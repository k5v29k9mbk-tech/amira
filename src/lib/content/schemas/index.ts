// GENERATED FILE — do not edit by hand.
// Written by scripts/generate-content-schemas.ts.
import type { z } from "zod";
import type { PageId } from "../pages.ts";
import { commonSchema } from "./common.ts";
import { homeSchema } from "./home.ts";
import { aboutSchema } from "./about.ts";
import { catalogSchema } from "./catalog.ts";
import { contactSchema } from "./contact.ts";
import { faqSchema } from "./faq.ts";
import { privacySchema } from "./privacy.ts";

export * from "./common.ts";
export * from "./home.ts";
export * from "./about.ts";
export * from "./catalog.ts";
export * from "./contact.ts";
export * from "./faq.ts";
export * from "./privacy.ts";

/** Every page's schema, keyed by the id used in the `content` table. */
export const SCHEMAS = {
  "common": commonSchema,
  "home": homeSchema,
  "about": aboutSchema,
  "catalog": catalogSchema,
  "contact": contactSchema,
  "faq": faqSchema,
  "privacy": privacySchema,
} as const satisfies Record<PageId, z.ZodType>;

export type ContentFor<P extends PageId> = z.infer<(typeof SCHEMAS)[P]>;
