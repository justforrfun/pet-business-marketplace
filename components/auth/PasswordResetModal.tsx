"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PasswordResetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  success: boolean; // 성공 여부
  serverError: { type: string | null; message: string | null } | null;
}

export function PasswordResetModal({
  open,
  onOpenChange,
  success,
  serverError,
}: PasswordResetModalProps) {
  const router = useRouter();

  const errorMessage = (() => {
    if (!serverError) return null;

    switch (serverError.type) {
      case "NETWORK":
        return "네트워크 연결 상태를 확인해 주세요.";
      case "SERVER":
        return "비밀번호 변경 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      case "VALIDATION":
        return serverError.message || "입력값을 다시 확인해 주세요.";
      case "UNEXPECTED":
      default:
        return "예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    }
  })();

  const hasError = !!errorMessage;
  const isSuccess = success && !hasError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md pt-8 pb-6">
        <DialogHeader className="gap-4">
          <DialogTitle className="text-xl font-bold">
            비밀번호 재설정
          </DialogTitle>

          {/* 오류 메시지 */}
          {hasError ? (
            <DialogDescription className="text-red-600 leading-relaxed">
              {errorMessage}
            </DialogDescription>
          ) : isSuccess ? (
            <DialogDescription asChild>
              <div className="text-gray-700 leading-relaxed space-y-1">
                <p>비밀번호 변경이 완료되었습니다.</p>
                <p>변경된 비밀번호로 로그인 후 이용해주세요.</p>
              </div>
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <DialogFooter>
          {hasError ? (
            <Button onClick={() => onOpenChange(false)}>확인하기</Button>
          ) : (
            <Button onClick={() => router.push("/login")}>로그인하기</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
