// Contact channels, in one place because the nav, footer and contact section all
// need them. City names are translated in messages/*.json under `contact.cities`.
//
// TODO(studio): phone, WhatsApp number and Instagram handle below are
// placeholders. Replace with the real ones before launch; nothing else has to
// change. Map links are Google Maps searches, not embeds, because the studio
// has not supplied street addresses yet.
export const studio = {
  email: "studio@amira-bechini.com",
  phone: "+39 000 000 000",
  whatsapp: "39000000000", // digits only, no + or spaces
  instagram: "amirabechini",
} as const;

export const whatsappLink = `https://wa.me/${studio.whatsapp}`;
export const instagramLink = `https://instagram.com/${studio.instagram}`;

export const cities = [
  { id: "roma", maps: "Amira+Bechini+PMU,+Roma" },
  { id: "milano", maps: "Amira+Bechini+PMU,+Milano" },
  { id: "tortoreto", maps: "Amira+Bechini+PMU,+Tortoreto" },
] as const;

export const mapsLink = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${query}`;
