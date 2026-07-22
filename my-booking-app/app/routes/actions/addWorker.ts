import { redirect, type ActionFunctionArgs } from "react-router";
import { prisma } from "~/services/prisma.server";
import type { person } from "../../../generated/prisma/client";
import { format } from "date-fns";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const dataForm = await request.formData();
    const workerName: string = dataForm.get("workerName") as string;
    const workerId: number = Number.parseInt(dataForm.get("workerId") as string);
    const workerBirthday: Date = new Date(dataForm.get("workerBirthday") as string);

    if (new Date().getFullYear() - workerBirthday.getFullYear() < 18) {
      throw new Error("vaulation! cant imploy for minors!");
    }
    const nickName: string = workerName.split(" ")[0] + "123";
    const password: string = format(workerBirthday, "yyyy-MM-dd") + workerName.split(" ")[0].slice(3);
    const worker: person = { id: workerId, birthDay: workerBirthday, fullName: workerName };

    await prisma.worker.create({
      data: {
        person: { create: { ...worker } },
        nickName,
        password,
      },
    });
    return redirect("/admin");

    return { nickName, password };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
}
