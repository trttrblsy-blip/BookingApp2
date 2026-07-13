import type { BookingDTO } from "~/utils/BookingDTO";
import Modal from "react-modal";
import { Form, type ActionFunctionArgs } from "react-router";
import { prisma } from "../../lib/prisma";
import type { person } from "../../generated/prisma/client";
import type { Worker } from "~/utils/Worker";
import { useAuth } from "~/context/AuthContext";
import { useModal } from "~/context/ModalContext";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
export async function action({ args: { request }, bookingDTO }: { args: ActionFunctionArgs; bookingDTO: BookingDTO }) {
  const formData = await request.formData();
  const custumerName: string = formData.get("custumerName") as string;
  const custumerId: number = Number.parseInt(formData.get("custumerId") as string);
  const custumerBirthday: Date = new Date(formData.get("custumerBirthday") as string);
  const custumer: person = { id: custumerId, birthDay: custumerBirthday, fullName: custumerName };
  const worker: Worker = useAuth()!.worker!;
  prisma.person.create({ data: { ...custumer } });
  const modalContext = useModal();
  modalContext?.setIsModalOpen(false);
  return await prisma.booking.create({
    data: {
      startDate: bookingDTO.startDate,
      endDate: bookingDTO.endDate,
      amount: bookingDTO.amount,
      custumerId: custumer.id,
      workerId: worker.personId,
      roomId: bookingDTO.roomId,
    },
  });
}

export default function NewBooking({ bookingDTO }: { bookingDTO: BookingDTO }) {
  const modalContext = useModal();
  return (
    <Modal isOpen={modalContext?.isModalOpen!} style={customStyles} contentLabel="Example Modal">
      <h2>Booking to room number {bookingDTO.roomId}</h2>

      <Form method="post">
        <label className="block text-gray-700">from</label>
        <input
          className="border border-gray-300 rounded px-3 py-2 w-full"
          type="date"
          name="startDate"
          value={bookingDTO.startDate.toString()}
          disabled
        />
        <label className="block text-gray-700">to</label>
        <input
          className="border border-gray-300 rounded px-3 py-2 w-full"
          type="date"
          name="endDate"
          value={bookingDTO.endDate.toString()}
          disabled
        />
        <label className="block text-gray-700">amount</label>
        <input
          className="border border-gray-300 rounded px-3 py-2 w-full"
          type="namber"
          name="amount"
          value={bookingDTO.amount}
          disabled
        />
        <label className="block text-gray-700">custumer name:</label>
        <input className="border border-gray-300 rounded px-3 py-2 w-full" type="text" name="custumerName" />
        <label className="block text-gray-700">custumer ID:</label>
        <input className="border border-gray-300 rounded px-3 py-2 w-full" type="text" name="custumerId" />
        <label className="block text-gray-700">custumer birthday:</label>
        <input className="border border-gray-300 rounded px-3 py-2 w-full" type="date" name="custumerBirthday" />
        <button type="submit" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-black-500">
          Book
        </button>
      </Form>
    </Modal>
  );
}
