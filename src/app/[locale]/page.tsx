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
import { Signature } from "@/components/Signature";
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
 * The homepage: eleven acts and a closing frame.
 *
 * WHAT THIS PAGE IS NOW ARGUING, which is the whole of the repositioning. The
 * page used to argue that a good PMU artist also teaches. It now argues that a
 * professional education exists here, that it has a named method, a ladder of
 * levels, six programmes on it, evidence of what it produces, and a person who
 * built the whole thing. Those are different arguments and they need different
 * furniture, which is why three acts are new (the standard, the path, what you
 * leave with) and one has been rebuilt (the room).
 *
 * The reading order is the argument:
 *
 *   who she is -> what she can prove -> how she teaches -> where you enter ->
 *   what you can book -> what it produces -> what the room is like ->
 *   what you leave with -> why us -> how to start -> what is unclear
 *
 * ORDER, IN DETAIL. The founder is still the first act after the statement, for
 * the reason the previous arrangement recorded and that has not changed:
 * everything after her is evidence for her. What is different is that the
 * evidence now starts before the statement rather than after it. The four marks
 * the academy can prove used to sit inside the hero; they are act 01 on their
 * own ground, directly under her name, because a claim made on a title card is
 * a slogan and the same claim made in a band beneath it is a credential.
 *
 * The catalogue has moved up. It used to come fifth, after the room; it is now
 * act 05, directly after the ladder that explains what its two levels mean. A
 * reader who has just been told there is a base level and an advanced one
 * should meet the six disciplines on the next screen, not four hundred pixels
 * of photographs later.
 *
 * GROUNDS, PACED IN PAIRS. Alternating on every section makes ten switches on
 * the way down and a ground that changes that often stops reading as a change.
 * Paired, each switch marks a turn:
 *
 *   night   hero, the signature, the standard      whose this is, and what is proven
 *   ivory   the statement, Amira                   what it claims, and who teaches it
 *   paper   the method, the path                   how it is taught, and where you enter
 *   ivory   the programmes                         what you can book
 *   paper   the work                               what it produces
 *   ivory   the room, what you leave with          what it is like, and what it gives
 *   night   the three claims, the voices           the one thing said about ourselves
 *   paper   how to book, the questions             what happens if you write
 *   night   the invitation
 *
 * Two consequences worth knowing before moving a section. The founder's copy
 * plate is painted with the section's own ground so it can cross the edge of
 * the portrait: it is ivory because her act is in the ivory block, and it has
 * to move with her. And a section that opens a ground carries the full rhythm
 * (`sectionPad`) while one that continues it carries only the tail
 * (`sectionPadBottom`), which is what makes the ground changes read as chapter
 * marks rather than as arbitrary switches.
 *
 * WHAT IS DELIBERATELY NOT ON THIS PAGE. No fee, anywhere: the academy quotes
 * privately and `courses.test.ts` enforces it. No testimonial until a student
 * has consented to one in writing, which is why `Testimonial` renders nothing
 * today and sits between the claims and the booking sequence for the day it
 * does. No masterclass and no private training in the ladder, because the
 * academy has not confirmed either exists; both are built and switched off in
 * `lib/pathway.ts`.
 *
 * Everything operational still lives one click away: the shared conditions and
 * the six programme pages on /courses, the booking channels on /contact, the
 * full question list on /faq, the values and the business curriculum on /about.
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
 * This is the page's proof-about-itself section, and it is deliberately not a
 * testimonial: the academy has supplied no consented student quotes, and until
 * it does, the honest form of proof is a claim a visitor can go and check. Each
 * of these is checkable. She trained in a working institute; the class cap is
 * 3-4 and is stated on every course; the support after the course is written
 * into the booking sequence on /contact.
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

      {/* The signature. Her name and the academy's, on the hero's own ground
          with the film stopped: the second half of the title card rather than
          the first section of the page. It carries no act number because the
          acts start at the credentials below it, and this is still the opening.
          The full reasoning is in the component. */}
      <Signature />

      {/* 01 THE STANDARD
          The four marks the academy can prove, on the ground the opening is set
          on. They were inside the hero; a statistics table in a title card is a
          brochure, and the same four figures in a band under her name are a
          credential. The reasoning for the move is in both components. */}
      <AuthorityStrip />

      <Manifesto />

      {/* 02 AMIRA
          The act the rest of the page is evidence for. It continues the ivory
          block the statement opens, so it carries no rhythm of its own and lives
          on the statement's tail: the founder is the second half of the opening
          argument, not a new chapter.

          Her portrait here is deliberately not the hero's. The hero has the
          academy's own classroom footage; this is the studio frame against a
          seamless sweep, black blazer, the brow calipers held at the collar. */}
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
              photograph. Parallax puts a transform on the portrait, a transform
              makes a stacking context, and a stacking context is painted in a
              later step than a plain in-flow sibling's background and text: DOM
              order stops deciding, so the earlier element wins. Positioning the
              plate puts it back in the same step, where tree order decides
              again. Any element that has to cover a Parallax needs this. */}
          <Reveal className="lg:relative lg:z-10 lg:col-span-4 lg:-ms-28 lg:bg-ivory lg:py-16 lg:ps-16">
            <MaskReveal>
              <SectionLabel n={2}>{t("sections.amira")}</SectionLabel>
            </MaskReveal>
            <MaskReveal delay={stagger.base} className="mt-8">
              <h2 className={`${displaySection} max-w-[12ch]`}>
                {t("instructor.headline")}
              </h2>
            </MaskReveal>

            {/* THE ORDER, AND WHY IT IS THIS ONE. A quotation first: one
                sentence at pull-quote size, hers, in quotation marks because it
                is speech and not a heading. A visitor who reads four words of
                this section reads the four that matter. Her name and her titles
                follow it as the attribution, which is what they are, and the
                paragraph sits under them as the evidence for the claim rather
                than in front of it. Nothing here is new copy. */}
            <blockquote className={`${displayLarge} mt-10 max-w-[24ch] text-balance`}>
              &ldquo;{t("about.mission.quote")}&rdquo;
            </blockquote>

            {/* The attribution. A hairline, then the name at reading size and
                the titles under it in the muted grade: the same construction the
                signature uses, so the two moments on the page that name her are
                recognisably the same mark. */}
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

      {/* 03 THE METHOD
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
      <section id="method" className={`${sectionPad} scroll-mt-20 bg-paper`}>
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
                <SectionLabel n={3}>{t("method.eyebrow")}</SectionLabel>
              </MaskReveal>
              {/* The name, then the claim. Two lines of display type a beat
                  apart: the proprietary mark at section size and the academy's
                  own sentence under it at the pull-quote weight, which is the
                  step down that stops them reading as two competing headings. */}
              <MaskReveal delay={stagger.base} className="mt-8">
                <h2 className={`${displaySection} max-w-[16ch]`}>{t("method.name")}</h2>
              </MaskReveal>
              {/* mt-9, not mt-6. Two blocks of Cormorant stacked, one at
                  section size and one at pull-quote size, and 24px between them
                  put the descenders of "Method" a few pixels off the caps of
                  "Technique": the pair read as one heading that had changed size
                  halfway through rather than as a name and the claim under it.
                  36px is the interval at which the step down does the work it is
                  there to do. */}
              <MaskReveal delay={stagger.base + stagger.line} className="mt-9">
                <p className={`${displayLarge} max-w-[20ch] text-mute`}>{t("method.title")}</p>
              </MaskReveal>
            </div>
            <Reveal delay={stagger.line} className="lg:col-span-4 lg:col-start-9 lg:pb-3">
              <p className="max-w-[48ch] text-[16px] leading-relaxed text-mute">
                {t("method.lede")}
              </p>
            </Reveal>
          </div>
          <MethodStory />
        </div>
      </section>

      {/* 04 THE PATH
          Where a student enters, which is the question the catalogue could not
          answer. The academy teaches every discipline at base and advanced
          level and said so once, in the FAQ; drawn as a ladder it becomes the
          thing that turns six courses into an education.

          It continues the paper block the method opens, so it takes only the
          tail: the method is how it is taught and this is where you come in,
          which is one argument in two halves. The rows themselves are
          `Pathway`, which renders only the levels the academy has confirmed. */}
      <section id="path" className={`${sectionPadBottom} scroll-mt-20 bg-paper`}>
        <div className={shell}>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-6">
              <MaskReveal>
                <SectionLabel n={4}>{t("sections.pathway")}</SectionLabel>
              </MaskReveal>
              <MaskReveal delay={stagger.base} className="mt-8">
                <h2 className={`${displaySection} max-w-[18ch]`}>{t("pathway.title")}</h2>
              </MaskReveal>
            </div>
            <Reveal delay={stagger.line} className="lg:col-span-5 lg:col-start-8 lg:pb-3">
              <p className="max-w-[48ch] text-[17px] leading-relaxed text-mute">
                {t("pathway.sub")}
              </p>
            </Reveal>
          </div>
          <Pathway />
        </div>
      </section>

      {/* 05 THE PROGRAMMES
          The catalogue, and it has moved up two acts. It used to arrive after
          the results and the room, on the reasoning that a reader should be
          convinced before she is asked to choose. That was right when the act
          before it was a photograph; it is wrong now the act before it is the
          ladder, because a reader who has just been told there are two levels
          has one question, and it is "of what".

          The panel row is full bleed by design and sits outside the shell; only
          the heading keeps the page gutter. This act opens the ivory block, so
          it carries the full rhythm. */}
      <section id="courses" className={`${sectionPad} scroll-mt-20 bg-ivory`}>
        <div className={`${shell} pb-12 md:pb-16`}>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-6">
              <MaskReveal>
                <SectionLabel n={5}>{t("sections.courses")}</SectionLabel>
              </MaskReveal>
              <MaskReveal delay={stagger.base} className="mt-8">
                <h2 className={`${displaySection} max-w-[16ch]`}>
                  {t("catalog.selectorTitle")}
                </h2>
              </MaskReveal>
            </div>
            <Reveal delay={stagger.line} className="lg:col-span-5 lg:col-start-8 lg:pb-3">
              <p className="max-w-[48ch] text-[17px] leading-relaxed text-mute">
                {t("programs.sub")}
              </p>
            </Reveal>
          </div>
        </div>
        <CourseSelector />
      </section>

      {/* 06 THE WORK
          What the method produces. It is the only place on the homepage that
          shows an outcome rather than a process: the gallery further down is
          the room, not the result.

          The composition, the crops and which frames open larger are all data in
          lib/media.ts; WorkGallery only arranges them. No result is graded,
          filtered, retouched or generated, three of the files are rotated
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
                <SectionLabel n={6}>{t("sections.work")}</SectionLabel>
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
                   this site are set to, so a second frame reads as the next line
                   of the same sentence and not as a grid loading. */
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

      {/* 07 THE ROOM
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
      <section id="gallery" className={`${sectionPad} scroll-mt-20 bg-ivory`}>
        <div className={shell}>
          <div className="grid gap-8 pb-12 md:pb-16 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-6">
              <MaskReveal>
                <SectionLabel n={7}>{t("sections.experience")}</SectionLabel>
              </MaskReveal>
              <MaskReveal delay={stagger.base} className="mt-8">
                <h2 className={`${displaySection} max-w-[16ch]`}>{t("experience.title")}</h2>
              </MaskReveal>
            </div>
            <Reveal delay={stagger.line} className="lg:col-span-5 lg:col-start-8 lg:pb-3">
              <p className="max-w-[48ch] text-[17px] leading-relaxed text-mute">
                {t("experience.sub")}
              </p>
            </Reveal>
          </div>
          <FrameGallery />
          <LearningExperience />
        </div>
      </section>

      {/* 08 WHAT YOU LEAVE WITH
          The value of the thing, stated plainly, and every line of it quoted
          from the academy's own conditions. It continues the ivory block, so it
          takes only the tail: the room and what the room gives you are one
          argument in two halves.

          It sits here rather than beside the catalogue on purpose. Next to six
          course names this list reads as a feature comparison; after the
          photographs of the room and the four claims about how it is taught, the
          same eight lines read as a summary of what has just been shown. */}
      <section id="included" className={`${sectionPadBottom} scroll-mt-20 bg-ivory`}>
        <div className={shell}>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-6">
              <MaskReveal>
                <SectionLabel n={8}>{t("sections.receive")}</SectionLabel>
              </MaskReveal>
              <MaskReveal delay={stagger.base} className="mt-8">
                <h2 className={`${displaySection} max-w-[16ch]`}>{t("receive.title")}</h2>
              </MaskReveal>
            </div>
            <Reveal delay={stagger.line} className="lg:col-span-5 lg:col-start-8 lg:pb-3">
              <p className="max-w-[48ch] text-[17px] leading-relaxed text-mute">
                {t("receive.sub")}
              </p>
            </Reveal>
          </div>
          <StudentReceives />
        </div>
      </section>

      {/* 09 WHAT MAKES US DIFFERENT
          On the near-black ground, which is the page's weight: the section above
          and the questions below are both light, and this is the one claim the
          page makes about itself rather than about the craft. */}
      <section id="difference" className={`${sectionPad} scroll-mt-20 bg-night text-ivory`}>
        <div className={shell}>
          <MaskReveal>
            <SectionLabel n={9} tone="light">
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
          who can confirm it.

          WHAT THEY MUST SAY WHEN THEY ARRIVE. Not "Amira is wonderful". The
          brief for this section is specific and it is right: a testimonial earns
          its place by naming a transformation a reader can measure herself
          against. The first client she completed alone, the procedure she could
          not do before the course and can now, the technique that stopped being
          inconsistent, the point at which the work started paying. The shape is
          in `Testimonial.tsx` and the consent rule is in the README. */}
      <Testimonial />

      {/* 10 HOW TO BOOK
          On paper with the questions below it, so the practical half of the page
          reads as one chapter: what happens, then what is still unclear, then
          the invitation. One hairline over the set and none between the steps,
          because a rule between each would make five boxes out of a sequence. */}
      <section id="booking" className={`${sectionPad} scroll-mt-20 bg-paper`}>
        <div className={shell}>
          <MaskReveal>
            <SectionLabel n={10}>{t("journey.eyebrow")}</SectionLabel>
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
        </div>
      </section>

      {/* 11 THE QUESTIONS
          Numbered, like every other act. `nav.faq` is the word the header
          already uses for it, in all four languages. */}
      <section id="faq" className={`${sectionPadBottom} scroll-mt-20 bg-paper`}>
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-4">
            <MaskReveal>
              <SectionLabel n={11}>{t("nav.faq")}</SectionLabel>
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
            {/* Two ways to start the same conversation, in the order most people
                want them: the message that needs no form, and the form for
                anyone who would rather write at length or not hand over a phone
                number. No catalogue link: at the foot of the page, after the
                whole catalogue and the five steps, sending a decided reader back
                to browse is the one thing this frame should not do.

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
                {t("cta.requestSeat")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
