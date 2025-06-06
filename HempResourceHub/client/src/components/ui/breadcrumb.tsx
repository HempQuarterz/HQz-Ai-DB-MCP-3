import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

// Simple breadcrumb component
const Breadcrumb = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <nav
      className={cn("flex", className)}
      aria-label="breadcrumb"
      data-oid="9p667sd"
    >
      <ol
        className="flex flex-wrap items-center gap-1.5 sm:gap-2.5"
        data-oid="5ak1zha"
      >
        {children}
      </ol>
    </nav>
  );
};

// Export as default and named export to maintain compatibility with both import styles
export default Breadcrumb;

// Export a simple way to create a breadcrumb from links
export const createBreadcrumb = (
  items: { href: string; label: string; isCurrent?: boolean }[],
) => {
  return (
    <Breadcrumb data-oid="1s6th.6">
      {items.map((item, index) => {
        // Using a div instead of Fragment to avoid the prop warning
        return (
          <div key={item.href} className="contents" data-oid="8oedul_">
            {index > 0 && (
              <ChevronRight
                className="h-4 w-4 text-white/50"
                data-oid="0no60mr"
              />
            )}
            <li className="inline-flex items-center gap-1.5" data-oid="g5fa73.">
              {item.isCurrent ? (
                <span
                  className="text-sm font-semibold text-green-400 pointer-events-none cursor-default"
                  aria-current="page"
                  data-oid="b7bpjwg"
                >
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} data-oid="m6-kpsb">
                  <span
                    className="text-sm text-white/70 hover:text-green-400 transition-colors cursor-pointer"
                    data-oid="e7f8z51"
                  >
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
