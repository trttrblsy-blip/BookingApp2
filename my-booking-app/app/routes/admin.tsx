import { Form, useActionData, useNavigate } from "react-router";
import TypesDropdown from "~/components/typesDropdown";
import { useEffect } from "react";
import type { action as actionWorker } from "./actions/addWorker";
import type { action as actionRoom } from "./actions/addRoom";

const Admin = () => {
  const navigate = useNavigate();
  const actionDataWorker = useActionData<typeof actionWorker>();
  const actionDataRoom = useActionData<typeof actionRoom>();
  console.log(actionDataRoom);
  useEffect(() => {
    if (actionDataWorker?.nickName) {
      alert(
        "worker added secsesfully!\n nickname:" +
          actionDataWorker.nickName +
          "\n password: " +
          actionDataWorker.password,
      );
    }
  });
  return (
    <div>
      <div className="flex flex-direction: row  mx-auto gap-4 justify-center">
        <Form method="post" action="/actions/addWorker" className="space-y-4 bg-white p-4 rounded shadow">
          <label className="block text-gray-700">worker ID:</label>
          <input className="border border-gray-300 rounded px-3 py-2 w-full" type="text" name="workerId" />
          <label className="block text-gray-700">worker full name:</label>
          <input className="border border-gray-300 rounded px-3 py-2 w-full" type="text" name="workerName" />
          <label className="block text-gray-700">worker birthday:</label>
          <input className="border border-gray-300 rounded px-3 py-2 w-full" type="date" name="workerBirthday" />
          <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-black-500">
            Add worker
          </button>
        </Form>

        <Form method="post" action="/actions/addRoom" className="space-y-4 bg-white p-4 rounded shadow">
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
