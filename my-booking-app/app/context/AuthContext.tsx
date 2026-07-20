import { createContext} from "react-router";
import type { Worker } from "~/utils/Worker";


interface AuthContextType {
  worker: Worker | null;
  setWorker: React.Dispatch<React.SetStateAction<Worker | null>>;
}

export const workerContext = createContext<Worker | null>(null);

/*export default function AuthProvider({ children,newWorker}: { children: React.ReactNode ,newWorker:Worker}) {
 

  return <workerContext. value={{ worker, setWorker }}>{children}</AuthContext.Provider>;
}*/

/*export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}*/
