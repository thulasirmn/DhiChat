import { cn } from "@/lib/utils/cn";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "focus-ring w-full rounded-xl border border-border bg-panel px-3 py-2 text-sm text-text placeholder:text-muted",
        className
      )}
      {...props}
    />
  );
}
