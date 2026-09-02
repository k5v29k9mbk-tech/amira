import type { Locale } from "@/i18n/routing";

/**
 * The Roma masterclass: one dated event, held away from the academy.
 *
 * WHY THE COPY IS HERE AND NOT IN THE CONTENT SYSTEM. Everything a visitor
 * reads on this site comes out of `lib/content`, because everything on this
 * site is standing copy Amira edits in the admin. This page is not standing
 * copy: it is one intake, on two dates, in a city the academy does not teach
 * in the rest of the year, and it stops being true the moment the dates pass.
 * Putting it in the catalogue would mean adding a namespace and an editing
 * surface for a page that is meant to be deleted, and leaving a form in the
 * admin for an event that no longer exists. So the strings live beside the
 * route, in four languages, and the whole feature is two files plus its
 * photographs.
 *
 * WHEN THIS BECOMES A RECURRING FORMAT — a second city, a second date — move
 * it: give it a `PageId` in `lib/content/pages.ts`, a schema, and the strings
 * to `messages/*.json` like every other page. The shape below is deliberately
 * flat so that move is a transcription rather than a rewrite.
 *
 * NO PRICE, for the same reason `programs.ts` carries none: the academy quotes
 * privately, and a page that invents a figure is a page that has to be argued
 * with later.
 */

export const masterclass = {
  slug: "masterclass-roma",
  /** ISO dates, so the schema payload and the printed line cannot drift. */
  startDate: "2026-09-20",
  endDate: "2026-09-21",
  city: "Roma",
  country: "IT",
  images: {
    portrait: "/masterclass/portrait.jpg",
    beforeAfter: "/masterclass/before-after.jpg",
    certificate: "/masterclass/certificate.jpg",
    training: "/masterclass/training.jpg",
  },
} as const;

type Pillar = { title: string; body: string };

export type MasterclassCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  titleAccent: string;
  when: string;
  where: string;
  lede: string;
  ctaPrimary: string;
  ctaSecondary: string;
  badge: string;
  pillarsLabel: string;
  pillars: [Pillar, Pillar, Pillar, Pillar];
  masterLabel: string;
  masterTitle: string;
  masters: string[];
  altBeforeAfter: string;
  altCertificate: string;
  altTraining: string;
  altPortrait: string;
  teacherLabel: string;
  teacherRole: string;
  quote: string;
  infoLabel: string;
  info: { days: string; daysNote: string; place: string; placeNote: string; seats: string; seatsNote: string };
  closingTitle: string;
  closingBody: string;
  closingCta: string;
};

/**
 * Italian is the source text. The academy teaches in Italian and every enquiry
 * it can serve arrives in Italian; the other three are translations of it
 * rather than four texts written in parallel.
 */
const it: MasterclassCopy = {
  meta: {
    title: "Masterclass di Microblading — Roma, 20–21 settembre",
    description:
      "Due giornate intensive di microblading con Amira Bechini a Roma. Metodo PhiBrows, pratica su modella dal vivo, certificazione ufficiale e supporto guidato dopo il percorso.",
  },
  eyebrow: "PhiBrows · Microblading",
  title: "Masterclass",
  titleAccent: "Microblading",
  when: "20–21 settembre 2026",
  where: "Roma, Italia",
  lede: "Due giornate intensive dedicate alla tecnica, alla pratica su modella dal vivo e allo sviluppo di una presenza professionale più solida e consapevole.",
  ctaPrimary: "Riserva il tuo posto",
  ctaSecondary: "Scopri il programma",
  badge: "2 giornate intensive · pratica su modella dal vivo · guida personale",
  pillarsLabel: "Perché questa Masterclass",
  pillars: [
    {
      title: "Il metodo PhiBrows",
      body: "Un metodo riconosciuto a livello internazionale, fondato su precisione, struttura e standard professionali elevati.",
    },
    {
      title: "Esperienza pratica",
      body: "Formazione hands-on su modelle dal vivo, con supervisione diretta e feedback personalizzato.",
    },
    {
      title: "Certificazione ufficiale",
      body: "Al termine del percorso, riceverai la certificazione prevista dal programma.",
    },
    {
      title: "Supporto continuo",
      body: "Il percorso prosegue anche dopo la masterclass, con supporto guidato in base al kit scelto.",
    },
  ],
  masterLabel: "Programma",
  masterTitle: "Cosa imparerai",
  masters: [
    "Design e simmetria del sopracciglio",
    "Anatomia della pelle",
    "Tecniche di mappatura",
    "Tecnica del pelo",
    "Teoria del colore",
    "Consulenza cliente",
    "Pratica su modella dal vivo",
    "Aftercare e gestione cliente",
    "Presentazione professionale del lavoro",
    "Posizionamento del servizio",
  ],
  altBeforeAfter: "Sopracciglia prima e dopo il microblading",
  altCertificate: "Consegna della certificazione PhiBrows a un\u2019allieva",
  altTraining: "Amira Bechini durante una masterclass",
  altPortrait: "Amira Bechini, Master Educator di trucco semipermanente",
  teacherLabel: "La tua Master Educator",
  teacherRole: "Fondatrice e Master Educator di Aura Academy",
  quote:
    "La mia missione è accompagnare ogni artista verso una maggiore sicurezza professionale attraverso conoscenza, pratica e una guida concreta.",
  infoLabel: "In breve",
  info: {
    days: "20–21 settembre",
    daysNote: "Due giornate piene",
    place: "Roma, Italia",
    placeNote: "La sede esatta viene comunicata alla conferma",
    seats: "Posti limitati",
    seatsNote: "Un gruppo ristretto, per seguire ogni artista personalmente",
  },
  closingTitle: "Il tuo prossimo livello inizia a Roma",
  closingBody:
    "Scrivimi per capire insieme se questa edizione è il passo giusto per il tuo percorso, prima ancora di parlare di iscrizione.",
  closingCta: "Riserva il tuo posto",
};

const en: MasterclassCopy = {
  meta: {
    title: "Microblading Masterclass \u2014 Rome, 20\u201321 September",
    description:
      "Two intensive days of microblading with Amira Bechini in Rome. The PhiBrows method, live-model practice, official certification, and business and positioning guidance.",
  },
  eyebrow: "PhiBrows \u00b7 Microblading",
  title: "Masterclass",
  titleAccent: "Microblading",
  when: "20\u201321 September 2026",
  where: "Rome, Italy",
  lede: "Two intensive days with Master Amira Bechini \u2014 from brow design and live-model practice to the professional skills you need to present, position and confidently offer your services.",
  ctaPrimary: "Reserve your place",
  ctaSecondary: "Discover the program",
  badge: "2 intensive days \u00b7 live-model practice \u00b7 personal guidance",
  pillarsLabel: "Why this masterclass",
  pillars: [
    {
      title: "The PhiBrows method",
      body: "A structured, world-renowned method built around precision, consistency and professional standards.",
    },
    {
      title: "Practical experience",
      body: "Hands-on training with live models and direct personal guidance from Amira.",
    },
    {
      title: "Official certification",
      body: "Receive your official certificate upon successful completion of the training.",
    },
    {
      title: "Ongoing support",
      body: "Continue learning after the masterclass with guided online support.",
    },
  ],
  masterLabel: "Program",
  masterTitle: "What you will master",
  masters: [
    "Brow design & symmetry",
    "Skin anatomy",
    "Mapping techniques",
    "Hair stroke technique",
    "Colour theory",
    "Client consultation",
    "Live model practice",
    "Aftercare & client management",
    "Professional presentation",
    "Service positioning",
  ],
  altBeforeAfter: "Brows before and after microblading",
  altCertificate: "A student receiving her PhiBrows certificate",
  altTraining: "Amira Bechini teaching a masterclass",
  altPortrait: "Amira Bechini, international permanent make-up master",
  teacherLabel: "Your master",
  teacherRole: "Founder & Master Educator of Aura Academy",
  quote:
    "My mission is to help artists build confidence through knowledge, practice and professional guidance.",
  infoLabel: "At a glance",
  info: {
    days: "20\u201321 September",
    daysNote: "Two full days: the foundation, then the practice",
    place: "Rome, Italy",
    placeNote: "The exact address is shared on confirmation",
    seats: "Limited seats",
    seatsNote: "A small group, so every artist is followed personally",
  },
  closingTitle: "Your next level starts in Rome",
  closingBody:
    "Learn the technique, practise it for real, and leave with the confidence to present your work professionally. Write to me and I will tell you whether this edition is the right step for you.",
  closingCta: "Enroll now",
};

const fr: MasterclassCopy = {
  meta: {
    title: "Masterclass Microblading — Rome, 20–21 septembre",
    description:
      "Deux jours intensifs de microblading avec Amira Bechini à Rome. Méthode PhiBrows, pratique sur modèle, certificat officiel et suivi en ligne encadré après la formation.",
  },
  eyebrow: "PhiBrows · Microblading",
  title: "Masterclass",
  titleAccent: "Microblading",
  when: "20–21 septembre 2026",
  where: "Rome, Italie",
  lede: "Deux jours pour amener votre main au niveau où votre œil est déjà.",
  ctaPrimary: "Réservez votre place",
  ctaSecondary: "Voir le programme",
  badge: "2 jours intensifs · pratique sur modèle",
  pillarsLabel: "Pourquoi cette masterclass",
  pillars: [
    {
      title: "Méthode PhiBrows",
      body: "La technique la plus reconnue du métier, enseignée par une master certifiée.",
    },
    {
      title: "Pratique réelle",
      body: "On travaille sur modèle vivant, corrigée main dans la main.",
    },
    {
      title: "Certificat",
      body: "Attestation PhiAcademy à l'issue du parcours.",
    },
    {
      title: "Suivi continu",
      body: "Continuez à apprendre après la masterclass grâce à un suivi en ligne encadré.",
    },
  ],
  masterLabel: "Programme",
  masterTitle: "Ce que vous emportez",
  masters: [
    "Dessin et symétrie du sourcil",
    "Anatomie de la peau",
    "Techniques de mapping",
    "Technique du poil",
    "Théorie de la couleur",
    "Consultation cliente",
    "Pratique sur modèle",
    "Suivi et relation client",
    "Présentation professionnelle",
    "Positionnement du service",
  ],
  altBeforeAfter: "Sourcils avant et après le microblading",
  altCertificate: "Remise du certificat PhiBrows à une élève",
  altTraining: "Amira Bechini pendant une masterclass",
  altPortrait: "Amira Bechini, master internationale en maquillage permanent",
  teacherLabel: "Votre master",
  teacherRole: "Fondatrice et Master Educator d’Aura Academy",
  quote:
    "Mon travail est d'amener celles qui dessinent des sourcils à la confiance : connaissance, pratique et passion, dans cet ordre.",
  infoLabel: "En bref",
  info: {
    days: "20–21 septembre",
    daysNote: "Deux journées pleines",
    place: "Rome, Italie",
    placeNote: "L'adresse exacte est communiquée à la confirmation",
    seats: "Places limitées",
    seatsNote: "Un petit groupe, pour suivre chacune de près",
  },
  closingTitle: "Rendez-vous à Rome",
  closingBody:
    "Écrivez-moi et je vous dirai si cette édition est la bonne étape pour vous, avant même de parler d'inscription.",
  closingCta: "Réservez votre place",
};

const ar: MasterclassCopy = {
  meta: {
    title: "ماستر كلاس المايكروبليدنغ — روما، 20–21 سبتمبر",
    description:
      "يومان مكثّفان في المايكروبليدنغ مع أميرة بشيني في روما. منهج PhiBrows، تدريب عملي على عارضة، شهادة رسمية، ومتابعة إلكترونية موجّهة بعد التدريب.",
  },
  eyebrow: "PhiBrows · مايكروبليدنغ",
  title: "ماستر كلاس",
  titleAccent: "المايكروبليدنغ",
  when: "20–21 سبتمبر 2026",
  where: "روما، إيطاليا",
  lede: "يومان ترتقي فيهما يدك إلى المستوى الذي بلغته عينك من قبل.",
  ctaPrimary: "احجزي مقعدك",
  ctaSecondary: "اطّلعي على البرنامج",
  badge: "يومان مكثّفان · تدريب على موديل",
  pillarsLabel: "لماذا هذه الماستر كلاس",
  pillars: [
    {
      title: "منهج PhiBrows",
      body: "أكثر التقنيات اعتماداً في المجال، تُدرّس على يد ماستر معتمدة.",
    },
    {
      title: "تدريب حقيقي",
      body: "تعملين على موديل حيّ، مع تصحيح مباشر خطوة بخطوة.",
    },
    {
      title: "شهادة",
      body: "شهادة PhiAcademy عند إتمام الدورة.",
    },
    {
      title: "متابعة مستمرة",
      body: "واصلي التعلّم بعد الماستر كلاس عبر متابعة إلكترونية موجّهة.",
    },
  ],
  masterLabel: "البرنامج",
  masterTitle: "ما ستخرجين به",
  masters: [
    "تصميم الحاجب والتماثل",
    "تشريح البشرة",
    "تقنيات رسم الخريطة",
    "تقنية الشعرة",
    "نظرية اللون",
    "استشارة العميلة",
    "التطبيق على عارضة",
    "العناية اللاحقة والتعامل مع العميلة",
    "العرض المهني",
    "تموضع الخدمة",
  ],
  altBeforeAfter: "الحاجبان قبل المايكروبليدنغ وبعده",
  altCertificate: "تسليم شهادة PhiBrows لإحدى المتدرّبات",
  altTraining: "أميرة بشيني خلال ماستر كلاس",
  altPortrait: "أميرة بشيني، ماستر دولية في المكياج الدائم",
  teacherLabel: "ماستر الدورة",
  teacherRole: "مؤسِّسة أكاديمية أورا والمدرِّبة المعتمدة",
  quote: "عملي أن أوصل رسّامات الحواجب إلى الثقة: المعرفة ثم الممارسة ثم الشغف، بهذا الترتيب.",
  infoLabel: "باختصار",
  info: {
    days: "20–21 سبتمبر",
    daysNote: "يومان كاملان",
    place: "روما، إيطاليا",
    placeNote: "يُرسل العنوان الدقيق عند تأكيد الحجز",
    seats: "مقاعد محدودة",
    seatsNote: "مجموعة صغيرة، لمتابعة كل متدرّبة عن قرب",
  },
  closingTitle: "إلى اللقاء في روما",
  closingBody: "راسليني وسأخبرك إن كانت هذه الدورة هي الخطوة المناسبة لك، قبل الحديث عن التسجيل.",
  closingCta: "احجزي مقعدك",
};

const COPY: Record<Locale, MasterclassCopy> = { it, en, fr, ar };

/**
 * Italian is the fallback rather than the routing default, for the reason
 * `xDefaultLocale` gives in `i18n/routing.ts`: this event is taught in Italian,
 * in Italy, and Italian is the page somebody the router could not place should
 * be handed.
 */
export const masterclassCopy = (locale: string): MasterclassCopy =>
  COPY[locale as Locale] ?? COPY.it;
