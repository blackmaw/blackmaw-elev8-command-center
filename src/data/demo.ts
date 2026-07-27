/**
 * CENTRALIZED DEMONSTRATION DATA LAYER
 * ------------------------------------
 * Every record below is demonstration or manually-recorded content authored
 * for the Elev8 Command Center foundation build. Nothing here is fetched from
 * a live system. Consumers read this module only through src/data/selectors.ts
 * so a future Supabase / API adapter can replace it without touching the UI.
 */
import type {
  ActivityEvent,
  AIBriefing,
  Approval,
  Asset,
  BaseRecord,
  BuilderJournalEntry,
  BusinessUnit,
  Checkpoint,
  Decision,
  DocumentRecord,
  DocumentVersion,
  EngineeringSession,
  InfrastructureConnection,
  InfrastructureNode,
  Integration,
  Milestone,
  Notification,
  Organization,
  Product,
  Project,
  Release,
  Repository,
  Risk,
  Roadmap,
  Snapshot,
  Stage,
  StageRequirement,
  SystemSetting,
  Task,
  User,
  Workspace,
} from "@/domain/types";

const NOW = "2026-07-27T14:20:00Z";

function base(over: Partial<BaseRecord> = {}) {
  return {
    organization_id: "org-bellcap",
    workspace_id: null as string | null,
    owner_id: "user-founder",
    provenance: "demonstration" as const,
    created_at: "2026-01-12T09:00:00Z",
    updated_at: NOW,
    created_by: "user-founder",
    updated_by: "user-founder",
    archived_at: null as string | null,
    ...over,
  };
}

/* ------------------------------------------------------------------ users */

export const users: User[] = [
  {
    id: "user-founder",
    name: "Founder",
    title: "Founder & Principal Architect",
    initials: "FD",
    email: "founder@bellcapgroup.example",
    role: "founder",
    organization_ids: ["org-bellcap", "org-elev8tech", "org-driving"],
    workspace_ids: ["command", "executive", "technologies", "driving-academy", "infrastructure", "institutional"],
  },
  {
    id: "user-eng-lead",
    name: "Engineering Lead",
    title: "Platform Engineering Lead",
    initials: "EL",
    email: "engineering@elev8.example",
    role: "engineering_lead",
    organization_ids: ["org-elev8tech"],
    workspace_ids: ["technologies", "infrastructure"],
  },
  {
    id: "user-ops",
    name: "Operations",
    title: "Infrastructure Operations",
    initials: "OP",
    email: "ops@elev8.example",
    role: "operations_manager",
    organization_ids: ["org-elev8tech"],
    workspace_ids: ["infrastructure"],
  },
];

export const currentUser = users[0];

/* ---------------------------------------------------------- organizations */

export const organizations: Organization[] = [
  {
    ...base(),
    id: "org-bellcap",
    status: "active",
    name: "Bell Cap Group",
    legal_name: "Bell Cap Group LLC",
    short_name: "Bell Cap",
    kind: "holding",
    parent_id: null,
    jurisdiction: "Washington, United States",
    formed_on: null,
    provenance: "manually_recorded",
    registered_agent_state: "pending_verification",
    ein_state: "pending_verification",
    banking_state: "planned",
    credit_state: "planned",
    insurance_state: "planned",
    summary:
      "Parent holding organization governing Elev8 Technologies, Elev8 Driving Academy, shared infrastructure, and future operating entities.",
  },
  {
    ...base(),
    id: "org-elev8tech",
    status: "active",
    name: "Elev8 Technologies",
    legal_name: "Elev8 Technologies LLC",
    short_name: "Elev8 Tech",
    kind: "operating",
    parent_id: "org-bellcap",
    jurisdiction: "Washington, United States",
    formed_on: null,
    provenance: "manually_recorded",
    registered_agent_state: "pending_verification",
    ein_state: "pending_verification",
    banking_state: "planned",
    credit_state: "planned",
    insurance_state: "planned",
    summary: "Technology operating entity responsible for Elev8 OS, Elev8 Cloud, and Elev8 AI Creator Studio.",
  },
  {
    ...base(),
    id: "org-driving",
    status: "formation",
    name: "Elev8 Driving Academy",
    legal_name: "Elev8 Driving Academy (entity name reserved — not filed)",
    short_name: "Driving Academy",
    kind: "operating",
    parent_id: "org-bellcap",
    jurisdiction: "Washington, United States",
    formed_on: null,
    provenance: "manually_recorded",
    registered_agent_state: "planned",
    ein_state: "planned",
    banking_state: "planned",
    credit_state: "planned",
    insurance_state: "planned",
    summary: "Regulated driver-training and workforce education business in formation. Not launched.",
  },
];

export const businessUnits: BusinessUnit[] = [
  { ...base({ organization_id: "org-elev8tech" }), id: "bu-platform", status: "active", name: "Platform Engineering", organization_id: "org-elev8tech", function: "OS, cloud, and shared platform engineering", headcount_plan: 6 },
  { ...base({ organization_id: "org-elev8tech" }), id: "bu-media", status: "active", name: "Generative Media", organization_id: "org-elev8tech", function: "AI Creator Studio pipelines and model operations", headcount_plan: 4 },
  { ...base({ organization_id: "org-elev8tech" }), id: "bu-infra", status: "active", name: "Infrastructure Operations", organization_id: "org-elev8tech", function: "Physical and virtualized infrastructure", headcount_plan: 2 },
  { ...base({ organization_id: "org-driving" }), id: "bu-academy", status: "formation", name: "Academy Operations", organization_id: "org-driving", function: "Curriculum, instruction, and compliance", headcount_plan: 3 },
];

/* ------------------------------------------------------------- workspaces */

export const workspaces: Workspace[] = [
  { id: "command", name: "Command Overview", short_name: "Command", descriptor: "Cross-portfolio operating picture", organization_id: null, status: "active", owner_id: "user-founder", access: ["founder", "executive_administrator", "auditor"], route: "/command", accent: "teal" },
  { id: "executive", name: "Executive — Bell Cap Group", short_name: "Executive", descriptor: "Parent company oversight and governance", organization_id: "org-bellcap", status: "active", owner_id: "user-founder", access: ["founder", "executive_administrator", "auditor"], route: "/executive", accent: "info" },
  { id: "technologies", name: "Elev8 Technologies", short_name: "Technologies", descriptor: "Engineering and product operations", organization_id: "org-elev8tech", status: "active", owner_id: "user-eng-lead", access: ["founder", "engineering_lead", "engineer", "product_manager"], route: "/workspaces/technologies", accent: "teal" },
  { id: "driving-academy", name: "Elev8 Driving Academy", short_name: "Driving Academy", descriptor: "Formation, regulatory, and curriculum discovery", organization_id: "org-driving", status: "formation", owner_id: "user-founder", access: ["founder", "operations_manager"], route: "/workspaces/driving-academy", accent: "warning" },
  { id: "infrastructure", name: "Infrastructure", short_name: "Infrastructure", descriptor: "Physical and virtualized asset operations", organization_id: "org-elev8tech", status: "active", owner_id: "user-ops", access: ["founder", "operations_manager", "engineering_lead"], route: "/infrastructure", accent: "success" },
  { id: "institutional", name: "Institutional Records", short_name: "Institutional", descriptor: "Documents, decisions, snapshots, and audit ledger", organization_id: "org-bellcap", status: "active", owner_id: "user-founder", access: ["founder", "executive_administrator", "auditor"], route: "/workspaces/institutional", accent: "info" },
];

/* --------------------------------------------------------------- products */

export const products: Product[] = [
  {
    ...base({ organization_id: "org-elev8tech", workspace_id: "technologies" }),
    id: "prd-elev8-os",
    key: "elev8-os",
    status: "active",
    name: "Elev8 OS",
    code: "PRD-0001",
    type: "Enterprise Software Platform",
    owner_org_id: "org-elev8tech",
    lifecycle: "active_development",
    current_phase: "Security hardening and platform validation",
    current_stage_id: "stg-os-4",
    release_state: "Internal Preview",
    health: "watch",
    progress: 62,
    security_state: "not_evaluated",
    validation_state: "not_evaluated",
    next_gate: "Security hardening review and platform validation sign-off",
    summary:
      "Core enterprise operating platform providing identity, tenancy, policy, and shared services for every Elev8 product surface.",
    acceptance_criteria: [
      { id: "ac-os-1", label: "Threat model recorded and reviewed", met: true },
      { id: "ac-os-2", label: "Authorization matrix validated against role register", met: false },
      { id: "ac-os-3", label: "Platform validation report published", met: false },
      { id: "ac-os-4", label: "Runbooks published for all shared services", met: false },
    ],
    dependencies: ["Elev8 Cloud infrastructure package", "Shared identity service"],
    last_checkpoint_at: "2026-07-21T18:40:00Z",
  },
  {
    ...base({ organization_id: "org-elev8tech", workspace_id: "technologies" }),
    id: "prd-elev8-cloud",
    key: "elev8-cloud",
    status: "active",
    name: "Elev8 Cloud",
    code: "PRD-0002",
    type: "Cloud Infrastructure Platform",
    owner_org_id: "org-elev8tech",
    lifecycle: "architecture",
    current_phase: "Architecture and infrastructure development",
    current_stage_id: "stg-cloud-35b",
    release_state: "Not Released",
    health: "paused",
    progress: 41,
    security_state: "not_evaluated",
    validation_state: "not_evaluated",
    next_gate: "Promote infrastructure architecture into canonical Git package",
    summary:
      "Private cloud platform covering virtualization, storage, networking, and tenant isolation across owned infrastructure.",
    acceptance_criteria: [
      { id: "ac-cl-1", label: "Canonical infrastructure package structure agreed", met: true },
      { id: "ac-cl-2", label: "Stage 3.5B promotion approved by Founder", met: false },
      { id: "ac-cl-3", label: "Backup and rollback strategy documented", met: false },
    ],
    dependencies: ["Dell PowerEdge R740xd", "FortiSwitch 448D-FPOE", "OPNsense edge router"],
    last_checkpoint_at: "2026-07-09T22:05:00Z",
  },
  {
    ...base({ organization_id: "org-elev8tech", workspace_id: "technologies" }),
    id: "prd-ai-studio",
    key: "elev8-ai-creator-studio",
    status: "active",
    name: "Elev8 AI Creator Studio",
    code: "PRD-0003",
    type: "Multimodal Generative Media Platform",
    owner_org_id: "org-elev8tech",
    lifecycle: "validation",
    current_phase: "Completion and validation",
    current_stage_id: "stg-ai-5",
    release_state: "Pre-Alpha",
    health: "nominal",
    progress: 78,
    security_state: "not_evaluated",
    validation_state: "not_evaluated",
    next_gate: "Repository and Platform Acceptance Audit",
    summary:
      "Multimodal generative media production platform for creator workflows spanning image, audio, and video pipelines.",
    acceptance_criteria: [
      { id: "ac-ai-1", label: "Feature freeze list agreed", met: true },
      { id: "ac-ai-2", label: "Repository acceptance audit completed", met: false },
      { id: "ac-ai-3", label: "Pre-alpha validation report published", met: false },
      { id: "ac-ai-4", label: "Rollback and snapshot procedure rehearsed", met: false },
    ],
    dependencies: ["Elev8 OS identity", "Ryzen 9 3950X inference node"],
    last_checkpoint_at: "2026-07-26T21:12:00Z",
  },
  {
    ...base({ organization_id: "org-driving", workspace_id: "driving-academy" }),
    id: "prd-driving-academy",
    key: "elev8-driving-academy",
    status: "formation",
    name: "Elev8 Driving Academy",
    code: "PRD-0004",
    type: "Regulated Education and Workforce Business",
    owner_org_id: "org-bellcap",
    lifecycle: "formation",
    current_phase: "Regulatory and curriculum discovery",
    current_stage_id: null,
    release_state: "Not Launched",
    health: "watch",
    progress: 12,
    security_state: "not_evaluated",
    validation_state: "not_evaluated",
    next_gate: "Washington launch requirements and course-map validation",
    summary:
      "Regulated driver-training business under Bell Cap Group. Currently gathering Washington state launch requirements.",
    acceptance_criteria: [
      { id: "ac-da-1", label: "Washington regulatory requirement matrix drafted", met: false },
      { id: "ac-da-2", label: "Instructor certification path documented", met: false },
      { id: "ac-da-3", label: "Course maps validated against state curriculum", met: false },
    ],
    dependencies: ["Entity formation", "Insurance placement", "Facility lease"],
    last_checkpoint_at: "2026-06-30T17:00:00Z",
  },
];

export const projects: Project[] = [
  { ...base({ organization_id: "org-elev8tech", workspace_id: "technologies" }), id: "prj-ai-validation", status: "in_progress", name: "AI Creator Studio Validation Cycle", code: "PRJ-0011", product_id: "prd-ai-studio", objective: "Complete acceptance audit and publish pre-alpha validation report.", phase: "Validation", health: "nominal", progress: 74, start_on: "2026-06-01", target_on: "2026-08-15" },
  { ...base({ organization_id: "org-elev8tech", workspace_id: "technologies" }), id: "prj-cloud-35b", status: "blocked", name: "Cloud Stage 3.5B Git Promotion", code: "PRJ-0007", product_id: "prd-elev8-cloud", objective: "Promote infrastructure architecture into the canonical Git package.", phase: "Architecture", health: "blocked", progress: 38, start_on: "2026-04-14", target_on: "2026-08-01" },
  { ...base({ organization_id: "org-elev8tech", workspace_id: "technologies" }), id: "prj-os-hardening", status: "in_progress", name: "Elev8 OS Security Hardening", code: "PRJ-0004", product_id: "prd-elev8-os", objective: "Close authorization gaps and publish the platform validation report.", phase: "Hardening", health: "watch", progress: 55, start_on: "2026-03-02", target_on: "2026-09-30" },
  { ...base({ organization_id: "org-driving", workspace_id: "driving-academy" }), id: "prj-da-regulatory", status: "in_progress", name: "Washington Regulatory Discovery", code: "PRJ-0013", product_id: "prd-driving-academy", objective: "Assemble the state licensing and instructor requirement matrix.", phase: "Discovery", health: "watch", progress: 20, start_on: "2026-06-15", target_on: "2026-10-01" },
  { ...base({ organization_id: "org-elev8tech", workspace_id: "infrastructure" }), id: "prj-rack-buildout", status: "in_progress", name: "Primary Rack Buildout", code: "PRJ-0009", product_id: null, objective: "Bring edge routing, switching, compute, and storage into service.", phase: "Buildout", health: "watch", progress: 46, start_on: "2026-05-01", target_on: "2026-09-15" },
];

/* ----------------------------------------------------------------- stages */

export const stages: Stage[] = [
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "stg-ai-4", status: "frozen", code: "AI-4", name: "Pipeline Consolidation", product_id: "prd-ai-studio", sequence: 4, state: "frozen", objective: "Consolidate render pipelines behind one job orchestrator.", entry_criteria: ["Pipeline inventory complete", "Orchestrator interface agreed"], repository_id: "repo-ai-studio", commit_ref: "b41f0ac", non_code_designation: null, freeze_record_id: "doc-freeze-ai4", rollback_notes: "Revert to tag v0.4.2 and restore snapshot SNP-0007.", opened_on: "2026-04-02", target_on: "2026-06-20" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "stg-ai-5", status: "validation_required", code: "AI-5", name: "Completion and Validation", product_id: "prd-ai-studio", sequence: 5, state: "validation_required", objective: "Complete the repository and platform acceptance audit for pre-alpha.", entry_criteria: ["Stage AI-4 frozen", "Feature freeze list agreed", "Snapshot registered"], repository_id: "repo-ai-studio", commit_ref: "9c27de1", non_code_designation: null, freeze_record_id: null, rollback_notes: "Roll back to SNP-0009 if acceptance audit fails.", opened_on: "2026-06-21", target_on: "2026-08-15" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "stg-cloud-35a", status: "approved", code: "3.5A", name: "Infrastructure Architecture Draft", product_id: "prd-elev8-cloud", sequence: 7, state: "approved", objective: "Draft the canonical infrastructure architecture package.", entry_criteria: ["Asset inventory recorded", "Network plan drafted"], repository_id: "repo-cloud", commit_ref: "3ad9f21", non_code_designation: null, freeze_record_id: null, rollback_notes: "Architecture draft is document-only; no rollback required.", opened_on: "2026-03-10", target_on: "2026-05-30" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "stg-cloud-35b", status: "blocked", code: "3.5B", name: "Canonical Git Promotion", product_id: "prd-elev8-cloud", sequence: 8, state: "blocked", objective: "Promote the approved architecture into the canonical Git package.", entry_criteria: ["Stage 3.5A approved", "Repository structure agreed", "Founder promotion approval"], repository_id: "repo-cloud", commit_ref: null, non_code_designation: null, freeze_record_id: null, rollback_notes: "No promotion performed; nothing to roll back.", opened_on: "2026-06-01", target_on: "2026-08-01" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "stg-os-4", status: "in_progress", code: "OS-4", name: "Security Hardening", product_id: "prd-elev8-os", sequence: 4, state: "in_progress", objective: "Close authorization gaps identified in the platform threat model.", entry_criteria: ["Threat model reviewed", "Role register published"], repository_id: "repo-os", commit_ref: "7fe1b02", non_code_designation: null, freeze_record_id: null, rollback_notes: "Feature-flagged; disable hardening flags to revert.", opened_on: "2026-05-05", target_on: "2026-09-30" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "stg-os-5", status: "planned", code: "OS-5", name: "Platform Validation", product_id: "prd-elev8-os", sequence: 5, state: "planned", objective: "Run the full platform validation suite and publish the report.", entry_criteria: ["Stage OS-4 approved"], repository_id: "repo-os", commit_ref: null, non_code_designation: null, freeze_record_id: null, rollback_notes: "N/A", opened_on: "2026-09-01", target_on: "2026-11-15" },
  { ...base({ workspace_id: "driving-academy", organization_id: "org-driving" }), id: "stg-da-1", status: "in_progress", code: "DA-1", name: "Regulatory and Curriculum Discovery", product_id: "prd-driving-academy", sequence: 1, state: "in_progress", objective: "Assemble Washington launch requirements and validate course maps.", entry_criteria: ["Business concept recorded"], repository_id: null, commit_ref: null, non_code_designation: "Non-code business formation stage", freeze_record_id: null, rollback_notes: "N/A", opened_on: "2026-06-15", target_on: "2026-10-01" },
];

export const stageRequirements: StageRequirement[] = [
  { id: "req-ai5-1", stage_id: "stg-ai-5", kind: "entry", label: "Stage AI-4 frozen with signed freeze record", state: "passed" },
  { id: "req-ai5-2", stage_id: "stg-ai-5", kind: "artifact", label: "Pre-alpha snapshot registered with checksum", state: "passed" },
  { id: "req-ai5-3", stage_id: "stg-ai-5", kind: "artifact", label: "Acceptance criteria matrix published", state: "not_evaluated" },
  { id: "req-ai5-4", stage_id: "stg-ai-5", kind: "review", label: "Architecture review of orchestrator boundaries", state: "not_evaluated" },
  { id: "req-ai5-5", stage_id: "stg-ai-5", kind: "review", label: "Repository acceptance audit", state: "not_evaluated", note: "Blocked on audit scheduling." },
  { id: "req-ai5-6", stage_id: "stg-ai-5", kind: "validation", label: "Media pipeline regression suite", state: "not_evaluated" },
  { id: "req-ai5-7", stage_id: "stg-ai-5", kind: "validation", label: "Rollback rehearsal from SNP-0009", state: "not_evaluated" },
  { id: "req-cl35b-1", stage_id: "stg-cloud-35b", kind: "entry", label: "Stage 3.5A approved", state: "passed" },
  { id: "req-cl35b-2", stage_id: "stg-cloud-35b", kind: "entry", label: "Founder promotion approval recorded", state: "blocked", note: "Awaiting founder decision." },
  { id: "req-cl35b-3", stage_id: "stg-cloud-35b", kind: "artifact", label: "Canonical package directory layout", state: "not_evaluated" },
  { id: "req-cl35b-4", stage_id: "stg-cloud-35b", kind: "review", label: "Infrastructure architecture review", state: "not_evaluated" },
  { id: "req-cl35b-5", stage_id: "stg-cloud-35b", kind: "validation", label: "Dry-run promotion into staging repository", state: "not_evaluated" },
  { id: "req-os4-1", stage_id: "stg-os-4", kind: "entry", label: "Threat model reviewed", state: "passed" },
  { id: "req-os4-2", stage_id: "stg-os-4", kind: "artifact", label: "Authorization matrix document", state: "not_evaluated" },
  { id: "req-os4-3", stage_id: "stg-os-4", kind: "review", label: "Security design review", state: "not_evaluated" },
  { id: "req-os4-4", stage_id: "stg-os-4", kind: "validation", label: "Permission boundary test suite", state: "not_evaluated" },
  { id: "req-da1-1", stage_id: "stg-da-1", kind: "entry", label: "Business concept recorded", state: "passed" },
  { id: "req-da1-2", stage_id: "stg-da-1", kind: "artifact", label: "Washington requirement matrix", state: "not_evaluated" },
  { id: "req-da1-3", stage_id: "stg-da-1", kind: "validation", label: "Course map validation against state curriculum", state: "not_evaluated" },
  { id: "req-ai4-1", stage_id: "stg-ai-4", kind: "entry", label: "Pipeline inventory complete", state: "passed" },
  { id: "req-ai4-2", stage_id: "stg-ai-4", kind: "artifact", label: "Freeze record FR-2026-004", state: "passed" },
  { id: "req-ai4-3", stage_id: "stg-ai-4", kind: "validation", label: "Orchestrator smoke suite", state: "passed" },
];

export const approvals: Approval[] = [
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "apr-1", status: "pending", subject_type: "stage", subject_id: "stg-cloud-35b", title: "Approve Stage 3.5B architecture promotion", requested_by: "user-eng-lead", approver_id: "user-founder", decision: "pending", decided_at: null, notes: "Promotion into canonical Git package requires explicit founder approval.", requires_manual_action: true },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "apr-2", status: "pending", subject_type: "stage", subject_id: "stg-ai-5", title: "Review AI Creator Studio acceptance requirements", requested_by: "user-eng-lead", approver_id: "user-founder", decision: "pending", decided_at: null, notes: "Acceptance criteria matrix must be approved before the audit begins.", requires_manual_action: true },
  { ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech" }), id: "apr-3", status: "pending", subject_type: "infrastructure", subject_id: "ast-r740xd", title: "Confirm infrastructure role assignment", requested_by: "user-ops", approver_id: "user-founder", decision: "pending", decided_at: null, notes: "R740xd primary virtualization role assignment awaiting confirmation.", requires_manual_action: true },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "apr-4", status: "pending", subject_type: "release", subject_id: "rel-ai-prealpha", title: "Approve release freeze for AI Creator Studio pre-alpha", requested_by: "user-eng-lead", approver_id: "user-founder", decision: "pending", decided_at: null, notes: "Freeze cannot proceed until validation and snapshot checks pass.", requires_manual_action: true },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "apr-5", status: "approved", subject_type: "stage", subject_id: "stg-ai-4", title: "Freeze Stage AI-4 Pipeline Consolidation", requested_by: "user-eng-lead", approver_id: "user-founder", decision: "approved", decided_at: "2026-06-20T19:05:00Z", notes: "Freeze approved with freeze record FR-2026-004.", requires_manual_action: true },
];

export const checkpoints: Checkpoint[] = [
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "chk-12", status: "recorded", label: "Acceptance audit scope drafted", product_id: "prd-ai-studio", stage_id: "stg-ai-5", recorded_at: "2026-07-26T21:12:00Z", summary: "Drafted the repository and platform acceptance audit scope and required artifacts.", next_action: "Publish acceptance criteria matrix and schedule the audit.", branch: "release/pre-alpha" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "chk-11", status: "recorded", label: "OS authorization gap list", product_id: "prd-elev8-os", stage_id: "stg-os-4", recorded_at: "2026-07-21T18:40:00Z", summary: "Recorded the remaining authorization gaps from the platform threat model.", next_action: "Draft the authorization matrix document.", branch: "hardening/authz" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "chk-10", status: "recorded", label: "Cloud 3.5B promotion paused", product_id: "prd-elev8-cloud", stage_id: "stg-cloud-35b", recorded_at: "2026-07-09T22:05:00Z", summary: "Promotion paused pending founder approval of the canonical package layout.", next_action: "Obtain founder approval for Stage 3.5B promotion.", branch: "main" },
];

export const engineeringSessions: EngineeringSession[] = [
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "ses-31", status: "closed", title: "AI Studio acceptance audit planning", product_id: "prd-ai-studio", started_at: "2026-07-26T18:00:00Z", ended_at: "2026-07-26T21:12:00Z", outcome: "Audit scope drafted; checkpoint CHK-12 recorded.", participants: ["user-founder", "user-eng-lead"] },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "ses-30", status: "closed", title: "Elev8 OS authorization review", product_id: "prd-elev8-os", started_at: "2026-07-21T15:00:00Z", ended_at: "2026-07-21T18:40:00Z", outcome: "Gap list produced; matrix document assigned.", participants: ["user-eng-lead"] },
];

/* ----------------------------------------------------------- repositories */

export const repositories: Repository[] = [
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "repo-os", status: "active", provenance: "manually_recorded", name: "elev8-os", product_id: "prd-elev8-os", provider: "github", visibility: "private", default_branch: "main", current_branch: "hardening/authz", latest_commit: "7fe1b02", latest_commit_message: "authz: narrow workspace scope checks", latest_tag: "v0.6.1", working_tree: "dirty", ci_status: "not_evaluated", test_status: "not_evaluated", documentation_state: "not_evaluated", last_snapshot_id: "snp-0008", last_verified_at: "2026-07-21T18:40:00Z", integration_state: "not_connected" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "repo-cloud", status: "active", provenance: "manually_recorded", name: "elev8-cloud", product_id: "prd-elev8-cloud", provider: "github", visibility: "private", default_branch: "main", current_branch: "main", latest_commit: "3ad9f21", latest_commit_message: "arch: stage 3.5a package draft", latest_tag: null, working_tree: "clean", ci_status: "not_evaluated", test_status: "not_evaluated", documentation_state: "not_evaluated", last_snapshot_id: "snp-0006", last_verified_at: "2026-07-09T22:05:00Z", integration_state: "not_connected" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "repo-ai-studio", status: "active", provenance: "manually_recorded", name: "elev8-ai-creator-studio", product_id: "prd-ai-studio", provider: "github", visibility: "private", default_branch: "main", current_branch: "release/pre-alpha", latest_commit: "9c27de1", latest_commit_message: "pipeline: finalize orchestrator job contracts", latest_tag: "v0.9.0-pre.3", working_tree: "clean", ci_status: "not_evaluated", test_status: "not_evaluated", documentation_state: "not_evaluated", last_snapshot_id: "snp-0009", last_verified_at: "2026-07-26T21:12:00Z", integration_state: "not_connected" },
  { ...base({ workspace_id: "institutional", organization_id: "org-bellcap" }), id: "repo-governance", status: "active", provenance: "manually_recorded", name: "bell-capital-governance", product_id: null, provider: "github", visibility: "private", default_branch: "main", current_branch: "main", latest_commit: "c10a8be", latest_commit_message: "records: add decision register template", latest_tag: null, working_tree: "clean", ci_status: "not_evaluated", test_status: "not_evaluated", documentation_state: "not_evaluated", last_snapshot_id: null, last_verified_at: "2026-07-02T12:00:00Z", integration_state: "not_connected" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "repo-command-center", status: "active", provenance: "manually_recorded", name: "elev8-command-center", product_id: null, provider: "github", visibility: "private", default_branch: "main", current_branch: "main", latest_commit: "0000000", latest_commit_message: "foundation build in progress", latest_tag: null, working_tree: "unknown", ci_status: "not_evaluated", test_status: "not_evaluated", documentation_state: "not_evaluated", last_snapshot_id: null, last_verified_at: null, integration_state: "not_connected" },
];

/* ---------------------------------------------------- releases, snapshots */

const checks = (over: Partial<Record<string, string>> = {}) =>
  (
    [
      ["architecture", "Architecture review", true],
      ["security", "Security review", true],
      ["testing", "Test suite", true],
      ["documentation", "Documentation coverage", true],
      ["infrastructure", "Infrastructure readiness", true],
      ["migration", "Migration readiness", false],
      ["backup", "Backup readiness", true],
      ["rollback", "Rollback readiness", true],
      ["approval", "Founder approval", true],
      ["snapshot", "Registered snapshot", true],
      ["release_notes", "Release notes", false],
    ] as const
  ).map(([key, label, mandatory]) => ({
    key,
    label,
    mandatory,
    state: (over[key] ?? "not_evaluated") as Release["checks"][number]["state"],
    note: "Demonstration state — no automated evaluation is connected.",
  }));

export const releases: Release[] = [
  {
    ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }),
    id: "rel-ai-prealpha",
    status: "in_review",
    name: "AI Creator Studio Pre-Alpha",
    version: "0.9.0-pre.3",
    product_id: "prd-ai-studio",
    channel: "pre_alpha",
    target_on: "2026-08-22",
    state: "in_review",
    checks: checks({ architecture: "passed", snapshot: "passed", backup: "passed", rollback: "not_evaluated", security: "not_evaluated" }),
    notes: "Controlled pre-alpha for internal validation only. Not production ready.",
  },
  {
    ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }),
    id: "rel-os-preview",
    status: "planning",
    name: "Elev8 OS Internal Preview 2",
    version: "0.7.0",
    product_id: "prd-elev8-os",
    channel: "alpha",
    target_on: "2026-10-30",
    state: "planning",
    checks: checks({ architecture: "not_evaluated" }),
    notes: "Blocked behind security hardening stage OS-4.",
  },
  {
    ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }),
    id: "rel-cloud-arch",
    status: "blocked",
    name: "Elev8 Cloud Architecture Package",
    version: "3.5B",
    product_id: "prd-elev8-cloud",
    channel: "pre_alpha",
    target_on: "2026-09-05",
    state: "blocked",
    checks: checks({ architecture: "blocked", approval: "blocked" }),
    notes: "Blocked at the Stage 3.5B Git promotion gate.",
  },
];

export const snapshots: Snapshot[] = [
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "snp-0009", status: "registered", provenance: "manually_recorded", identifier: "SNP-0009", product_id: "prd-ai-studio", stage_id: "stg-ai-5", version: "0.9.0-pre.3", taken_on: "2026-07-26", repository_id: "repo-ai-studio", branch: "release/pre-alpha", commit_ref: "9c27de1", tag: "v0.9.0-pre.3", artifact_name: "elev8-ai-creator-studio-0.9.0-pre.3.tar.zst", checksum: "sha256:4f21c8a9d0be7716c2e9b1f5a3d8c04f9e2b77aa5c1d0e83fb6427cd91a0e5b2", validation_state: "not_evaluated", freeze_state: "freeze_requested", storage_location: "Primary storage chassis / snapshots/ai-studio", notes: "Pre-alpha candidate snapshot for the acceptance audit." },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "snp-0008", status: "registered", provenance: "manually_recorded", identifier: "SNP-0008", product_id: "prd-elev8-os", stage_id: "stg-os-4", version: "0.6.1", taken_on: "2026-07-21", repository_id: "repo-os", branch: "hardening/authz", commit_ref: "7fe1b02", tag: "v0.6.1", artifact_name: "elev8-os-0.6.1.tar.zst", checksum: "sha256:9b3e0d1c77a5428ef01c6d5b2a94f8703cd1ee45bb0927fa61d3c8095e74a1d6", validation_state: "not_evaluated", freeze_state: "not_frozen", storage_location: "Primary storage chassis / snapshots/os", notes: "Interim hardening snapshot." },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "snp-0007", status: "registered", provenance: "manually_recorded", identifier: "SNP-0007", product_id: "prd-ai-studio", stage_id: "stg-ai-4", version: "0.4.2", taken_on: "2026-06-20", repository_id: "repo-ai-studio", branch: "main", commit_ref: "b41f0ac", tag: "v0.4.2", artifact_name: "elev8-ai-creator-studio-0.4.2.tar.zst", checksum: "sha256:d51a7fc2e6b0498a3c7d1e9f0ba24c85d739e1cf40a6b28e5c93f70da1b64e37", validation_state: "passed", freeze_state: "frozen", storage_location: "Primary storage chassis / snapshots/ai-studio", notes: "Frozen with freeze record FR-2026-004." },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "snp-0006", status: "registered", provenance: "manually_recorded", identifier: "SNP-0006", product_id: "prd-elev8-cloud", stage_id: "stg-cloud-35a", version: "3.5A", taken_on: "2026-05-30", repository_id: "repo-cloud", branch: "main", commit_ref: "3ad9f21", tag: null, artifact_name: "elev8-cloud-architecture-3.5a.zip", checksum: "sha256:1c82ff0b4a37d5e9026b7c418ad35fe0912cba76d40e5831ff29ac6bd7e10a44", validation_state: "passed", freeze_state: "not_frozen", storage_location: "Primary storage chassis / snapshots/cloud", notes: "Architecture draft package." },
];

/* -------------------------------------------------------------- documents */

export const documents: DocumentRecord[] = [
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "doc-freeze-ai4", status: "effective", provenance: "manually_recorded", title: "Freeze Record FR-2026-004 — AI Studio Stage AI-4", doc_type: "freeze_record", product_id: "prd-ai-studio", project_id: "prj-ai-validation", version: "1.0", approval_state: "passed", effective_on: "2026-06-20", superseded_by: null, storage_location: "bell-capital-governance/records/freeze", tags: ["freeze", "stage", "ai-studio"] },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "doc-arch-cloud", status: "in_review", provenance: "manually_recorded", title: "Elev8 Cloud Infrastructure Architecture (Stage 3.5A)", doc_type: "architecture", product_id: "prd-elev8-cloud", project_id: "prj-cloud-35b", version: "0.9", approval_state: "not_evaluated", effective_on: null, superseded_by: null, storage_location: "elev8-cloud/docs/architecture", tags: ["architecture", "cloud", "stage-3.5"] },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "doc-accept-ai", status: "draft", provenance: "demonstration", title: "AI Creator Studio Acceptance Criteria Matrix", doc_type: "acceptance_report", product_id: "prd-ai-studio", project_id: "prj-ai-validation", version: "0.3", approval_state: "not_evaluated", effective_on: null, superseded_by: null, storage_location: "elev8-ai-creator-studio/docs/acceptance", tags: ["acceptance", "pre-alpha"] },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "doc-threat-os", status: "effective", provenance: "manually_recorded", title: "Elev8 OS Platform Threat Model", doc_type: "specification", product_id: "prd-elev8-os", project_id: "prj-os-hardening", version: "1.2", approval_state: "passed", effective_on: "2026-05-04", superseded_by: null, storage_location: "elev8-os/docs/security", tags: ["security", "threat-model"] },
  { ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech" }), id: "doc-runbook-rack", status: "draft", provenance: "demonstration", title: "Primary Rack Bring-Up Runbook", doc_type: "runbook", product_id: null, project_id: "prj-rack-buildout", version: "0.4", approval_state: "not_evaluated", effective_on: null, superseded_by: null, storage_location: "bell-capital-governance/runbooks", tags: ["infrastructure", "runbook"] },
  { ...base({ workspace_id: "institutional", organization_id: "org-bellcap" }), id: "doc-journal", status: "effective", provenance: "manually_recorded", title: "Builder's Journal — 2026 Q3", doc_type: "builders_journal", product_id: null, project_id: null, version: "3.0", approval_state: "not_evaluated", effective_on: "2026-07-01", superseded_by: null, storage_location: "bell-capital-governance/journal", tags: ["journal"] },
  { ...base({ workspace_id: "executive", organization_id: "org-bellcap" }), id: "doc-corp-structure", status: "pending_verification", provenance: "pending_verification", title: "Bell Cap Group Entity Structure Memorandum", doc_type: "corporate", product_id: null, project_id: null, version: "0.6", approval_state: "not_evaluated", effective_on: null, superseded_by: null, storage_location: "bell-capital-governance/corporate", tags: ["corporate", "structure"] },
  { ...base({ workspace_id: "driving-academy", organization_id: "org-driving" }), id: "doc-da-curriculum", status: "draft", provenance: "demonstration", title: "Driving Academy Course Map — Standard Program", doc_type: "course_map", product_id: "prd-driving-academy", project_id: "prj-da-regulatory", version: "0.2", approval_state: "not_evaluated", effective_on: null, superseded_by: null, storage_location: "bell-capital-governance/academy/curriculum", tags: ["curriculum", "washington"] },
  { ...base({ workspace_id: "driving-academy", organization_id: "org-driving" }), id: "doc-da-reg", status: "draft", provenance: "demonstration", title: "Washington Driver Training Requirement Matrix", doc_type: "specification", product_id: "prd-driving-academy", project_id: "prj-da-regulatory", version: "0.1", approval_state: "not_evaluated", effective_on: null, superseded_by: null, storage_location: "bell-capital-governance/academy/regulatory", tags: ["regulatory", "washington"] },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "doc-validation-ai4", status: "superseded", provenance: "manually_recorded", title: "AI Studio Pipeline Validation Report (AI-4)", doc_type: "validation_report", product_id: "prd-ai-studio", project_id: "prj-ai-validation", version: "1.0", approval_state: "passed", effective_on: "2026-06-18", superseded_by: "doc-accept-ai", storage_location: "elev8-ai-creator-studio/docs/validation", tags: ["validation"] },
];

export const documentVersions: DocumentVersion[] = [
  { id: "dv-1", document_id: "doc-arch-cloud", version: "0.9", created_at: "2026-05-30T10:00:00Z", created_by: "user-eng-lead", summary: "Stage 3.5A draft package." },
  { id: "dv-2", document_id: "doc-arch-cloud", version: "0.8", created_at: "2026-05-11T10:00:00Z", created_by: "user-eng-lead", summary: "Network segmentation revision." },
  { id: "dv-3", document_id: "doc-threat-os", version: "1.2", created_at: "2026-05-04T10:00:00Z", created_by: "user-eng-lead", summary: "Added workspace scope threats." },
];

/* --------------------------------------------------------- infrastructure */

export const assets: Asset[] = [
  {
    ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech", owner_id: "user-ops" }),
    id: "ast-r740xd", status: "in_service", provenance: "manually_recorded",
    name: "Dell PowerEdge R740xd", category: "compute", model: "PowerEdge R740xd", vendor: "Dell",
    serial_state: "pending_verification", lifecycle: "in_service", role: "Primary virtualization host",
    location: "Primary rack — U18", acquired_on: "2026-02-18",
    specifications: [
      { label: "Chassis", value: "2U, 12 × 3.5\" front bays" },
      { label: "Intended hypervisor", value: "Proxmox VE (planned)" },
      { label: "Management", value: "iDRAC" },
    ],
    interfaces: [
      { label: "Management", value: "iDRAC dedicated port" },
      { label: "Data", value: "Dual 10 GbE to FortiSwitch" },
    ],
    services: ["Virtualization host (planned)", "Elev8 Cloud control plane (planned)"],
    dependencies: ["ast-fortiswitch"],
    maintenance_notes: "Firmware baseline not yet recorded. Live telemetry integration not connected.",
    planned_upgrades: ["Additional NVMe cache tier", "Redundant PSU verification"],
    document_ids: ["doc-runbook-rack"], risk_ids: ["rsk-3"],
  },
  {
    ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech", owner_id: "user-ops" }),
    id: "ast-ryzen-node", status: "staging", provenance: "manually_recorded",
    name: "ASRock Rack X570D4I-2T Node", category: "compute", model: "X570D4I-2T / Ryzen 9 3950X", vendor: "ASRock Rack",
    serial_state: "pending_verification", lifecycle: "staging", role: "Compute and inference node",
    location: "Primary rack — U14", acquired_on: "2026-03-05",
    specifications: [
      { label: "CPU", value: "AMD Ryzen 9 3950X — 16C / 32T" },
      { label: "Memory", value: "64 GB" },
      { label: "Networking", value: "Dual 10 GbE onboard" },
      { label: "Management", value: "IPMI" },
    ],
    interfaces: [
      { label: "Management", value: "IPMI dedicated" },
      { label: "Data", value: "2 × 10 GbE" },
    ],
    services: ["AI Creator Studio inference (planned)", "Build agents (planned)"],
    dependencies: ["ast-fortiswitch"],
    maintenance_notes: "Awaiting rack mounting and thermal validation.",
    planned_upgrades: ["Memory expansion to 128 GB", "GPU evaluation"],
    document_ids: ["doc-runbook-rack"], risk_ids: [],
  },
  {
    ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech", owner_id: "user-ops" }),
    id: "ast-fortiswitch", status: "in_service", provenance: "manually_recorded",
    name: "FortiSwitch 448D-FPOE", category: "network", model: "448D-FPOE", vendor: "Fortinet",
    serial_state: "pending_verification", lifecycle: "in_service", role: "Core access switch",
    location: "Primary rack — U20", acquired_on: "2026-02-18",
    specifications: [
      { label: "Ports", value: "48 × 1 GbE PoE+" },
      { label: "Uplinks", value: "4 × 10 GbE SFP+" },
    ],
    interfaces: [
      { label: "Uplink", value: "SFP+ to edge router (planned)" },
      { label: "Downlink", value: "10 GbE to compute nodes" },
    ],
    services: ["VLAN segmentation (planned)", "PoE for endpoints"],
    dependencies: ["ast-optiplex"],
    maintenance_notes: "Management integration not connected; configuration recorded manually.",
    planned_upgrades: ["Firmware baseline record", "VLAN plan implementation"],
    document_ids: ["doc-arch-cloud"], risk_ids: ["rsk-4"],
  },
  {
    ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech", owner_id: "user-ops" }),
    id: "ast-optiplex", status: "staging", provenance: "manually_recorded",
    name: "Dell OptiPlex Micro — OPNsense Router", category: "network", model: "OptiPlex Micro", vendor: "Dell",
    serial_state: "pending_verification", lifecycle: "staging", role: "Edge router / firewall (OPNsense planned)",
    location: "Primary rack — shelf", acquired_on: "2026-04-01",
    specifications: [
      { label: "Form factor", value: "Micro desktop" },
      { label: "Planned OS", value: "OPNsense" },
    ],
    interfaces: [
      { label: "WAN", value: "ISP modem / ONT" },
      { label: "LAN", value: "FortiSwitch uplink" },
    ],
    services: ["Routing (planned)", "Firewall (planned)", "VPN (planned)"],
    dependencies: [],
    maintenance_notes: "OPNsense not yet installed. No control integration.",
    planned_upgrades: ["Dual-NIC expansion", "HA pair evaluation"],
    document_ids: ["doc-arch-cloud"], risk_ids: ["rsk-4"],
  },
  {
    ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech", owner_id: "user-ops" }),
    id: "ast-storage-chassis", status: "planned", provenance: "manually_recorded",
    name: "Custom 8-Bay Storage Chassis", category: "storage", model: "Custom 8-bay", vendor: "Custom build",
    serial_state: "pending_verification", lifecycle: "planned", role: "Bulk storage and snapshot repository",
    location: "Primary rack — U8", acquired_on: null,
    specifications: [
      { label: "Bays", value: "8 × 3.5\"" },
      { label: "Planned platform", value: "TrueNAS (planned)" },
    ],
    interfaces: [{ label: "Data", value: "10 GbE (planned)" }],
    services: ["Snapshot storage (planned)", "Backup target (planned)"],
    dependencies: ["ast-fortiswitch"],
    maintenance_notes: "Not yet assembled.",
    planned_upgrades: ["HBA selection", "Pool layout decision"],
    document_ids: [], risk_ids: ["rsk-2"],
  },
  {
    ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech", owner_id: "user-ops" }),
    id: "ast-hdd-20tb", status: "procured", provenance: "manually_recorded",
    name: "Enterprise HDD Inventory — 2 × 20 TB", category: "storage", model: "20 TB enterprise HDD", vendor: "Recorded manually",
    serial_state: "pending_verification", lifecycle: "procured", role: "Bulk capacity for storage chassis",
    location: "Storage — staged", acquired_on: "2026-05-20",
    specifications: [
      { label: "Quantity", value: "2" },
      { label: "Capacity", value: "20 TB each — 40 TB raw" },
    ],
    interfaces: [{ label: "Bus", value: "SATA" }],
    services: ["Snapshot capacity (planned)"],
    dependencies: ["ast-storage-chassis"],
    maintenance_notes: "No SMART telemetry — integration not connected.",
    planned_upgrades: ["Expand to 4 drives for parity"],
    document_ids: [], risk_ids: ["rsk-2"],
  },
];

export const infrastructureNodes: InfrastructureNode[] = [
  { id: "node-internet", asset_id: null, label: "Internet", sublabel: "External transit", tier: 0, column: 1, kind: "external", state: "unknown" },
  { id: "node-isp", asset_id: null, label: "ISP Modem / ONT", sublabel: "Provider equipment", tier: 1, column: 1, kind: "external", state: "unknown" },
  { id: "node-opnsense", asset_id: "ast-optiplex", label: "Dell OptiPlex — OPNsense", sublabel: "Edge router / firewall (planned)", tier: 2, column: 1, kind: "edge", state: "planned" },
  { id: "node-fortiswitch", asset_id: "ast-fortiswitch", label: "FortiSwitch 448D-FPOE", sublabel: "Core access switch", tier: 3, column: 1, kind: "network", state: "in_service" },
  { id: "node-r740xd", asset_id: "ast-r740xd", label: "Dell PowerEdge R740xd", sublabel: "Primary virtualization host", tier: 4, column: 0, kind: "compute", state: "in_service" },
  { id: "node-ryzen", asset_id: "ast-ryzen-node", label: "Ryzen 9 3950X Node", sublabel: "Compute / inference", tier: 4, column: 1, kind: "compute", state: "planned" },
  { id: "node-storage", asset_id: "ast-storage-chassis", label: "8-Bay Storage Chassis", sublabel: "Snapshots and backup", tier: 4, column: 2, kind: "storage", state: "planned" },
  { id: "node-future", asset_id: null, label: "Future Nodes", sublabel: "Reserved capacity", tier: 5, column: 1, kind: "planned", state: "planned" },
];

export const infrastructureConnections: InfrastructureConnection[] = [
  { id: "cx-1", from_node_id: "node-internet", to_node_id: "node-isp", medium: "Provider circuit", state: "installed" },
  { id: "cx-2", from_node_id: "node-isp", to_node_id: "node-opnsense", medium: "1 GbE WAN", state: "planned" },
  { id: "cx-3", from_node_id: "node-opnsense", to_node_id: "node-fortiswitch", medium: "1 GbE LAN uplink", state: "planned" },
  { id: "cx-4", from_node_id: "node-fortiswitch", to_node_id: "node-r740xd", medium: "2 × 10 GbE", state: "installed" },
  { id: "cx-5", from_node_id: "node-fortiswitch", to_node_id: "node-ryzen", medium: "2 × 10 GbE", state: "planned" },
  { id: "cx-6", from_node_id: "node-fortiswitch", to_node_id: "node-storage", medium: "10 GbE", state: "planned" },
  { id: "cx-7", from_node_id: "node-fortiswitch", to_node_id: "node-future", medium: "Reserved uplinks", state: "planned" },
];

/* ------------------------------------------------ work, risk, and ledgers */

export const tasks: Task[] = [
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "tsk-1", status: "in_progress", title: "Publish AI Studio acceptance criteria matrix", product_id: "prd-ai-studio", project_id: "prj-ai-validation", state: "in_progress", priority: "critical", due_on: "2026-07-31" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "tsk-2", status: "todo", title: "Schedule repository acceptance audit", product_id: "prd-ai-studio", project_id: "prj-ai-validation", state: "todo", priority: "high", due_on: "2026-08-04" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "tsk-3", status: "blocked", title: "Promote cloud architecture into canonical Git package", product_id: "prd-elev8-cloud", project_id: "prj-cloud-35b", state: "blocked", priority: "high", due_on: "2026-08-01" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "tsk-4", status: "in_progress", title: "Draft Elev8 OS authorization matrix", product_id: "prd-elev8-os", project_id: "prj-os-hardening", state: "in_progress", priority: "high", due_on: "2026-08-12" },
  { ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech" }), id: "tsk-5", status: "todo", title: "Install OPNsense on OptiPlex edge router", product_id: null, project_id: "prj-rack-buildout", state: "todo", priority: "normal", due_on: "2026-08-20" },
  { ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech" }), id: "tsk-6", status: "todo", title: "Assemble 8-bay storage chassis", product_id: null, project_id: "prj-rack-buildout", state: "todo", priority: "normal", due_on: "2026-09-01" },
  { ...base({ workspace_id: "driving-academy", organization_id: "org-driving" }), id: "tsk-7", status: "in_progress", title: "Compile Washington instructor certification path", product_id: "prd-driving-academy", project_id: "prj-da-regulatory", state: "in_progress", priority: "normal", due_on: "2026-09-10" },
  { ...base({ workspace_id: "driving-academy", organization_id: "org-driving" }), id: "tsk-8", status: "todo", title: "Draft launch budget model", product_id: "prd-driving-academy", project_id: "prj-da-regulatory", state: "todo", priority: "low", due_on: "2026-10-01" },
];

export const milestones: Milestone[] = [
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "mst-1", status: "validation_required", title: "AI Creator Studio — Repository and Platform Acceptance Audit", product_id: "prd-ai-studio", due_on: "2026-08-15", gate_type: "Acceptance audit", state: "validation_required" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "mst-2", status: "blocked", title: "Elev8 Cloud — Stage 3.5B canonical promotion", product_id: "prd-elev8-cloud", due_on: "2026-08-01", gate_type: "Architecture promotion", state: "blocked" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "mst-3", status: "in_progress", title: "Elev8 OS — Security hardening sign-off", product_id: "prd-elev8-os", due_on: "2026-09-30", gate_type: "Security review", state: "in_progress" },
  { ...base({ workspace_id: "driving-academy", organization_id: "org-driving" }), id: "mst-4", status: "planned", title: "Driving Academy — Washington launch requirement matrix", product_id: "prd-driving-academy", due_on: "2026-10-01", gate_type: "Regulatory readiness", state: "planned" },
  { ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech" }), id: "mst-5", status: "planned", title: "Infrastructure — Primary rack in service", product_id: null, due_on: "2026-09-15", gate_type: "Operational readiness", state: "planned" },
];

export const roadmaps: Roadmap[] = [
  {
    ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }),
    id: "rmp-tech", status: "active", name: "Elev8 Technologies — 12 Month Horizon", product_id: null, horizon: "2026 Q3 — 2027 Q2",
    lanes: [
      { id: "lane-ai", label: "AI Creator Studio", items: [
        { id: "ri-1", label: "Acceptance audit", quarter: "2026 Q3", state: "validation_required", product_id: "prd-ai-studio" },
        { id: "ri-2", label: "Pre-alpha controlled release", quarter: "2026 Q3", state: "planned", product_id: "prd-ai-studio" },
        { id: "ri-3", label: "Alpha creator cohort", quarter: "2026 Q4", state: "proposed", product_id: "prd-ai-studio" },
      ]},
      { id: "lane-cloud", label: "Elev8 Cloud", items: [
        { id: "ri-4", label: "Stage 3.5B promotion", quarter: "2026 Q3", state: "blocked", product_id: "prd-elev8-cloud" },
        { id: "ri-5", label: "Virtualization bring-up", quarter: "2026 Q4", state: "planned", product_id: "prd-elev8-cloud" },
        { id: "ri-6", label: "Tenant isolation model", quarter: "2027 Q1", state: "proposed", product_id: "prd-elev8-cloud" },
      ]},
      { id: "lane-os", label: "Elev8 OS", items: [
        { id: "ri-7", label: "Security hardening", quarter: "2026 Q3", state: "in_progress", product_id: "prd-elev8-os" },
        { id: "ri-8", label: "Platform validation", quarter: "2026 Q4", state: "planned", product_id: "prd-elev8-os" },
        { id: "ri-9", label: "Internal preview 2", quarter: "2027 Q1", state: "proposed", product_id: "prd-elev8-os" },
      ]},
    ],
  },
  {
    ...base({ workspace_id: "driving-academy", organization_id: "org-driving" }),
    id: "rmp-academy", status: "active", name: "Driving Academy — Formation Horizon", product_id: "prd-driving-academy", horizon: "2026 Q3 — 2027 Q2",
    lanes: [
      { id: "lane-form", label: "Formation", items: [
        { id: "ri-10", label: "Entity formation filing", quarter: "2026 Q4", state: "planned", product_id: "prd-driving-academy" },
        { id: "ri-11", label: "Insurance placement", quarter: "2027 Q1", state: "proposed", product_id: "prd-driving-academy" },
      ]},
      { id: "lane-curr", label: "Curriculum", items: [
        { id: "ri-12", label: "Requirement matrix", quarter: "2026 Q3", state: "in_progress", product_id: "prd-driving-academy" },
        { id: "ri-13", label: "Course map validation", quarter: "2026 Q4", state: "planned", product_id: "prd-driving-academy" },
      ]},
    ],
  },
];

export const decisions: Decision[] = [
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "dec-1", status: "accepted", identifier: "ADR-0007", title: "Single orchestrator for all AI Studio render pipelines", context: "Three independent pipeline runners produced divergent job semantics and duplicated retry logic.", decision: "Consolidate all render pipelines behind one job orchestrator with a typed job contract.", alternatives: ["Keep per-modality runners", "Adopt a third-party workflow engine"], consequences: ["One retry and observability path", "Short-term migration cost across three pipelines"], decided_on: "2026-05-28", product_id: "prd-ai-studio", stage_id: "stg-ai-4", document_ids: ["doc-validation-ai4"], state: "accepted" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "dec-2", status: "proposed", identifier: "ADR-0011", title: "Canonical Git package layout for Elev8 Cloud infrastructure", context: "Infrastructure architecture currently lives in documents rather than version control.", decision: "Promote the Stage 3.5A architecture into a canonical Git package with environment overlays.", alternatives: ["Keep architecture document-only", "Split per-site repositories"], consequences: ["Reviewable infrastructure history", "Requires founder promotion approval"], decided_on: null, product_id: "prd-elev8-cloud", stage_id: "stg-cloud-35b", document_ids: ["doc-arch-cloud"], state: "proposed" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "dec-3", status: "accepted", identifier: "ADR-0004", title: "Roles stored in a dedicated role register", context: "Embedding roles on user records invites privilege escalation.", decision: "Model roles and permissions in a separate register evaluated server-side.", alternatives: ["Role field on the user profile"], consequences: ["Server-side checks required", "Clear audit surface"], decided_on: "2026-03-19", product_id: "prd-elev8-os", stage_id: "stg-os-4", document_ids: ["doc-threat-os"], state: "accepted" },
  { ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech" }), id: "dec-4", status: "accepted", identifier: "ADR-0009", title: "OPNsense on dedicated edge hardware", context: "Edge routing shared with compute risks blast radius during maintenance.", decision: "Run OPNsense on a dedicated Dell OptiPlex Micro at the network edge.", alternatives: ["Virtualized router on the R740xd", "Vendor appliance"], consequences: ["Independent maintenance window", "Additional physical device to manage"], decided_on: "2026-04-06", product_id: "prd-elev8-cloud", stage_id: null, document_ids: [], state: "accepted" },
  { ...base({ workspace_id: "executive", organization_id: "org-bellcap" }), id: "dec-5", status: "proposed", identifier: "ADR-0012", title: "Driving Academy operates as a separate operating entity", context: "Regulated education carries distinct liability and licensing exposure.", decision: "Hold the Driving Academy as a separate operating entity under Bell Cap Group.", alternatives: ["Operate as a Bell Cap division"], consequences: ["Cleaner liability separation", "Additional formation and filing work"], decided_on: null, product_id: "prd-driving-academy", stage_id: null, document_ids: ["doc-corp-structure"], state: "proposed" },
];

export const risks: Risk[] = [
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "rsk-1", status: "open", title: "Stage 3.5B promotion gate has been open for 8 weeks", severity: "high", product_id: "prd-elev8-cloud", opened_on: "2026-06-01", recommended_response: "Hold a 45-minute promotion decision review and record the approval or a formal deferral.", state: "open" },
  { ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech", owner_id: "user-ops" }), id: "rsk-2", status: "open", title: "No verified backup target for pre-alpha snapshots", severity: "critical", product_id: "prd-ai-studio", opened_on: "2026-06-24", recommended_response: "Assemble the storage chassis and register a verified snapshot destination before release review.", state: "mitigating" },
  { ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech", owner_id: "user-ops" }), id: "rsk-3", status: "open", title: "R740xd firmware baseline not recorded", severity: "moderate", product_id: null, opened_on: "2026-05-12", recommended_response: "Record firmware versions manually until a management integration is approved.", state: "open" },
  { ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech", owner_id: "user-ops" }), id: "rsk-4", status: "open", title: "Edge routing still on planned status ahead of rack in-service date", severity: "high", product_id: null, opened_on: "2026-07-02", recommended_response: "Install OPNsense and validate the switch uplink before the September readiness gate.", state: "open" },
  { ...base({ workspace_id: "driving-academy", organization_id: "org-driving" }), id: "rsk-5", status: "open", title: "Washington licensing requirements not yet confirmed", severity: "moderate", product_id: "prd-driving-academy", opened_on: "2026-06-18", recommended_response: "Complete the requirement matrix before committing to any launch date.", state: "open" },
];

export const notifications: Notification[] = [
  { ...base({ workspace_id: "technologies" }), id: "ntf-1", status: "unread", title: "Approval requested — Stage 3.5B promotion", body: "Engineering Lead requested founder approval to promote the Elev8 Cloud architecture package.", severity: "warning", read: false, link: "/engineering/stages", occurred_at: "2026-07-27T09:12:00Z" },
  { ...base({ workspace_id: "technologies" }), id: "ntf-2", status: "unread", title: "Snapshot SNP-0009 registered", body: "Pre-alpha candidate snapshot registered for AI Creator Studio.", severity: "info", read: false, link: "/engineering/checkpoints", occurred_at: "2026-07-26T21:15:00Z" },
  { ...base({ workspace_id: "infrastructure" }), id: "ntf-3", status: "unread", title: "Risk escalated — no verified backup target", body: "Snapshot backup destination remains unverified ahead of release review.", severity: "critical", read: false, link: "/infrastructure", occurred_at: "2026-07-24T16:40:00Z" },
  { ...base({ workspace_id: "technologies" }), id: "ntf-4", status: "read", title: "Freeze approved — Stage AI-4", body: "Founder approved the freeze of Stage AI-4 with record FR-2026-004.", severity: "success", read: true, link: "/engineering/stages", occurred_at: "2026-06-20T19:05:00Z" },
  { ...base({ workspace_id: "executive" }), id: "ntf-5", status: "read", title: "Entity structure memorandum updated", body: "Bell Cap Group entity structure memorandum revised to 0.6 — pending verification.", severity: "info", read: true, link: "/executive", occurred_at: "2026-07-11T13:20:00Z" },
];

export const activityEvents: ActivityEvent[] = [
  { id: "act-1", kind: "checkpoint_recorded", occurred_at: "2026-07-26T21:12:00Z", actor_id: "user-founder", workspace_id: "technologies", product_id: "prd-ai-studio", summary: "Checkpoint CHK-12 recorded", detail: "Acceptance audit scope drafted for the AI Creator Studio pre-alpha cycle.", provenance: "manually_recorded", link: "/engineering/checkpoints" },
  { id: "act-2", kind: "snapshot_registered", occurred_at: "2026-07-26T21:05:00Z", actor_id: "user-eng-lead", workspace_id: "technologies", product_id: "prd-ai-studio", summary: "Snapshot SNP-0009 registered", detail: "Artifact elev8-ai-creator-studio-0.9.0-pre.3.tar.zst registered with checksum.", provenance: "manually_recorded", link: "/engineering/checkpoints" },
  { id: "act-3", kind: "risk_escalated", occurred_at: "2026-07-24T16:40:00Z", actor_id: "user-ops", workspace_id: "infrastructure", product_id: "prd-ai-studio", summary: "Risk escalated to critical", detail: "No verified backup target for pre-alpha snapshots.", provenance: "demonstration", link: "/infrastructure" },
  { id: "act-4", kind: "stage_review", occurred_at: "2026-07-21T18:40:00Z", actor_id: "user-eng-lead", workspace_id: "technologies", product_id: "prd-elev8-os", summary: "Stage OS-4 authorization gaps recorded", detail: "Gap list produced from the platform threat model review.", provenance: "manually_recorded", link: "/engineering/stages" },
  { id: "act-5", kind: "document_superseded", occurred_at: "2026-07-14T11:00:00Z", actor_id: "user-eng-lead", workspace_id: "technologies", product_id: "prd-ai-studio", summary: "Validation report superseded", detail: "AI-4 validation report superseded by the acceptance criteria matrix draft.", provenance: "manually_recorded", link: "/documents" },
  { id: "act-6", kind: "repository_verified", occurred_at: "2026-07-09T22:05:00Z", actor_id: "user-eng-lead", workspace_id: "technologies", product_id: "prd-elev8-cloud", summary: "Repository state manually verified", detail: "elev8-cloud recorded at commit 3ad9f21 on main, working tree clean.", provenance: "manually_recorded", link: "/repositories" },
  { id: "act-7", kind: "asset_purchased", occurred_at: "2026-05-20T15:30:00Z", actor_id: "user-ops", workspace_id: "infrastructure", product_id: null, summary: "Enterprise storage acquired", detail: "Two 20 TB enterprise HDDs recorded in the asset registry.", provenance: "manually_recorded", link: "/assets" },
  { id: "act-8", kind: "freeze_approved", occurred_at: "2026-06-20T19:05:00Z", actor_id: "user-founder", workspace_id: "technologies", product_id: "prd-ai-studio", summary: "Stage AI-4 frozen", detail: "Freeze approved with record FR-2026-004 at commit b41f0ac.", provenance: "manually_recorded", link: "/engineering/stages" },
  { id: "act-9", kind: "decision_approved", occurred_at: "2026-05-28T20:10:00Z", actor_id: "user-founder", workspace_id: "technologies", product_id: "prd-ai-studio", summary: "ADR-0007 accepted", detail: "Single orchestrator adopted for all AI Studio render pipelines.", provenance: "manually_recorded", link: "/decisions" },
  { id: "act-10", kind: "validation_completed", occurred_at: "2026-06-18T14:00:00Z", actor_id: "user-eng-lead", workspace_id: "technologies", product_id: "prd-ai-studio", summary: "Pipeline validation completed", detail: "Orchestrator smoke suite passed ahead of the AI-4 freeze.", provenance: "manually_recorded", link: "/documents" },
  { id: "act-11", kind: "product_created", occurred_at: "2026-06-15T09:00:00Z", actor_id: "user-founder", workspace_id: "driving-academy", product_id: "prd-driving-academy", summary: "Driving Academy record created", detail: "Formation lifecycle opened with regulatory discovery as the first stage.", provenance: "manually_recorded", link: "/products" },
  { id: "act-12", kind: "stage_review", occurred_at: "2026-06-01T10:00:00Z", actor_id: "user-eng-lead", workspace_id: "technologies", product_id: "prd-elev8-cloud", summary: "Stage 3.5B opened for review", detail: "Promotion gate opened; founder approval required.", provenance: "manually_recorded", link: "/engineering/stages" },
];

export const integrations: Integration[] = [
  { id: "int-github", name: "GitHub", category: "source_control", target: "Repository state and commits", state: "not_connected", adapter: "server-side adapter (planned)", notes: "All repository values are currently manually recorded." },
  { id: "int-proxmox", name: "Proxmox VE", category: "virtualization", target: "R740xd virtualization host", state: "not_connected", adapter: "server-side adapter (planned)", notes: "No control operations are implemented." },
  { id: "int-opnsense", name: "OPNsense", category: "network", target: "Edge router", state: "not_connected", adapter: "server-side adapter (planned)", notes: "Router not yet installed." },
  { id: "int-truenas", name: "TrueNAS", category: "storage", target: "Storage chassis", state: "not_connected", adapter: "server-side adapter (planned)", notes: "Chassis not yet assembled." },
  { id: "int-fortiswitch", name: "FortiSwitch", category: "network", target: "448D-FPOE core switch", state: "not_connected", adapter: "server-side adapter (planned)", notes: "Configuration recorded manually." },
  { id: "int-grafana", name: "Grafana", category: "observability", target: "Dashboards", state: "planned", adapter: "server-side adapter (planned)", notes: "Telemetry surfaces are placeholders." },
  { id: "int-prometheus", name: "Prometheus", category: "observability", target: "Metrics", state: "planned", adapter: "server-side adapter (planned)", notes: "Telemetry surfaces are placeholders." },
  { id: "int-supabase", name: "Lovable Cloud", category: "platform", target: "Authentication and persistence", state: "planned", adapter: "server functions", notes: "Authentication is not connected — development preview mode." },
];

export const systemSettings: SystemSetting[] = [
  { key: "app.environment", label: "Environment", group: "general", description: "Current operating environment label shown in the shell.", value: "Development Preview", kind: "select", options: ["Development Preview", "Staging", "Production"], editable: false },
  { key: "app.boot_sequence", label: "Startup sequence", group: "appearance", description: "Show the initialization sequence on first launch of a session.", value: true, kind: "toggle", editable: true },
  { key: "app.density", label: "Interface density", group: "appearance", description: "Table and panel density for dense enterprise views.", value: "Compact", kind: "select", options: ["Compact", "Comfortable"], editable: true },
  { key: "app.theme", label: "Theme", group: "appearance", description: "Dark is the primary experience; light is token-ready.", value: "Dark", kind: "select", options: ["Dark", "Light"], editable: false },
  { key: "app.default_workspace", label: "Default workspace", group: "workspaces", description: "Workspace loaded at startup.", value: "Command Overview", kind: "select", options: ["Command Overview", "Executive — Bell Cap Group", "Elev8 Technologies", "Elev8 Driving Academy", "Infrastructure", "Institutional Records"], editable: true },
  { key: "security.auth", label: "Authentication", group: "security", description: "Authentication provider status.", value: "Not connected — development preview", kind: "text", editable: false },
  { key: "security.audit", label: "Audit record on governed actions", group: "security", description: "Architecture Approved, Stage Complete, Stage Frozen, Release Approved, and Production Ready always write an audit record.", value: true, kind: "toggle", editable: false },
  { key: "advanced.desktop", label: "Desktop shell readiness", group: "advanced", description: "Frontend is structured for a future Tauri desktop wrapper.", value: "Ready — not packaged", kind: "text", editable: false },
];

export const SYSTEM_STATE = {
  environment: "Development Preview",
  system_status: "Nominal",
  last_sync_at: NOW,
  operational_mode: "Founder Operating Mode",
  build: "ECC-0001 · v1.0.0-foundation",
};

export const CURRENT_PRIORITY = {
  product_id: "prd-ai-studio",
  phase: "Completion and Validation",
  release_status: "Pre-Alpha",
  next_gate: "Repository and Platform Acceptance Audit",
  resume: {
    last_completed_action: "Drafted acceptance audit scope (CHK-12)",
    branch: "release/pre-alpha",
    stage_id: "stg-ai-5",
    project_id: "prj-ai-validation",
    next_required_action: "Publish the acceptance criteria matrix and schedule the audit",
    last_checkpoint_at: "2026-07-26T21:12:00Z",
    owner_id: "user-eng-lead",
  },
};

export const INTELLIGENCE_BRIEFING = {
  headline:
    "Elev8 AI Creator Studio is currently closest to a controlled release. Elev8 Cloud remains paused at the Stage 3.5B Git promotion gate. Driving Academy remains in formation and should not interrupt the AI Creator Studio validation cycle.",
  citations: [
    { label: "Stage AI-5 — Completion and Validation", route: "/engineering/stages" },
    { label: "Stage 3.5B — Canonical Git Promotion", route: "/engineering/stages" },
    { label: "Snapshot SNP-0009", route: "/engineering/checkpoints" },
  ],
};

export const AI_SUGGESTED_PROMPTS = [
  "Where did we leave off?",
  "What should I work on next?",
  "Which products are blocked?",
  "What changed this week?",
  "What documentation is missing?",
  "Is this release ready to freeze?",
  "Show the latest verified repository state.",
  "Which infrastructure assets are not assigned?",
];

export const AI_RESPONSES: Record<string, { answer: string; citations: { label: string; route: string }[] }> = {
  "Where did we leave off?": {
    answer:
      "The last recorded checkpoint is CHK-12 on Elev8 AI Creator Studio, branch release/pre-alpha, taken 26 July 2026. The acceptance audit scope was drafted. The next required action is publishing the acceptance criteria matrix and scheduling the repository and platform acceptance audit.",
    citations: [
      { label: "Checkpoint CHK-12", route: "/engineering/checkpoints" },
      { label: "Elev8 AI Creator Studio", route: "/products" },
    ],
  },
  "What should I work on next?": {
    answer:
      "Publish the AI Creator Studio acceptance criteria matrix (due 31 July), then decide Stage 3.5B promotion for Elev8 Cloud — that gate has been open for eight weeks and is the oldest blocker in the portfolio.",
    citations: [
      { label: "Task — Publish acceptance criteria matrix", route: "/engineering" },
      { label: "Stage 3.5B", route: "/engineering/stages" },
    ],
  },
  "Which products are blocked?": {
    answer:
      "Elev8 Cloud is paused at Stage 3.5B pending founder promotion approval. No other product is hard-blocked; Elev8 OS is on watch due to open authorization gaps.",
    citations: [{ label: "Elev8 Cloud", route: "/products" }],
  },
  "What changed this week?": {
    answer:
      "Three recorded events: checkpoint CHK-12, snapshot SNP-0009 registration, and a critical risk escalation for the unverified snapshot backup target.",
    citations: [{ label: "Activity ledger", route: "/activity" }],
  },
  "What documentation is missing?": {
    answer:
      "The Elev8 OS authorization matrix, the AI Creator Studio pre-alpha validation report, and rollback rehearsal notes for SNP-0009 are all unpublished. The rack bring-up runbook is at 0.4 and unapproved.",
    citations: [{ label: "Documents register", route: "/documents" }],
  },
  "Is this release ready to freeze?": {
    answer:
      "No. The AI Creator Studio pre-alpha release has five mandatory checks that are not evaluated, including security review and founder approval. Freeze requires an explicit approval record and cannot be inferred from system facts.",
    citations: [{ label: "AI Creator Studio Pre-Alpha", route: "/releases" }],
  },
  "Show the latest verified repository state.": {
    answer:
      "elev8-ai-creator-studio was last manually verified on 26 July 2026 at commit 9c27de1, branch release/pre-alpha, tag v0.9.0-pre.3, working tree clean. No live source-control integration is connected.",
    citations: [{ label: "Repository center", route: "/repositories" }],
  },
  "Which infrastructure assets are not assigned?": {
    answer:
      "The 8-bay storage chassis is planned and unassembled, and the 2 × 20 TB drives are procured but staged. The OptiPlex edge router is staged without OPNsense installed.",
    citations: [{ label: "Infrastructure registry", route: "/infrastructure" }],
  },
};

export const DEFAULT_AI_RESPONSE = {
  answer:
    "Elev8 Intelligence is running in demonstration mode. Responses are authored examples drawn from the demonstration record set — no repository, infrastructure, or financial system has been queried.",
  citations: [{ label: "Integration register", route: "/settings" }],
};
/* --------------------------------------------------------- builder journal */

export const builderJournal: BuilderJournalEntry[] = [
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "jnl-1", status: "recorded", entry_date: "2026-07-26", title: "Acceptance audit scope defined for AI Creator Studio", summary: "Wrote the repository and platform acceptance audit scope, listing the artifacts required before the pre-alpha freeze can be requested.", product_id: "prd-ai-studio", repository_id: "repo-ai-studio", document_ids: ["doc-accept-ai"], asset_ids: [], decision_ids: ["dec-1"], stage_id: "stg-ai-5", tags: ["acceptance", "pre-alpha", "governance"], importance: "significant" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "jnl-2", status: "recorded", entry_date: "2026-07-21", title: "Authorization gaps recorded for Elev8 OS", summary: "Threat-model review produced a concrete authorization gap list; the authorization matrix document is the next artifact.", product_id: "prd-elev8-os", repository_id: "repo-elev8-os", document_ids: ["doc-threat-os"], asset_ids: [], decision_ids: ["dec-3"], stage_id: "stg-os-4", tags: ["security", "authorization"], importance: "notable" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "jnl-3", status: "recorded", entry_date: "2026-07-09", title: "Cloud 3.5B promotion paused pending founder approval", summary: "Canonical Git package layout for Elev8 Cloud infrastructure is drafted, but promotion is deliberately paused until the founder approves the package structure.", product_id: "prd-elev8-cloud", repository_id: "repo-elev8-cloud", document_ids: ["doc-arch-cloud"], asset_ids: [], decision_ids: ["dec-2"], stage_id: "stg-cloud-35b", tags: ["infrastructure-as-code", "approval"], importance: "significant" },
  { ...base({ workspace_id: "infrastructure", organization_id: "org-elev8tech" }), id: "jnl-4", status: "recorded", entry_date: "2026-05-20", title: "Enterprise storage acquired for the snapshot target", summary: "Recorded two 20 TB enterprise drives in the asset registry; the verified backup target remains outstanding until the chassis is assembled.", product_id: null, repository_id: null, document_ids: [], asset_ids: ["ast-r740xd"], decision_ids: ["dec-4"], stage_id: null, tags: ["hardware", "storage", "backup"], importance: "notable" },
  { ...base({ workspace_id: "technologies", organization_id: "org-elev8tech" }), id: "jnl-5", status: "recorded", entry_date: "2026-06-20", title: "Stage AI-4 frozen with freeze record FR-2026-004", summary: "Pipeline consolidation completed and frozen after explicit founder approval; the freeze record is the governing audit artifact.", product_id: "prd-ai-studio", repository_id: "repo-ai-studio", document_ids: ["doc-validation-ai4"], asset_ids: [], decision_ids: ["dec-1"], stage_id: "stg-ai-4", tags: ["freeze", "milestone", "governance"], importance: "milestone" },
];

/* ------------------------------------------------------------ AI briefings */

export const aiBriefings: AIBriefing[] = [
  { id: "brf-1", generated_at: NOW, workspace_id: "command", headline: "Acceptance audit is the single gate holding the pre-alpha freeze", body: "AI Creator Studio sits at Stage AI-5. The acceptance criteria matrix is unpublished, the release freeze approval is pending, and the snapshot backup target is unverified.", citations: [{ label: "Stage AI-5", route: "/engineering/stages" }, { label: "Pending approvals", route: "/notifications" }], provenance: "demonstration" },
  { id: "brf-2", generated_at: NOW, workspace_id: "technologies", headline: "Two promotions are waiting on founder decisions", body: "Elev8 Cloud Stage 3.5B promotion and the AI Creator Studio release freeze both require explicit founder approval before engineering can continue.", citations: [{ label: "Approvals", route: "/notifications" }, { label: "Decisions", route: "/decisions" }], provenance: "demonstration" },
  { id: "brf-3", generated_at: NOW, workspace_id: "infrastructure", headline: "No verified backup target for registered snapshots", body: "Snapshots are registered against storage that has not been verified. This is the highest-severity open infrastructure record.", citations: [{ label: "Assets", route: "/assets" }, { label: "Topology", route: "/infrastructure/topology" }], provenance: "demonstration" },
];
