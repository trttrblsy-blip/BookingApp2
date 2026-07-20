import { PrismaClient } from "../../generated/prisma/client";
import type { Worker } from "~/utils/Worker";
import { sessionStorage } from "./session.server";
import { prisma } from "./prisma.server";

export async function getCurrentWorker(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const workerId = session.get("workerId");
  console.log("workerId:", workerId)
  if (!workerId) {
    return null;
  }
  const worker: Worker = (await prisma.worker.findUnique({
    where: {
      personId: workerId,
    },
  })) as Worker;
  return worker;
}
