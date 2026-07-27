import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import {
  DemoBanner,
  KeyValue,
  Label,
  PageHeader,
  Panel,
  StatusPill,
  Tag,
} from "@/components/primitives";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { listAssets } from "@/data/selectors";
import { ASSET_LIFECYCLE, PROVENANCE } from "@/domain/status";
import type { Asset } from "@/domain/types";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Asset Registry — Elev8 Command Center" },
      {
        name: "description",
        content:
          "Owned equipment with specifications, interfaces, dependencies, and planned upgrades.",
      },
      { property: "og:title", content: "Asset Registry — Elev8 Command Center" },
      { property: "og:description", content: "Owned equipment inventory and lifecycle." },
    ],
  }),
  component: AssetsPage,
});

function AssetsPage() {
  const assets = listAssets();
  const [selected, setSelected] = useState<Asset | null>(null);

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Assets"
        descriptor="Equipment actually owned by the group. Serial numbers and firmware baselines are pending manual verification."
        provenance="manually_recorded"
      >
        <DemoBanner />
      </PageHeader>

      <Panel dense>
        <DataTable
          rows={assets}
          onRowClick={(a) => setSelected(a)}
          columns={[
            {
              key: "name",
              header: "Asset",
              render: (a) => <span className="font-medium">{a.name}</span>,
            },
            { key: "category", header: "Category", render: (a) => <Tag>{a.category}</Tag> },
            { key: "vendor", header: "Vendor", render: (a) => a.vendor, secondary: true },
            { key: "role", header: "Role", render: (a) => a.role, secondary: true },
            { key: "location", header: "Location", render: (a) => a.location, secondary: true },
            {
              key: "serial",
              header: "Serial",
              render: (a) => <StatusPill map={PROVENANCE} value={a.serial_state} dot={false} />,
              secondary: true,
            },
            {
              key: "lifecycle",
              header: "Lifecycle",
              render: (a) => <StatusPill map={ASSET_LIFECYCLE} value={a.lifecycle} />,
            },
          ]}
        />
      </Panel>

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto bg-canvas-2 sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader className="p-0">
                <SheetTitle className="text-[0.9375rem]">{selected.name}</SheetTitle>
                <SheetDescription className="text-xs">{selected.role}</SheetDescription>
              </SheetHeader>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <KeyValue label="Vendor" value={selected.vendor} />
                <KeyValue label="Model" value={selected.model} />
                <KeyValue label="Location" value={selected.location} />
                <KeyValue label="Acquired" value={selected.acquired_on ?? "Not acquired"} />
                <KeyValue
                  label="Lifecycle"
                  value={<StatusPill map={ASSET_LIFECYCLE} value={selected.lifecycle} />}
                />
                <KeyValue
                  label="Serial record"
                  value={<StatusPill map={PROVENANCE} value={selected.serial_state} />}
                />
              </div>

              <div className="mt-4 space-y-1.5">
                <Label>Specifications</Label>
                {selected.specifications.map((s) => (
                  <div
                    key={s.label}
                    className="flex justify-between gap-3 border-b border-border/60 pb-1 text-[0.8125rem] last:border-0"
                  >
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="text-right">{s.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-1.5">
                <Label>Interfaces</Label>
                {selected.interfaces.map((s) => (
                  <div
                    key={s.label}
                    className="flex justify-between gap-3 border-b border-border/60 pb-1 text-[0.8125rem] last:border-0"
                  >
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="text-right">{s.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-1.5">
                <Label>Services</Label>
                <div className="flex flex-wrap gap-1.5">
                  {selected.services.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <Label>Planned upgrades</Label>
                <ul className="space-y-1 text-[0.8125rem] text-muted-foreground">
                  {selected.planned_upgrades.map((u) => (
                    <li key={u}>— {u}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 space-y-1.5">
                <Label>Maintenance notes</Label>
                <p className="text-xs text-muted-foreground">{selected.maintenance_notes}</p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
