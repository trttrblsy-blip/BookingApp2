import { CheckCircle2Icon,  AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function AlertDemo({ title, description, iserror }: { title?: string; description: string; iserror: boolean }) {
  return (
    <div className="grid w-full max-w-md items-start gap-4">
      <Alert >
        {!iserror && <CheckCircle2Icon />}
        {iserror && <AlertCircleIcon />}
        <AlertTitle>{title||"Ërror!"}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  );
}
