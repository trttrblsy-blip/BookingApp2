import type { room_type } from "../../generated/prisma/client";
import { prisma } from "./prisma.server";

const findFreeRooms = async ({
  amount,
  startDate,
  endDate,
  type,
}: {
  amount: number;
  startDate: Date;
  endDate: Date;
  type: room_type;
}) => {
    console.log(typeof(type))
  return await prisma.room.findMany({
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
        type,
      },
    },
  });
};

const createRoom = async (capacity: number, type: room_type) => {
  await prisma.room.create({
    data: { capacity, type },
  });
};

export { findFreeRooms, createRoom };
