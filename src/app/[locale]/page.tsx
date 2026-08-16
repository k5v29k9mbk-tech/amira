import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { altLanguages } from "@/i18n/routing";
import { closingMedia, founderMedia } from "@/lib/media";
import { beforeAfterPairs, whatsappLinkWith } from "@/lib/studio";
import {
  arrow,
  btnLineLight,
  btnSolidLight,
  displayLarge,
  displayRow,
  displaySection,
  linkRule,
  sectionPad,
  sectionPadBottom,
  shell,
} from "@/lib/ui";
import { stagger } from "@/lib/motion";
import { JsonLd, faqSchema } from "@/lib/seo";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { CourseSelector } from "@/components/CourseSelector";
import { MethodStory } from "@/components/MethodStory";
import { WorkGallery } from "@/components/WorkGallery";
import { BeforeAfter } from "@/components/BeforeAfter";
import { FrameGallery } from "@/components/FrameGallery";
import { Testimonial } from "@/components/Testimonial";
import { Faq } from "@/components/Faq";
import { MediaFrame } from "@/components/MediaFrame";
import { Parallax } from "@/components/Parallax";
import { MaskReveal } from "@/components/MaskReveal";
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
 * The homepage is eight acts and a closing frame, in this order: the hero, the
 * statement, the founder, the method, the work, the studio, the catalogue, the
 * three claims, the voices, how to book, six questions, and the invitation.
 *
 * ORDER. The page is arranged as the argument a visitor actually needs, which is
 * a person before a product:
 *
 *   Amira -> the method -> the results -> the room -> the courses -> booking
 *
 * The founder used to be act 04, after the catalogue, the method and the work.
 * That is late enough that a reader met the school first and the master
 * afterwards, as though she were a member of staff the page got round to
 * introducing; and it left the first thing after the statement as a row of six
 * courses, which is a decision asked for before any reason to trust it had been
 * given. She is now the first act. Everything after her is evidence for her: how
 * she teaches, what it produces, where it happens, and only then what you can
 * book. The catalogue has not been demoted, it has been given the four acts of
 * argument it used to sit in front of, and the hero's primary action still goes
 * straight to it for anyone who arrived already decided.
 *
 * Everything operational lives one click away rather than here: the shared
 * course conditions on /courses, the booking sequence and the channels on
 * /contact, the full question list on /faq, the values, the business curriculum
 * and the welcome message on /about. The before/after is the one thing that is
 * now in both places: it is the only outcome the academy has supplied that a
 * visitor can operate rather than look at, and someone who never reaches
 * /courses should still see it. Here it is set among the other results rather
 * than alone, which is the whole of the work section.
 *
 * The two grounds are paced in pairs rather than alternated. Alternating on
 * every section makes eight switches on the way down the page, and a ground
 * that changes that often stops reading as a change at all. Paired, each switch
 * marks a turn in the argument:
 *
 *   ivory   hero, statement, Amira         what this is, and who teaches it
 *   paper   the method, the work           how it is taught, what it produces
 *   ivory   the studio, the catalogue      where it happens, and what to book
 *   night   the three claims               the one thing said about ourselves
 *   paper   how to book, the questions     what happens if you write
 *   night   the invitation
 *
 * Two consequences worth knowing before moving a section. The founder's copy
 * plate is painted with the section's own ground so it can cross the edge of
 * the portrait: it is ivory because her act is in the ivory block, and it has to
 * move with her. And a section that opens a ground carries the full rhythm
 * (`sectionPad`) while one that continues it carries only the tail
 * (`sectionPadBottom`), which is what makes the ground changes read as chapter
 * marks rather than as arbitrary switches.
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
 * The three claims, in the academy's own words (`about.different.*`).
 *
 * This is the page's proof section, and it is deliberately not a testimonial:
 * the academy has supplied no consented student quotes, and until it does, the
 * honest form of proof is a claim a visitor can go and check. Each of these is
 * checkable. She trained in a working institute; the class cap is 3-4 and is
 * stated on every course; the support after the course is written into the
 * booking sequence on /contact.
 *
 * The copy is the same copy /about carries, translated once and read twice. It
 * belongs on both: /about argues it at length to someone already interested,
 * the homepage states it to someone deciding whether to be.
 */
const differences = ["experience", "small", "support"] as const;

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
 * The location is the reach, not a street. The academy trains throughout the
 * country, which is what a student wants to know before she reads further; the
 * venue for her own course is settled in the conversation that follows. The
 * registered address is still on /contact and in the schema.org payload, where
 * it belongs, and it is untouched here.
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
 * The page spent eight acts earning the enquiry and then asked for it without
 * ever saying what an enquiry leads to. That is the last thing standing between
 * a convinced reader and the button: not whether the training is good, but what
 * she is agreeing to by getting in touch, and whether a deposit is going to be
 * asked for before anyone has spoken to her.
 *
 * Five steps answers it, and the academy had already written them. They render
 * on /contact, which is a page you reach by having already decided.
 *
 * Set as a numbered strip across the field rather than as stacked rows: the
 * claims above are stacked rows, and the difference in shape is what stops the
 * two reading as one long list. It is also what a sequence looks like. Step one
 * carries the WhatsApp action, because step one is the one that names it.
 */
const journeySteps = ["contact", "deposit", "training", "certificate", "support"] as const;

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

  return (
    <>
      {/* Only the six questions this page actually shows. The other four are
          marked up on /faq, where they are visible. */}
      <JsonLd
        data={faqSchema(
          homeFaq.map((k) => ({ q: t(`faq.items.${k}.q`), a: t(`faq.items.${k}.a`) })),
        )}
      />

      <Hero />

      <Manifesto />

      {/* 01 AMIRA
          The first act, and the reason the rest of the page is worth reading.
          It continues the ivory block the hero and the statement are set on, so
          it opens with no rhythm of its own and lives on the statement's tail:
          the founder is the second half of the opening, not a new chapter.

          Her portrait here is deliberately not the hero's. The hero has her in
          the institute, camel blazer, the treatment room behind her; this is
          the studio frame against a seamless sweep, black blazer, the brow
          calipers held at the collar. Same person, two registers: the founder
          in her rooms, then the founder against nothing at all. */}
      <section id="amira" className={`${sectionPadBottom} scroll-mt-20 bg-ivory`}>
        <div className={`${shell} grid items-center gap-10 lg:grid-cols-12 lg:gap-0`}>
          <Parallax distance={12} className="lg:col-span-8">
            <div className="relative aspect-[4/5] w-full">
              <MediaFrame
                media={{ ...founderMedia, alt: t("about.portrait") }}
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
          </Parallax>

          {/* The copy plate crosses the edge of the portrait rather than
              sitting beside it. Same ground as the page, no border, no card.

              `lg:relative lg:z-10` is what makes the crossing work, and without
              it the section is broken rather than merely flat: the portrait was
              painting over the plate, so at lg the first 80px of every line in
              this column, including the heading, was hidden behind the
              photograph. The cause is not obvious from the markup. Parallax puts
              a transform on the portrait, a transform makes a stacking context,
              and a stacking context is painted in a later step of the algorithm
              than a plain in-flow sibling's background and text: DOM order stops
              deciding, so the earlier element wins. Positioning the plate puts it
              back in the same step as the portrait, where tree order decides
              again and the later element is on top. Any element that has to cover
              a Parallax needs this. */}
          {/* 8 columns of portrait and 4 of plate, crossing by 112px.
              The row is twelve, so the two spans have to sum to twelve or the
              plate wraps onto a line of its own: the portrait taking a column
              from the copy is exactly the point of the change, and the crossing
              is what keeps the plate from reading as a caption beside it. */}
          <Reveal className="lg:relative lg:z-10 lg:col-span-4 lg:-ms-28 lg:bg-ivory lg:py-16 lg:ps-16">
            <MaskReveal>
              <SectionLabel n={1}>{t("sections.amira")}</SectionLabel>
            </MaskReveal>
            <MaskReveal delay={stagger.base} className="mt-8">
              <h2 className={`${displaySection} max-w-[12ch]`}>
                {t("instructor.headline")}
              </h2>
            </MaskReveal>
            {/* THE ORDER, AND WHY IT IS THIS ONE. The act used to run name,
                role, a four-line paragraph in her own voice, then the mission
                line. So the emotional argument — the reason to want to learn
                from this person — arrived fifth, under a block of prose, in the
                position a reader's eye reaches last.

                It is now a quotation first. One sentence at pull-quote size,
                hers, in quotation marks because it is speech and not a heading:
                a visitor who reads four words of this section reads the four
                that matter. Her name and her titles follow it as the
                attribution, which is what they are, and the paragraph that used
                to open the act now sits under them as the evidence for the
                claim rather than in front of it.

                Nothing here is new copy. The quotation is `about.mission.quote`,
                already on /about in all four languages and already hers; the
                paragraph is `about.story.p3`, exactly where it was. */}
            <blockquote className={`${displayLarge} mt-10 max-w-[24ch] text-balance`}>
              &ldquo;{t("about.mission.quote")}&rdquo;
            </blockquote>

            {/* The attribution. A hairline, then the name at reading size and
                the titles under it in the muted grade: the same construction the
                hero signs itself with, so the two moments on the page that name
                her are recognisably the same mark. */}
            <div className="mt-10 border-t border-hair pt-6">
              <p className="text-[17px] text-espresso">{t("instructor.title")}</p>
              <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-mute">
                {t("instructor.role")}
              </p>
            </div>

            <p className="mt-8 max-w-[44ch] text-[16px] leading-relaxed text-mute">
              {t("about.story.p3")}
            </p>

            <Link href="/about" className={`${linkRule} mt-12`}>
              {t("about.readStory")}
              <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 02 THE METHOD */}
      <section id="method" className={`${sectionPad} scroll-mt-20 bg-paper`}>
        <div className={shell}>
          {/* The measure belongs on the heading, not on the block around it.
              `ch` is the width of the font's own "0", so it is resolved against
              the element that carries it: on this wrapper, which inherits the
              16px body face, 20ch is about 180px, and the section heading and its
              eyebrow were both being folded into a 180px column. That is what set
              "Technique is built in stages." as five lines of one and two words
              with the label above it broken in half, and it is the same mistake
              in three sections. On the h2 the same 20ch is 20 characters of
              Cormorant at display size, which is what was meant. Every other act
              on this page already measures its heading this way. */}
          <div className="pb-8 lg:pb-4">
            <MaskReveal>
              <SectionLabel n={2}>{t("sections.method")}</SectionLabel>
            </MaskReveal>
            <MaskReveal delay={stagger.base} className="mt-8">
              <h2 className={`${displaySection} max-w-[20ch]`}>{t("method.title")}</h2>
            </MaskReveal>
          </div>
          <MethodStory />
        </div>
      </section>

      {/* 03 THE WORK
          The method section above explains how the technique is built; this is
          what it produces. It sits directly after it for that reason, and it is
          the only place on the homepage that shows an outcome rather than a
          process: the gallery further down is the room, not the result.

          This used to be the before/after slider alone, beside a heading, at
          34rem. It is now the section the page has been building towards: seven
          treatment photographs and the pair, set as one composition. The pair
          has not been demoted, it has been given company, and it still carries
          the only outcome a visitor can operate rather than look at.

          The composition, the crops and which frames open larger are all data
          in lib/media.ts; WorkGallery only arranges them. No result is graded,
          filtered, retouched or generated, three of the files are rotated
          upright and nothing else, and no frame is ever set wider than the file
          behind it, which is what keeps the small close-ups sharp.

          WHAT THE COPY MAY CLAIM. `work.title` read "Real work, unretouched."
          and `work.sub` ended "Nothing on this page is retouched, filtered or
          generated." Of the results that is true. Of the page it is not: the
          hero portrait two acts up is a graded master, by a light unsharp pass
          and a four percent lift in colour, which lib/media.ts says plainly. An
          absolute claim that is false about one photograph on the page is worth
          less than no claim at all, and it is the kind of sentence a competitor
          screenshots. Both lines now say what is checkable instead, which is
          that these are the academy's own client photographs. Scope any future
          wording the same way: to the results, never to the page.

          The heading block sits above the composition rather than beside it, and
          splits across the field at lg: the title takes five columns and the
          line under it four, set from column eight. Stacked, the two ran down
          the inline edge in a single narrow measure and the section opened like
          a blog post. Across the field they read as a masthead over the plate,
          which is the register the photographs below are in. */}
      <section id="work" className={`${sectionPadBottom} scroll-mt-20 bg-paper`}>
        <div className={shell}>
          <div className="grid gap-8 pb-12 md:pb-16 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-6">
              <MaskReveal>
                <SectionLabel n={3}>{t("sections.work")}</SectionLabel>
              </MaskReveal>
              <MaskReveal delay={stagger.base} className="mt-8">
                <h2 className={`${displaySection} max-w-[14ch]`}>{t("work.title")}</h2>
              </MaskReveal>
            </div>
            <Reveal delay={stagger.line} className="lg:col-span-5 lg:col-start-8 lg:pb-3">
              <p className="max-w-[48ch] text-[17px] leading-relaxed text-mute">
                {t("work.sub")}
              </p>
            </Reveal>
          </div>

          {/* THE PROOF, AT THE SIZE OF THE CLAIM.
              The academy has supplied exactly one aligned before/after pair,
              and it is the only outcome on the site a visitor can operate
              rather than look at: she drags the handle and does the comparison
              herself, which is a different kind of evidence from a photograph
              she is asked to believe. It was set third among seven frames at
              six columns of twelve — the strongest thing in the section,
              printed at the size of a supporting one.

              It leads the act now, on the axis. The gallery of finished work
              follows it, which is the right order — the transformation, then
              the range.

              ONE PAIR OR SEVERAL, AND THE LAYOUT FOLLOWS. A single pair is held
              to 900px on the axis, which is the width of the aligned frames:
              wider would be an upscale of the one image on the page that has to
              survive close reading. From two, they take the full field in a
              two-column set from lg, because two sliders of half the width are
              more evidence than one of full width, and the comparison a visitor
              makes between two clients is the argument this act exists to make.
              Below lg they stack full width, where a phone gives each of them
              more pixels than the desktop set does anyway.

              Every pair is mapped onto the same canvas by
              `scripts/align-pair.swift`, so the eyes sit on the same pixels in
              both of its frames and at the same place in every pair on the
              page: the wipe reads as one face, and the set reads as one crop
              repeated rather than as photographs of different sizes.

              Renders only while a pair exists. */}
          {beforeAfterPairs.length > 0 ? (
            <ul
              className={`mx-auto grid gap-y-12 pb-16 md:pb-24 ${
                beforeAfterPairs.length > 1
                  ? "w-full gap-x-8 lg:grid-cols-2 lg:gap-x-10"
                  : "w-full max-w-[900px]"
              }`}
            >
              {beforeAfterPairs.map((pair, i) => (
                /* The pairs arrive one after the other rather than together.
                   `stagger.line` between them is the interval the headlines on
                   this site are set to, so a second frame reads as the next
                   line of the same sentence and not as a grid loading. */
                <Reveal as="li" key={pair.after} delay={i * stagger.line}>
                  <BeforeAfter
                    pair={pair}
                    sizes={
                      beforeAfterPairs.length > 1
                        ? "(max-width: 1024px) 100vw, 46vw"
                        : "(max-width: 900px) 100vw, 900px"
                    }
                  />
                </Reveal>
              ))}
            </ul>
          ) : null}

          <WorkGallery />
        </div>
      </section>

      {/* 04 INSIDE AURA
          Opens the second ivory block, so it carries the full rhythm: the work
          above it is the last of the paper pair, and this is a new turn in the
          argument rather than a continuation of it.

          The line that used to sit under the heading listed the three things the
          three photographs are ("the lesson, the mapping drawn by hand, the
          demonstration on the model"). It is now set under the frame each clause
          names, in FrameGallery, where it labels a picture instead of promising
          one. Removing it from here is not a cut: it is the same sentence, moved
          to where the eye already is. */}
      <section id="gallery" className={`${sectionPad} scroll-mt-20 bg-ivory`}>
        <div className={shell}>
          <div className="pb-12 md:pb-16">
            <MaskReveal>
              <SectionLabel n={4}>{t("sections.inside")}</SectionLabel>
            </MaskReveal>
            <MaskReveal delay={stagger.base} className="mt-8">
              <h2 className={`${displaySection} max-w-[14ch]`}>{t("students.title")}</h2>
            </MaskReveal>
          </div>
          <FrameGallery />
        </div>
      </section>

      {/* 05 COURSES
          The catalogue arrives after the master, the method, the results and
          the room, which is the whole of the reordering: a reader reaches this
          row already knowing who teaches, how, to what standard and where, so
          six names are a choice rather than a demand.

          It continues the ivory block the studio opens, so it takes only the
          tail of the rhythm. The panel row is full bleed by design and sits
          outside the shell; only the heading keeps the page gutter. */}
      <section id="courses" className={`${sectionPadBottom} scroll-mt-20 bg-ivory`}>
        <div className={`${shell} pb-12 md:pb-16`}>
          <MaskReveal>
            <SectionLabel n={5}>{t("sections.courses")}</SectionLabel>
          </MaskReveal>
          <MaskReveal delay={stagger.base} className="mt-8">
            <h2 className={`${displaySection} max-w-[16ch]`}>
              {t("catalog.selectorTitle")}
            </h2>
          </MaskReveal>
        </div>
        <CourseSelector />
      </section>

      {/* 06 WHAT MAKES US DIFFERENT
          On the near-black ground, which is the page's weight: the gallery
          above and the questions below are both light, and this is the one
          claim the page makes about itself rather than about the craft. The
          hairlines and the muted text switch to their dark-ground variants;
          nothing else about the row changes from the way /about sets it. */}
      <section id="why" className={`${sectionPad} scroll-mt-20 bg-night text-ivory`}>
        <div className={shell}>
          {/* Measure on the heading. See the note in the method section. */}
          <MaskReveal>
            <SectionLabel n={6} tone="light">
              {t("about.different.eyebrow")}
            </SectionLabel>
          </MaskReveal>
          <MaskReveal delay={stagger.base} className="mt-8">
            <h2 className={`${displaySection} max-w-[22ch]`}>
              {t("about.different.title")}
            </h2>
          </MaskReveal>

          <Reveal delay={0.06}>
            <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-mute-dark">
              {t("about.different.sub")}
            </p>
          </Reveal>

          <ol className="mt-12 border-t border-hair-dark md:mt-16">
            {differences.map((k, i) => (
              <Reveal
                as="li"
                key={k}
                delay={i * 0.06}
                className="grid gap-3 border-b border-hair-dark py-8 md:grid-cols-12 md:gap-10"
              >
                <span className="label font-mono text-bronze-hi md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`${displayRow} md:col-span-4`}>
                  {t(`about.different.items.${k}.title`)}
                </h3>
                <p className="max-w-[52ch] text-[16px] leading-relaxed text-mute-dark md:col-span-6 md:col-start-7">
                  {t(`about.different.items.${k}.body`)}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Renders only once real, consented student quotes exist. When they do,
          they land here, directly under the claims: the claim, then the person
          who can confirm it. */}
      <Testimonial />

      {/* 07 HOW TO BOOK
          On paper with the questions below it, so the practical half of the
          page reads as one chapter: what happens, then what is still unclear,
          then the invitation. One hairline over the set and none between the
          steps, because a rule between each would make five boxes out of a
          sequence. */}
      <section id="booking" className={`${sectionPad} scroll-mt-20 bg-paper`}>
        <div className={shell}>
          {/* Measure on the heading. See the note in the method section. */}
          <MaskReveal>
            <SectionLabel n={7}>{t("journey.eyebrow")}</SectionLabel>
          </MaskReveal>
          <MaskReveal delay={stagger.base} className="mt-8">
            <h2 className={`${displaySection} max-w-[22ch]`}>{t("journey.title")}</h2>
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
                <h3 className={`${displayRow} mt-4`}>{t(`journey.steps.${k}.title`)}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-mute">
                  {t(`journey.steps.${k}.body`)}
                </p>

                {/* Step one names WhatsApp, so step one carries it. A reader
                    who is ready at this point should not have to scroll to the
                    bottom to act on the sentence she has just read. Renders
                    only while the academy has a number on file. */}
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
        </div>
      </section>

      {/* 08 THE QUESTIONS
          Numbered, like every other act. It was the one section on the page
          that arrived without its figure, which made the sequence read 01 to 07
          and then stop counting two thirds of the way down. `nav.faq` is the
          word the header already uses for it, in all four languages. */}
      <section id="faq" className={`${sectionPadBottom} scroll-mt-20 bg-paper`}>
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-4">
            <MaskReveal>
              <SectionLabel n={8}>{t("nav.faq")}</SectionLabel>
            </MaskReveal>
            <MaskReveal delay={stagger.base} className="mt-8">
              <h2 className={`${displaySection} max-w-[10ch]`}>{t("faq.title")}</h2>
            </MaskReveal>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={homeFaq} />
            <Link href="/faq" className={`${linkRule} mt-10`}>
              {t("faq.viewAll")}
              <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
            </Link>
          </div>

          {/* Four facts across the full width, under the questions and directly
              above the invitation. Two columns on a phone, four from md, one
              hairline over the set and none between: a border around each cell
              would make four boxes out of what is one row of small print.
              `catalog.detailsTitle` names it, in the small caps the rest of the
              page uses for a label rather than at the display size /courses
              gives it. */}
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

      {/* Closing frame. */}
      <section className="relative flex h-[92svh] min-h-[32rem] items-end overflow-hidden bg-night">
        <MediaFrame
          media={closingMedia}
          sizes="100vw"
        />
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
            {/* Two ways to start the same conversation, in the order most
                people want them: the message that needs no form, and the form
                for anyone who would rather write at length or not hand over a
                phone number. The catalogue link that used to sit here has gone:
                at the foot of the page, after the whole catalogue and the five
                steps, sending a decided reader back to browse is the one thing
                this frame should not do.

                The WhatsApp action appears only while a number is on file, and
                the form is never conditional, so this frame always offers at
                least one way through. */}
            <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className={btnSolidLight}
                >
                  <WhatsappLogo size={17} weight="light" />
                  {t("contact.whatsapp")}
                </a>
              ) : null}
              <Link
                href="/contact"
                className={whatsappHref ? btnLineLight : btnSolidLight}
              >
                {t("cta.availability")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
