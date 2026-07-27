/**
 * ELEV8 COMMAND CENTER — canonical domain models.
 * These types are the contract between the demonstration data layer
 * (src/data) and every presentation module. A future Supabase / API adapter
 * must satisfy these same shapes; no page should invent its own record type.
 */

export type ID = string;

/** Provenance label applied to every value that could be mistaken for live data. */
export type Provenance =
  | "demonstration"
  | "manually_recorded"
  | "pending_verification"
  | "integration_not_connected"
  | "verified";

export interface BaseRecord {
  id: ID;
  organization_id: ID | null;
  workspace_id: ID | null;
  owner_id: ID | null;
  status: string;
  provenance: Provenance;
  created_at: string;
  updated_at: string;
  created_by: ID | null;
  updated_by: ID | null;
  archived_at?: string | null;
}

/* ---------------------------------------------------------------- people */

export type RoleKey =
  | "founder"
  | "executive_administrator"
  | "workspace_administrator"
  | "engineering_lead"
  | "engineer"
  | "product_manager"
  | "operations_manager"
  | "auditor"
  | "read_only";

export interface Role {
  key: RoleKey;
  name: string;
  description: string;
  permissions: PermissionKey[];
}

export type PermissionKey =
  | "workspace.read"
  | "workspace.manage"
  | "product.read"
  | "product.manage"
  | "stage.read"
  | "stage.approve"
  | "release.read"
  | "release.approve"
  | "infrastructure.read"
  | "infrastructure.manage"
  | "document.read"
  | "document.manage"
  | "decision.read"
  | "decision.approve"
  | "settings.manage"
  | "audit.read";

export interface User {
  id: ID;
  name: string;
  title: string;
  initials: string;
  email: string;
  role: RoleKey;
  organization_ids: ID[];
  workspace_ids: ID[];
}

/* --------------------------------------------------------- organizations */

export type EntityStatus =
  | "planned"
  | "formation"
  | "active"
  | "pending_verification"
  | "verified"
  | "suspended"
  | "archived";

export interface Organization extends BaseRecord {
  status: EntityStatus;
  name: string;
  legal_name: string;
  short_name: string;
  kind: "holding" | "operating" | "business_unit";
  parent_id: ID | null;
  jurisdiction: string;
  formed_on: string | null;
  registered_agent_state: EntityStatus;
  ein_state: EntityStatus;
  banking_state: EntityStatus;
  credit_state: EntityStatus;
  insurance_state: EntityStatus;
  summary: string;
}

export interface BusinessUnit extends BaseRecord {
  name: string;
  organization_id: ID;
  function: string;
  headcount_plan: number;
}

/* ------------------------------------------------------------ workspaces */

export type WorkspaceKey =
  "command" | "executive" | "technologies" | "driving-academy" | "infrastructure" | "institutional";

export interface Workspace {
  id: WorkspaceKey;
  name: string;
  short_name: string;
  descriptor: string;
  organization_id: ID | null;
  status: EntityStatus;
  owner_id: ID;
  access: RoleKey[];
  route: string;
  accent: "teal" | "info" | "warning" | "success";
}

/* -------------------------------------------------------------- products */

export type Lifecycle =
  | "concept"
  | "formation"
  | "architecture"
  | "active_development"
  | "validation"
  | "released"
  | "sunset";

export type Health = "nominal" | "watch" | "at_risk" | "blocked" | "paused";

export interface Product extends BaseRecord {
  key: string;
  name: string;
  code: string;
  type: string;
  owner_org_id: ID;
  lifecycle: Lifecycle;
  current_phase: string;
  current_stage_id: ID | null;
  release_state: string;
  health: Health;
  progress: number;
  security_state: GateState;
  validation_state: GateState;
  next_gate: string;
  summary: string;
  acceptance_criteria: { id: ID; label: string; met: boolean }[];
  dependencies: string[];
  last_checkpoint_at: string | null;
}

export interface Project extends BaseRecord {
  name: string;
  code: string;
  product_id: ID | null;
  objective: string;
  phase: string;
  health: Health;
  progress: number;
  start_on: string;
  target_on: string;
}

/* ---------------------------------------------------------- stage system */

export type StageState =
  | "proposed"
  | "planned"
  | "in_progress"
  | "review_required"
  | "validation_required"
  | "blocked"
  | "approved"
  | "frozen"
  | "superseded"
  | "archived";

export type GateState = "not_evaluated" | "passed" | "failed" | "blocked" | "waived";

export interface StageRequirement {
  id: ID;
  stage_id: ID;
  kind: "entry" | "artifact" | "review" | "validation";
  label: string;
  state: GateState;
  note?: string;
}

export interface Stage extends BaseRecord {
  code: string;
  name: string;
  product_id: ID;
  sequence: number;
  state: StageState;
  objective: string;
  entry_criteria: string[];
  repository_id: ID | null;
  commit_ref: string | null;
  non_code_designation: string | null;
  freeze_record_id: ID | null;
  rollback_notes: string;
  opened_on: string;
  target_on: string;
}

export interface Approval extends BaseRecord {
  subject_type: "stage" | "release" | "decision" | "infrastructure" | "document";
  subject_id: ID;
  title: string;
  requested_by: ID;
  approver_id: ID;
  decision: "pending" | "approved" | "rejected";
  decided_at: string | null;
  notes: string;
  requires_manual_action: true;
}

export interface Checkpoint extends BaseRecord {
  label: string;
  product_id: ID | null;
  stage_id: ID | null;
  recorded_at: string;
  summary: string;
  next_action: string;
  branch: string | null;
}

export interface EngineeringSession extends BaseRecord {
  title: string;
  product_id: ID | null;
  started_at: string;
  ended_at: string | null;
  outcome: string;
  participants: ID[];
}

/* ---------------------------------------------------------- repositories */

export interface Repository extends BaseRecord {
  name: string;
  product_id: ID | null;
  provider: "github" | "self_hosted" | "not_assigned";
  visibility: "private" | "internal" | "public";
  default_branch: string;
  current_branch: string;
  latest_commit: string;
  latest_commit_message: string;
  latest_tag: string | null;
  working_tree: "clean" | "dirty" | "unknown";
  ci_status: GateState;
  test_status: GateState;
  documentation_state: GateState;
  last_snapshot_id: ID | null;
  last_verified_at: string | null;
  integration_state: "not_connected" | "configured" | "connected";
}

/* ------------------------------------------------ releases and snapshots */

export type ReleaseCheckKey =
  | "architecture"
  | "security"
  | "testing"
  | "documentation"
  | "infrastructure"
  | "migration"
  | "backup"
  | "rollback"
  | "approval"
  | "snapshot"
  | "release_notes";

export interface ReleaseCheck {
  key: ReleaseCheckKey;
  label: string;
  mandatory: boolean;
  state: GateState;
  note: string;
}

export interface Release extends BaseRecord {
  name: string;
  version: string;
  product_id: ID;
  channel: "pre_alpha" | "alpha" | "beta" | "rc" | "ga";
  target_on: string;
  state: "planning" | "in_review" | "ready" | "blocked" | "shipped";
  checks: ReleaseCheck[];
  notes: string;
}

export interface Snapshot extends BaseRecord {
  identifier: string;
  product_id: ID;
  stage_id: ID | null;
  version: string;
  taken_on: string;
  repository_id: ID | null;
  branch: string;
  commit_ref: string;
  tag: string | null;
  artifact_name: string;
  checksum: string;
  validation_state: GateState;
  freeze_state: "not_frozen" | "freeze_requested" | "frozen";
  storage_location: string;
  notes: string;
}

/* ------------------------------------------------------------- documents */

export type DocumentType =
  | "architecture"
  | "specification"
  | "validation_report"
  | "freeze_record"
  | "acceptance_report"
  | "runbook"
  | "sop"
  | "meeting_notes"
  | "builders_journal"
  | "engineering_session"
  | "legal"
  | "corporate"
  | "curriculum"
  | "course_map"
  | "vendor";

export interface DocumentRecord extends BaseRecord {
  title: string;
  doc_type: DocumentType;
  product_id: ID | null;
  project_id: ID | null;
  version: string;
  approval_state: GateState;
  effective_on: string | null;
  superseded_by: ID | null;
  storage_location: string;
  tags: string[];
}

export interface DocumentVersion {
  id: ID;
  document_id: ID;
  version: string;
  created_at: string;
  created_by: ID;
  summary: string;
}

/* -------------------------------------------------------- infrastructure */

export type AssetLifecycle =
  "planned" | "procured" | "staging" | "in_service" | "maintenance" | "retired";

export interface Asset extends BaseRecord {
  name: string;
  category: "compute" | "network" | "storage" | "power" | "endpoint" | "software";
  model: string;
  vendor: string;
  serial_state: Provenance;
  lifecycle: AssetLifecycle;
  role: string;
  location: string;
  acquired_on: string | null;
  specifications: { label: string; value: string }[];
  interfaces: { label: string; value: string }[];
  services: string[];
  dependencies: ID[];
  maintenance_notes: string;
  planned_upgrades: string[];
  document_ids: ID[];
  risk_ids: ID[];
}

export interface InfrastructureNode {
  id: ID;
  asset_id: ID | null;
  label: string;
  sublabel: string;
  tier: number;
  column: number;
  kind: "external" | "edge" | "network" | "compute" | "storage" | "planned";
  state: "in_service" | "planned" | "unknown";
}

export interface InfrastructureConnection {
  id: ID;
  from_node_id: ID;
  to_node_id: ID;
  medium: string;
  state: "installed" | "planned";
}

/* ----------------------------------------------- work, risk, and ledgers */

export interface Task extends BaseRecord {
  title: string;
  product_id: ID | null;
  project_id: ID | null;
  state: "todo" | "in_progress" | "review" | "done" | "blocked";
  priority: "low" | "normal" | "high" | "critical";
  due_on: string | null;
}

export interface Milestone extends BaseRecord {
  title: string;
  product_id: ID | null;
  due_on: string;
  gate_type: string;
  state: StageState;
}

export interface Roadmap extends BaseRecord {
  name: string;
  product_id: ID | null;
  horizon: string;
  lanes: { id: ID; label: string; items: RoadmapItem[] }[];
}

export interface RoadmapItem {
  id: ID;
  label: string;
  quarter: string;
  state: StageState;
  product_id: ID | null;
}

export interface Decision extends BaseRecord {
  identifier: string;
  title: string;
  context: string;
  decision: string;
  alternatives: string[];
  consequences: string[];
  decided_on: string | null;
  product_id: ID | null;
  stage_id: ID | null;
  document_ids: ID[];
  state: "proposed" | "accepted" | "rejected" | "superseded";
}

export interface Risk extends BaseRecord {
  title: string;
  severity: "low" | "moderate" | "high" | "critical";
  product_id: ID | null;
  opened_on: string;
  recommended_response: string;
  state: "open" | "mitigating" | "accepted" | "closed";
}

export interface Notification extends BaseRecord {
  title: string;
  body: string;
  severity: "info" | "success" | "warning" | "critical";
  read: boolean;
  link: string | null;
  occurred_at: string;
}

export type ActivityKind =
  | "product_created"
  | "stage_review"
  | "validation_completed"
  | "freeze_approved"
  | "snapshot_registered"
  | "document_superseded"
  | "risk_escalated"
  | "asset_purchased"
  | "repository_verified"
  | "decision_approved"
  | "checkpoint_recorded";

export interface ActivityEvent {
  id: ID;
  kind: ActivityKind;
  occurred_at: string;
  actor_id: ID;
  workspace_id: WorkspaceKey;
  product_id: ID | null;
  summary: string;
  detail: string;
  provenance: Provenance;
  link: string | null;
}

export interface Integration {
  id: ID;
  name: string;
  category:
    "source_control" | "virtualization" | "network" | "storage" | "observability" | "platform";
  target: string;
  state: "not_connected" | "planned" | "configured";
  adapter: string;
  notes: string;
}

export interface SystemSetting {
  key: string;
  label: string;
  group: "general" | "appearance" | "workspaces" | "security" | "integrations" | "advanced";
  description: string;
  value: string | boolean;
  kind: "toggle" | "select" | "text";
  options?: string[];
  editable: boolean;
}

/* ------------------------------------------------------------- search UI */

export type SearchEntity =
  | "organization"
  | "workspace"
  | "product"
  | "project"
  | "repository"
  | "stage"
  | "task"
  | "document"
  | "asset"
  | "decision"
  | "snapshot"
  | "release"
  | "risk"
  | "approval"
  | "milestone"
  | "roadmap"
  | "journal"
  | "activity";

export interface SearchResult {
  id: ID;
  entity: SearchEntity;
  title: string;
  subtitle: string;
  meta: string;
  route: string;
}
/* ------------------------------------------------- phase 2: institutional
 * Builder Journal, AI briefings, health scoring, resume + briefing engines.
 * These models complete the centralized architecture: every derived view is
 * computed from the records above, never stored twice.
 * ---------------------------------------------------------------------- */

export type JournalImportance = "routine" | "notable" | "significant" | "milestone";

export interface BuilderJournalEntry extends BaseRecord {
  entry_date: string;
  title: string;
  summary: string;
  product_id: ID | null;
  repository_id: ID | null;
  document_ids: ID[];
  asset_ids: ID[];
  decision_ids: ID[];
  stage_id: ID | null;
  tags: string[];
  importance: JournalImportance;
}

export interface AIBriefing {
  id: ID;
  generated_at: string;
  workspace_id: WorkspaceKey;
  headline: string;
  body: string;
  citations: { label: string; route: string }[];
  provenance: Provenance;
}

/* --------------------------------------------------------- health engine */

export type HealthBand = "nominal" | "watch" | "at_risk" | "blocked";

export interface HealthScore {
  key: string;
  label: string;
  score: number;
  band: HealthBand;
  basis: string;
  factors: { label: string; value: string }[];
  provenance: Provenance;
}

/* ------------------------------------------------- relationship snapshots */

export interface ProductGraph {
  product: Product;
  organization: Organization | null;
  repositories: Repository[];
  stages: Stage[];
  currentStage: Stage | null;
  snapshots: Snapshot[];
  releases: Release[];
  documents: DocumentRecord[];
  roadmaps: Roadmap[];
  assets: Asset[];
  tasks: Task[];
  risks: Risk[];
  approvals: Approval[];
  decisions: Decision[];
  checkpoints: Checkpoint[];
  journal: BuilderJournalEntry[];
  activity: ActivityEvent[];
}

/* ------------------------------------------------------- resume engine */

export interface ResumeContext {
  product: Product | null;
  stage: Stage | null;
  repository: Repository | null;
  branch: string | null;
  lastCompletedAction: string;
  lastSession: EngineeringSession | null;
  lastCheckpoint: Checkpoint | null;
  nextRecommendedAction: string;
  priority: "low" | "normal" | "high" | "critical";
  owner: User | null;
  status: string;
  route: string;
  provenance: Provenance;
}

/* ----------------------------------------------------- briefing engine */

export interface FounderBriefing {
  generated_at: string;
  workspace_id: WorkspaceKey;
  currentPriority: { title: string; detail: string; route: string };
  currentProduct: Product | null;
  currentStage: Stage | null;
  blockers: Risk[];
  pendingApprovals: Approval[];
  infrastructureAlerts: {
    id: ID;
    label: string;
    detail: string;
    severity: "info" | "warning" | "critical";
  }[];
  upcomingGates: Milestone[];
  documentationGaps: { id: ID; label: string; detail: string }[];
  recentChanges: ActivityEvent[];
  suggestedNextAction: { label: string; route: string };
  health: HealthScore[];
  provenance: Provenance;
}
