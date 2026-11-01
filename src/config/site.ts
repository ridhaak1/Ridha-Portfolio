export const site = {
  name: "Ridha Al-Khaykanee",
  role: "Software Developer",
  focus: "Full-stack & mobile",
  city: "Antwerp",
  timeZone: "Europe/Brussels",

  /**
   * The contact corridor flies past these in order. New Arabic letters need the font re-subset
   * (scripts/font-subset/subset.py); other non-Latin scripts need a font of their own.
   */
  greetings: [
    { word: "Hello", language: "English" },
    { word: "Hallo", language: "Dutch", lang: "nl" },
    { word: "Bonjour", language: "French", lang: "fr" },
    { word: "مرحبا", language: "Arabic", lang: "ar", dir: "rtl" },
  ],

  /** Temporary: see components/temporary/InternshipNotice.tsx. Delete together with that file. */
  showInternshipNotice: true,
} as const;
