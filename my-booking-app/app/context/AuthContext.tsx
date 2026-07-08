import { createContext, useState, useContext, type ReactElement } from "react";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { fetch as undiciFetch } from "undici"; // Only for Node.js <18
import type { Worker } from "../utils/Worker";

const adapter = new PrismaPlanetScale({
  url: process.env.DATABASE_URL,
  fetch: undiciFetch,
});
const prisma = new PrismaClient({ adapter });
// 1. Define the structure of your context data
interface AuthContextType {
  worker: { worker: string | null; } | null;
  logout: () => void;
  login: (nickName: string, password: string) => Promise<
    { success: boolean; error: string; worker?: undefined; } | 
    { success: boolean; worker: any; error?: undefined; } 
  >;
}

export const AuthContext= createContext<AuthContextType | null>(null);




export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [worker, setWorker] = useState(JSON.parse(localStorage.getItem("currentWorker")!)
      ? { worker: localStorage.getItem("currentWorker") }
      : null
  );


  async function login(nickName:string, password:string) {
    const worker:Worker = await prisma.worker.findFirst({
    where: { AND: { nickName: nickName, password: password } },
  }) as Worker;

    if (!worker) {
      return { success: false, error: "Invalid nickname or password" };
    }

    localStorage.setItem("currentWorker", JSON.stringify(worker));
    setWorker(JSON.parse(JSON.stringify(worker)));

    return { success: true,worker:worker };
  }

  function logout() {
    localStorage.removeItem("currentWorker");
    setWorker(null);
  }

  return (
    <AuthContext.Provider value={{ worker, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}