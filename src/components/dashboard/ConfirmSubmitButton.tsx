"use client";

import { Trash2 } from "lucide-react";

interface ConfirmSubmitButtonProps {
  message: string;
  title?: string;
}

export function ConfirmSubmitButton({
  message,
  title = "Delete",
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10"
      title={title}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      <Trash2 size={16} />
    </button>
  );
}
