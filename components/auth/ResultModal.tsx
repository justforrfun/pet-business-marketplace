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

interface ResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nickname: string;
  loginId: string | null;
  isFound: boolean;
  serverError: { type: string | null; message: string | null } | null;
}

export function ResultModal({
  open,
  onOpenChange,
  nickname,
  loginId,
  isFound,
  serverError,
}: ResultModalProps) {
  const router = useRouter();

  const errorMessage = (() => {
    if (!serverError) return null;

    switch (serverError.type) {
      case "NETWORK":
        return "네트워크 연결 상태를 확인해 주세요.";
      case "SERVER":
        return "서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      case "VALIDATION":
        return serverError.message || "입력값을 확인해 주세요.";
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
            아이디 찾기 결과
          </DialogTitle>

          {hasError ? (
            <DialogDescription className="text-red-600 leading-relaxed">
              {errorMessage}
            </DialogDescription>
          ) : !isFound ? (
            <DialogDescription className="text-gray-700 leading-relaxed space-y-1">
              <p>입력하신 정보와 일치하는 아이디가 없습니다.</p>
              <p>정보를 다시 확인하시거나, 다른 방법으로 시도해 주세요.</p>
            </DialogDescription>
          ) : (
            <DialogDescription className="text-gray-700">
              [{nickname}]님의 아이디는 [{loginId}]입니다.
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter>
          {hasError ? (
            <Button onClick={() => onOpenChange(false)}>확인하기</Button>
          ) : !isFound ? (
            <Button onClick={() => onOpenChange(false)}>확인하기</Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => router.push("/find-password")}
              >
                비밀번호 찾기
              </Button>
              <Button onClick={() => router.push("/login")}>로그인하기</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
