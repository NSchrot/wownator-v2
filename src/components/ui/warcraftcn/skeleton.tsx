import { cn } from "@/lib/utils";
import "@/components/ui/warcraftcn/styles/warcraft.css";

type SkeletonFaction = "default" | "orc" | "elf" | "human" | "undead";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  faction?: SkeletonFaction;
  shimmer?: boolean;
  icons?: boolean;
}

export function Skeleton({
  className,
  faction = "default",
  shimmer = true,
  icons = false,
  ...props
}: SkeletonProps) {
  const baseClass =
    faction === "default" ? "wc-skeleton" : `wc-skeleton-${faction}`;

  return (
    <div
      className={cn("relative overflow-hidden rounded", baseClass, className)}
      {...props}
    >
      {shimmer && <div className="wc-skeleton-shimmer" />}
      {icons && <div className="wc-skeleton-icons" />}
    </div>
  );
}
