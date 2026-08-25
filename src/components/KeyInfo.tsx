import { getTranslations } from "next-intl/server";
import type { Program } from "@/lib/programs";
import { Reveal } from "./Reveal";

/**
 * The key-information module: the facts a visitor scans before she reads.
 *
 * WHAT IT PRINTS, AND WHERE EACH ROW COMES FROM. Five of the rows are the
 * academy's shared conditions and are true of all six programmes, so they are
 * read from `catalog.details.*` and `programs.values.*` rather than restated per
 * course: level, places, language, certificate, live model. One row, the
 * location, prefers the programme's own city if it has one on file and falls
 * back to the academy's stated reach, which is across Italy and true of all six.
 *
 * THE DURATION ROW IS ABSENT UNTIL THERE IS A DURATION. The academy states only
 * that duration "varies by course", which the shared conditions on /courses
 * already say. Printing that here, in a module whose whole job is to answer a
 * question in two words, would be a row that says "we have not told you". So
 * `facts.durationKey` is undefined for all six today and the row does not
 * render; set it in `programs.ts` and add the string to the four catalogues and
 * the row appears in the right position, because the order below is fixed and
 * the filter runs over it.
 *
 * NO FEE ROW, EVER. See the note at the top of `programs.ts`.
 *
 * THE SHAPE. A definition list under one hairline, two columns on a phone and
 * four from md, label above value. No borders around the cells: a bordered grid
 * of six facts is a spec table from a shopping site, and the same six with a
 * single rule over them is the practical strip a printed prospectus sets. It is
 * the same construction the homepage uses for its four practical facts, on
 * purpose, so a reader who has seen one recognises the other.
 */
export async function KeyInfo({ program }: { program: Program }) {
  const t = await getTranslations("programs");
  const catalog = await getTranslations("catalog");

  /* Label and value, in reading order. A row whose value resolves to null is
     filtered out rather than printed empty, which is what makes the duration
     row appear the day it is supplied and stay absent until then. */
  const rows: { key: string; label: string; value: string | null }[] = [
    {
      key: "duration",
      label: t("labels.duration"),
      value: program.facts.durationKey ? t(program.facts.durationKey) : null,
    },
    { key: "level", label: t("labels.level"), value: catalog("details.level.value") },
    { key: "seats", label: t("labels.seats"), value: t("values.seats") },
    {
      key: "location",
      label: t("labels.location"),
      value: program.facts.locationKey
        ? t(program.facts.locationKey)
        : catalog("details.location.value"),
    },
    { key: "certificate", label: t("labels.certificate"), value: t("values.certificate") },
    { key: "model", label: t("labels.model"), value: t("values.model") },
    { key: "language", label: t("labels.language"), value: catalog("details.language.value") },
  ];

  const shown = rows.filter((r) => r.value);

  return (
    <Reveal>
      <p className="label text-bronze-ink">{t("keyInfoTitle")}</p>
      <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-hair pt-8 md:grid-cols-3 md:gap-x-12 md:pt-10 lg:grid-cols-4">
        {shown.map((row) => (
          <div key={row.key}>
            <dt className="label text-mute">{row.label}</dt>
            <dd className="mt-3 text-[16px] leading-relaxed text-espresso">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
