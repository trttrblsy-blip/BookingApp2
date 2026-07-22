import { Form, useActionData, useLoaderData, useNavigate } from "react-router";
import type { Route } from "../+types/root";
import type Room from "~/utils/Room";
import { room_type, worker_role } from "../../generated/prisma/enums";
import { prisma } from "../services/prisma.server";
import NewBooking from "~/components/newBooking";
import { useState } from "react";
import type { BookingDTO } from "~/utils/BookingDTO";
import type { Worker } from "~/utils/Worker";

import { getCurrentWorker } from "~/services/auth.server";
import TypesDropdown from "~/components/typesDropdown";
import type { action } from "./actions/addBooking";
import { AlertDemo } from "~/components/alerDemo";

export async function loader({ request }: Route.LoaderArgs) {
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
  if (startDate > endDate) {
    throw Error("start date cant be after the end date!");
  }
  const amount = Number(url.searchParams.get("amount"));
  const roomType: room_type = url.searchParams.get("roomType") as string as room_type;
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
        /*type: roomType,*/
      },
    },
  });
  return { rooms, startDate, endDate, amount, isSearched: true, worker };
}

const Booking = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [bookingDTO, setBookingDTO] = useState<BookingDTO>();
  const loaderData = useLoaderData<typeof loader>();
  const worker: Worker = loaderData.worker!;
  const openModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    setBookingDTO({
      roomId: Number.parseInt(event.currentTarget.id),
      startDate: loaderData.startDate!,
      endDate: loaderData.endDate!,
      amount: loaderData.amount!,
    });
    setIsOpen(true);
  };
  try {
    const actionData = useActionData<typeof action>();
    const rooms: Room[] = loaderData.rooms;
  } catch (error) {
    if (error instanceof Error) {
      setError(error);
    }
  }

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
            <input className="border border-gray-300 rounded" type="number" name="amount" required />
            <label className="block text-gray-700 px-4"></label>
            <TypesDropdown></TypesDropdown>
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
      {error && <AlertDemo description={error.message} iserror={true} isOpen={true}></AlertDemo>}
      {worker.role == worker_role.ADMIN && (
        <button
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-500 absolute bottom-4 "
          onClick={() => {
            navigate("/admin");
          }}
        >
          admin page
        </button>
      )}
    </div>
  );
};

export default Booking;
