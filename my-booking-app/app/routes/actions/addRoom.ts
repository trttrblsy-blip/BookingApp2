import { data, redirect, type ActionFunctionArgs } from "react-router";
import { prisma } from "~/services/prisma.server";
import { room_type, type person } from "../../../generated/prisma/client";
import { format } from "date-fns";

export async function action({ request }: ActionFunctionArgs) {
  const dataForm = await request.formData();
  const capacity: number = Number.parseInt(dataForm.get("capacity") as string);
  const type: room_type = room_type[dataForm.get("roomType") as keyof typeof room_type];
try{
  await prisma.room.create({
    data: { capacity, type },
  });

  return redirect("/admin");
}catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
}