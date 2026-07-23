import { Form, useActionData, useNavigate, type ActionFunctionArgs } from "react-router";
import TypesDropdown from "~/components/typesDropdown";
import { AlertDemo } from "~/components/alerDemo";
import { room_type } from "../../generated/prisma/enums";
import { format } from "date-fns";
import type { person } from "../../generated/prisma/client";
import { createRoom } from "~/services/room.server";
import { createWorker } from "~/services/worker.server";
import type Room from "~/utils/Room";
import type { Worker } from "~/utils/Worker";
export async function action({ request }: ActionFunctionArgs) {
  try {
    const dataForm = await request.formData();
    if (dataForm.get("capacity")) {
      const capacity: number = Number.parseInt(dataForm.get("capacity") as string);
      const type: room_type = dataForm.get("roomType") as room_type;
      const room: Room = await createRoom(capacity, type);
      return { secsses: true, action: "room", message: "good job!", key: room.id };
    } else if (dataForm.get("workerName")) {
      const workerName: string = dataForm.get("workerName") as string;
      const workerId: number = Number.parseInt(dataForm.get("workerId") as string);
      const workerBirthday: Date = new Date(dataForm.get("workerBirthday") as string);

      if (new Date().getFullYear() - workerBirthday.getFullYear() < 18) {
        throw new Error("vaulation! cant imploy minors!");
      }
      const nickName: string = workerName.split(" ")[0] + Math.floor(Math.random() * 899 + 100);
      const password: string = format(workerBirthday, "yyyy-MM-dd") + workerName.split(" ")[0].slice(0, 3);
      const person: person = { id: workerId, birthDay: workerBirthday, fullName: workerName };
      const worker: Worker = await createWorker(person, nickName, password);
      return {
        secsses: true,
        action: "worker",
        message: "nickname: " + nickName + "\n password: " + password,
        key: worker.personId,
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { secsses: false, error: error.message, key: Math.random() };
    }
  }
}

const Admin = () => {
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  return (
    <div>
      {actionData?.secsses == false && (
        <AlertDemo key={actionData.key} description={actionData!.error!} iserror={true} isOpen={true}></AlertDemo>
      )}
      {actionData?.secsses == true && (
        <AlertDemo
          key={actionData.key}
          title={actionData.action + " added secssfully!"}
          description={actionData?.message!}
          iserror={false}
          isOpen={true}
        />
      )}
      <div className="flex flex-direction: row  mx-auto gap-4 justify-center">
        <Form method="post" className="space-y-4 bg-white p-4 rounded shadow">
          <label className="block text-gray-700">worker ID:</label>
          <input className="border border-gray-300 rounded px-3 py-2 w-full" type="text" name="workerId" required />
          <label className="block text-gray-700">worker full name:</label>
          <input className="border border-gray-300 rounded px-3 py-2 w-full" type="text" name="workerName" required />
          <label className="block text-gray-700">worker birthday:</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            type="date"
            name="workerBirthday"
            required
          />
          <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-black-500">
            Add worker
          </button>
        </Form>

        <Form method="post" className="space-y-4 bg-white p-4 rounded shadow">
          <div className="input-group pb-4 ">
            <label className="block text-gray-700 pb-4">capacity:</label>
            <input className="border border-gray-300 rounded px-3 py-2 w-full mb-4" type="number" name="capacity" />
            <TypesDropdown></TypesDropdown>
          </div>
          <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-black-500">
            Add room
          </button>
        </Form>
      </div>

      <button
        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-500 absolute bottom-4"
        onClick={() => {
          navigate("/booking");
        }}
      >
        booking page
      </button>
    </div>
  );
};
export default Admin;
