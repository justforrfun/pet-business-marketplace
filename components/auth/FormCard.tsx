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
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function FormCard({
  title,
  description,
  footer,
  children,
}: FormCardProps) {
  return (
    <Card className="w-[450px] border-0 shadow-none">
      {/* 제목 / 설명 */}
      <CardHeader className="pb-10">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className="pt-4 flex justify-center">{footer}</CardFooter>
      )}
    </Card>
  );
}
