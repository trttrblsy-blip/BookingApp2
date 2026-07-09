import { createContext, useState, useContext, type ReactElement } from "react";
import type { Worker } from "~/utils/Worker";


export interface AuthContextType {
  worker: Worker | null;
  setWorker: React.Dispatch<React.SetStateAction<Worker | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [worker, setWorker] = useState<Worker | null>(null);

  return <AuthContext.Provider value={{ worker, setWorker }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
