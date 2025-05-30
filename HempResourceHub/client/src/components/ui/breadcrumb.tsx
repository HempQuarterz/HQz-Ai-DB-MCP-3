import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

// Simple breadcrumb component
const Breadcrumb = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
  return (
    <nav className={cn("flex", className)} aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">{children}</ol>
    </nav>
  );
};

// Export as default and named export to maintain compatibility with both import styles
export default Breadcrumb;

// Export a simple way to create a breadcrumb from links
export const createBreadcrumb = (items: { href: string; label: string; isCurrent?: boolean }[]) => {
  return (
    <Breadcrumb>
      {items.map((item, index) => {
        // Using a div instead of Fragment to avoid the prop warning
        return (
          <div key={item.href} className="contents">
            {index > 0 && <ChevronRight className="h-4 w-4 text-white/50" />}
            <li className="inline-flex items-center gap-1.5">
              {item.isCurrent ? (
                <span 
                  className="text-sm font-semibold text-green-400 pointer-events-none cursor-default"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link href={item.href}>
                  <span className="text-sm text-white/70 hover:text-green-400 transition-colors cursor-pointer">
                    {item.label}
                  </span>
                </Link>
              )}
            </li>
          </div>
        );
      })}
    </Breadcrumb>
  );
};