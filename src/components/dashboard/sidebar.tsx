"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipTitle,
} from "@/components/ui/warcraftcn/tooltip";
import type { ReactNode } from "react";

interface NavItem {
    href: string;
    label: string;
    icon: ReactNode;
    tooltip?: string;
}

interface SidebarProps {
    title: string;
    subtitle: string;
    items: NavItem[];
    accentColor?: string;
}

export function Sidebar({ title, subtitle, items, accentColor = "text-gold" }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-40">
                <div className="flex flex-col h-full border-r border-gold/10 bg-[hsl(220,24%,7%)]">
                    {/* Logo */}
                    <div className="px-6 py-6 border-b border-gold/10">
                        <Link href="/" className="block">
                            <h1 className={cn("font-(family-name:--font-cinzel) font-bold text-lg", accentColor)}>
                                {title}
                            </h1>
                            <p className="font-(family-name:--font-crimson) text-amber-100/40 text-xs mt-1">
                                {subtitle}
                            </p>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {items.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-(family-name:--font-crimson) transition-all duration-200",
                                                isActive
                                                    ? "bg-gold/10 text-gold border border-gold/20 shadow-[0_0_12px_rgba(242,201,76,0.06)]"
                                                    : "text-amber-100/50 hover:text-amber-100/80 hover:bg-white/3 border border-transparent"
                                            )}
                                        >
                                            <span className={cn("shrink-0", isActive ? "text-gold" : "text-amber-100/30")}>
                                                {item.icon}
                                            </span>
                                            <span>{item.label}</span>
                                            {isActive && (
                                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                                            )}
                                        </Link>
                                    </TooltipTrigger>
                                    {item.tooltip && (
                                        <TooltipContent side="right" variant="default">
                                            <TooltipTitle>{item.tooltip}</TooltipTitle>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gold/10">
                        <p className="text-amber-100/20 text-xs font-(family-name:--font-crimson)">
                            WoWnator v2
                        </p>
                    </div>
                </div>
            </aside>

            {/* Mobile header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[hsl(220,24%,7%)] border-b border-gold/10">
                <div className="px-4 py-3 flex items-center justify-between">
                    <Link href="/">
                        <h1 className={cn("font-(family-name:--font-cinzel) font-bold text-base", accentColor)}>
                            {title}
                        </h1>
                    </Link>
                    <nav className="flex items-center gap-1">
                        {items.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "p-2 rounded-md transition-colors",
                                                isActive
                                                    ? "bg-gold/10 text-gold"
                                                    : "text-amber-100/40 hover:text-amber-100/70"
                                            )}
                                        >
                                            {item.icon}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" variant="default">
                                        <TooltipTitle>{item.label}</TooltipTitle>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </>
    );
}
