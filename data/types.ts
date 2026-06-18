export type FormValue = string | null;

export type LetterMode = "isolated" | "initial" | "medial" | "final" | "mixed";

export type Letter = {
  id: string;
  nameFranko: string;
  forms: {
    isolated: string;
    initial: FormValue;
    medial: FormValue;
    final: FormValue;
  };
  exampleWordArabic: string;
  exampleWordFranko: string;
  meaningGerman: string;
  leftConnectionNote?: string;
};

export type WordEntry = {
  arabic: string;
  franko: string;
  german: string;
  category?: string;
};

export type SentenceEntry = {
  arabic: string;
  franko: string;
  german: string;
};

export type ParagraphEntry = {
  arabic: string;
  franko: string;
  german: string;
};

export type VerseEntry = {
  arabic: string;
  franko: string;
  german: string;
  category: "Bibel" | "Agpeya" | "Basilius" | "Gregorios" | "Kyrillos";
};
