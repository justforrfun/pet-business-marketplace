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

interface PasswordFindResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverError: { type: string | null; message: string | null } | null;
}

export function PasswordFindResultModal({
  open,
  onOpenChange,
  serverError,
}: PasswordFindResultModalProps) {
  const errorMessage = (() => {
    if (!serverError) return null;

    switch (serverError.type) {
      case "NETWORK":
        return "네트워크 연결 상태를 확인해 주세요.";
      case "SERVER":
        return "비밀번호 찾기 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      case "VALIDATION":
        return serverError.message || "입력값을 다시 확인해 주세요.";
      case "UNEXPECTED":
      default:
        return "예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    }
  })();

  const hasError = !!errorMessage;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md pt-8 pb-6">
        <DialogHeader className="gap-4">
          <DialogTitle className="text-xl font-bold">
            비밀번호 찾기 결과
          </DialogTitle>

          {/* 서버 오류 */}
          {hasError ? (
            <DialogDescription className="text-red-600 leading-relaxed">
              {errorMessage}
            </DialogDescription>
          ) : (
            // verified = false → 회원 없음
            <DialogDescription asChild>
              <div className="text-gray-700 leading-relaxed space-y-1">
                <p>입력하신 정보와 일치하는 회원 정보가 없습니다.</p>
                <p>정보를 다시 확인하시거나, 회원가입을 진행해 주세요.</p>
              </div>
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>확인하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
