import { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions
} from "react-native";
import { LearningCard } from "../components/LearningCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { ScreenHeader } from "../components/ScreenHeader";
import { writingExercises } from "../data/writingExercises";
import { theme } from "../theme/theme";
import { recordLearningPoint } from "../utils/learningProgress";
import { shuffle } from "../utils/shuffle";
import { useRecordLearningPath } from "../utils/learningPath";

function normalizeArabicText(value: string) {
  return value
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[ى]/g, "ي")
    .replace(/\s+/g, "")
    .trim();
}

export default function WritingLevelScreen() {
  useRecordLearningPath({ label: "Stufe 6: Schreiben", route: "/writing" });
  const [difficulty, setDifficulty] = useState<"gemischt" | "leicht" | "mittel" | "schwer">(
    "gemischt"
  );
  const deck = useMemo(() => {
    const shuffled = shuffle(writingExercises);
    if (difficulty === "gemischt") {
      return shuffled;
    }

    const filtered = shuffled.filter((entry) => entry.difficulty === difficulty);
    return filtered.length > 0 ? filtered : shuffled;
  }, [difficulty]);
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState("Schreibe das arabische Wort selbst.");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const { height } = useWindowDimensions();
  const compactLayout = height < 760;

  const current = deck[index % deck.length];

  useEffect(() => {
    setIndex(0);
    setInputValue("");
    setStatus("Schreibe das arabische Wort selbst.");
    setResult(null);
    setShowSolution(false);
    setSolvedCount(0);
  }, [difficulty]);

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [index]);

  function checkAnswer() {
    if (!inputValue.trim()) {
      setStatus("Schreibe zuerst ein Wort in Arabisch.");
      setResult(null);
      return;
    }

    const normalizedInput = normalizeArabicText(inputValue);
    const normalizedAnswer = normalizeArabicText(current.arabic);
    const isCorrect = normalizedInput === normalizedAnswer;

    setResult(isCorrect ? "correct" : "wrong");
    setShowSolution(true);

    if (isCorrect) {
      setSolvedCount((value) => value + 1);
      setStatus("Richtig. Gut geschrieben.");
      recordLearningPoint(1);
      return;
    }

    setStatus(`Fast. Richtig ist: ${current.arabic}`);
  }

  function nextWord() {
    setIndex((value) => (value + 1) % deck.length);
    setInputValue("");
    setStatus("Nächstes Wort bereit.");
    setResult(null);
    setShowSolution(false);
  }

  function revealSolution() {
    setShowSolution(true);
    setStatus("Lösung angezeigt.");
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={[styles.container, compactLayout && styles.containerCompact]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          bounces={false}
        >
          <ScreenHeader
            title="Stufe 6: Schreiben"
            subtitle="Schreibe die arabischen Wörter selbst. Die Tastatur verdeckt nichts."
          />

          <View style={[styles.introCard, compactLayout && styles.introCardCompact]}>
            <Text style={styles.introTag}>Schreibmodus</Text>
            <Text style={styles.introTitle}>Sieh das Wort, dann schreibe es in Arabisch.</Text>
            <Text style={styles.introText}>
              Du bekommst Bedeutung und Umschrift als Hilfe. Danach tippst du das Wort selbst.
            </Text>
          </View>

          <View style={styles.difficultyRow}>
            {[
              { key: "gemischt" as const, label: "Gemischt" },
              { key: "leicht" as const, label: "Leicht" },
              { key: "mittel" as const, label: "Mittel" },
              { key: "schwer" as const, label: "Schwer" }
            ].map((item) => (
              <Pressable
                key={item.key}
                onPress={() => setDifficulty(item.key)}
                style={({ pressed }) => [
                  styles.difficultyChip,
                  difficulty === item.key && styles.difficultyChipActive,
                  pressed && styles.difficultyChipPressed
                ]}
              >
                <Text
                  style={[
                    styles.difficultyChipText,
                    difficulty === item.key && styles.difficultyChipTextActive
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <LearningCard style={[styles.boardCard, compactLayout && styles.boardCardCompact]}>
            <View style={styles.practiceHeader}>
              <View>
                <Text style={styles.practiceLabel}>Wort schreiben</Text>
                <Text style={styles.practiceTitle}>
                  Wort {index + 1} / {deck.length}
                </Text>
              </View>
              <View style={styles.practiceBadge}>
                <Text style={styles.practiceBadgeText}>{solvedCount} richtig</Text>
              </View>
            </View>

            <View style={[styles.promptCard, compactLayout && styles.promptCardCompact]}>
              <Text style={styles.promptLabel}>Bedeutung</Text>
              <Text style={styles.promptMeaning}>{current.german}</Text>
              <Text style={styles.promptFranko}>{current.franko}</Text>
              <Text style={styles.promptHint}>Von rechts nach links schreiben.</Text>
            </View>

            <View style={[styles.inputCard, result === "correct" && styles.inputCardCorrect, result === "wrong" && styles.inputCardWrong]}>
              <Text style={styles.inputLabel}>Arabisch schreiben</Text>
              <TextInput
                ref={inputRef}
                value={inputValue}
                onChangeText={(text) => {
                  setInputValue(text);
                  if (result) {
                    setResult(null);
                  }
                }}
                onSubmitEditing={checkAnswer}
                placeholder="اكتب الكلمة هنا"
                placeholderTextColor={theme.colors.mutedText}
                style={styles.input}
                autoCorrect={false}
                spellCheck={false}
                textAlign="right"
                autoCapitalize="none"
                returnKeyType="done"
              />
            </View>

            <View style={styles.buttonStack}>
              <PrimaryButton label="Prüfen" onPress={checkAnswer} />
              <PrimaryButton label="Lösung anzeigen" variant="ghost" onPress={revealSolution} />
              <PrimaryButton label="Nächstes Wort" variant="ghost" onPress={nextWord} />
            </View>
          </LearningCard>

          {showSolution ? (
            <View style={styles.solutionCard}>
              <Text style={styles.solutionLabel}>Lösung</Text>
              <Text style={styles.solutionArabic}>{current.arabic}</Text>
            </View>
          ) : null}

          <View style={styles.feedbackCard}>
            <Text
              style={[
                styles.feedbackText,
                result === "correct" && styles.feedbackTextCorrect,
                result === "wrong" && styles.feedbackTextWrong
              ]}
            >
              {status}
            </Text>
            <Text style={styles.feedbackSubtext}>
              Schreibe ruhig, prüfe dann und gehe mit dem nächsten Wort weiter.
            </Text>
          </View>

          <View style={styles.progressBlock}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Richtig geschrieben: {solvedCount}</Text>
              <Text style={styles.progressLabel}>{Math.min(index + 1, deck.length)} / {deck.length}</Text>
            </View>
            <ProgressBar progress={Math.min(solvedCount / deck.length, 1)} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 12,
    paddingBottom: 160,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background
  },
  containerCompact: {
    paddingTop: 8,
    gap: 10,
    paddingBottom: 180
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
    padding: 12,
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
  difficultyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  difficultyChip: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  difficultyChipActive: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accent
  },
  difficultyChipPressed: {
    opacity: 0.92
  },
  difficultyChipText: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: "700"
  },
  difficultyChipTextActive: {
    color: theme.colors.accent
  },
  boardCard: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accent,
    borderWidth: 1,
    padding: 14,
    gap: 10
  },
  boardCardCompact: {
    padding: 12,
    gap: 8
  },
  practiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 8
  },
  practiceLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.accent,
    letterSpacing: 0.7,
    textTransform: "uppercase"
  },
  practiceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: 2
  },
  practiceBadge: {
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  practiceBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.accent
  },
  promptCard: {
    backgroundColor: "#F9F7F0",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: 14,
    gap: 6,
    marginBottom: 10
  },
  promptCardCompact: {
    padding: 12,
    gap: 5
  },
  promptLabel: {
    fontSize: 12,
    color: theme.colors.mutedText,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7
  },
  promptMeaning: {
    fontSize: 20,
    lineHeight: 28,
    color: theme.colors.text,
    fontWeight: "700"
  },
  promptFranko: {
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.accent,
    fontWeight: "700"
  },
  promptHint: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.colors.mutedText,
    marginTop: 2
  },
  inputCard: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 14,
    gap: 8
  },
  inputCardCorrect: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accentSoft
  },
  inputCardWrong: {
    borderColor: "#D77A7A",
    backgroundColor: "#FDECEC"
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text
  },
  input: {
    minHeight: 84,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundAlt,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 30,
    color: theme.colors.text,
    writingDirection: "rtl",
    textAlign: "right",
    textAlignVertical: "center"
  },
  buttonStack: {
    gap: 10,
    marginTop: 12
  },
  solutionCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: 14,
    gap: 6
  },
  solutionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.mutedText,
    textTransform: "uppercase",
    letterSpacing: 0.7
  },
  solutionArabic: {
    fontSize: 32,
    lineHeight: 40,
    color: theme.colors.text,
    writingDirection: "rtl",
    textAlign: "right"
  },
  feedbackCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: 14,
    gap: 6
  },
  feedbackText: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
    color: theme.colors.text
  },
  feedbackTextCorrect: {
    color: theme.colors.accent
  },
  feedbackTextWrong: {
    color: "#B24B4B"
  },
  feedbackSubtext: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.colors.mutedText
  },
  progressBlock: {
    gap: 8
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  },
  progressLabel: {
    fontSize: 13,
    color: theme.colors.mutedText,
    fontWeight: "700"
  }
});
