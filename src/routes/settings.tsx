import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/DataTable";
import { DemoBanner, KeyValue, PageHeader, Panel, StatusPill, Tag } from "@/components/primitives";
import { useAppState } from "@/app/app-state";
import { currentUser, SYSTEM_STATE } from "@/data/demo";
import { listIntegrations, listSettings } from "@/data/selectors";
import { INTEGRATION_STATE } from "@/domain/status";
import { ROLES } from "@/domain/roles";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "System Settings — Elev8 Command Center" },
      { name: "description", content: "Environment, appearance, workspace defaults, security posture, and integration state." },
      { property: "og:title", content: "System Settings — Elev8 Command Center" },
      { property: "og:description", content: "Command center configuration and integration register." },
    ],
  }),
  component: SettingsPage,
});

const GROUPS: { key: string; label: string }[] = [
  { key: "general", label: "General" },
  { key: "appearance", label: "Appearance" },
  { key: "workspaces", label: "Workspaces" },
  { key: "security", label: "Security" },
  { key: "advanced", label: "Advanced" },
];

function SettingsPage() {
  const { bootEnabled, setBootEnabled, sidebarCollapsed, toggleSidebar } = useAppState();
  const integrations = listIntegrations();

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Settings"
        descriptor="Configuration for the command center shell. Values marked as fixed are governed and cannot be changed in this phase."
        provenance="manually_recorded"
      >
        <DemoBanner />
      </PageHeader>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Session">
          <div className="grid grid-cols-2 gap-3">
            <KeyValue label="Operator" value={currentUser.name} />
            <KeyValue label="Role" value={ROLES[currentUser.role].name} />
            <KeyValue label="Environment" value={SYSTEM_STATE.environment} />
            <KeyValue label="Authentication" value={<Tag tone="warning">Not connected</Tag>} />
            <KeyValue label="Operating mode" value={SYSTEM_STATE.operational_mode} />
            <KeyValue label="Build" value={SYSTEM_STATE.build} mono />
          </div>
        </Panel>

        <Panel title="Shell preferences" subtitle="Stored locally on this device.">
          <div className="space-y-2">
            <label className="flex items-center justify-between gap-3 rounded-xs border border-border bg-canvas px-2 py-2 text-[0.8125rem]">
              <span>
                Startup sequence
                <span className="block text-xs text-muted-foreground">Play the initialization sequence once per session.</span>
              </span>
              <input type="checkbox" checked={bootEnabled} onChange={(e) => setBootEnabled(e.target.checked)} className="size-4 accent-[var(--teal-bright,#42A5A5)]" />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-xs border border-border bg-canvas px-2 py-2 text-[0.8125rem]">
              <span>
                Collapsed navigation
                <span className="block text-xs text-muted-foreground">Persisted between sessions.</span>
              </span>
              <input type="checkbox" checked={sidebarCollapsed} onChange={() => toggleSidebar()} className="size-4 accent-[var(--teal-bright,#42A5A5)]" />
            </label>
          </div>
        </Panel>
      </div>

      {GROUPS.map((g) => {
        const rows = listSettings(g.key);
        if (rows.length === 0) return null;
        return (
          <Panel key={g.key} title={g.label} dense>
            <DataTable
              rows={rows.map((s) => ({ ...s, id: s.key }))}
              columns={[
                { key: "label", header: "Setting", render: (s) => <span className="font-medium">{s.label}</span> },
                { key: "description", header: "Description", render: (s) => s.description, secondary: true },
                { key: "value", header: "Value", render: (s) => (typeof s.value === "boolean" ? (s.value ? "Enabled" : "Disabled") : s.value) },
                { key: "editable", header: "Control", render: (s) => <Tag tone={s.editable ? "teal" : "muted"}>{s.editable ? "Adjustable" : "Fixed"}</Tag> },
              ]}
            />
          </Panel>
        );
      })}

      <Panel title="Integrations" subtitle="No adapter is connected in this phase — every recorded value is entered by a person." dense>
        <DataTable
          rows={integrations}
          columns={[
            { key: "name", header: "Integration", render: (i) => i.name },
            { key: "category", header: "Category", render: (i) => i.category.replace(/_/g, " "), secondary: true },
            { key: "target", header: "Target", render: (i) => i.target, secondary: true },
            { key: "state", header: "State", render: (i) => <StatusPill map={INTEGRATION_STATE} value={i.state} /> },
            { key: "notes", header: "Notes", render: (i) => i.notes, secondary: true },
          ]}
        />
      </Panel>
    </div>
  );
}