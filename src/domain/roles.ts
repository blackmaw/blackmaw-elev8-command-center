import type { PermissionKey, Role, RoleKey } from "./types";

/**
 * Authorization model. Deny by default: `can()` returns false unless the
 * role explicitly holds the permission within the requested scope.
 *
 * NOTE: This is a client-side *presentation* guard only. Authentication is
 * not connected in this build (development preview mode). Privileged
 * operations must be enforced server-side once Lovable Cloud is enabled;
 * hidden navigation is never treated as authorization.
 */

const ALL: PermissionKey[] = [
  "workspace.read",
  "workspace.manage",
  "product.read",
  "product.manage",
  "stage.read",
  "stage.approve",
  "release.read",
  "release.approve",
  "infrastructure.read",
  "infrastructure.manage",
  "document.read",
  "document.manage",
  "decision.read",
  "decision.approve",
  "settings.manage",
  "audit.read",
];

const READ: PermissionKey[] = [
  "workspace.read",
  "product.read",
  "stage.read",
  "release.read",
  "infrastructure.read",
  "document.read",
  "decision.read",
];

export const ROLES: Record<RoleKey, Role> = {
  founder: { key: "founder", name: "Founder", description: "Full authority across every organization and workspace.", permissions: ALL },
  executive_administrator: {
    key: "executive_administrator",
    name: "Executive Administrator",
    description: "Corporate oversight, approvals, and document governance.",
    permissions: [...READ, "document.manage", "decision.approve", "release.approve", "audit.read"],
  },
  workspace_administrator: {
    key: "workspace_administrator",
    name: "Workspace Administrator",
    description: "Manages membership and configuration within one workspace.",
    permissions: [...READ, "workspace.manage", "document.manage"],
  },
  engineering_lead: {
    key: "engineering_lead",
    name: "Engineering Lead",
    description: "Owns stage progression and requests freezes and releases.",
    permissions: [...READ, "product.manage", "stage.approve", "document.manage"],
  },
  engineer: { key: "engineer", name: "Engineer", description: "Executes engineering work and records checkpoints.", permissions: [...READ, "product.manage"] },
  product_manager: { key: "product_manager", name: "Product Manager", description: "Owns roadmap, scope, and acceptance criteria.", permissions: [...READ, "product.manage", "document.manage"] },
  operations_manager: { key: "operations_manager", name: "Operations Manager", description: "Owns infrastructure registry and maintenance.", permissions: [...READ, "infrastructure.manage"] },
  auditor: { key: "auditor", name: "Auditor", description: "Read-only access plus the full audit ledger.", permissions: [...READ, "audit.read"] },
  read_only: { key: "read_only", name: "Read Only", description: "Read access to non-sensitive records.", permissions: READ },
};

export interface AuthScope {
  role: RoleKey;
  organization_ids: string[];
  workspace_ids: string[];
}

export function can(
  scope: AuthScope,
  permission: PermissionKey,
  target?: { organization_id?: string | null; workspace_id?: string | null },
): boolean {
  const role = ROLES[scope.role];
  if (!role) return false;
  if (!role.permissions.includes(permission)) return false;
  if (target?.organization_id && !scope.organization_ids.includes(target.organization_id)) return false;
  if (target?.workspace_id && !scope.workspace_ids.includes(target.workspace_id)) return false;
  return true;
}

/**
 * Human-governed actions. These must never be automated by system facts and
 * always require an explicit approval record.
 */
export const MANUAL_GOVERNED_ACTIONS = [
  "Architecture Approved",
  "Stage Complete",
  "Stage Frozen",
  "Release Approved",
  "Production Ready",
] as const;