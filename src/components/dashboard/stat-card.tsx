import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipTitle,
    TooltipBody,
} from "@/components/ui/warcraftcn/tooltip";
import type { ReactNode } from "react";

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    description?: string;
    color?: string;
    tooltip?: string;
}

export function StatCard({
    icon,
    label,
    value,
    description,
    color = "text-gold",
    tooltip,
}: StatCardProps) {
    const card = (
        <div className="relative group flex flex-col gap-3 p-5 rounded-lg border border-gold/10 bg-white/2 hover:border-gold/20 hover:bg-white/4 transition-all duration-300">
            <div className="flex items-center justify-between">
                <div
                    className={cn(
                        "w-10 h-10 rounded-lg bg-gold/5 border border-gold/15 flex items-center justify-center transition-colors duration-300 group-hover:bg-gold/10",
                        color
                    )}
                >
                    {icon}
                </div>
                <span className="font-(family-name:--font-cinzel) text-amber-100/30 text-xs uppercase tracking-wider">
                    {label}
                </span>
            </div>

            <div>
                <p className={cn("font-(family-name:--font-cinzel) text-2xl font-bold", color)}>
                    {value}
                </p>
                {description && (
                    <p className="font-(family-name:--font-crimson) text-amber-100/40 text-sm mt-1">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );

    if (tooltip) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>{card}</TooltipTrigger>
                <TooltipContent variant="default">
                    <TooltipTitle>{label}</TooltipTitle>
                    <TooltipBody>{tooltip}</TooltipBody>
                </TooltipContent>
            </Tooltip>
        );
    }

    return card;
}
