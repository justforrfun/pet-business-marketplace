import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";

type FormCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function FormCard({ title, description, children }: FormCardProps) {
  return (
    //카드 테두리 없애고 그림자도 없앰
    <Card className="w-[450px] border-0 shadow-none">
      {/* 제목 / 설명 */}
      <CardHeader className="pb-10">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {/* form 내용 들어갈 자리 */}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
