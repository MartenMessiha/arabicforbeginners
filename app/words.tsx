import { useMemo, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { FlipCard } from "../components/FlipCard";
import { LearningCard } from "../components/LearningCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { ScreenHeader } from "../components/ScreenHeader";
import { words } from "../data/words";
import { pickNextIndex } from "../utils/learningCycle";
import { shuffle } from "../utils/shuffle";
import { theme } from "../theme/theme";
import { recordLearningPoint } from "../utils/learningProgress";
import { useRecordLearningPath } from "../utils/learningPath";

export default function WordLevelScreen() {
  useRecordLearningPath({ label: "Stufe 2: Wörter", route: "/words" });
  const deck = useMemo(() => shuffle(words), []);
  const displayTotal = 100;
  const [index, setIndex] = useState(0);
  const [known, setKnown] = useState(0);
  const [revealKey, setRevealKey] = useState(0);
  const [recent, setRecent] = useState<number[]>([0]);
  const [status, setStatus] = useState<string>("Bereit zum Lesen.");

  const current = deck[index % deck.length];

  function nextWord() {
    const nextIndex = pickNextIndex(index, deck.length, recent);
    setRecent((currentRecent) => [...currentRecent, nextIndex].slice(-4));
    setIndex(nextIndex);
    setRevealKey((value) => value + 1);
    setStatus("Nächstes Wort bereit.");
  }

  return (
    <ScrollView contentContainerStyle={styles.container} stickyHeaderIndices={[0]}>
      <ScreenHeader
        title="Stufe 2: Wörter lesen"
        subtitle="Lies das Wort laut. Tippe für Franko und Bedeutung."
      />

      <FlipCard
        key={`${current.arabic}-${revealKey}`}
        front={
          <LearningCard>
            <Text style={styles.arabicWord}>{current.arabic}</Text>
            <Text style={styles.helperText}>Lies das Wort laut. Tippe dann auf die Karte.</Text>
          </LearningCard>
        }
        back={
          <LearningCard>
            <Text style={styles.franko}>{current.franko}</Text>
            <Text style={styles.meaning}>{current.german}</Text>
            {current.category ? <Text style={styles.category}>{current.category}</Text> : null}
          </LearningCard>
        }
      />

      <View style={styles.actions}>
        <PrimaryButton label="Nächstes Wort" onPress={nextWord} />
        <PrimaryButton
          label="Ich habe es gelesen"
          variant="ghost"
          onPress={() => {
            setKnown((value) => value + 1);
            recordLearningPoint(1);
            setStatus("Gut gelesen.");
          }}
        />
        <PrimaryButton
          label="Nochmal üben"
          variant="ghost"
          onPress={() => {
            setRevealKey((value) => value + 1);
            setStatus("Noch einmal ruhig lesen.");
          }}
        />
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Gelesen: {known}</Text>
          <Text style={styles.progressLabel}>Karte {index + 1} von {displayTotal}</Text>
        </View>
        <ProgressBar progress={Math.min((known + 1) / displayTotal, 1)} />
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.footerText}>Schon geschafft: {known} Wörter</Text>
        <Text style={styles.footerWord}>{current.arabic}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 2,
    paddingBottom: theme.spacing.xl,
    gap: 12,
    backgroundColor: theme.colors.background
  },
  arabicWord: {
    fontSize: Platform.select({ ios: 40, android: 38, default: 40 }),
    lineHeight: Platform.select({ ios: 48, android: 46, default: 48 }),
    textAlign: "center",
    writingDirection: "rtl",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  helperText: {
    textAlign: "center",
    fontSize: Platform.select({ ios: 15, android: 14, default: 15 }),
    color: theme.colors.mutedText,
    lineHeight: Platform.select({ ios: 22, android: 20, default: 22 })
  },
  franko: {
    textAlign: "center",
    fontSize: Platform.select({ ios: 28, android: 26, default: 28 }),
    lineHeight: Platform.select({ ios: 34, android: 32, default: 34 }),
    color: theme.colors.text,
    fontWeight: "700",
    marginBottom: 10
  },
  meaning: {
    textAlign: "center",
    fontSize: Platform.select({ ios: 19, android: 18, default: 19 }),
    lineHeight: Platform.select({ ios: 26, android: 24, default: 26 }),
    color: theme.colors.mutedText
  },
  category: {
    textAlign: "center",
    marginTop: 14,
    fontSize: Platform.select({ ios: 13, android: 12, default: 13 }),
    lineHeight: 17,
    color: theme.colors.accent
  },
  actions: {
    gap: 10
  },
  statusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 12,
    paddingHorizontal: 14
  },
  statusText: {
    fontSize: Platform.select({ ios: 15, android: 14, default: 15 }),
    lineHeight: 20,
    color: theme.colors.accent,
    fontWeight: "600"
  },
  progressBlock: {
    gap: 8
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  progressLabel: {
    fontSize: Platform.select({ ios: 13, android: 12, default: 13 }),
    color: theme.colors.mutedText
  },
  footerCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.xl,
    padding: 14,
    gap: 6
  },
  footerText: {
    fontSize: Platform.select({ ios: 15, android: 14, default: 15 }),
    lineHeight: 20,
    color: theme.colors.mutedText
  },
  footerWord: {
    fontSize: Platform.select({ ios: 24, android: 22, default: 24 }),
    lineHeight: Platform.select({ ios: 30, android: 28, default: 30 }),
    color: theme.colors.text,
    writingDirection: "rtl",
    textAlign: "right"
  }
});
