import { Form, useLoaderData } from "react-router";
import type { Route } from "../+types/root";
import type Room from "~/utils/Room";
import { room_type } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import NewBooking from "~/components/newBooking";
import { useState } from "react";
import ModalProvider, { useModal } from "~/context/ModalContext";
import type { BookingDTO } from "~/utils/BookingDTO";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const startDate = new Date(url.searchParams.get("startDate") as string);
  const endDate = new Date(url.searchParams.get("endDate") as string);
  const amount = new Number(url.searchParams.get("amount")) as number;
  const roomType = url.searchParams.get("roomType") as room_type;
  const rooms = await prisma.room.findMany({
    where: {
      AND: {
        capacity: { lte: amount },
        booking: {
          none: {
            OR: [
              { AND: { endDate: { gte: startDate }, startDate: { lte: startDate } } },
              { AND: { startDate: { lte: endDate, gte: startDate } } },
            ],
          },
        },
        type: roomType,
      },
    },
    
  });
  return { rooms, startDate, endDate, amount };
}

export default function Booking() {
  const modalContext = useModal();
  const [isSearched, setIssearched] = useState(false);
  const loaderData = useLoaderData();
  setIssearched(true);
  const rooms: Room[] = loaderData.rooms;
  const [bookingDTO, setBookingDTO] = useState<BookingDTO | null>(null);
  function openModal(event: React.MouseEvent<HTMLButtonElement>) {
    setBookingDTO({
      roomId: Number.parseInt(event.currentTarget.id),
      startDate: loaderData.startDate,
      endDate: loaderData.endDate,
      amount: loaderData.amount,
    });
    modalContext?.setIsModalOpen(true);
  }
  return (
    <ModalProvider>
      <div className="max-w-md mx-auto">
        {modalContext?.isModalOpen && <NewBooking bookingDTO={bookingDTO!}></NewBooking>}
        <Form className="space-y-4 bg-white p-4 rounded shadow" method="get">
          <label className="block text-gray-700">from</label>
          <input className="border border-gray-300 rounded px-3 py-2 w-full" type="date" name="startDate" />
          <label className="block text-gray-700">to</label>
          <input className="border border-gray-300 rounded px-3 py-2 w-full" type="date" name="endDate" />
          <label className="block text-gray-700">amount</label>
          <input className="border border-gray-300 rounded px-3 py-2 w-full" type="namber" name="amount" />
          <label className="block text-gray-700">type</label>
          <select className="form-control" name="roomType">
            {Object.values(room_type).map((type) => (
              <option>{type}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            search rooms
          </button>
        </Form>
        {isSearched && (
          <ul className="space-y-4">
            {rooms.map((room) => (
              <li className="p-4 bg-white rounded shadow">
                <button className="block text-pink-600" onClick={openModal} id={room.id.toString()}>
                  <span className="font-semibold text-xl">{room.id}</span>
                  <p className="text-gray-700">{room.type}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ModalProvider>
  );
}
