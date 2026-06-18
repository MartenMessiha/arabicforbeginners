import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LearningCard } from "../components/LearningCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { ScreenHeader } from "../components/ScreenHeader";
import { letters, type Letter, type LetterMode } from "../data/letters";
import { decreaseMistakeCount, increaseMistakeCount } from "../utils/learningCycle";
import { shuffle } from "../utils/shuffle";
import { theme } from "../theme/theme";
import { recordLearningPoint } from "../utils/learningProgress";
import { useRecordLearningPath } from "../utils/learningPath";

type Question = {
  id: string;
  letterId: string;
  mode: LetterMode;
  prompt: string;
  answer: string;
  options: string[];
};

const SUCCESS_MESSAGES = [
  "Richtig",
  "Gut gelesen",
  "Sehr gut",
  "Stark",
  "Weiter so"
];
const ENCOURAGE_MESSAGES = [
  "Schau noch einmal ruhig",
  "Fast richtig",
  "Bleib ruhig, du schaffst das"
];

const QUESTION_MODES = ["isolated", "initial", "medial", "final"] as const;

const HARD_LETTER_GROUPS: ReadonlyArray<readonly string[]> = [
  ["ain", "ghain"],
  ["fa", "qaf"],
  ["sad", "dad"],
  ["ta2", "za"],
  ["jeem", "ha", "kha"],
  ["seen", "sheen"],
  ["ba", "ta", "tha", "noon", "ya"],
  ["dal", "thal"],
  ["ra", "zay"]
] as const;

const BASIC_HARD_LETTERS = new Set([
  "hamza",
  "alef",
  "waw",
  "dal",
  "thal",
  "ra",
  "zay",
  "ta_marbuta",
  "alef_maqsura"
]);

function getConfusionGroup(letterId: string) {
  const group = HARD_LETTER_GROUPS.find((candidate) => candidate.includes(letterId));
  return group ? [...group] : [letterId];
}

function getLetterWeight(letter: Letter) {
  let weight = 1;

  if (getConfusionGroup(letter.id).length > 1) {
    weight += 2;
  }

  if (letter.forms.initial && letter.forms.medial && letter.forms.final) {
    weight += 1;
  }

  if (BASIC_HARD_LETTERS.has(letter.id)) {
    weight += 0.75;
  }

  return weight;
}

function pickWeightedLetter(pool: Letter[], recentIds: string[]) {
  const recentSet = new Set(recentIds.slice(-4));
  const candidates = pool.filter((letter) => !recentSet.has(letter.id));
  const source = candidates.length > 0 ? candidates : pool;
  const totalWeight = source.reduce((sum, letter) => sum + getLetterWeight(letter), 0);

  if (totalWeight <= 0) {
    return source[0];
  }

  let cursor = Math.random() * totalWeight;
  for (const letter of source) {
    cursor -= getLetterWeight(letter);
    if (cursor <= 0) {
      return letter;
    }
  }

  return source[0];
}

function pickQuestionMode(letter: Letter, mode: LetterMode): Exclude<LetterMode, "mixed"> {
  if (mode !== "mixed") {
    return mode;
  }

  const availableModes = (["isolated", "initial", "medial", "final"] as const).filter((candidate) =>
    Boolean(getForm(letter, candidate))
  );

  const weightedModes = availableModes.flatMap((candidate) =>
    candidate === "isolated" ? [candidate] : [candidate, candidate, candidate]
  );

  return shuffle(weightedModes)[0] ?? "isolated";
}

function pickDistractorGlyphs(answerLetter: Letter, questionMode: Exclude<LetterMode, "mixed">) {
  const answer = getForm(answerLetter, questionMode) ?? answerLetter.forms.isolated;
  const answerGroup = getConfusionGroup(answerLetter.id);
  const candidates = letters
    .filter((candidate) => candidate.id !== answerLetter.id)
    .map((candidate) => ({
      candidate,
      glyph: getForm(candidate, questionMode) ?? candidate.forms.isolated,
      group: getConfusionGroup(candidate.id)
    }))
    .filter(({ glyph }) => Boolean(glyph) && glyph !== answer);

  const usedGlyphs = new Set<string>([answer]);
  const picks: string[] = [];

  function addPick(source: typeof candidates) {
    const next = shuffle(
      source.filter(({ glyph }) => !usedGlyphs.has(glyph))
    )[0];
    if (!next) {
      return;
    }
    usedGlyphs.add(next.glyph);
    picks.push(next.glyph);
  }

  const sameGroup = candidates.filter(({ group }) => group.some((entry) => answerGroup.includes(entry)));
  const otherGroup = candidates.filter(({ group }) => !group.some((entry) => answerGroup.includes(entry)));

  addPick(sameGroup);
  addPick(sameGroup);
  addPick(otherGroup);
  addPick(candidates);

  return shuffle([...new Set(picks)]).slice(0, 3);
}

function getModeLabel(mode: LetterMode) {
  switch (mode) {
    case "isolated":
      return "Buchstaben";
    case "initial":
      return "am Anfang";
    case "medial":
      return "in der Mitte";
    case "final":
      return "am Ende";
    case "mixed":
      return "gemischt";
  }
}

function getForm(letter: Letter, mode: Exclude<LetterMode, "mixed">) {
  switch (mode) {
    case "isolated":
      return letter.forms.isolated;
    case "initial":
      return letter.forms.initial;
    case "medial":
      return letter.forms.medial;
    case "final":
      return letter.forms.final;
  }
}

function buildQuestions(mode: LetterMode): Question[] {
  const availableLetters = letters.filter((letter) => {
    if (mode === "mixed" || mode === "isolated") {
      return true;
    }
    if (mode === "initial") return Boolean(letter.forms.initial);
    if (mode === "medial") return Boolean(letter.forms.medial);
    if (mode === "final") return Boolean(letter.forms.final);
    return true;
  });
  const plan =
    mode === "mixed"
      ? shuffle(
          letters.flatMap((letter) =>
            QUESTION_MODES.flatMap((questionMode) => {
              const glyph = getForm(letter, questionMode);
              if (!glyph) {
                return [];
              }
              return [{ letter, questionMode }];
            })
          )
        )
      : shuffle(availableLetters).map((letter) => ({
          letter,
          questionMode: mode
        }));

  const questions: Question[] = [];
  const recentLetterIds: string[] = [];

  for (const entry of plan) {
    const letter = entry.letter;
    const questionMode =
      mode === "mixed"
        ? entry.questionMode
        : (entry.questionMode as Exclude<LetterMode, "mixed">);

    recentLetterIds.push(letter.id);
    recentLetterIds.splice(0, Math.max(0, recentLetterIds.length - 5));

    const answer = getForm(letter, questionMode) ?? letter.forms.isolated;
    const distractors = pickDistractorGlyphs(letter, questionMode);
    const options = shuffle([...distractors, answer]);

    questions.push({
      id: `${letter.id}-${questionMode}-${questions.length}`,
      letterId: letter.id,
      mode: questionMode,
      prompt:
        questionMode === "isolated"
          ? `Finde: ${letter.nameFranko}`
          : `Finde: ${letter.nameFranko} ${getModeLabel(questionMode)} des Wortes`,
      answer,
      options: shuffle(options)
    });
  }

  return questions;
}

function createModeList() {
  return [
    { key: "isolated" as const, label: "Isoliert" },
    { key: "initial" as const, label: "Anfang" },
    { key: "medial" as const, label: "Mitte" },
    { key: "final" as const, label: "Ende" },
    { key: "mixed" as const, label: "Gemischt" }
  ];
}

export default function LetterLevelScreen() {
  useRecordLearningPath({ label: "Stufe 1: Buchstaben", route: "/letters" });
  const router = useRouter();
  const [mode, setMode] = useState<LetterMode>("mixed");
  const [questionsSeed, setQuestionsSeed] = useState(0);
  const questions = useMemo(() => buildQuestions(mode), [mode, questionsSeed]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [message, setMessage] = useState<string>("Wähle die passende Karte.");
  const [finished, setFinished] = useState(false);
  const [reviewQueue, setReviewQueue] = useState<string[]>([]);
  const [mistakeCounts, setMistakeCounts] = useState<Record<string, number>>({});
  const weakLetters = useMemo(
    () =>
      Object.entries(mistakeCounts)
        .map(([id, count]) => ({
          letter: letters.find((item) => item.id === id),
          count
        }))
        .filter((item): item is { letter: Letter; count: number } => Boolean(item.letter))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3),
    [mistakeCounts]
  );
  const [recentQuestionIds, setRecentQuestionIds] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [answerHint, setAnswerHint] = useState<string>("");
  const [waitingForContinue, setWaitingForContinue] = useState(false);

  const question = questions[index % questions.length];

  function resetPractice(nextMode = mode) {
    setMode(nextMode);
    setQuestionsSeed((current) => current + 1);
    setIndex(0);
    setCorrect(0);
    setMessage("Wähle die passende Karte.");
    setFinished(false);
    setReviewQueue([]);
    setMistakeCounts({});
    setRecentQuestionIds([]);
    setSelectedAnswer(null);
    setResult(null);
    setAnswerHint("");
    setWaitingForContinue(false);
  }

  function handleAnswer(answer: string) {
    if (finished || waitingForContinue) {
      return;
    }

    if (answer !== question.answer) {
      setMessage(ENCOURAGE_MESSAGES[Math.floor(Math.random() * ENCOURAGE_MESSAGES.length)]);
      setAnswerHint(`Richtig ist: ${question.answer}`);
      setSelectedAnswer(answer);
      setResult("wrong");
      setMistakeCounts((current) => increaseMistakeCount(current, question.id));
      setReviewQueue((current) => (current.includes(question.id) ? current : [...current, question.id]));
      setWaitingForContinue(true);
      return;
    }

    const nextCorrect = correct + 1;
    const nextReviewQueue = reviewQueue.filter((item) => item !== question.id);
    const nextRecentQuestionIds = [...recentQuestionIds, question.id].slice(-5);
    const nextMistakeCounts = decreaseMistakeCount(mistakeCounts, question.id);
    setCorrect(nextCorrect);
    setReviewQueue(nextReviewQueue);
    setMistakeCounts(nextMistakeCounts);
    setRecentQuestionIds(nextRecentQuestionIds);
    setSelectedAnswer(answer);
    setResult("correct");
    setMessage(SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]);
    setAnswerHint(`Richtig ist: ${question.answer}`);
    recordLearningPoint(1);
    setWaitingForContinue(true);
  }

  function handleContinue() {
    if (!waitingForContinue) {
      return;
    }

    const nextIndex = index + 1;
    setSelectedAnswer(null);
    setResult(null);
    setAnswerHint("");
    setWaitingForContinue(false);

    if (nextIndex >= questions.length) {
      setFinished(true);
      return;
    }

    setIndex(nextIndex);
  }

  if (finished) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title="Stufe 1: Buchstaben lernen"
          subtitle={`Erkenne jede Buchstabenform. ${questions.length} Karten im aktuellen Lauf.`}
        />
        <View style={styles.finishCard}>
          <Text style={styles.finishTitle}>Sehr gut</Text>
          <Text style={styles.finishText}>
            Du hast {correct} von {questions.length} Karten beantwortet.
          </Text>
          <View style={styles.finishActions}>
            <PrimaryButton label="Nochmal üben" onPress={() => resetPractice()} />
            <PrimaryButton label="Zur Startseite" variant="ghost" onPress={() => router.push("/")} />
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader
        title="Stufe 1: Buchstaben lernen"
        subtitle={`Erkenne die Buchstabenformen. ${questions.length} Karten im aktuellen Lauf.`}
      />

      <View style={styles.deckCard}>
        <View style={styles.deckRow}>
          <Text style={styles.deckLabel}>Lernlauf</Text>
          <Text style={styles.deckBadge}>{questions.length} Karten</Text>
        </View>
        <Text style={styles.deckTitle}>
          31 Buchstaben, nur eindeutige Formen aus isoliert, Anfang, Mitte und Ende.
        </Text>
        <Text style={styles.deckText}>
          Die Karten laufen ruhig durch, damit du jede Form bewusst sehen und vergleichen kannst.
        </Text>
      </View>

      <View style={styles.modeRow}>
        {createModeList().map((item) => (
          <Pressable
            key={item.key}
            style={[styles.modeChip, mode === item.key && styles.modeChipActive]}
            onPress={() => resetPractice(item.key)}
          >
            <Text style={[styles.modeChipText, mode === item.key && styles.modeChipTextActive]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.supportCard}>
        <Text style={styles.supportTitle}>Schwache Formen</Text>
        <Text style={styles.supportText}>
          Diese Zeichen kommen etwas öfter wieder, damit du sie sicherer erkennst.
        </Text>
        <View style={styles.supportList}>
          {weakLetters.length > 0 ? (
            weakLetters.map(({ letter, count }) => (
              <View key={letter.id} style={styles.supportChip}>
                <Text style={styles.supportChipGlyph}>{letter.forms.isolated}</Text>
                <Text style={styles.supportChipText}>
                  {letter.nameFranko} · {count}
                </Text>
              </View>
            ))
          ) : (
          <Text style={styles.supportEmpty}>Keine schwachen Formen offen.</Text>
          )}
        </View>
      </View>

      <LearningCard>
        <Text style={styles.prompt}>{question.prompt}</Text>
        <View style={styles.answerGrid}>
          {question.options.map((option) => (
            <Pressable
              key={`${question.id}-${option}`}
              style={({ pressed }) => [
                styles.answerCard,
                waitingForContinue && styles.answerCardLocked,
                selectedAnswer === option && result === "correct" && styles.answerCardCorrect,
                selectedAnswer === option && result === "wrong" && styles.answerCardWrong,
                pressed && styles.answerCardPressed
              ]}
              onPress={() => handleAnswer(option)}
              disabled={waitingForContinue}
            >
              <Text style={styles.answerGlyph}>{option}</Text>
            </Pressable>
          ))}
        </View>
        {waitingForContinue ? (
          <PrimaryButton label="Nächste Karte" onPress={handleContinue} />
        ) : null}
      </LearningCard>

      <View style={styles.feedbackCard}>
        <Text
          style={[
            styles.feedback,
            result === "correct" && styles.feedbackCorrect,
            result === "wrong" && styles.feedbackWrong
          ]}
        >
          {message}
        </Text>
        {answerHint ? <Text style={styles.answerHint}>{answerHint}</Text> : null}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>
            Schritt {Math.min(index + 1, questions.length)} / {questions.length}
          </Text>
          <Text style={styles.progressLabel}>Erst schauen, dann weiter.</Text>
        </View>
      </View>

      <View style={styles.reviewHint}>
        <Text style={styles.reviewText}>
          Wiederholen: {reviewQueue.length > 0 ? `${reviewQueue.length} Karte(n)` : "gerade nichts offen"}
        </Text>
        <Text style={styles.reviewText}>
          Schwache Karten:{" "}
          {Object.keys(mistakeCounts).length > 0 ? `${Object.keys(mistakeCounts).length}` : "keine"}
        </Text>
        <Text style={styles.reviewText}>
          Modus: erst schauen, dann weiterklicken. Frage {Math.min(index + 1, questions.length)} von{" "}
          {questions.length}.
        </Text>
      </View>

      <ProgressBar progress={Math.min((index + 1) / questions.length, 1)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 24,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.background
  },
  header: {
    gap: 10
  },
  modeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  modeChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  modeChipActive: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accent
  },
  modeChipText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600"
  },
  modeChipTextActive: {
    color: theme.colors.accent
  },
  deckCard: {
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    gap: 8
  },
  deckRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  deckLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: theme.colors.accent,
    fontWeight: "700"
  },
  deckBadge: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: "700",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  deckTitle: {
    fontSize: 16,
    lineHeight: 23,
    color: theme.colors.text,
    fontWeight: "700"
  },
  deckText: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.mutedText
  },
  supportCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    gap: 8
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text
  },
  supportText: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.mutedText
  },
  supportList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  supportChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  supportChipGlyph: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: "700"
  },
  supportChipText: {
    fontSize: 12,
    color: theme.colors.mutedText,
    fontWeight: "600"
  },
  supportEmpty: {
    fontSize: 13,
    color: theme.colors.mutedText
  },
  prompt: {
    fontSize: 24,
    lineHeight: 32,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontWeight: "600"
  },
  answerGrid: {
    gap: 12
  },
  answerCard: {
    minHeight: 72,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundAlt,
    alignItems: "center",
    justifyContent: "center"
  },
  answerCardPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: theme.colors.cardPressed
  },
  answerCardLocked: {
    opacity: 0.8
  },
  answerCardCorrect: {
    backgroundColor: "#E8F4EA",
    borderColor: "#7DAA88"
  },
  answerCardWrong: {
    backgroundColor: "#FDECEC",
    borderColor: "#D77A7A"
  },
  answerGlyph: {
    fontSize: 32,
    color: theme.colors.text,
    writingDirection: "rtl"
  },
  feedbackCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8
  },
  feedback: {
    fontSize: 16,
    color: theme.colors.accent,
    fontWeight: "600"
  },
  feedbackCorrect: {
    color: "#4E7B58"
  },
  feedbackWrong: {
    color: "#B24B4B"
  },
  answerHint: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text,
    fontWeight: "600"
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  },
  progressLabel: {
    fontSize: 14,
    color: theme.colors.mutedText
  },
  reviewHint: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  reviewText: {
    fontSize: 14,
    color: theme.colors.mutedText
  },
  finishCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  finishTitle: {
    fontSize: 30,
    fontFamily: theme.fonts.display,
    fontWeight: "700",
    color: theme.colors.text
  },
  finishText: {
    fontSize: 17,
    color: theme.colors.mutedText,
    lineHeight: 25
  },
  finishActions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm
  }
});
