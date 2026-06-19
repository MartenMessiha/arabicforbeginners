export type WritingExercise = {
  arabic: string;
  franko: string;
  german: string;
  difficulty: "leicht" | "mittel" | "schwer";
  hint?: string;
};

export const writingExercises: WritingExercise[] = [
  { arabic: "الخدمة", franko: "el-Khedma", german: "der Dienst", difficulty: "leicht" },
  { arabic: "الرحمة", franko: "er-Rahma", german: "die Barmherzigkeit", difficulty: "leicht" },
  { arabic: "الفضيلة", franko: "el-Fadeela", german: "die Tugend", difficulty: "leicht" },
  { arabic: "القداسة", franko: "el-Qadasa", german: "die Heiligkeit", difficulty: "mittel" },
  { arabic: "السجود", franko: "es-Sogood", german: "die Anbetung", difficulty: "mittel" },
  { arabic: "الملكوت", franko: "el-Malakoot", german: "das Reich", difficulty: "mittel" },
  { arabic: "التسبحة", franko: "et-Tasbeha", german: "der Lobpreis", difficulty: "schwer" },
  { arabic: "الذبيحة", franko: "ez-Zabeha", german: "das Opfer", difficulty: "schwer" },
  { arabic: "الملائكة", franko: "el-Malayeka", german: "die Engel", difficulty: "schwer" },
  { arabic: "البشارة", franko: "el-Bishara", german: "die Verkündigung", difficulty: "schwer" },
  { arabic: "المذود", franko: "el-Mazood", german: "die Krippe", difficulty: "schwer" },
  { arabic: "الترتيل", franko: "et-Tarteel", german: "der Gesang", difficulty: "schwer" }
];
