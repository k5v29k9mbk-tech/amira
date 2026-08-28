import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { altLanguages } from "@/i18n/routing";
import { closingMedia } from "@/lib/media";
import { beforeAfterPairs, whatsappLinkWith } from "@/lib/studio";
import { serviceGallery, beforeSrc, afterSrc } from "@/lib/service-gallery";
import {
  arrow,
  bodySmall,
  btnLineLight,
  btnSolidLight,
  displayLarge,
  displayRow,
  displaySection,
  eyebrow,
  linkRule,
  sectionPad,
  sectionPadBottom,
  sectionPadTop,
  shell,
} from "@/lib/ui";
import { stagger } from "@/lib/motion";
import { JsonLd, faqSchema } from "@/lib/seo";
import { Hero } from "@/components/Hero";
import { Artist } from "@/components/Artist";
import { AuthorityStrip } from "@/components/AuthorityStrip";
import { Manifesto } from "@/components/Manifesto";
import { CourseSelector } from "@/components/CourseSelector";
import { MethodStory } from "@/components/MethodStory";
import { Pathway } from "@/components/Pathway";
import { WorkGallery } from "@/components/WorkGallery";
import { BeforeAfter } from "@/components/BeforeAfter";
import { FrameGallery } from "@/components/FrameGallery";
import { LearningExperience } from "@/components/LearningExperience";
import { StudentReceives } from "@/components/StudentReceives";
import { Testimonial } from "@/components/Testimonial";
import { Faq } from "@/components/Faq";
import { MediaFrame } from "@/components/MediaFrame";
import { MaskReveal } from "@/components/MaskReveal";
import { StrokeReveal } from "@/components/StrokeReveal";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

// A function rather than a constant, because the canonical is per language and
// a static `metadata` export cannot see which one it is being rendered for.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { alternates: altLanguages("", locale) };
}

/**
 * The homepage, read as the academy's landing page: seven acts and a closing
 * frame.
 *
 * WHAT THIS PAGE ARGUES. That a professional education exists here, that it has
 * a named method, two levels, six courses on them, evidence of what it produces,
 * and a person who built the whole thing.
 *
 * ONE DECISION AT A TIME, IN THE ORDER A BUYER MAKES THEM. The page is now
 * ordered against the path a visitor actually walks rather than against the
 * order the material was written in:
 *
 *   understand the brand -> trust the person -> understand the method ->
 *   see what can be booked -> see what it produces -> see the room ->
 *   see how to start and what is included -> ask what is unclear -> write
 *
 * Each act serves exactly one of those steps, and no act repeats the step
 * before it.
 *
 * THE EXPLANATION NOW COMES BEFORE THE PROOF, which reverses the ordering this
 * file used to turn on. The results and the room sat at acts 03 and 04, above
 * the method and the catalogue, on the argument that evidence should precede
 * reasoning. It cost the page its conversion path: a reader who was persuaded
 * by the before/after pairs had four screens of method between her and anything
 * she could book, and the catalogue arrived after she had already decided. The
 * method is now act 02 and the catalogue act 03, so the question the method
 * raises ("taught how?" -> "of what?") is answered on the next screen and the
 * proof underneath it is read as confirmation of a choice already forming.
 *
 * WHAT WAS FOLDED IN, AND WHY THE PAGE IS SHORTER. Two numbered acts lost their
 * furniture and kept their content, because in both cases the act was the
 * closing clause of the act above it rather than a chapter beside it:
 *
 *   the ladder        "the path" was a numbered act whose whole content was
 *                     two levels of the thing the method had just explained.
 *                     It closes the method, under the same heading.
 *   what you leave    six rows of what a course includes, three screens above
 *   with              the five steps that say what happens if you book. It
 *                     closes the path act, and dropped the four rows that were
 *                     already stated by the method, the room and the shared
 *                     conditions.
 *
 * The same reasoning took the second action and the class-size note off the
 * hero (the first screen makes one ask, and the figure band already prints the
 * number), and the founder's name and role out of `AuthorityStrip` (the artist
 * act one screen below captions the same person). No string was deleted for any
 * of it. The keys stay in all four catalogues, held for the pages that still
 * render them, which is what `courses.test.ts` checks.
 *
 * THE ASKS, AND THERE ARE TWO. `cta.courses` is the primary and it is spent
 * once, on the first screen, because every act between it and the catalogue is
 * the argument for pressing it. `cta.consultation` is the closing ask, and it
 * is the one the fixed bar and the standing mobile bar carry the whole way
 * down, so a reader who is ready at any point has it in reach without the page
 * having to plant a third button in every section. Nothing else on this page is
 * a button: the course rows, "leggi la sua storia", the WhatsApp line on step
 * one and "tutte le domande" are links, and each one goes where the sentence
 * next to it says it goes.
 *
 * GROUNDS, PACED IN CHAPTERS. A ground that changes on every section stops
 * reading as a change, so the switches mark the turns in the argument:
 *
 *   ivory   the statement                        what it claims
 *   night   the standard                         what is proven
 *   ivory   Amira, the stroke, the method,       who teaches it, how it is
 *           the courses                          taught, what to book
 *   paper   the work, the room, the path,        what it produces, where, how
 *           the questions                        to start, what is unclear
 *   night   the invitation
 *
 * A section that opens a ground carries the full rhythm (`sectionPad`); one
 * that continues it carries only the tail (`sectionPadBottom`), which is what
 * makes the ground changes read as chapter marks rather than arbitrary
 * switches. Move a section and its padding moves with it.
 *
 * WHAT IS DELIBERATELY NOT ON THIS PAGE. No fee, anywhere: the academy quotes
 * privately and `courses.test.ts` enforces it. No testimonial until a student
 * has consented to one in writing, which is why `Testimonial` renders nothing
 * today and sits directly under the results for the day it does: the proof a
 * reader can see, then the person who can confirm it. No masterclass and no
 * private training in the ladder, because the academy has not confirmed either
 * exists; both are built and switched off in `lib/pathway.ts`.
 *
 * Everything operational still lives one click away: the shared conditions and
 * the six course pages on /courses, the booking channels on /contact, the full
 * question list on /faq, the values and the business curriculum on /about.
 */
const homeFaq = [
  "beginners",
  "students",
  "includes",
  "kit",
  "certificate",
  "booking",
] as const;

/**
 * The practical frame: where, in what language, what you leave with, how it is
 * paid for. Label key and value key, both quoted from the academy's own course
 * information, all four already translated for /courses.
 *
 * It sits under the questions because that is where a visitor is deciding
 * rather than browsing, and it answers the four things she cannot find out by
 * reading further: the academy teaches across Italy, the teaching is in
 * Italian, the certificate is issued, and the payment is not necessarily one
 * transfer.
 *
 * The fee is not here and does not belong here. It is quoted privately, which
 * `catalog.privateNote` says on /courses; a row saying "on request" would only
 * take up space to say nothing.
 */
const practical = [
  ["catalog.details.location.label", "catalog.details.location.value"],
  ["catalog.details.language.label", "catalog.details.language.value"],
  ["catalog.details.certificate.label", "catalog.details.certificate.value"],
  ["catalog.paymentsLabel", "catalog.payments"],
] as const;

/**
 * What happens after you write, in the order it happens (`journey.*`).
 *
 * The page spent ten acts earning the enquiry and would otherwise ask for it
 * without ever saying what an enquiry leads to. That is the last thing standing
 * between a convinced reader and the button: not whether the training is good,
 * but what she is agreeing to by getting in touch, and whether a deposit is
 * going to be asked for before anyone has spoken to her.
 *
 * Set as a numbered strip across the field rather than as stacked rows: the
 * claims above are stacked rows, and the difference in shape is what stops the
 * two reading as one long list. Step one carries the WhatsApp action, because
 * step one is the one that names it.
 */
const journeySteps = [
  "contact",
  "deposit",
  "training",
  "certificate",
  "support",
] as const;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  // Null while no number is on file, which is what hides both CTAs.
  const whatsappHref = whatsappLinkWith(t("contact.whatsappMessage"));

  /**
   * The before/after pairs act 03 opens with, which is the strongest evidence on
   * the site and now the first evidence a scrolling reader meets.
   *
   * It is every aligned pair the academy has actually supplied, not just the one
   * `lib/studio` keeps on file. Two more are sitting in `lib/service-gallery`
   * marked ready, filed under microblading, and shown on that course page; there
   * is no reason the homepage should show one comparison when three exist. All
   * three are mapped onto the same 900x620 canvas by `scripts/align-pair.swift`,
   * so the eyes sit on the same pixels in both frames of a pair and at the same
   * place in every pair on the page. `courses.test.ts` checks the canvas.
   *
   * LABELS ARE TRANSLATED, AND THEY CLAIM ONLY WHAT THE DATA KNOWS. The label is
   * read out in the alt text of both frames, so an English string would have read
   * "Brow artistry, Dopo" to an Italian visitor. The gallery pairs are filed
   * under a course, so they can carry that course's own name; the pair in
   * `lib/studio` is not attributed to a technique anywhere, so it takes the
   * family name - the brows - which is what the photograph shows and not a guess
   * about how it was done.
   */
  // Every aligned pair, the unattributed one first: it is the pair the academy
  // put on file and the one act 03 leads with.
  const pairs = [
    ...beforeAfterPairs.map((pair) => ({
      ...pair,
      label: t("catalog.families.brows.title"),
    })),
    ...(serviceGallery.microblading ?? [])
      .filter((pair) => pair.ready)
      .map((pair) => ({
        before: beforeSrc(pair.id),
        after: afterSrc(pair.id),
        label: t("catalog.courses.microblading"),
      })),
  ];

  return (
    <>
      {/* Only the six questions this page actually shows. The other four are
          marked up on /faq, where they are visible. */}
      <JsonLd
        data={faqSchema(
          homeFaq.map((k) => ({
            q: t(`faq.items.${k}.q`),
            a: t(`faq.items.${k}.a`),
          })),
        )}
      />

      <Hero />
      <Manifesto />

      <AuthorityStrip />

      {/* 01 (CONTINUED) THE ARTIST
          The act the rest of the page is evidence for. It continues the ivory
          block the statement opens, so it carries no rhythm of its own and lives
          on the statement's tail: the founder is the second half of the opening
          argument, not a new chapter.

          It is a component rather than markup here, and the whole of it changed.
          The old shape was a portrait under `Parallax` with a copy plate
          crossing its edge, which could not carry a scroll sequence: `Parallax`
          measures the element it is on, and the moment that element is pinned
          its own rect stops moving and the drift dies exactly where the
          composition should be at its most alive. `Artist` takes one scroll
          reading on the section and strikes every layer from it, which is a
          client concern and cannot live in this file at all.

          Her photograph there is the academy's current official portrait and is
          deliberately still not the hero's, which is the classroom footage. It
          is also deliberately not `founderMedia`: that frame is unchanged and is
          what the six programme pages carry, so a homepage edit does not print
          itself across the catalogue. The reasoning for both is in `lib/media`. */}
      {/* The seven strings the act needs, read here rather than in the
          component: `Artist` is a client component and the namespaces it draws
          on, `about` above all, are far too large to add to CLIENT_NAMESPACES
          for one section. The reasoning is at the component. */}
      <Artist
        copy={{
          label: t("sections.amira"),
          statementA: t("instructor.statementA"),
          statementB: t("instructor.statementB"),
          bio: t("instructor.bio"),
          name: t("instructor.title"),
          credit: t("instructor.credit"),
          readStory: t("about.readStory"),
          portrait: t("instructor.portrait"),
        }}
      />

      {/* THE STROKE. The page's one signature moment, and it is the overture to
          the method rather than an act of its own.

          It sits here, between the room and the method, because the method act
          is the four stages in words and this is the thing those stages are for
          shown once, at size, without a claim attached. Ivory, like the method
          under it, so the two read as one movement and the page gains a moment
          rather than a section: the drawing resolves, the photograph replaces
          it, and the next thing on the screen is the name of the method that
          produced it.

          The copy is the shorter half of the split, four columns against seven,
          because the figure is the argument here and the paragraph is its
          footnote. */}
      <section className={`${sectionPadBottom} bg-ivory`}>
        <div className={shell}>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-4">
              <MaskReveal>
                <p className={eyebrow}>{t("stroke.eyebrow")}</p>
              </MaskReveal>
              <MaskReveal delay={stagger.base} className="mt-8">
                <h2 className={`${displayLarge} max-w-[14ch]`}>
                  {t("stroke.title")}
                </h2>
              </MaskReveal>
              <Reveal delay={stagger.line}>
                <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-mute">
                  {t("stroke.body")}
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <StrokeReveal alt={t("stroke.alt")} caption={t("stroke.caption")} />
            </div>
          </div>
        </div>
      </section>

      {/* 02 THE METHOD
          The one act on the page that names something. The academy already
          taught in four stages and always has; what it did not have was a name
          for them, and an unnamed sequence of four steps reads as a description
          of any course rather than as this school's own system.

          `method.name` is that name, set as the largest thing in the act, with
          the academy's own heading under it as the explanation. Nothing about
          what is taught changed and no fifth stage was invented to make the
          method sound bigger: the four are what the academy states, in the order
          it states them, and `method.lede` says why the order is the method. A
          seven-stage framework was on the table and would have meant writing
          three stages nobody has confirmed are taught. */}
      <section id="method" className={`${sectionPadBottom} scroll-mt-20 bg-ivory`}>
        <div className={shell}>
          {/* The measure belongs on the heading, not on the block around it.
              `ch` is the width of the font's own "0", so it is resolved against
              the element that carries it: on a wrapper inheriting the 16px body
              face, 20ch is about 180px, and the section heading and its eyebrow
              would both be folded into a 180px column. On the h2 the same 20ch
              is 20 characters of Cormorant at display size, which is what was
              meant. Every act on this page measures its heading this way. */}
          <div className="grid gap-8 pb-8 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pb-4">
            <div className="lg:col-span-7">
              <MaskReveal>
                <SectionLabel n={2}>{t("method.eyebrow")}</SectionLabel>
              </MaskReveal>
              {/* The name, then the claim. Two lines of display type a beat
                  apart: the proprietary mark at section size and the academy's
                  own sentence under it at the pull-quote weight, which is the
                  step down that stops them reading as two competing headings. */}
              <MaskReveal delay={stagger.base} className="mt-8">
                <h2 className={`${displaySection} max-w-[16ch]`}>
                  {t("method.name")}
                </h2>
              </MaskReveal>
              {/* mt-9, not mt-6. Two blocks of Cormorant stacked, one at
                  section size and one at pull-quote size, and 24px between them
                  put the descenders of "Method" a few pixels off the caps of
                  "Technique": the pair read as one heading that had changed size
                  halfway through rather than as a name and the claim under it.
                  36px is the interval at which the step down does the work it is
                  there to do. */}
              <MaskReveal delay={stagger.base + stagger.line} className="mt-9">
                <p className={`${displayLarge} max-w-[20ch] text-mute`}>
                  {t("method.title")}
                </p>
              </MaskReveal>
            </div>
            <Reveal
              delay={stagger.line}
              className="lg:col-span-4 lg:col-start-9 lg:pb-3"
            >
              <p className="max-w-[48ch] text-[16px] leading-relaxed text-mute">
                {t("method.lede")}
              </p>
            </Reveal>
          </div>
          <MethodStory />

          {/* WHERE YOU ENTER, folded into the method rather than set beside it.
              It was act 04, with its own number, its own heading at section
              size and its own standfirst, and all it said was that the four
              stages above are taught at two levels. That is the closing clause
              of the method, not a chapter of its own, and as a chapter it made
              the page repeat "for every technique and both levels" three times
              in four screens.

              So it keeps its content and loses its furniture: the label drops
              to a plain eyebrow, the heading to the pull-quote size that steps
              down from `method.name` above it, and a hairline replaces the
              section break. `Pathway` itself is untouched and still renders
              only the levels the academy has confirmed.

              `id="path"` moves here with it. The mobile menu links to /#path
              and must still land on the levels. */}
          <div
            id="path"
            className="mt-20 scroll-mt-20 border-t border-hair pt-12 md:mt-28 md:pt-16"
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
              <div className="lg:col-span-6">
                <MaskReveal>
                  <p className="label text-bronze-ink">
                    {t("sections.pathway")}
                  </p>
                </MaskReveal>
                <MaskReveal delay={stagger.base} className="mt-6">
                  <h3 className={`${displayLarge} max-w-[18ch]`}>
                    {t("pathway.title")}
                  </h3>
                </MaskReveal>
              </div>
              <Reveal
                delay={stagger.line}
                className="lg:col-span-5 lg:col-start-8 lg:pb-2"
              >
                <p className="max-w-[48ch] text-[16px] leading-relaxed text-mute">
                  {t("pathway.sub")}
                </p>
              </Reveal>
            </div>
            <Pathway />
          </div>
        </div>
      </section>

      {/* 03 THE PROGRAMMES
          The catalogue, and it has moved up two acts. It used to arrive after
          the results and the room, on the reasoning that a reader should be
          convinced before she is asked to choose. That was right when the act
          before it was a photograph; it is wrong now the act before it is the
          ladder, because a reader who has just been told there are two levels
          has one question, and it is "of what".

          The panel row is full bleed by design and sits outside the shell; only
          the heading keeps the page gutter. This act opens the ivory block, so
          it carries the full rhythm. */}
      <section
        id="courses"
        className={`${sectionPadBottom} scroll-mt-20 bg-ivory`}
      >
        <div className={`${shell} pb-12 md:pb-16`}>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-6">
              <MaskReveal>
                <SectionLabel n={3}>{t("sections.courses")}</SectionLabel>
              </MaskReveal>
              <MaskReveal delay={stagger.base} className="mt-8">
                <h2 className={`${displaySection} max-w-[16ch]`}>
                  {t("catalog.selectorTitle")}
                </h2>
              </MaskReveal>
            </div>
            <Reveal
              delay={stagger.line}
              className="lg:col-span-5 lg:col-start-8 lg:pb-3"
            >
              <p className="max-w-[48ch] text-[17px] leading-relaxed text-mute">
                {t("programs.sub")}
              </p>
            </Reveal>
          </div>
        </div>
        <CourseSelector />
      </section>

      {/* 04 THE WORK
          What the method produces. It is the only place on the homepage that
          shows an outcome rather than a process: the gallery further down is
          the room, not the result.

          The composition, the crops and which frames open larger are all data in
          lib/media.ts; WorkGallery only arranges them. No result is graded,
          filtered, retouched or generated, one of the files is rotated
          upright and nothing else, and no frame is ever set wider than the file
          behind it, which is what keeps the small close-ups sharp.

          WHAT THE COPY MAY CLAIM. Both `work.title` and `work.sub` are scoped to
          the results, never to the page: the hero portrait is a graded master,
          which lib/media.ts says plainly, and an absolute authenticity claim
          that is false about one photograph is worth less than no claim at all.
          `courses.test.ts` enforces the scope. Word any future edit the same
          way. */}
      <section id="work" className={`${sectionPad} scroll-mt-20 bg-paper`}>
        <div className={shell}>
          <div className="grid gap-8 pb-12 md:pb-16 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-6">
              <MaskReveal>
                <SectionLabel n={4}>{t("sections.work")}</SectionLabel>
              </MaskReveal>
              <MaskReveal delay={stagger.base} className="mt-8">
                <h2 className={`${displaySection} max-w-[14ch]`}>
                  {t("work.title")}
                </h2>
              </MaskReveal>
            </div>
            <Reveal
              delay={stagger.line}
              className="lg:col-span-5 lg:col-start-8 lg:pb-3"
            >
              <p className="max-w-[48ch] text-[17px] leading-relaxed text-mute">
                {t("work.sub")}
              </p>
            </Reveal>
          </div>

          {/* THE PROOF, AT THE SIZE OF THE CLAIM.
              The academy has supplied exactly one aligned before/after pair, and
              it is the only outcome on the site a visitor can operate rather
              than look at: she drags the handle and does the comparison herself,
              which is a different kind of evidence from a photograph she is
              asked to believe. It leads the act, on the axis, and the gallery of
              finished work follows it: the transformation, then the range.

              ONE PAIR OR SEVERAL, AND THE LAYOUT FOLLOWS. A single pair is held
              to 900px on the axis, which is the width of the aligned frames:
              wider would be an upscale of the one image on the page that has to
              survive close reading. From two, they take the full field in a
              two-column set from lg. Below lg they stack full width, where a
              phone gives each of them more pixels than the desktop set does.

              Every pair is mapped onto the same canvas by
              `scripts/align-pair.swift`, so the eyes sit on the same pixels in
              both of its frames and at the same place in every pair on the page.

              Renders only while a pair exists. */}
          {pairs.length > 0 ? (
            <ul className="grid gap-y-12 pb-16 md:pb-24 lg:grid-cols-2 lg:gap-x-10">
              {pairs.map((pair, i) => (
                /* The pairs arrive one after the other rather than together.
                   `stagger.line` between them is the interval the headlines on
                   this site are set to, so a second frame reads as the next line
                   of the same sentence and not as a grid loading.

                   THE FIRST PAIR LEADS, THE REST SUPPORT. One comparison held
                   to 900px on the axis is the width of the aligned frames, and
                   wider would be an upscale of the images on this page that
                   have to survive close reading. The pairs after it take half
                   the field each, which is still 460px of a 900px file and
                   still sharp. With one pair on file this collapses to exactly
                   what it was: a single frame, centred, at its own width. */
                <Reveal
                  as="li"
                  key={pair.after}
                  delay={i * stagger.line}
                  className={
                    i === 0
                      ? "lg:col-span-2 lg:mx-auto lg:w-full lg:max-w-[900px]"
                      : undefined
                  }
                >
                  <BeforeAfter
                    pair={pair}
                    sizes={
                      i === 0
                        ? "(max-width: 900px) 100vw, 900px"
                        : "(max-width: 1024px) 100vw, 46vw"
                    }
                  />
                </Reveal>
              ))}
            </ul>
          ) : null}

          <WorkGallery />
        </div>
      </section>

      {/* 05 THE ROOM
          What it is like to be taught here, which the page showed and never
          said. It was "Inside Aura": three photographs of the lesson, the
          mapping and the demonstration, under a heading, with nothing claimed.
          The photographs are unchanged and four claims now sit under them
          (`LearningExperience`), because three pictures with no claim is a mood
          board and four claims with no picture is a brochure.

          The heading is the one the brief asked for and the one the section has
          always been about: you learn by doing, and you improve because someone
          corrects you while you do it. That second half is the reason the class
          is capped at three or four, which is the academy's own oldest claim.

          Opens the second ivory block, so it carries the full rhythm. */}
      <section
        id="gallery"
        className={`${sectionPadBottom} scroll-mt-20 bg-paper`}
      >
        <div className={shell}>
          <div className="grid gap-8 pb-12 md:pb-16 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-6">
              <MaskReveal>
                <SectionLabel n={5}>{t("sections.experience")}</SectionLabel>
              </MaskReveal>
              <MaskReveal delay={stagger.base} className="mt-8">
                <h2 className={`${displaySection} max-w-[16ch]`}>
                  {t("experience.title")}
                </h2>
              </MaskReveal>
            </div>
            <Reveal
              delay={stagger.line}
              className="lg:col-span-5 lg:col-start-8 lg:pb-3"
            >
              <p className="max-w-[48ch] text-[17px] leading-relaxed text-mute">
                {t("experience.sub")}
              </p>
            </Reveal>
          </div>
          <FrameGallery />
          <LearningExperience />
        </div>
      </section>

      {/* Renders only once real, consented student quotes exist. When they do,
          they land here, directly under the claims: the claim, then the person
          who can confirm it.

          WHAT THEY MUST SAY WHEN THEY ARRIVE. Not "Amira is wonderful". The
          brief for this section is specific and it is right: a testimonial earns
          its place by naming a transformation a reader can measure herself
          against. The first client she completed alone, the procedure she could
          not do before the course and can now, the technique that stopped being
          inconsistent, the point at which the work started paying. The shape is
          in `Testimonial.tsx` and the consent rule is in the README. */}
      <Testimonial />

      {/* 06 THE PATH, AND WHAT IT LEAVES YOU WITH
          Two blocks under one number: the five steps from the first message to
          the certificate, then the short list of what every course carries. On
          paper with the questions below it, so the practical half of the page
          reads as one chapter: what happens, what you get, what is still
          unclear, then the invitation. One hairline over the set and none
          between the steps, because a rule between each would make five boxes
          out of a sequence.

          "COSA PORTI CON TE" USED TO BE AN ACT OF ITS OWN, three screens above
          this one and with its own number, its own section heading and its own
          standfirst. It is folded in here for the same reason the ladder is
          folded into the method: what a course includes is the closing clause
          of "what happens if you book", not a chapter beside it, and as a
          chapter it made the page state the class size, the live model, the
          correction and the after-course support twice each within four
          screens. It keeps its content and loses its furniture: the label drops
          to a plain eyebrow, the heading to the pull-quote size, and a hairline
          replaces the section break. `id="included"` moves here with it. */}
      <section id="booking" className={`${sectionPadBottom} scroll-mt-20 bg-paper`}>
        <div className={shell}>
          <MaskReveal>
            <SectionLabel n={6}>{t("journey.eyebrow")}</SectionLabel>
          </MaskReveal>
          <MaskReveal delay={stagger.base} className="mt-8">
            <h2 className={`${displaySection} max-w-[22ch]`}>
              {t("journey.title")}
            </h2>
          </MaskReveal>

          <Reveal delay={0.06}>
            <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-mute">
              {t("journey.sub")}
            </p>
          </Reveal>

          <ol className="mt-12 grid gap-x-8 gap-y-10 border-t border-hair pt-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-5 lg:gap-x-10">
            {journeySteps.map((k, i) => (
              <Reveal as="li" key={k} delay={i * 0.05}>
                <span className="label font-mono text-bronze-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`${displayRow} mt-4`}>
                  {t(`journey.steps.${k}.title`)}
                </h3>
                <p className={`mt-3 ${bodySmall} text-mute`}>
                  {t(`journey.steps.${k}.body`)}
                </p>

                {/* Step one names WhatsApp, so step one carries it. A reader who
                    is ready at this point should not have to scroll to the
                    bottom to act on the sentence she has just read. Renders only
                    while the academy has a number on file. */}
                {k === "contact" && whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className={`${linkRule} mt-5`}
                  >
                    <WhatsappLogo size={15} weight="light" />
                    {t("contact.whatsapp")}
                  </a>
                ) : null}
              </Reveal>
            ))}
          </ol>

          {/* WHAT EVERY COURSE CARRIES, and only what has not already been
              said. The list ran to six rows and four of them were repeats: the
              live model is act 02's fourth stage, the correction is act 05's
              third claim, and both were stated a third time in the shared
              conditions under the questions. `StudentReceives` now prints the
              four that are only stated here. No string was deleted for it; the
              keys stay in all four catalogues for /courses, which is what
              `courses.test.ts` checks. */}
          <div
            id="included"
            className="mt-20 scroll-mt-20 border-t border-hair pt-12 md:mt-28 md:pt-16"
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
              <div className="lg:col-span-6">
                <MaskReveal>
                  <p className="label text-bronze-ink">{t("sections.receive")}</p>
                </MaskReveal>
                <MaskReveal delay={stagger.base} className="mt-6">
                  <h3 className={`${displayLarge} max-w-[18ch]`}>
                    {t("receive.title")}
                  </h3>
                </MaskReveal>
              </div>
              <Reveal
                delay={stagger.line}
                className="lg:col-span-5 lg:col-start-8 lg:pb-2"
              >
                <p className="max-w-[48ch] text-[16px] leading-relaxed text-mute">
                  {t("receive.sub")}
                </p>
              </Reveal>
            </div>
            <StudentReceives />
          </div>
        </div>
      </section>

      {/* 07 THE QUESTIONS
          Numbered, like every other act. `nav.faq` is the word the header
          already uses for it, in all four languages. */}
      <section id="faq" className={`${sectionPadBottom} scroll-mt-20 bg-paper`}>
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-4">
            <MaskReveal>
              <SectionLabel n={7}>{t("nav.faq")}</SectionLabel>
            </MaskReveal>
            <MaskReveal delay={stagger.base} className="mt-8">
              <h2 className={`${displaySection} max-w-[10ch]`}>
                {t("faq.title")}
              </h2>
            </MaskReveal>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={homeFaq} />
            <Link href="/faq" className={`${linkRule} mt-10`}>
              {t("faq.viewAll")}
              <ArrowRight
                size={14}
                weight="light"
                className={`flip-x ${arrow}`}
              />
            </Link>
          </div>

          {/* Four facts across the full width, under the questions and directly
              above the invitation. Two columns on a phone, four from md, one
              hairline over the set and none between: a border around each cell
              would make four boxes out of what is one row of small print. */}
          <Reveal delay={0.08} className="lg:col-span-12">
            <p className="label text-bronze-ink">{t("catalog.detailsTitle")}</p>
            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-hair pt-8 md:grid-cols-4 md:gap-x-12 md:pt-10">
              {practical.map(([labelKey, valueKey]) => (
                <div key={labelKey}>
                  <dt className="label text-mute">{t(labelKey)}</dt>
                  <dd className="mt-3 text-[16px] leading-relaxed text-espresso">
                    {t(valueKey)}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Closing frame. The one section on the page set against a photograph
          rather than a ground, and the only one that asks twice. */}
      <section className="relative flex h-[92svh] min-h-[32rem] items-end overflow-hidden bg-night">
        <MediaFrame media={closingMedia} sizes="100vw" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/25"
        />
        <div className={`${shell} relative pb-20 text-ivory md:pb-28`}>
          <Reveal>
            <MaskReveal>
              <h2 className={`${displaySection} max-w-[18ch] text-balance`}>
                {t("closing.title")}
              </h2>
            </MaskReveal>
            <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-ivory/80">
              {t("closing.sub")}
            </p>
            {/* Two ways to start the same conversation. No catalogue link: at
                the foot of the page, after the whole catalogue and the five
                steps, sending a decided reader back to browse is the one thing
                this frame should not do.

                THE BOOKING IS THE SOLID ONE, AND IT USED TO BE WHATSAPP. Every
                other closing frame on the site — the course pages', /about's —
                sets the consultation as the primary and the channel beside it
                as the secondary, and this one had them the other way round, so
                the single most decided reader on the site met a different
                hierarchy here than on the six pages that lead to it. The
                strongest ask is also the one that survives a reader with no
                WhatsApp on the device she is holding.

                The WhatsApp action appears only while a number is on file, and
                the booking is never conditional, so this frame always offers at
                least one way through. */}
            <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
              <Link href="/contact" className={btnSolidLight}>
                {t("cta.consultation")}
              </Link>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className={btnLineLight}
                >
                  <WhatsappLogo size={17} weight="light" />
                  {t("contact.whatsapp")}
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
