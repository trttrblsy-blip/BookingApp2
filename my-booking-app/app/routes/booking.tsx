import { Form, useLoaderData, useOutletContext } from "react-router";
import type { Route } from "../+types/root";
import type Room from "~/utils/Room";
import { room_type } from "../../generated/prisma/enums";
import { prisma } from "../services/prisma.server";
import NewBooking from "~/components/newBooking";
import { useContext, useState } from "react";
import type { BookingDTO } from "~/utils/BookingDTO";
import type { Worker } from "~/utils/Worker";
import { workerContext } from "~/context/AuthContext";
import { getCurrentWorker } from "~/services/auth.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const worker = await getCurrentWorker(request);
  const url = new URL(request.url);
  if (!url.searchParams.get("startDate")) {
    return {
      rooms: [],
      isSearched: false,
      worker,
    };
  }
  const startDate = new Date(url.searchParams.get("startDate") as string);
  const endDate = new Date(url.searchParams.get("endDate") as string);
  const amount = Number(url.searchParams.get("amount"));
  const roomType: room_type = room_type[url.searchParams.get("roomType") as keyof typeof room_type];
  const rooms = await prisma.room.findMany({
    where: {
      AND: {
        capacity: { gte: amount },
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
  return { rooms, startDate, endDate, amount, isSearched: true, worker };
}

const Booking = () => {
  const loaderData = useLoaderData<typeof loader>();
  const worker: Worker = loaderData.worker!;
  const [isOpen, setIsOpen] = useState(false);
  const rooms: Room[] = loaderData.rooms;
  const [bookingDTO, setBookingDTO] = useState<BookingDTO>();
  const openModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    setBookingDTO({
      roomId: Number.parseInt(event.currentTarget.id),
      startDate: loaderData.startDate!,
      endDate: loaderData.endDate!,
      amount: loaderData.amount!,
    });
    setIsOpen(true);
  };

  return (
    <div>
      {isOpen && <NewBooking bookingDTO={bookingDTO!} isOpen={isOpen}></NewBooking>}

      <div> hello, {worker.nickName}</div>
      <div className="conteiner p-4 ">
        <Form className="conteiner-fluid space-y-4 bg-white p-4 rounded shadow mb-4" method="get">
          <div className="input-group mb-3  p-4 flex justify-center items-center conteiner-fluid ">
            <label className="block text-gray-700 px-4">from</label>
            <input className="border border-gray-300 rounded px-4 py-2 " type="date" name="startDate" required />
            <label className="block text-gray-700 px-4">to</label>
            <input className="border border-gray-300 rounded px-4 py-2 " type="date" name="endDate" required />
            <label className="block text-gray-700 px-4">amount</label>
            <input className="border border-gray-300 rounded" type="namber" name="amount" required />
            <label className="block text-gray-700 px-4"></label>
            <select className="form-control  px-4 py-2 rounded border border-gray-300 " name="roomType">
              <option value="">type</option>
              {Object.values(room_type).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-500">
            search rooms
          </button>
        </Form>
        <ul className="space-y-4 py-4">
          {loaderData.isSearched &&
            loaderData.rooms.map((room) => (
              <li className=" bg-white rounded shadow " key={room.id.toString()}>
                <button className=" text-teal-600 " onClick={openModal} id={room.id.toString()}>
                  <span className="font-semibold text-xl">{room.id}</span>
                  <p className="text-gray-700">{room_type[room.type as keyof typeof room_type]}</p>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Booking;
