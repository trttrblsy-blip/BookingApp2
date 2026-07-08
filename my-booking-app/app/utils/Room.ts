import { Booking } from "../../../../BookingApp/server/generated/prisma/client";

export default interface Room {
  id: number;
  capacity: number;
  type: string;
}
