import { Form, redirect, useActionData, type ActionFunctionArgs } from "react-router";
import { AuthContext, useAuth, type AuthContextType } from "../context/AuthContext";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { fetch as undiciFetch } from "undici"; // Only for Node.js <18
import type { Worker } from "../utils/Worker";
import type { Route } from "./+types/login";
import Swal from "sweetalert2";

const adapter = new PrismaPlanetScale({
  url: process.env.DATABASE_URL,
  fetch: undiciFetch,
});
const prisma = new PrismaClient({ adapter });

export function meta({}: Route.MetaArgs) {
  return [{ title: "BookingApp" }, { name: "description", content: "Welcome to BookingApp!" }];
}
async function login(nickName: string, password: string,authContext:AuthContextType) {


  const worker: Worker = (await prisma.worker.findFirst({
    where: { AND: { nickName: nickName, password: password } },
  })) as Worker;

  if (!worker) {
    console.log(worker);

    throw new Error("Invalid nickname or password");
  }

  authContext?.setWorker(worker);

  return worker;
}

export async function action({ context ,request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const nickName = formData.get("nickname") as string;
  const password = formData.get("password") as string;

  try {
    if (!nickName || !password) {
      throw new Error("Nickname and Password are required");
    }
    await login(nickName, password,context.get(AuthContext));

    return redirect("/booking");
  } catch (error) {
    return { error: (error as Error).message };
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
