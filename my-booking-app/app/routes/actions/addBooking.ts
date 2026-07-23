import { redirect, type ActionFunctionArgs } from "react-router";
import { getCurrentWorker } from "~/services/auth.server";
import { createbooking } from "~/services/booking.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
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
    const custumer: any = { id: custumerId, birthDay: custumerBirthday, fullName: custumerName };
    const worker: any = (await getCurrentWorker(request))!;
    createbooking(roomId, startDate, endDate, custumer, worker);

    return redirect("/booking");
  } catch (error) {
    if (error instanceof Error) {
      return { secsses: false, error: error.message };
    }
  }
}
