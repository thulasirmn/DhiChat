import { cn } from "@/lib/utils/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success" | "warning" | "danger";
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "default" && "bg-panelSoft text-muted",
        tone === "success" && "bg-success/10 text-success",
        tone === "warning" && "bg-warn/10 text-warn",
        tone === "danger" && "bg-danger/10 text-danger",
        className
      )}
      {...props}
    />
  );
}
