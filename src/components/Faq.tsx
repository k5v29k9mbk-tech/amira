import { getTranslations } from "next-intl/server";
import { displayRow } from "@/lib/ui";

/**
 * Native disclosure rows. No JavaScript, correct keyboard and screen reader
 * behaviour for free, and the answer is in the DOM for search engines whether
 * or not the row is open.
 */
export async function Faq({ items }: { items: readonly string[] }) {
  const t = await getTranslations("faq");

  return (
    <div className="border-t border-hair">
      {items.map((k) => (
        <details key={k} className="group border-b border-hair">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-7 [&::-webkit-details-marker]:hidden">
            <span className={displayRow}>
              {t(`items.${k}.q`)}
            </span>
            {/* Two hairlines. The vertical one flattens when the row opens. */}
            <span aria-hidden className="relative mt-3 h-3 w-3 shrink-0">
              <span className="absolute top-1/2 left-0 h-px w-full bg-bronze" />
              <span className="absolute top-0 left-1/2 h-full w-px bg-bronze transition-transform duration-500 ease-[var(--ease-aura)] group-open:scale-y-0" />
            </span>
          </summary>
          <p className="max-w-[64ch] pb-8 text-[16px] leading-relaxed text-mute">
            {t(`items.${k}.a`)}
          </p>
        </details>
      ))}
    </div>
  );
}
