import { createFileRoute, Link } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import {
  DemoBanner,
  EmptyState,
  KeyValue,
  PageHeader,
  Panel,
  StatusPill,
  Tag,
} from "@/components/primitives";
import { getRelease, listApprovalsForSubject, productName } from "@/data/selectors";
import { GATE_STATE, RELEASE_STATE } from "@/domain/status";

export const Route = createFileRoute("/releases/$releaseId")({
  head: () => ({
    meta: [
      { title: "Release Record — Elev8 Command Center" },
      {
        name: "description",
        content: "Release record with every mandatory readiness check and the governing approval.",
      },
      { property: "og:title", content: "Release Record — Elev8 Command Center" },
      { property: "og:description", content: "Mandatory release checks and approval record." },
    ],
  }),
  component: ReleaseDetail,
});

function ReleaseDetail() {
  const { releaseId } = Route.useParams();
  const release = getRelease(releaseId);

  if (!release) {
    return (
      <div className="mx-auto max-w-[1600px] p-4 lg:p-6">
        <EmptyState
          title="Release not found"
          description="No release matches this identifier in the current record set."
          action={
            <Link to="/releases" className="text-[0.75rem] text-teal-bright hover:underline">
              Back to releases
            </Link>
          }
        />
      </div>
    );
  }

  const approvals = listApprovalsForSubject(release.id);
  const checks = release.checks.map((c) => ({ ...c, id: c.key }));
  const blocking = release.checks.filter((c) => c.mandatory && c.state !== "passed").length;

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader title={release.name} descriptor={release.notes} provenance={release.provenance}>
        <DemoBanner />
      </PageHeader>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Release record">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <KeyValue label="Product" value={productName(release.product_id)} />
            <KeyValue label="Version" value={release.version} mono />
            <KeyValue label="Channel" value={release.channel.replace(/_/g, " ")} />
            <KeyValue label="Target" value={release.target_on} />
            <KeyValue
              label="State"
              value={<StatusPill map={RELEASE_STATE} value={release.state} />}
            />
            <KeyValue label="Blocking checks" value={<span className="num">{blocking}</span>} />
          </div>
        </Panel>

        <Panel title="Approval record">
          {approvals.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No approval recorded. This release cannot be marked ready or shipped without an
              explicit founder approval record.
            </p>
          ) : (
            approvals.map((a) => (
              <div
                key={a.id}
                className="rounded-xs border border-border bg-canvas p-2 text-[0.8125rem]"
              >
                <div className="font-medium">{a.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{a.notes}</div>
                <Tag
                  className="mt-1.5"
                  tone={
                    a.decision === "approved"
                      ? "success"
                      : a.decision === "rejected"
                        ? "critical"
                        : "warning"
                  }
                >
                  {a.decision}
                </Tag>
              </div>
            ))
          )}
        </Panel>
      </div>

      <Panel
        title="Readiness checks"
        subtitle="Mandatory checks must be explicitly evaluated — never inferred."
        dense
      >
        <DataTable
          rows={checks}
          columns={[
            { key: "label", header: "Check", render: (c) => c.label },
            {
              key: "mandatory",
              header: "Mandatory",
              render: (c) => (
                <Tag tone={c.mandatory ? "warning" : "muted"}>
                  {c.mandatory ? "Required" : "Optional"}
                </Tag>
              ),
            },
            {
              key: "state",
              header: "State",
              render: (c) => <StatusPill map={GATE_STATE} value={c.state} />,
            },
            { key: "note", header: "Note", render: (c) => c.note, secondary: true },
          ]}
        />
      </Panel>
    </div>
  );
}
