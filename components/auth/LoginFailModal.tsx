"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LoginFailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginFailModal({ open, onOpenChange }: LoginFailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md pt-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">로그인 실패</DialogTitle>
        </DialogHeader>

        <p className="text-gray-700 font-medium pb-4">
          존재하는 계정이 없습니다.
        </p>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
