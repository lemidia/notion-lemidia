import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
  asChild?: boolean;
}

function ConfirmModal({ children, onConfirm, asChild }: ConfirmModalProps) {
  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConfirm();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild={asChild}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-3">
            <AlertTriangle className="w-6 h-6" /> Are you sure to delete?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This behavior is <span className="font-bold">irreversible</span> and
            if the note you want to delete has other notes below it, all those
            notes will also be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmModal;
