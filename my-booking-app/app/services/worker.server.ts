import type { Worker } from "~/utils/Worker";
import { prisma } from "./prisma.server";
import type { person } from "../../generated/prisma/client";

const auth = async (nickName: string, password: string) => {
  return (await prisma.worker.findFirst({
    where: { AND: { nickName: nickName, password: password } },
  })) as Worker;
};

const createWorker = async (worker: person, nickName: string, password: string) => {
  await prisma.worker.create({
    data: {
      person: { create: { ...worker } },
      nickName,
      password,
    },
  });
};

export { auth, createWorker };
