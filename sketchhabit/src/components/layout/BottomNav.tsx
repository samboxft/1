"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PenLine, BookOpen, Clock } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/draw", label: "Draw", icon: PenLine },
  { href: "/tutorials", label: "Learn", icon: BookOpen },
  { href: "/history", label: "History", icon: Clock },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-100 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 h-16">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-200 min-w-[64px]",
                active
                  ? "text-amber-600"
                  : "text-neutral-400 hover:text-neutral-600"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-200",
                  active ? "bg-amber-50" : ""
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={active ? "text-amber-600" : "text-neutral-400"}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium leading-none",
                  active ? "text-amber-600" : "text-neutral-400"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
