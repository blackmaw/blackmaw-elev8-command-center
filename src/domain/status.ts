/**
 * Centralized status vocabulary. Every badge, pill, and health indicator in
 * the application resolves its label and tone from this module — components
 * must never define their own colour/status mapping.
 */

export type Tone =
  | "neutral"
  | "teal"
  | "success"
  | "warning"
  | "critical"
  | "info"
  | "muted";

export interface StatusMeta {
  label: string;
  tone: Tone;
}

const def = (label: string, tone: Tone): StatusMeta => ({ label, tone });

export const STAGE_STATE: Record<string, StatusMeta> = {
  proposed: def("Proposed", "muted"),
  planned: def("Planned", "neutral"),
  in_progress: def("In Progress", "teal"),
  review_required: def("Review Required", "warning"),
  validation_required: def("Validation Required", "warning"),
  blocked: def("Blocked", "critical"),
  approved: def("Approved", "success"),
  frozen: def("Frozen", "info"),
  superseded: def("Superseded", "muted"),
  archived: def("Archived", "muted"),
};

export const GATE_STATE: Record<string, StatusMeta> = {
  not_evaluated: def("Not Evaluated", "muted"),
  passed: def("Passed", "success"),
  failed: def("Failed", "critical"),
  blocked: def("Blocked", "critical"),
  waived: def("Waived with Approval", "warning"),
};

export const ENTITY_STATUS: Record<string, StatusMeta> = {
  planned: def("Planned", "muted"),
  formation: def("Formation", "warning"),
  active: def("Active", "success"),
  pending_verification: def("Pending Verification", "warning"),
  verified: def("Verified", "success"),
  suspended: def("Suspended", "critical"),
  archived: def("Archived", "muted"),
};

export const HEALTH: Record<string, StatusMeta> = {
  nominal: def("Nominal", "success"),
  watch: def("Watch", "warning"),
  at_risk: def("At Risk", "warning"),
  blocked: def("Blocked", "critical"),
  paused: def("Paused", "info"),
};

export const LIFECYCLE: Record<string, StatusMeta> = {
  concept: def("Concept", "muted"),
  formation: def("Formation", "warning"),
  architecture: def("Architecture", "info"),
  active_development: def("Active Development", "teal"),
  validation: def("Validation", "warning"),
  released: def("Released", "success"),
  sunset: def("Sunset", "muted"),
};

export const ASSET_LIFECYCLE: Record<string, StatusMeta> = {
  planned: def("Planned", "muted"),
  procured: def("Procured", "info"),
  staging: def("Staging", "warning"),
  in_service: def("In Service", "success"),
  maintenance: def("Maintenance", "warning"),
  retired: def("Retired", "muted"),
};

export const PROVENANCE: Record<string, StatusMeta> = {
  demonstration: def("Demonstration", "warning"),
  manually_recorded: def("Manually Recorded", "info"),
  pending_verification: def("Pending Verification", "warning"),
  integration_not_connected: def("Integration Not Connected", "critical"),
  verified: def("Verified", "success"),
};

export const SEVERITY: Record<string, StatusMeta> = {
  low: def("Low", "muted"),
  moderate: def("Moderate", "info"),
  high: def("High", "warning"),
  critical: def("Critical", "critical"),
};

export const TASK_STATE: Record<string, StatusMeta> = {
  todo: def("To Do", "muted"),
  in_progress: def("In Progress", "teal"),
  review: def("Review", "warning"),
  done: def("Done", "success"),
  blocked: def("Blocked", "critical"),
};

export const RELEASE_STATE: Record<string, StatusMeta> = {
  planning: def("Planning", "muted"),
  in_review: def("In Review", "warning"),
  ready: def("Ready", "success"),
  blocked: def("Blocked", "critical"),
  shipped: def("Shipped", "info"),
};

export const DECISION_STATE: Record<string, StatusMeta> = {
  proposed: def("Proposed", "warning"),
  accepted: def("Accepted", "success"),
  rejected: def("Rejected", "critical"),
  superseded: def("Superseded", "muted"),
};

export const INTEGRATION_STATE: Record<string, StatusMeta> = {
  not_connected: def("Not Connected", "critical"),
  planned: def("Planned", "muted"),
  configured: def("Configured", "warning"),
  connected: def("Connected", "success"),
};

export const FREEZE_STATE: Record<string, StatusMeta> = {
  not_frozen: def("Not Frozen", "muted"),
  freeze_requested: def("Freeze Requested", "warning"),
  frozen: def("Frozen", "info"),
};

export const WORKING_TREE: Record<string, StatusMeta> = {
  clean: def("Clean", "success"),
  dirty: def("Uncommitted Changes", "warning"),
  unknown: def("Unknown", "muted"),
};

/** Fallback-safe lookup used by every status component. */
export function statusMeta(map: Record<string, StatusMeta>, key: string | null | undefined): StatusMeta {
  if (!key) return def("Unknown", "muted");
  return map[key] ?? def(key.replace(/_/g, " "), "muted");
}

export const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-border-strong bg-secondary text-foreground",
  muted: "border-border bg-muted/60 text-muted-foreground",
  teal: "border-teal/40 bg-teal/12 text-teal-bright",
  success: "border-success/40 bg-success/12 text-success",
  warning: "border-warning/40 bg-warning/12 text-warning",
  critical: "border-critical/50 bg-critical/14 text-critical",
  info: "border-info/40 bg-info/12 text-info",
};

export const TONE_DOT: Record<Tone, string> = {
  neutral: "bg-foreground/60",
  muted: "bg-muted-foreground",
  teal: "bg-teal-bright",
  success: "bg-success",
  warning: "bg-warning",
  critical: "bg-critical",
  info: "bg-info",
};