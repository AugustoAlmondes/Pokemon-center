"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdWarning } from "react-icons/md";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "destructive",
}: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-(--bg-base) border-2 border-red-500/40 text-primary max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red">
            <MdWarning size={24} />
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-transparent border-white/10 hover:bg-white/5 text-primary cursor-pointer"
          >
            {cancelLabel}
          </Button>
          <Button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={variant === "destructive" ? " bg-red hover:bg-red/80 text-white cursor-pointer border-white/10 hover:bg-white/5" : "bg-primary hover:bg-primary/80  text-white cursor-pointer"}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
