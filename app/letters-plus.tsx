import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LearningCard } from "../components/LearningCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenHeader } from "../components/ScreenHeader";
import { theme } from "../theme/theme";
import { diacritics } from "../data/diacritics";
import { shuffle } from "../utils/shuffle";
import { useRecordLearningPath } from "../utils/learningPath";
import { recordLearningPoint } from "../utils/learningProgress";

const GROUP_ORDER = ["Grundzeichen", "Verdopplung", "Endungen"] as const;

type QuizQuestion = {
  id: string;
  entryId: string;
  prompt: string;
  answer: string;
  options: string[];
  answerKind: "symbol" | "name" | "effect";
};

function buildQuizQuestions(entries: typeof diacritics) {
  return shuffle(entries).map((entry, index) => {
    const useSymbolPrompt = index % 2 === 0;
    const distractors = shuffle(
      entries
        .filter((candidate) => candidate.id !== entry.id)
        .map((candidate) => (useSymbolPrompt ? candidate.name : candidate.effect))
    ).slice(0, 3);

    if (useSymbolPrompt) {
      return {
        id: entry.id,
        entryId: entry.id,
        prompt: "Wie heißt dieses Zeichen?",
        answer: entry.name,
        answerKind: "name" as const,
        options: shuffle([entry.name, ...distractors])
      };
    }

    return {
      id: entry.id,
      entryId: entry.id,
      prompt: `Was macht ${entry.name}?`,
      answer: entry.effect,
      answerKind: "effect" as const,
      options: shuffle([entry.effect, ...distractors])
    };
  });
}

export default function LettersPlusScreen() {
  useRecordLearningPath({ label: "Stufe 1+: Vokalzeichen", route: "/letters-plus" });
  const groupedDiacritics = useMemo(
    () =>
      GROUP_ORDER.map((group) => ({
        group,
        items: diacritics.filter((entry) => entry.group === group)
      })),
    []
  );
  const [activeGroup, setActiveGroup] = useState<(typeof GROUP_ORDER)[number]>("Grundzeichen");
  const currentGroupEntries =
    groupedDiacritics.find((section) => section.group === activeGroup)?.items ??
    groupedDiacritics[0].items;
  const [selectedId, setSelectedId] = useState<string>(currentGroupEntries[0]?.id ?? "");
  const selectedEntry =
    currentGroupEntries.find((entry) => entry.id === selectedId) ?? currentGroupEntries[0];
  const quizQuestions = useMemo(() => buildQuizQuestions(currentGroupEntries), [currentGroupEntries]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<"correct" | "wrong" | null>(null);
  const [quizLocked, setQuizLocked] = useState(false);
  const { height } = useWindowDimensions();
  const compactLayout = height < 760;
  const [completedGroups, setCompletedGroups] = useState<Record<(typeof GROUP_ORDER)[number], boolean>>(
    {
      Grundzeichen: false,
      Verdopplung: false,
      Endungen: false
    }
  );
  const currentQuestion = quizQuestions[quizIndex % quizQuestions.length];
  const currentQuestionEntry =
    currentGroupEntries.find((entry) => entry.id === currentQuestion.entryId) ??
    currentGroupEntries[0];

  function selectGroup(group: (typeof GROUP_ORDER)[number]) {
    setActiveGroup(group);
    const firstItem = groupedDiacritics.find((section) => section.group === group)?.items[0];
    if (firstItem) {
      setSelectedId(firstItem.id);
    }
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizResult(null);
    setQuizLocked(false);
  }

  const groupProgress = GROUP_ORDER.filter((group) => completedGroups[group]).length;
  const allGroupsDone = groupProgress === GROUP_ORDER.length;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, compactLayout && styles.containerCompact]}
      bounces={false}
    >
      <ScreenHeader
        title="Stufe 1+: Vokalzeichen"
        subtitle="Kleine Zeichen, die das Lesen und die Aussprache verändern."
      />

      <View style={[styles.introCard, compactLayout && styles.introCardCompact]}>
        <Text style={styles.introTag}>Tashkīl / Harakāt</Text>
        <Text style={styles.introTitle}>Die Zeichen über und unter den Buchstaben</Text>
        <Text style={styles.introText}>
          Tippe auf ein Zeichen, um Wirkung und Beispiel zu sehen. So lernst du die Markierungen
          ruhig und Schritt für Schritt.
        </Text>
      </View>

      <View style={[styles.progressCard, compactLayout && styles.progressCardCompact]}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Gruppen gelernt</Text>
          <Text style={styles.progressValue}>
            {groupProgress} / {GROUP_ORDER.length}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(groupProgress / GROUP_ORDER.length) * 100}%` }]} />
        </View>
        <View style={styles.progressPills}>
          {GROUP_ORDER.map((group) => (
            <View key={group} style={[styles.progressPill, completedGroups[group] && styles.progressPillDone]}>
              <Text style={[styles.progressPillText, completedGroups[group] && styles.progressPillTextDone]}>
                {completedGroups[group] ? "✓ " : ""}
                {group}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.lessonTabs}>
        {GROUP_ORDER.map((group) => (
          <Pressable
            key={group}
            onPress={() => selectGroup(group)}
            style={({ pressed }) => [
              styles.lessonTab,
              activeGroup === group && styles.lessonTabActive,
              pressed && styles.lessonTabPressed
            ]}
          >
            <Text style={[styles.lessonTabText, activeGroup === group && styles.lessonTabTextActive]}>
              {group}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.summaryCard, compactLayout && styles.summaryCardCompact]}>
        <Text style={styles.summaryTitle}>Aktuell gewählt</Text>
        <Text style={[styles.summarySymbol, compactLayout && styles.summarySymbolCompact]}>
          {selectedEntry.symbol}
        </Text>
        <Text style={styles.summaryName}>{selectedEntry.name}</Text>
        <Text style={styles.summaryEffect}>{selectedEntry.effect}</Text>
        <Text style={[styles.summaryExample, compactLayout && styles.summaryExampleCompact]}>
          {selectedEntry.exampleArabic}
        </Text>
        <Text style={styles.summaryFranko}>{selectedEntry.exampleFranko}</Text>
        <Text style={styles.summaryMeaning}>{selectedEntry.meaningGerman}</Text>
      </View>

      <View style={styles.groupList}>
        {groupedDiacritics
          .filter((section) => section.group === activeGroup)
          .map((section) => (
            <View key={section.group} style={styles.groupCard}>
              <Text style={styles.groupTitle}>{section.group}</Text>
              <View style={styles.symbolGrid}>
                {section.items.map((entry) => {
                  const active = entry.id === selectedId;
                  return (
                    <Pressable
                      key={entry.id}
                      onPress={() => {
                        setSelectedId(entry.id);
                        recordLearningPoint(1);
                      }}
                      style={({ pressed }) => [
                        styles.symbolCard,
                        active && styles.symbolCardActive,
                        pressed && styles.symbolCardPressed
                      ]}
                    >
                      <Text style={[styles.symbol, active && styles.symbolActive]}>{entry.symbol}</Text>
                      <Text style={[styles.symbolName, active && styles.symbolNameActive]}>
                        {entry.name}
                      </Text>
                      <Text style={styles.symbolEffect} numberOfLines={2}>
                        {entry.effect}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
      </View>

      <View style={[styles.tipCard, compactLayout && styles.tipCardCompact]}>
        <Text style={styles.tipTitle}>Lesehilfe</Text>
        <Text style={styles.tipText}>
          Ein Vokalzeichen macht aus einem harten Konsonanten ein lesbares kleines Wortstück.
          Mit Sukun endet der Laut, mit Shadda wird er verdoppelt.
        </Text>
      </View>

      <LearningCard>
        <Text style={styles.quizTitle}>Mini-Übung: {activeGroup}</Text>
        <Text style={[styles.quizPrompt, compactLayout && styles.quizPromptCompact]}>
          {currentQuestion.prompt}
        </Text>
        <View style={[styles.quizSymbolCard, compactLayout && styles.quizSymbolCardCompact]}>
          <Text style={styles.quizSymbolLabel}>Zeichen</Text>
          <Text style={[styles.quizSymbol, compactLayout && styles.quizSymbolCompact]}>
            {currentQuestionEntry.symbol}
          </Text>
        </View>
        <View style={styles.quizOptions}>
          {currentQuestion.options.map((option) => {
            const active = selectedAnswer === option;
            const correct = option === currentQuestion.answer && quizResult === "correct";
            const wrong = active && quizResult === "wrong";

            return (
              <Pressable
                key={option}
                onPress={() => {
                  if (quizLocked) {
                    return;
                  }

                  setSelectedAnswer(option);
                  if (option === currentQuestion.answer) {
                    setQuizResult("correct");
                    setQuizLocked(true);
                    setCompletedGroups((current) => ({
                      ...current,
                      [activeGroup]: true
                    }));
                    recordLearningPoint(1);
                    return;
                  }

                  setQuizResult("wrong");
                }}
                style={({ pressed }) => [
                  styles.quizOption,
                  correct && styles.quizOptionCorrect,
                  wrong && styles.quizOptionWrong,
                  pressed && styles.quizOptionPressed
                ]}
              >
                <Text
                  style={[
                    styles.quizOptionText,
                    correct && styles.quizOptionTextCorrect,
                    wrong && styles.quizOptionTextWrong
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {quizResult ? (
          <Text
            style={[
              styles.quizFeedback,
              quizResult === "correct" && styles.quizFeedbackCorrect,
              quizResult === "wrong" && styles.quizFeedbackWrong
            ]}
          >
            {quizResult === "correct"
              ? "Richtig. Weiter zum nächsten Zeichen."
              : `Fast. Richtig ist: ${currentQuestion.answer}`}
          </Text>
        ) : null}
        <View style={styles.quizActions}>
          <PrimaryButton
            label="Nächstes Zeichen"
            onPress={() => {
              setQuizIndex((current) => (current + 1) % quizQuestions.length);
              setSelectedAnswer(null);
              setQuizResult(null);
              setQuizLocked(false);
            }}
          />
          <PrimaryButton
            label="Neu mischen"
            variant="ghost"
            onPress={() => {
              setQuizIndex(0);
              setSelectedAnswer(null);
              setQuizResult(null);
              setQuizLocked(false);
            }}
          />
        </View>
      </LearningCard>

      {allGroupsDone ? (
        <View style={styles.finishCard}>
          <Text style={styles.finishTitle}>Alle drei Gruppen geschafft</Text>
          <Text style={styles.finishText}>
            Du hast Grundzeichen, Verdopplung und Endungen ruhig durchgearbeitet. Die Vokalzeichen
            sind jetzt gesammelt im Kopf und bereit für die nächsten Lesewege.
          </Text>
          <View style={styles.finishPill}>
            <Text style={styles.finishPillText}>3 / 3 Gruppen abgeschlossen</Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 16,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background
  },
  containerCompact: {
    paddingTop: 8,
    gap: 8
  },
  introCard: {
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    gap: 8
  },
  introCardCompact: {
    padding: 10,
    gap: 6
  },
  introTag: {
    fontSize: 12,
    color: theme.colors.accent,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  introTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    color: theme.colors.text
  },
  introText: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.mutedText
  },
  lessonTabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  lessonTab: {
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  lessonTabActive: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accent
  },
  lessonTabPressed: {
    opacity: 0.9
  },
  lessonTabText: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: "700"
  },
  lessonTabTextActive: {
    color: theme.colors.accent
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    gap: 6,
    alignItems: "center"
  },
  summaryCardCompact: {
    padding: 10,
    gap: 4
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.mutedText,
    textTransform: "uppercase",
    letterSpacing: 0.7
  },
  summarySymbol: {
    fontSize: 42,
    color: theme.colors.text,
    fontWeight: "700"
  },
  summarySymbolCompact: {
    fontSize: 36
  },
  summaryName: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: "700"
  },
  summaryEffect: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.mutedText,
    textAlign: "center"
  },
  summaryExample: {
    fontSize: 28,
    color: theme.colors.text,
    writingDirection: "rtl",
    marginTop: 4
  },
  summaryExampleCompact: {
    fontSize: 24
  },
  summaryFranko: {
    fontSize: 16,
    color: theme.colors.accent,
    fontWeight: "700"
  },
  summaryMeaning: {
    fontSize: 13,
    color: theme.colors.mutedText,
    textAlign: "center"
  },
  groupList: {
    gap: theme.spacing.md
  },
  progressCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    gap: 8
  },
  progressCardCompact: {
    padding: 10,
    gap: 6
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  progressLabel: {
    fontSize: 13,
    color: theme.colors.mutedText,
    fontWeight: "700"
  },
  progressValue: {
    fontSize: 13,
    color: theme.colors.accent,
    fontWeight: "700"
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.track,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: theme.colors.accent
  },
  progressPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  progressPill: {
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  progressPillDone: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accent
  },
  progressPillText: {
    fontSize: 11,
    color: theme.colors.text,
    fontWeight: "700"
  },
  progressPillTextDone: {
    color: theme.colors.accent
  },
  groupCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    gap: 10
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text
  },
  symbolGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  symbolCard: {
    width: "48%",
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundAlt,
    padding: 12,
    gap: 4,
    minHeight: 114
  },
  symbolCardActive: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accentSoft
  },
  symbolCardPressed: {
    transform: [{ scale: 0.99 }]
  },
  symbol: {
    fontSize: 34,
    color: theme.colors.text,
    textAlign: "center"
  },
  symbolActive: {
    color: theme.colors.accent
  },
  symbolName: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text
  },
  symbolNameActive: {
    color: theme.colors.accent
  },
  symbolEffect: {
    fontSize: 11,
    lineHeight: 16,
    color: theme.colors.mutedText
  },
  tipCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    gap: 6
  },
  tipCardCompact: {
    padding: 10,
    gap: 5
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text
  },
  tipText: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.mutedText
  },
  quizTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text
  },
  quizPrompt: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.text,
    fontWeight: "600"
  },
  quizPromptCompact: {
    fontSize: 15,
    lineHeight: 20
  },
  quizSymbolCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundAlt,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 3
  },
  quizSymbolCardCompact: {
    paddingVertical: 9,
    paddingHorizontal: 12
  },
  quizSymbolLabel: {
    fontSize: 12,
    color: theme.colors.mutedText,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7
  },
  quizSymbol: {
    fontSize: 48,
    color: theme.colors.accent,
    fontWeight: "700"
  },
  quizSymbolCompact: {
    fontSize: 38
  },
  quizOptions: {
    gap: 8
  },
  quizOption: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  quizOptionPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }]
  },
  quizOptionCorrect: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accentSoft
  },
  quizOptionWrong: {
    borderColor: "#D77A7A",
    backgroundColor: "#FDECEC"
  },
  quizOptionText: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text,
    fontWeight: "600"
  },
  quizOptionTextCorrect: {
    color: theme.colors.accent
  },
  quizOptionTextWrong: {
    color: "#B24B4B"
  },
  quizFeedback: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700"
  },
  quizFeedbackCorrect: {
    color: theme.colors.accent
  },
  quizFeedbackWrong: {
    color: "#B24B4B"
  },
  quizActions: {
    gap: theme.spacing.sm
  },
  finishCard: {
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    gap: 6
  },
  finishTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text
  },
  finishText: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.mutedText
  },
  finishPill: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 2
  },
  finishPillText: {
    fontSize: 12,
    color: theme.colors.accent,
    fontWeight: "700"
  }
});
