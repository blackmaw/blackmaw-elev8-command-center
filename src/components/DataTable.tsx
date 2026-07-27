import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/primitives";
import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  width?: string;
  className?: string;
  /** Hidden below the lg breakpoint so dense tables stay readable on tablets. */
  secondary?: boolean;
}

/**
 * Dense enterprise table. Rows are focusable when `onRowClick` is provided so
 * keyboard users get the same affordance as pointer users.
 */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  onRowClick,
  emptyTitle = "No records",
  emptyDescription,
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="p-4">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full min-w-[42rem] border-collapse text-left text-[0.8125rem]">
        <thead>
          <tr className="border-b border-border-strong bg-canvas-2/60">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                style={c.width ? { width: c.width } : undefined}
                className={cn("label-caps px-3 py-2 font-medium whitespace-nowrap", c.secondary && "hidden lg:table-cell", c.className)}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
              className={cn(
                "border-b border-border/70 transition-colors last:border-0",
                onRowClick && "cursor-pointer hover:bg-panel-elevated focus:bg-panel-elevated focus:outline-none",
              )}
            >
              {columns.map((c) => (
                <td key={c.key} className={cn("px-3 py-2 align-middle", c.secondary && "hidden lg:table-cell", c.className)}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}