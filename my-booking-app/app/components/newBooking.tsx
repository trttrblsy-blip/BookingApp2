import type { BookingDTO } from "~/utils/BookingDTO";
import Modal from "react-modal";
import { Form, useActionData } from "react-router";
import { format } from "date-fns";
import type { action } from "~/routes/actions/addBooking";
import { AlertDemo } from "./alerDemo";

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

const NewBooking = ({ bookingDTO, isOpen }: { bookingDTO: BookingDTO; isOpen: boolean }) => {
  const actionData = useActionData<typeof action>();
  return (
    <div>
      {actionData?.error && <AlertDemo description={actionData.error} iserror={true}></AlertDemo>}
      <Modal isOpen={isOpen} style={customStyles} contentLabel="Example Modal">
        <Form method="post" action="/actions/addBooking">
          <label className="block text-gray-700">Booking to room number</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            type="text"
            name="roomId"
            value={bookingDTO.roomId}
            readOnly
          />
          <label className="block text-gray-700">from</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            type="date"
            name="startDate"
            value={format(bookingDTO.startDate, "yyyy-MM-dd")}
            readOnly
          />
          <label className="block text-gray-700">to</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            type="date"
            name="endDate"
            value={format(bookingDTO.endDate, "yyyy-MM-dd")}
            readOnly
          />
          <label className="block text-gray-700">amount</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            type="number"
            name="amount"
            value={bookingDTO.amount}
            readOnly
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
    </div>
  );
};
export default NewBooking;
