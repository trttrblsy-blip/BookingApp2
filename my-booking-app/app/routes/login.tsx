import type { Route } from "./+types/booking";
import { Form, redirect, type ActionFunctionArgs } from "react-router";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { fetch as undiciFetch } from "undici"; 
import type { Worker } from "~/utils/Worker";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const adapter = new PrismaPlanetScale({
  url: process.env.DATABASE_URL,
  fetch: undiciFetch,
});
const prisma = new PrismaClient({ adapter });

export function meta({}: Route.MetaArgs) {
  return [{ title: "New React Router App" }, { name: "description", content: "Welcome to React Router!" }];
}



export async function action({ request }: ActionFunctionArgs) {
    const authContextType = useAuth();
  const formData = await request.formData();
  const nickName = formData.get("nickname") as string;
  const password = formData.get("password") as string;

  if(!nickName||!password){
    return{error:"Nickname and Password are required"}
  }
    const result = await authContextType!.login(nickName, password);

    if (result!.success){
      return redirect("/booking")
    }
    else
  
}
export default function Login() {
  
  return (
    <div>
      <h1>Welcome to Booking App</h1>
      <h2>please Login</h2>
      <Form method="post">
        <div>
          <label>Nickname:</label>
          <textarea name="nickname" required></textarea>
        </div>
        <div>
          <label>Password:</label>
          <textarea name="password" required></textarea>
        </div>
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}


  return (
    <div className="page">
      <div className="container">
        <div className="auth-container">
          <h1 className="page-title">
          </h1>
          <Form className="auth-form" >
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label className="form-label" htmlFor="nickname">
                Nickname
              </label>
              <input
                className="form-input"
                type="nickname"
                id="nickname"
                {...register("nickname", { required: "nickname is required" })}
              />
              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  maxLength: {
                    value: 12,
                    message: "Password must be less than 12 characters",
                  },
                })}
                className="form-input"
                type="password"
                id="password"
              />
              {errors.password && (
                <span className="form-error">{errors.password.message}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-large">
            Login
            </button>
          </Form>

        </div>
      </div>
    </div>
  );
}
