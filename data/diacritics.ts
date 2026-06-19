import type { DiacriticEntry } from "./types";

export const diacritics: DiacriticEntry[] = [
  {
    id: "fatha",
    symbol: "َ",
    name: "Fatha",
    group: "Grundzeichen",
    effect: "Kurzes a, über dem Buchstaben.",
    exampleArabic: "بَ",
    exampleFranko: "ba",
    meaningGerman: "wie in einem kurzen a"
  },
  {
    id: "kasra",
    symbol: "ِ",
    name: "Kasra",
    group: "Grundzeichen",
    effect: "Kurzes i, unter dem Buchstaben.",
    exampleArabic: "بِ",
    exampleFranko: "bi",
    meaningGerman: "wie in einem kurzen i"
  },
  {
    id: "damma",
    symbol: "ُ",
    name: "Damma",
    group: "Grundzeichen",
    effect: "Kurzes u, über dem Buchstaben.",
    exampleArabic: "بُ",
    exampleFranko: "bu",
    meaningGerman: "wie in einem kurzen u"
  },
  {
    id: "sukun",
    symbol: "ْ",
    name: "Sukun",
    group: "Grundzeichen",
    effect: "Kein Vokal. Der Buchstabe wird abgeschlossen gelesen.",
    exampleArabic: "بْ",
    exampleFranko: "b",
    meaningGerman: "ohne Vokal"
  },
  {
    id: "shadda",
    symbol: "ّ",
    name: "Shadda",
    group: "Verdopplung",
    effect: "Verdoppelt den Konsonantenklang.",
    exampleArabic: "بّ",
    exampleFranko: "bb",
    meaningGerman: "der Laut wird doppelt gesprochen"
  },
  {
    id: "tanwin-fatha",
    symbol: "ً",
    name: "Tanwin Fatha",
    group: "Endungen",
    effect: "Endung mit -an.",
    exampleArabic: "بً",
    exampleFranko: "ban",
    meaningGerman: "nasaler Auslaut"
  },
  {
    id: "tanwin-kasra",
    symbol: "ٍ",
    name: "Tanwin Kasra",
    group: "Endungen",
    effect: "Endung mit -in.",
    exampleArabic: "بٍ",
    exampleFranko: "bin",
    meaningGerman: "nasaler Auslaut"
  },
  {
    id: "tanwin-damma",
    symbol: "ٌ",
    name: "Tanwin Damma",
    group: "Endungen",
    effect: "Endung mit -un.",
    exampleArabic: "بٌ",
    exampleFranko: "bun",
    meaningGerman: "nasaler Auslaut"
  }
];
