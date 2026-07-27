/**
 * HEALTH ENGINE
 * -------------
 * Every score is computed from the current record set — no fabricated values.
 * Each score carries the basis so the UI can state how it was derived.
 */
import { db } from "@/data/selectors";
import type { HealthBand, HealthScore, ID, Provenance } from "@/domain/types";

const PROVENANCE: Provenance = "demonstration";

function band(score: number): HealthBand {
  if (score >= 85) return "nominal";
  if (score >= 65) return "watch";
  if (score >= 40) return "at_risk";
  return "blocked";
}

const pct = (n: number, d: number) => (d === 0 ? 0 : Math.round((n / d) * 100));

function score(
  key: string,
  label: string,
  value: number,
  basis: string,
  factors: { label: string; value: string }[],
): HealthScore {
  return { key, label, score: value, band: band(value), basis, factors, provenance: PROVENANCE };
}

export function productHealth(productId: ID): HealthScore {
  const product = db.products.find((p) => p.id === productId || p.key === productId)!;
  const risks = db.risks.filter(
    (r) => r.product_id === product.id && (r.state === "open" || r.state === "mitigating"),
  );
  const criticals = risks.filter((r) => r.severity === "critical" || r.severity === "high").length;
  const met = product.acceptance_criteria.filter((c) => c.met).length;
  const acceptance = pct(met, product.acceptance_criteria.length || 1);
  const gates = [product.security_state, product.validation_state].filter(
    (g) => g === "passed",
  ).length;
  const value = Math.max(
    0,
    Math.min(
      100,
      Math.round(product.progress * 0.4 + acceptance * 0.3 + gates * 15 - criticals * 12),
    ),
  );
  return score(
    "product." + product.key,
    product.name,
    value,
    "Progress, acceptance criteria met, gate states, and open risk severity.",
    [
      { label: "Recorded progress", value: `${product.progress}%` },
      { label: "Acceptance criteria met", value: `${met}/${product.acceptance_criteria.length}` },
      { label: "Gates passed", value: `${gates}/2` },
      { label: "Open risks", value: `${risks.length}` },
    ],
  );
}

export function repositoryHealth(): HealthScore {
  const repos = db.repositories;
  const clean = repos.filter((r) => r.working_tree === "clean").length;
  const ci = repos.filter((r) => r.ci_status === "passed").length;
  const docs = repos.filter((r) => r.documentation_state === "passed").length;
  const value = Math.round(
    (pct(clean, repos.length) + pct(ci, repos.length) + pct(docs, repos.length)) / 3,
  );
  return score(
    "repository",
    "Repository health",
    value,
    "Working-tree cleanliness, recorded CI state, and documentation review state across tracked repositories.",
    [
      { label: "Clean working trees", value: `${clean}/${repos.length}` },
      { label: "CI passed", value: `${ci}/${repos.length}` },
      { label: "Documentation reviewed", value: `${docs}/${repos.length}` },
    ],
  );
}

export function infrastructureHealth(): HealthScore {
  const assets = db.assets;
  const inService = assets.filter((a) => a.lifecycle === "in_service").length;
  const risks = db.risks.filter(
    (r) => r.workspace_id === "infrastructure" && (r.state === "open" || r.state === "mitigating"),
  );
  const critical = risks.filter((r) => r.severity === "critical").length;
  const value = Math.max(
    0,
    Math.round(pct(inService, assets.length) - critical * 15 - (risks.length - critical) * 5),
  );
  return score(
    "infrastructure",
    "Infrastructure health",
    value,
    "Assets in service versus registered assets, reduced by open infrastructure risks.",
    [
      { label: "Assets in service", value: `${inService}/${assets.length}` },
      { label: "Open infrastructure risks", value: `${risks.length}` },
      { label: "Critical risks", value: `${critical}` },
    ],
  );
}

export function documentationHealth(): HealthScore {
  const docs = db.documents;
  const approved = docs.filter((d) => d.approval_state === "passed").length;
  const stale = docs.filter((d) => d.approval_state === "not_evaluated").length;
  const value = Math.max(0, pct(approved, docs.length) - stale * 3);
  return score(
    "documentation",
    "Documentation health",
    value,
    "Approved documents as a share of the register, reduced by documents never evaluated.",
    [
      { label: "Approved", value: `${approved}/${docs.length}` },
      { label: "Not evaluated", value: `${stale}` },
    ],
  );
}

export function releaseHealth(): HealthScore {
  const releases = db.releases;
  const checks = releases.flatMap((r) => r.checks);
  const passed = checks.filter((c) => c.state === "passed").length;
  const blocked = releases.filter((r) => r.state === "blocked").length;
  const value = Math.max(0, pct(passed, checks.length || 1) - blocked * 10);
  return score(
    "release",
    "Release health",
    value,
    "Mandatory release checks passed across all recorded releases, reduced by blocked releases.",
    [
      { label: "Checks passed", value: `${passed}/${checks.length}` },
      { label: "Blocked releases", value: `${blocked}` },
    ],
  );
}

export function engineeringHealth(): HealthScore {
  const stages = db.stages;
  const settled = stages.filter((s) => s.state === "approved" || s.state === "frozen").length;
  const blocked = stages.filter((s) => s.state === "blocked").length;
  const pending = db.approvals.filter((a) => a.decision === "pending").length;
  const value = Math.max(0, pct(settled, stages.length) - blocked * 10 - pending * 4);
  return score(
    "engineering",
    "Engineering health",
    value,
    "Stages approved or frozen, reduced by blocked stages and pending approvals.",
    [
      { label: "Stages settled", value: `${settled}/${stages.length}` },
      { label: "Blocked stages", value: `${blocked}` },
      { label: "Pending approvals", value: `${pending}` },
    ],
  );
}

/** Portfolio-wide health board used by the briefing engine. */
export function healthBoard(): HealthScore[] {
  return [
    engineeringHealth(),
    repositoryHealth(),
    infrastructureHealth(),
    documentationHealth(),
    releaseHealth(),
  ];
}
