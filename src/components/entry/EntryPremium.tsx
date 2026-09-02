import { EntryHero } from "./EntryHero";
import { EntryBenefits } from "./EntryBenefits";
import { EntryStatement } from "./EntryStatement";
import { EntryMastery } from "./EntryMastery";
import { EntryProgram } from "./EntryProgram";
import { EntryBusiness } from "./EntryBusiness";
import { EntryFounder } from "./EntryFounder";
import { EntryOutcome } from "./EntryOutcome";
import { EntryKits } from "./EntryKits";
import { EntryInfoBar } from "./EntryInfoBar";
import { EntryClose } from "./EntryClose";
import { entryCopy } from "@/lib/entry";

/**
 * The premium opening of the homepage, as one object.
 *
 * WHAT THIS IS FOR. The five sections below used to be a page of their own at
 * the site's root, with the academy's landing page behind them at /academy.
 * That is no longer the arrangement: there is ONE homepage, and it opens with
 * these five and then continues, without a break, into the academy's own film
 * hero and every act after it.
 *
 * They are grouped here rather than listed inline in the route for one reason:
 * the homepage file is the academy's landing page, restored to the path it was
 * always on, and the only edit that file should carry is a single line adding
 * this opening above its first section. A route that listed five imports and
 * five elements before the original page's first line would have buried that
 * one-line change in a diff that looked like a rewrite.
 *
 * THERE IS NO FOOTER IN HERE, AND THAT IS THE POINT OF THE GROUPING. As a page
 * this movement closed on a slim contact line of its own. As the opening of a
 * longer page it closes on the information bar and hands straight over to the
 * film, because the page does not end here -- it ends where it always did, on
 * the site's own footer, several acts below.
 *
 * THE SELLING SECTIONS ARE INTERLEAVED, NOT APPENDED. The eight blocks written
 * for the masterclass are set between the five that were already here, in the
 * order a reader decides in: what this is beyond a technique course (after the
 * strip has said what it is), the two days and the professional guidance beside
 * them (after the syllabus has said what is taught), who it is open to and what
 * PhiBrows is (before the person who teaches it), then what an artist leaves
 * with, the kits, the practical bar, and the ask. Stacking all eight after the
 * information bar would have made the page argue twice.
 *
 * THEY RENDER ONLY WHERE THEY HAVE BEEN WRITTEN. `sections` is optional per
 * locale -- the note on `EntrySections` in `lib/entry.ts` says why -- so a
 * language that has not been written yet renders exactly the page it rendered
 * before, rather than English inside its own.
 */
export function EntryPremium({ locale }: { locale: string }) {
  const { sections } = entryCopy(locale);

  return (
    <>
      <EntryHero />
      <EntryBenefits locale={locale} />
      {sections ? (
        <EntryStatement ground="ivory" title={sections.intro.title} body={sections.intro.body} />
      ) : null}
      <EntryMastery locale={locale} />
      {sections ? (
        <>
          <EntryProgram copy={sections.program} />
          <EntryBusiness copy={sections.business} />
          <EntryStatement
            ground="ivory"
            title={sections.access.title}
            lead={sections.access.lead}
            body={sections.access.body}
          />
          <EntryStatement
            ground="paper"
            title={sections.method.title}
            body={sections.method.body}
          />
        </>
      ) : null}
      <EntryFounder locale={locale} />
      {sections ? (
        <>
          <EntryOutcome copy={sections.outcome} />
          <EntryKits copy={sections.kits} />
        </>
      ) : null}
      <EntryInfoBar locale={locale} />
      {sections ? <EntryClose copy={sections.close} /> : null}
    </>
  );
}
