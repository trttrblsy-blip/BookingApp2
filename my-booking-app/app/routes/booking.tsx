import { Form, useLoaderData } from "react-router";
import type { Route } from "../+types/root";
import type Room from "~/utils/Room";
import RoomComp from "~/components/room";
import { room_type } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export async function loader({ request }: Route.LoaderArgs) {
  const formData = await request.formData();
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = new Date(formData.get("endDate") as string);
  const amount = new Number(formData.get("amount")) as number;
  const roomType = formData.get("roomType") as room_type;
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
  return rooms;
}

export default function Login() {
  const rooms: Room[] = useLoaderData();
  return (
    <div className="max-w-md mx-auto">
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
      </Form>
      <ul className="space-y-4">
        {rooms.map((room) => (
          <RoomComp value={room}></RoomComp>
        ))}
      </ul>
    </div>
  );
}
