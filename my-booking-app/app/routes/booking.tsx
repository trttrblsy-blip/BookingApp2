import { Form, useActionData, useLoaderData, useNavigate } from "react-router";
import type { Route } from "../+types/root";
import type Room from "~/utils/Room";
import { room_type, worker_role } from "../../generated/prisma/enums";
import NewBooking from "~/components/newBooking";
import { useState } from "react";
import type { BookingDTO } from "~/utils/BookingDTO";
import { getCurrentWorker } from "~/services/auth.server";
import TypesDropdown from "~/components/typesDropdown";
import { AlertDemo } from "~/components/alerDemo";
import { findFreeRooms } from "~/services/room.server";
import type { action } from "./actions/addBooking";
import { roomDTO } from "~/schema/schema.roomDTO";
import { Separator } from "@base-ui/react";
export function meta({}: Route.MetaArgs) {
  return [{ title: "BookingApp" }, { name: "description", content: "Welcome to BookingApp!" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const worker = await getCurrentWorker(request);
  try {
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
    const type: string = url.searchParams.get("roomType") as string;
    const parsed = await roomDTO.safeParseAsync({ startDate, endDate, amount, type });
    if (!parsed.success) {
      throw Error("Invalid room search parameters");
    }
    const rooms = await findFreeRooms(parsed.data);
    return { rooms, startDate, endDate, amount, isSearched: true, worker };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return { error: error.message, worker };
    }
  }
}

const Booking = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  let worker;
  const [bookingDTO, setBookingDTO] = useState<BookingDTO>();
  const loaderData = useLoaderData<typeof loader>();
  if (loaderData?.worker) {
    worker = loaderData.worker;
  }
  const openModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    setBookingDTO({
      roomId: Number.parseInt(event.currentTarget.id),
      startDate: loaderData?.startDate!,
      endDate: loaderData?.endDate!,
      amount: loaderData?.amount!,
    });
    setIsOpen(true);
  };
  const actionData = useActionData<typeof action>();
  const rooms: Room[] = loaderData?.rooms!;

  return (
    <div>
      {loaderData?.error && <AlertDemo description={loaderData?.error} iserror={true} isOpen={true}></AlertDemo>}
      {isOpen && <NewBooking bookingDTO={bookingDTO!} isOpen={isOpen}></NewBooking>}
      <div className="text-teal-800"> hello, {worker?.nickName}</div>
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
        <div className="space-y-4 py-4">
          {loaderData?.isSearched &&
            loaderData.rooms.map((room) => (
              <div>
                <dl className=" bg-white rounded shadow " key={room.id.toString()}>
                  <button className=" text-teal-600 " onClick={openModal} id={room.id.toString()}>
                    <dt className="font-semibold text-xl">{room.id}</dt>
                    <dd className="text-gray-700">{room.type.toLowerCase()}</dd>
                  </button>
                </dl>
                <Separator />
              </div>
            ))}
        </div>
      </div>
      {worker?.role == worker_role.ADMIN && (
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
