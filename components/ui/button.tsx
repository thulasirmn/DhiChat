import { cn } from "@/lib/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring pressable inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold",
        variant === "primary" && "bg-accent text-white shadow-card hover:brightness-110",
        variant === "ghost" && "bg-transparent text-text hover:bg-panelSoft",
        variant === "outline" && "border border-border bg-panel text-text hover:bg-panelSoft",
        className
      )}
      {...props}
    />
  );
}
