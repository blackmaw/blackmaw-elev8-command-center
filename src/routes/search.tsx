import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { DemoBanner, EmptyState, Mono, PageHeader, Panel, Tag } from "@/components/primitives";
import { SEARCH_ENTITY_LABEL, searchAll } from "@/data/selectors";
import { useAppState } from "@/app/app-state";
import type { SearchEntity } from "@/domain/types";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Global Search — Elev8 Command Center" },
      {
        name: "description",
        content:
          "Search every record across organizations, products, stages, repositories, documents, and assets.",
      },
      { property: "og:title", content: "Global Search — Elev8 Command Center" },
      { property: "og:description", content: "Unified record search across the command center." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { recentSearches, addRecentSearch } = useAppState();
  const [query, setQuery] = useState("");
  const [entity, setEntity] = useState<SearchEntity | "all">("all");

  const results = useMemo(
    () =>
      query.trim().length < 2 ? [] : searchAll(query, entity === "all" ? undefined : [entity]),
    [query, entity],
  );

  const entities = ["all", ...(Object.keys(SEARCH_ENTITY_LABEL) as SearchEntity[])] as const;

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 p-4 lg:p-6">
      <PageHeader
        title="Search"
        descriptor="Unified search across every recorded entity in the command center."
        provenance="demonstration"
      >
        <DemoBanner />
      </PageHeader>

      <Panel>
        <label className="flex items-center gap-2 rounded-xs border border-border bg-canvas px-2 py-2 focus-within:border-border-strong">
          <SearchIcon className="size-4 text-muted-foreground" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => addRecentSearch(query)}
            placeholder="Search records, products, stages, repositories, documents…"
            className="w-full bg-transparent text-[0.8125rem] outline-none placeholder:text-muted-foreground"
            aria-label="Search records"
          />
        </label>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {entities.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEntity(e as SearchEntity | "all")}
              className={`rounded-xs border px-2 py-1 text-[0.75rem] transition-colors ${
                e === entity
                  ? "border-border-strong bg-panel-elevated text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {e === "all" ? "All" : SEARCH_ENTITY_LABEL[e as SearchEntity]}
            </button>
          ))}
        </div>

        {recentSearches.length > 0 && query.length === 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="label-caps">Recent</span>
            {recentSearches.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setQuery(r)}
                className="rounded-xs border border-border px-2 py-0.5 text-[0.75rem] text-muted-foreground hover:text-foreground"
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </Panel>

      <Panel title={`Results (${results.length})`} dense bodyClassName="p-0">
        {results.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title={query.trim().length < 2 ? "Enter a search term" : "No matching records"}
              description={
                query.trim().length < 2
                  ? "Type at least two characters to search the record set."
                  : "Try a different term or entity filter."
              }
            />
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {results.map((r) => (
              <li key={`${r.entity}-${r.id}`}>
                <Link
                  to={r.route}
                  className="flex min-w-0 items-start gap-3 px-4 py-2.5 hover:bg-panel-elevated"
                >
                  <Tag>{SEARCH_ENTITY_LABEL[r.entity]}</Tag>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.8125rem] font-medium">{r.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {r.subtitle}
                    </span>
                  </span>
                  <Mono className="shrink-0 text-[0.6875rem] text-muted-foreground">{r.meta}</Mono>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
