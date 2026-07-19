import { redirect, type ActionFunctionArgs } from "react-router";
import { prisma } from "~/services/prisma.server";
import type { BookingDTO } from "~/utils/BookingDTO";
import type { person } from "../../../generated/prisma/client";
import { useAuth } from "~/context/AuthContext";
import type { Worker } from "~/utils/Worker";

export async function action({ request }: ActionFunctionArgs) {
  const dataForm = await request.formData();
  const custumerName: string = dataForm.get("custumerName") as string;
  const custumerId: number = Number.parseInt(dataForm.get("custumerId") as string);
  const custumerBirthday: Date = new Date(dataForm.get("custumerBirthday") as string);
  if (new Date().getFullYear() - custumerBirthday.getFullYear() < 18) {
    alert("vaulation! cant book for minors!");
    return redirect("/booking");
  }
  const custumer: person = { id: custumerId, birthDay: custumerBirthday, fullName: custumerName };

  const worker: Worker = useAuth()!.worker!;
  prisma.person.create({ data: { ...custumer } });
  /*return await prisma.booking.create({
    data: {
     // startDate: bookingDTO.startDate,
      endDate: bookingDTO.endDate,
      amount: bookingDTO.amount,
      custumerId: custumer.id,
      workerId: worker.personId,
      roomId: bookingDTO.roomId,
    },
  });*/
}
