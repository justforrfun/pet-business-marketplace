import { Button } from "@/components/ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

export function Submit({ children, ...others }: ButtonProps) {
  return (
    <Button type="submit" variant="destructive" {...others}>
      {children}
    </Button>
  );
}
