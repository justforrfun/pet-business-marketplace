import { Toaster } from "react-hot-toast";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center h-full">
      <Toaster />
      {children}
    </div>
  );
}
