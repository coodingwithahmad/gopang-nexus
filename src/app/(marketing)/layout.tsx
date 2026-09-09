import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { FloatingChatBubble } from "@/components/marketing/FloatingChatBubble";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingChatBubble />
    </div>
  );
}
