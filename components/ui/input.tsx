import { cn } from "@/lib/utils/cn";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "focus-ring h-10 w-full rounded-xl border border-border bg-panel px-3 text-sm text-text placeholder:text-muted",
        className
      )}
      {...props}
    />
  );
}
