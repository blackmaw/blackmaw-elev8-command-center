import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Boxes,
  Building2,
  Cpu,
  FileStack,
  FolderGit2,
  Gauge,
  GitBranch,
  HardDrive,
  LayoutDashboard,
  Map as MapIcon,
  Rocket,
  ScrollText,
  Search,
  Settings,
  Sparkles,
  Bell,
} from "lucide-react";

/**
 * Single source of truth for global navigation. Navigation labels and order
 * are stable across workspaces and must not be restructured by feature work.
 */

export interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  description: string;
  exact?: boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  { id: "command", label: "Command Overview", to: "/command", icon: LayoutDashboard, description: "Where did we leave off" },
  { id: "executive", label: "Executive", to: "/executive", icon: Building2, description: "Bell Cap Group oversight" },
  { id: "organizations", label: "Organizations", to: "/organizations", icon: Boxes, description: "Legal entities and units" },
  { id: "products", label: "Products", to: "/products", icon: Gauge, description: "Portfolio records" },
  { id: "engineering", label: "Engineering", to: "/engineering", icon: GitBranch, description: "Stage gates and checkpoints" },
  { id: "infrastructure", label: "Infrastructure", to: "/infrastructure", icon: Cpu, description: "Asset registry and topology" },
  { id: "repositories", label: "Repositories", to: "/repositories", icon: FolderGit2, description: "Repository center" },
  { id: "roadmaps", label: "Roadmaps", to: "/roadmaps", icon: MapIcon, description: "Horizons and lanes" },
  { id: "releases", label: "Releases", to: "/releases", icon: Rocket, description: "Launch sequence" },
  { id: "documents", label: "Documents", to: "/documents", icon: FileStack, description: "Institutional records" },
  { id: "assets", label: "Assets", to: "/assets", icon: HardDrive, description: "Owned equipment" },
  { id: "decisions", label: "Decisions", to: "/decisions", icon: ScrollText, description: "Decision register" },
  { id: "activity", label: "Activity", to: "/activity", icon: Activity, description: "Institutional ledger" },
];

export const UTILITY_NAV: NavItem[] = [
  { id: "search", label: "Search", to: "/search", icon: Search, description: "Global search" },
  { id: "notifications", label: "Notifications", to: "/notifications", icon: Bell, description: "Notification center" },
  { id: "ai", label: "AI Command", to: "/ai", icon: Sparkles, description: "Elev8 Intelligence" },
  { id: "settings", label: "Settings", to: "/settings", icon: Settings, description: "System settings" },
];

/** Contextual items rendered underneath the stable global navigation. */
export const WORKSPACE_CONTEXT_NAV: Record<string, NavItem[]> = {
  command: [],
  executive: [
    { id: "exec-orgs", label: "Entity Structure", to: "/organizations", icon: Building2, description: "Ownership hierarchy" },
    { id: "exec-docs", label: "Corporate Records", to: "/documents", icon: FileStack, description: "Corporate documents" },
  ],
  technologies: [
    { id: "tech-stages", label: "Stage Gates", to: "/engineering/stages", icon: GitBranch, description: "Stage register" },
    { id: "tech-snapshots", label: "Snapshots", to: "/engineering/checkpoints", icon: FileStack, description: "Snapshot register" },
  ],
  "driving-academy": [
    { id: "da-docs", label: "Curriculum Records", to: "/documents", icon: FileStack, description: "Curriculum and course maps" },
  ],
  infrastructure: [
    { id: "infra-topology", label: "Topology", to: "/infrastructure/topology", icon: Cpu, description: "Interactive topology" },
    { id: "infra-assets", label: "Asset Inventory", to: "/assets", icon: HardDrive, description: "Owned equipment" },
  ],
  institutional: [
    { id: "inst-decisions", label: "Decision Register", to: "/decisions", icon: ScrollText, description: "ADR register" },
    { id: "inst-activity", label: "Activity Ledger", to: "/activity", icon: Activity, description: "Append-oriented ledger" },
  ],
};

export const ROUTE_LABELS: Record<string, string> = {
  command: "Command Overview",
  executive: "Executive",
  organizations: "Organizations",
  workspaces: "Workspaces",
  products: "Products",
  engineering: "Engineering",
  stages: "Stage Gates",
  checkpoints: "Checkpoints & Snapshots",
  infrastructure: "Infrastructure",
  topology: "Topology",
  repositories: "Repositories",
  roadmaps: "Roadmaps",
  releases: "Releases",
  documents: "Documents",
  assets: "Assets",
  decisions: "Decisions",
  activity: "Activity",
  search: "Search",
  notifications: "Notifications",
  ai: "Elev8 Intelligence",
  settings: "Settings",
};