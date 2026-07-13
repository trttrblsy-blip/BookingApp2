import { Form, redirect, useActionData, type ActionFunctionArgs } from "react-router";
import type { Worker } from "../utils/Worker";
import type { Route } from "./+types/login";
import { createSession } from "~/services/session.server";
import { prisma } from "../../lib/prisma";

export function meta({}: Route.MetaArgs) {
  return [{ title: "BookingApp" }, { name: "description", content: "Welcome to BookingApp!" }];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const nickName = formData.get("nickname") as string;
  const password = formData.get("password") as string;

  try {
    if (!nickName || !password) {
      throw new Error("Nickname and Password are required");
    }
    const worker: Worker = (await prisma.worker.findFirst({
      where: { AND: { nickName: nickName, password: password } },
    })) as Worker;

    if (!worker) {
      throw new Error("Invalid nickname or password");
    }

    return await createSession({ request, workerId: worker.personId, remember: true });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
}
export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Please log in</h2>
      <Form className="space-y-4 bg-white p-4 rounded shadow" method="post">
        <div className="form-group">
          <label className="block text-gray-700" htmlFor="nickname">
            Nickname
          </label>
          <input className="border border-gray-300 rounded px-3 py-2 w-full" type="text" name="nickname" />
        </div>
        <div className="form-group">
          <label className="block text-gray-700" htmlFor="password">
            Password
          </label>
          <input className="border border-gray-300 rounded px-3 py-2 w-full" type="password" name="password" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
          Login
        </button>
        {actionData?.error && <div className=" text-red-800 p-2 mb-4 rounded"> {actionData.error} </div>}
      </Form>
    </div>
  );
}
