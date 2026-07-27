import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { DemoBanner, Mono, PageHeader, Panel, StatusPill, Tag } from "@/components/primitives";
import { listDocuments, productName } from "@/data/selectors";
import { ENTITY_STATUS, GATE_STATE } from "@/domain/status";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Document Registry — Elev8 Command Center" },
      {
        name: "description",
        content:
          "Institutional records: architecture, specifications, runbooks, corporate and curriculum documents.",
      },
      { property: "og:title", content: "Document Registry — Elev8 Command Center" },
      { property: "og:description", content: "Versioned institutional record registry." },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const all = listDocuments();
  const [type, setType] = useState<string>("all");
  const types = ["all", ...Array.from(new Set(all.map((d) => d.doc_type)))];
  const rows = type === "all" ? all : all.filter((d) => d.doc_type === type);

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Documents"
        descriptor="Every institutional record with its version, approval state, and storage location."
        provenance="manually_recorded"
      >
        <DemoBanner />
      </PageHeader>

      <div className="flex flex-wrap gap-1.5">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-xs border px-2 py-1 text-[0.75rem] transition-colors ${
              t === type
                ? "border-border-strong bg-panel-elevated text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <Panel dense>
        <DataTable
          rows={rows}
          columns={[
            {
              key: "title",
              header: "Document",
              render: (d) => <span className="font-medium">{d.title}</span>,
            },
            {
              key: "type",
              header: "Type",
              render: (d) => <Tag>{d.doc_type.replace(/_/g, " ")}</Tag>,
              secondary: true,
            },
            {
              key: "product",
              header: "Product",
              render: (d) => productName(d.product_id),
              secondary: true,
            },
            { key: "version", header: "Version", render: (d) => <Mono>v{d.version}</Mono> },
            {
              key: "approval",
              header: "Approval",
              render: (d) => <StatusPill map={GATE_STATE} value={d.approval_state} />,
            },
            {
              key: "status",
              header: "Status",
              render: (d) => <StatusPill map={ENTITY_STATUS} value={d.status} dot={false} />,
            },
            {
              key: "loc",
              header: "Storage",
              render: (d) => <Mono className="text-muted-foreground">{d.storage_location}</Mono>,
              secondary: true,
            },
          ]}
        />
      </Panel>
    </div>
  );
}
