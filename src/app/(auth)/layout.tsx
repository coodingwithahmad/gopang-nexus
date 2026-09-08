import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  robots: { index: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      {children}
    </div>
  );
}
