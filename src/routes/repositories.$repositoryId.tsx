import { createFileRoute, Link } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import { DemoBanner, EmptyState, KeyValue, Mono, PageHeader, Panel, StatusPill } from "@/components/primitives";
import { getRepository, listSnapshots, listStages, productName } from "@/data/selectors";
import { FREEZE_STATE, GATE_STATE, INTEGRATION_STATE, STAGE_STATE, WORKING_TREE } from "@/domain/status";

export const Route = createFileRoute("/repositories/$repositoryId")({
  head: () => ({
    meta: [
      { title: "Repository Record — Elev8 Command Center" },
      { name: "description", content: "Repository record: recorded commit, review gates, linked stages, and registered snapshots." },
      { property: "og:title", content: "Repository Record — Elev8 Command Center" },
      { property: "og:description", content: "Recorded repository state, stages, and snapshots." },
    ],
  }),
  component: RepositoryDetail,
});

function RepositoryDetail() {
  const { repositoryId } = Route.useParams();
  const repo = getRepository(repositoryId);

  if (!repo) {
    return (
      <div className="mx-auto max-w-[1600px] p-4 lg:p-6">
        <EmptyState
          title="Repository not found"
          description="No repository matches this identifier in the current record set."
          action={
            <Link to="/repositories" className="text-[0.75rem] text-teal-bright hover:underline">
              Back to repository center
            </Link>
          }
        />
      </div>
    );
  }

  const stages = listStages().filter((s) => s.repository_id === repo.id);
  const snapshots = listSnapshots().filter((s) => s.repository_id === repo.id);

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader title={repo.name} descriptor={`Repository record for ${productName(repo.product_id)}.`} provenance={repo.provenance}>
        <DemoBanner />
      </PageHeader>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Recorded state">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <KeyValue label="Provider" value={repo.provider} />
            <KeyValue label="Visibility" value={repo.visibility} />
            <KeyValue label="Default branch" value={repo.default_branch} mono />
            <KeyValue label="Current branch" value={repo.current_branch} mono />
            <KeyValue label="Latest commit" value={repo.latest_commit} mono />
            <KeyValue label="Latest tag" value={repo.latest_tag ?? "None"} mono />
            <KeyValue label="Working tree" value={<StatusPill map={WORKING_TREE} value={repo.working_tree} />} />
            <KeyValue label="Last verified" value={repo.last_verified_at ? new Date(repo.last_verified_at).toLocaleString() : "Never"} />
            <KeyValue label="Integration" value={<StatusPill map={INTEGRATION_STATE} value={repo.integration_state} />} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{repo.latest_commit_message}</p>
        </Panel>

        <Panel title="Review gates">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <KeyValue label="CI" value={<StatusPill map={GATE_STATE} value={repo.ci_status} />} />
            <KeyValue label="Tests" value={<StatusPill map={GATE_STATE} value={repo.test_status} />} />
            <KeyValue label="Documentation" value={<StatusPill map={GATE_STATE} value={repo.documentation_state} />} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Gate values are recorded manually. Connecting a provider adapter is a separate, approved change.
          </p>
        </Panel>
      </div>

      <Panel title="Linked stages" dense>
        <DataTable
          rows={stages}
          emptyTitle="No stages reference this repository"
          columns={[
            { key: "code", header: "Stage", render: (s) => <Mono>{s.code}</Mono> },
            { key: "name", header: "Name", render: (s) => s.name },
            { key: "state", header: "State", render: (s) => <StatusPill map={STAGE_STATE} value={s.state} /> },
          ]}
        />
      </Panel>

      <Panel title="Registered snapshots" dense>
        <DataTable
          rows={snapshots}
          emptyTitle="No snapshots registered"
          columns={[
            { key: "id", header: "Identifier", render: (s) => <Mono>{s.identifier}</Mono> },
            { key: "version", header: "Version", render: (s) => <Mono>{s.version}</Mono> },
            { key: "taken", header: "Taken", render: (s) => <span className="num">{s.taken_on}</span> },
            { key: "freeze", header: "Freeze", render: (s) => <StatusPill map={FREEZE_STATE} value={s.freeze_state} /> },
          ]}
        />
      </Panel>
    </div>
  );
}