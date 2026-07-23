import { CheckCircle2Icon, AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useState } from "react";

export function AlertDemo({
  title,
  description,
  iserror,
  isOpen,
}: {
  title?: string;
  description: string;
  iserror: boolean;
  isOpen: boolean;
}) {
  const [open, setOpen] = useState(isOpen);
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className={iserror ? "text-destructive" : "text-success"}>
        <AlertDialogHeader>
          {iserror && <AlertCircleIcon />}
          {!iserror && <CheckCircle2Icon />}
          <AlertDialogTitle>{title || "Ërror!"}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              setOpen(false);
              window.location.reload();
            }}
          >
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
