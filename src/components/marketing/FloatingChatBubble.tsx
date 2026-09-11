"use client";

import { useState } from "react";
import { MessageCircle, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { getOrCreateClientChat } from "@/lib/actions/client-chat";
import {
  ChatThread,
  type ChatAuthor,
  type ChatMessage,
} from "@/components/dashboard/ChatThread";
import { usePathname } from "next/navigation";

export function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "unauthenticated" | "admin" | "ready" | "error">("idle");
  const [chatData, setChatData] = useState<{
    ticketId: string;
    messages: ChatMessage[];
    authorMap: Record<string, ChatAuthor>;
    currentUserId: string;
  } | null>(null);
  const pathname = usePathname();

  // Don't show bubble on auth pages or dashboard
  if (pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/dashboard")) {
    return null;
  }

  const handleOpen = async () => {
    setIsOpen(true);
    if (status === "idle" || status === "error") {
      setStatus("loading");
      try {
        const res = await getOrCreateClientChat();
        if (res.status === "success") {
          setChatData(res);
          setStatus("ready");
        } else {
          setStatus(res.status);
        }
      } catch {
        setStatus("error");
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[90vw] max-w-sm sm:w-[350px] bg-background border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[500px] max-h-[70vh]">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-bold text-sm">Chat with Admin</h3>
              <p className="text-xs opacity-90">We typically reply within a few hours.</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-muted/10 relative">
            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center flex-col text-muted-foreground gap-2">
                <Loader2 className="animate-spin" size={24} />
                <span className="text-sm font-medium">Loading chat...</span>
              </div>
            )}
            
            {status === "error" && (
              <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-6 text-muted-foreground">
                <p className="text-sm">We couldn&apos;t load the chat right now.</p>
                <button 
                  onClick={handleOpen} 
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-xs font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

            {status === "unauthenticated" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <MessageCircle size={24} />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Welcome!</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Please log in or create an account to start a persistent conversation with our team.
                </p>
                <div className="flex gap-3 w-full">
                  <Link href="/login" className="flex-1 bg-primary text-primary-foreground text-center py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Log In
                  </Link>
                  <Link href="/register" className="flex-1 bg-secondary text-secondary-foreground text-center py-2.5 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors">
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            {status === "admin" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <p className="text-sm text-muted-foreground mb-4">You are logged in as an Admin.</p>
                <Link href="/dashboard/admin" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                  Go to Admin Panel
                </Link>
              </div>
            )}

            {status === "ready" && chatData && (
              <ChatThread
                ticketId={chatData.ticketId}
                initialMessages={chatData.messages}
                authorMap={chatData.authorMap}
                currentUserId={chatData.currentUserId}
                isTicketOpen={true}
              />
            )}
          </div>
        </div>
      )}

      {/* Bubble Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform hover:shadow-primary/30"
          aria-label="Open chat"
        >
          <MessageCircle size={26} />
        </button>
      )}
    </div>
  );
}
