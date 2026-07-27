import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import {
  DemoBanner,
  Mono,
  PageHeader,
  Panel,
  ProgressBar,
  StatusPill,
} from "@/components/primitives";
import { listReleases, productName } from "@/data/selectors";
import { RELEASE_STATE } from "@/domain/status";

export const Route = createFileRoute("/releases/")({
  head: () => ({
    meta: [
      { title: "Release Sequence — Elev8 Command Center" },
      {
        name: "description",
        content: "Release candidates with their mandatory readiness checks and approval state.",
      },
      { property: "og:title", content: "Release Sequence — Elev8 Command Center" },
      { property: "og:description", content: "Release readiness and mandatory checks." },
    ],
  }),
  component: ReleasesIndex,
});

function ReleasesIndex() {
  const navigate = useNavigate();
  const releases = listReleases();

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Releases"
        descriptor="A release is never marked ready by inference. Every mandatory check must be evaluated and an approval recorded."
        provenance="manually_recorded"
      >
        <DemoBanner />
      </PageHeader>

      <Panel dense>
        <DataTable
          rows={releases}
          onRowClick={(r) => navigate({ to: "/releases/$releaseId", params: { releaseId: r.id } })}
          columns={[
            {
              key: "name",
              header: "Release",
              render: (r) => <span className="font-medium">{r.name}</span>,
            },
            {
              key: "product",
              header: "Product",
              render: (r) => productName(r.product_id),
              secondary: true,
            },
            { key: "version", header: "Version", render: (r) => <Mono>{r.version}</Mono> },
            {
              key: "channel",
              header: "Channel",
              render: (r) => r.channel.replace(/_/g, " "),
              secondary: true,
            },
            {
              key: "target",
              header: "Target",
              render: (r) => <span className="num">{r.target_on}</span>,
              secondary: true,
            },
            {
              key: "checks",
              header: "Checks passed",
              width: "11rem",
              render: (r) => {
                const passed = r.checks.filter((c) => c.state === "passed").length;
                return (
                  <div className="flex items-center gap-2">
                    <ProgressBar
                      value={Math.round((passed / r.checks.length) * 100)}
                      className="w-20"
                    />
                    <span className="num text-xs">
                      {passed}/{r.checks.length}
                    </span>
                  </div>
                );
              },
            },
            {
              key: "state",
              header: "State",
              render: (r) => <StatusPill map={RELEASE_STATE} value={r.state} />,
            },
          ]}
        />
      </Panel>
    </div>
  );
}
