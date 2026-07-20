import { data, redirect, type ActionFunctionArgs } from "react-router";
import { prisma } from "~/services/prisma.server";

import type { Worker } from "~/utils/Worker";

import type { BookingDTO } from "~/utils/BookingDTO";
import type { person } from "../../../generated/prisma/client";
import { getCurrentWorker } from "~/services/auth.server";
import { create } from "domain";
import { connect } from "net";

export async function action({ request }: ActionFunctionArgs) {
  const dataForm = await request.formData();
  const roomId = Number.parseInt(dataForm.get("roomId") as string);
  const amount = Number.parseInt(dataForm.get("amount") as string);
  const startDate = new Date(dataForm.get("startDate") as string);
  const endDate = new Date(dataForm.get("endDate") as string);
  const custumerName: string = dataForm.get("custumerName") as string;
  const custumerId: number = Number.parseInt(dataForm.get("custumerId") as string);
  const custumerBirthday: Date = new Date(dataForm.get("custumerBirthday") as string);
  if (new Date().getFullYear() - custumerBirthday.getFullYear() < 18) {
    throw new Error("vaulation! cant book for minors!");
  }
  const custumer: person = { id: custumerId, birthDay: custumerBirthday, fullName: custumerName };
  const worker: Worker = (await getCurrentWorker(request))!;
  console.log(
    await prisma.booking.create({
      data: {
        startDate,
        endDate,
        amount,
        custumerId: custumer.id,
        workerId: worker.personId,
        roomId,
        person: {
          create: {
            id: custumerId,
            birthDay: custumerBirthday,
            fullName: custumerName,
          },
        },
        worker: { connect: { personId: worker.personId } },
      },
    }),
  );
  return redirect("/booking");
}
