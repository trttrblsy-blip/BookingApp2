import type { Worker } from "~/utils/Worker";
import type { person } from "../../generated/prisma/client";
import { prisma } from "./prisma.server";

const createbooking = async (roomId: number, startDate: Date, endDate: Date, custumer: person, worker: Worker) => {
  await prisma.booking.create({
    data: {
      room: { connect: { id: roomId } },
      startDate: startDate,
      endDate: endDate,
      person: { connectOrCreate: { create: { ...custumer }, where: { id: custumer.id } } },
      worker: { connect: { personId: worker.personId } },
    },
  });
};

export { createbooking };
