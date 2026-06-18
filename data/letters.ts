import type { Letter, LetterMode } from "./types";

export type { Letter, LetterMode };

export const letters: Letter[] = [
  {
    id: "alef",
    nameFranko: "alef",
    forms: { isolated: "ا", initial: null, medial: null, final: null },
    exampleWordArabic: "الله",
    exampleWordFranko: "Allah",
    meaningGerman: "Gott",
    leftConnectionNote: "Verbindet sich nicht nach links."
  },
  {
    id: "ba",
    nameFranko: "ba",
    forms: { isolated: "ب", initial: "بـ", medial: "ـبـ", final: "ـب" },
    exampleWordArabic: "باب",
    exampleWordFranko: "bab",
    meaningGerman: "Tür"
  },
  {
    id: "ta",
    nameFranko: "ta",
    forms: { isolated: "ت", initial: "تـ", medial: "ـتـ", final: "ـت" },
    exampleWordArabic: "تسبحة",
    exampleWordFranko: "tasbeha",
    meaningGerman: "Lobpreis"
  },
  {
    id: "tha",
    nameFranko: "tha",
    forms: { isolated: "ث", initial: "ثـ", medial: "ـثـ", final: "ـث" },
    exampleWordArabic: "ثلاثة",
    exampleWordFranko: "talata",
    meaningGerman: "drei"
  },
  {
    id: "jeem",
    nameFranko: "jeem",
    forms: { isolated: "ج", initial: "جـ", medial: "ـجـ", final: "ـج" },
    exampleWordArabic: "مجد",
    exampleWordFranko: "magd",
    meaningGerman: "Herrlichkeit"
  },
  {
    id: "ha",
    nameFranko: "ha",
    forms: { isolated: "ح", initial: "حـ", medial: "ـحـ", final: "ـح" },
    exampleWordArabic: "حب",
    exampleWordFranko: "hob",
    meaningGerman: "Liebe"
  },
  {
    id: "kha",
    nameFranko: "kha",
    forms: { isolated: "خ", initial: "خـ", medial: "ـخـ", final: "ـخ" },
    exampleWordArabic: "خلاص",
    exampleWordFranko: "khalas",
    meaningGerman: "Rettung"
  },
  {
    id: "dal",
    nameFranko: "dal",
    forms: { isolated: "د", initial: null, medial: null, final: null },
    exampleWordArabic: "درب",
    exampleWordFranko: "derb",
    meaningGerman: "Weg",
    leftConnectionNote: "Verbindet sich nicht nach links."
  },
  {
    id: "thal",
    nameFranko: "thal",
    forms: { isolated: "ذ", initial: null, medial: null, final: null },
    exampleWordArabic: "هذا",
    exampleWordFranko: "haza",
    meaningGerman: "dieser",
    leftConnectionNote: "Verbindet sich nicht nach links."
  },
  {
    id: "ra",
    nameFranko: "ra",
    forms: { isolated: "ر", initial: null, medial: null, final: null },
    exampleWordArabic: "رب",
    exampleWordFranko: "rab",
    meaningGerman: "Herr",
    leftConnectionNote: "Verbindet sich nicht nach links."
  },
  {
    id: "zay",
    nameFranko: "zay",
    forms: { isolated: "ز", initial: null, medial: null, final: null },
    exampleWordArabic: "زيت",
    exampleWordFranko: "zeit",
    meaningGerman: "Öl",
    leftConnectionNote: "Verbindet sich nicht nach links."
  },
  {
    id: "seen",
    nameFranko: "seen",
    forms: { isolated: "س", initial: "سـ", medial: "ـسـ", final: "ـس" },
    exampleWordArabic: "سلام",
    exampleWordFranko: "salam",
    meaningGerman: "Frieden"
  },
  {
    id: "sheen",
    nameFranko: "sheen",
    forms: { isolated: "ش", initial: "شـ", medial: "ـشـ", final: "ـش" },
    exampleWordArabic: "شعب",
    exampleWordFranko: "shaab",
    meaningGerman: "Volk"
  },
  {
    id: "sad",
    nameFranko: "sad",
    forms: { isolated: "ص", initial: "صـ", medial: "ـصـ", final: "ـص" },
    exampleWordArabic: "صلاة",
    exampleWordFranko: "sala",
    meaningGerman: "Gebet"
  },
  {
    id: "dad",
    nameFranko: "dad",
    forms: { isolated: "ض", initial: "ضـ", medial: "ـضـ", final: "ـض" },
    exampleWordArabic: "ضياء",
    exampleWordFranko: "diyaa",
    meaningGerman: "Licht"
  },
  {
    id: "ta2",
    nameFranko: "tah",
    forms: { isolated: "ط", initial: "طـ", medial: "ـطـ", final: "ـط" },
    exampleWordArabic: "طريق",
    exampleWordFranko: "tareeq",
    meaningGerman: "Weg"
  },
  {
    id: "za",
    nameFranko: "za",
    forms: { isolated: "ظ", initial: "ظـ", medial: "ـظـ", final: "ـظ" },
    exampleWordArabic: "ظلمة",
    exampleWordFranko: "zolma",
    meaningGerman: "Dunkelheit"
  },
  {
    id: "ain",
    nameFranko: "ain",
    forms: { isolated: "ع", initial: "عـ", medial: "ـعـ", final: "ـع" },
    exampleWordArabic: "عهد",
    exampleWordFranko: "ahd",
    meaningGerman: "Bund"
  },
  {
    id: "ghain",
    nameFranko: "ghain",
    forms: { isolated: "غ", initial: "غـ", medial: "ـغـ", final: "ـغ" },
    exampleWordArabic: "غفران",
    exampleWordFranko: "ghufran",
    meaningGerman: "Vergebung"
  },
  {
    id: "fa",
    nameFranko: "fa",
    forms: { isolated: "ف", initial: "فـ", medial: "ـفـ", final: "ـف" },
    exampleWordArabic: "فرح",
    exampleWordFranko: "farah",
    meaningGerman: "Freude"
  },
  {
    id: "qaf",
    nameFranko: "qaf",
    forms: { isolated: "ق", initial: "قـ", medial: "ـقـ", final: "ـق" },
    exampleWordArabic: "قداس",
    exampleWordFranko: "oddas",
    meaningGerman: "Liturgie/Messe"
  },
  {
    id: "kaf",
    nameFranko: "kaf",
    forms: { isolated: "ك", initial: "كـ", medial: "ـكـ", final: "ـك" },
    exampleWordArabic: "كنيسة",
    exampleWordFranko: "kenisa",
    meaningGerman: "Kirche"
  },
  {
    id: "lam",
    nameFranko: "lam",
    forms: { isolated: "ل", initial: "لـ", medial: "ـلـ", final: "ـل" },
    exampleWordArabic: "لحن",
    exampleWordFranko: "lahn",
    meaningGerman: "Hymnus"
  },
  {
    id: "meem",
    nameFranko: "meem",
    forms: { isolated: "م", initial: "مـ", medial: "ـمـ", final: "ـم" },
    exampleWordArabic: "مسيح",
    exampleWordFranko: "maseeh",
    meaningGerman: "Christus"
  },
  {
    id: "noon",
    nameFranko: "noon",
    forms: { isolated: "ن", initial: "نـ", medial: "ـنـ", final: "ـن" },
    exampleWordArabic: "نور",
    exampleWordFranko: "noor",
    meaningGerman: "Licht"
  },
  {
    id: "ha2",
    nameFranko: "heh",
    forms: { isolated: "ه", initial: "هـ", medial: "ـهـ", final: "ـه" },
    exampleWordArabic: "هنا",
    exampleWordFranko: "hena",
    meaningGerman: "hier"
  },
  {
    id: "waw",
    nameFranko: "waw",
    forms: { isolated: "و", initial: null, medial: null, final: null },
    exampleWordArabic: "وعد",
    exampleWordFranko: "waad",
    meaningGerman: "Verheißung",
    leftConnectionNote: "Verbindet sich nicht nach links."
  },
  {
    id: "ya",
    nameFranko: "ya",
    forms: { isolated: "ي", initial: "يـ", medial: "ـيـ", final: "ـي" },
    exampleWordArabic: "يد",
    exampleWordFranko: "yed",
    meaningGerman: "Hand"
  },
  {
    id: "ta_marbuta",
    nameFranko: "ta marbuta",
    forms: { isolated: "ة", initial: null, medial: null, final: "ـة" },
    exampleWordArabic: "نعمة",
    exampleWordFranko: "neama",
    meaningGerman: "Gnade"
  },
  {
    id: "alef_maqsura",
    nameFranko: "alef maqsura",
    forms: { isolated: "ى", initial: null, medial: null, final: "ـى" },
    exampleWordArabic: "هدى",
    exampleWordFranko: "hoda",
    meaningGerman: "Führung"
  },
  {
    id: "hamza",
    nameFranko: "hamza",
    forms: { isolated: "ء", initial: null, medial: null, final: null },
    exampleWordArabic: "إيمان",
    exampleWordFranko: "eeman",
    meaningGerman: "Glaube",
    leftConnectionNote: "Verbindet sich nicht nach links."
  }
];
