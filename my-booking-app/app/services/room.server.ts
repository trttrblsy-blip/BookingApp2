import { room_type } from "../../generated/prisma/enums";
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
  type: room_type | "";
}) => {
  const baseAnd: any = {
    capacity: { gte: amount },
    booking: {
      none: {
        OR: [
          { AND: { endDate: { gte: startDate }, startDate: { lte: startDate } } },
          { AND: { startDate: { lte: endDate, gte: startDate } } },
        ],
      },
    },
    type: Object.values(room_type).includes(type as room_type)
      ? Object.entries(room_type).find(([, v]) => v === type)?.[0]
      : undefined,
  };

  return await prisma.room.findMany({
    where: {
      AND: baseAnd,
    },
  });
};

const createRoom = async (capacity: number, type: room_type) => {
  const enumKey = Object.entries(room_type).find(([, v]) => v === type)?.[0];
  const dbType = enumKey ?? (type as any);
  return await prisma.room.create({
    data: { capacity, type: dbType },
  });
};

export { findFreeRooms, createRoom };
