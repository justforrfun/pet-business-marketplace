"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SignUpResultModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

export function SignUpResultModal({
  open,
  title,
  message,
  onConfirm,
}: SignUpResultModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-gray-700">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={onConfirm} className="w-full">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
