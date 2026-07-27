import { cn } from "@/lib/utils";
import elev8Logo from "@/assets/elev8-logo.png.asset.json";

/**
 * OFFICIAL BRAND AREA.
 *
 * The official Elev8 Technologies logo asset is rendered inside the fixed
 * 32x32 slot below (`data-logo-slot="elev8-primary"`). To install the official
 * asset, set ELEV8_LOGO_SRC to the imported asset URL — the slot preserves the
 * mark's aspect ratio with `object-contain` and adds clear space around it, so
 * no sidebar dimension changes. The mark is never redrawn, cropped, or
 * recoloured here; until the asset file is supplied the slot shows a neutral
 * placeholder monogram.
 */
export const ELEV8_LOGO_SRC: string | null = elev8Logo.url;

/** Compact official mark, used wherever Elev8 Intelligence is represented. */
export function Elev8Mark({ className }: { className?: string }) {
  return (
    <img
      src={elev8Logo.url}
      alt="Elev8"
      className={cn("size-4 shrink-0 object-contain", className)}
    />
  );
}

export function BrandMark({
  collapsed = false,
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        data-logo-slot="elev8-primary"
        className="grid size-8 shrink-0 place-items-center rounded-xs border border-border-strong bg-canvas p-1"
      >
        {ELEV8_LOGO_SRC ? (
          <img src={ELEV8_LOGO_SRC} alt="Elev8 Technologies" className="size-full object-contain" />
        ) : (
          <span className="tech text-[0.6875rem] font-semibold text-teal-bright" aria-hidden>
            E8
          </span>
        )}
      </div>
      {!collapsed && (
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[0.8125rem] font-semibold tracking-[0.18em]">ELEV8</div>
          <div className="label-caps truncate tracking-[0.16em]">Command Center</div>
        </div>
      )}
    </div>
  );
}
