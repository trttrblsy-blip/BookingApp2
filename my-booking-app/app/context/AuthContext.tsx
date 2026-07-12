import { createContext, useState, useContext, type ReactElement } from "react";
import type { Worker } from "~/utils/Worker";


interface AuthContextType {
  worker: Worker | null;
  setWorker: React.Dispatch<React.SetStateAction<Worker | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children,newWorker}: { children: React.ReactNode ,newWorker:Worker}) {
  const [worker, setWorker] = useState<Worker | null>(newWorker);

  return <AuthContext.Provider value={{ worker, setWorker }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
