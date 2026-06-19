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
    paddingTop: 6,
    paddingBottom: theme.spacing.xl,
    gap: 8,
    backgroundColor: theme.colors.background
  },
  arabicWord: {
    fontSize: Platform.select({ ios: 38, android: 36, default: 38 }),
    lineHeight: Platform.select({ ios: 46, android: 44, default: 46 }),
    textAlign: "center",
    writingDirection: "rtl",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  helperText: {
    textAlign: "center",
    fontSize: Platform.select({ ios: 16, android: 15, default: 16 }),
    color: theme.colors.mutedText,
    lineHeight: Platform.select({ ios: 24, android: 22, default: 24 })
  },
  franko: {
    textAlign: "center",
    fontSize: Platform.select({ ios: 26, android: 24, default: 26 }),
    lineHeight: Platform.select({ ios: 32, android: 30, default: 32 }),
    color: theme.colors.text,
    fontWeight: "700",
    marginBottom: 8
  },
  meaning: {
    textAlign: "center",
    fontSize: Platform.select({ ios: 18, android: 17, default: 18 }),
    lineHeight: Platform.select({ ios: 24, android: 22, default: 24 }),
    color: theme.colors.mutedText
  },
  category: {
    textAlign: "center",
    marginTop: 12,
    fontSize: Platform.select({ ios: 14, android: 13, default: 14 }),
    lineHeight: 18,
    color: theme.colors.accent
  },
  actions: {
    gap: 8
  },
  statusCard: {
    backgroundColor: "#FBF8F1",
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 8,
    paddingHorizontal: 11
  },
  statusText: {
    fontSize: Platform.select({ ios: 14, android: 13, default: 14 }),
    lineHeight: 18,
    color: theme.colors.accent,
    fontWeight: "600"
  },
  progressBlock: {
    gap: 6
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  progressLabel: {
    fontSize: Platform.select({ ios: 14, android: 13, default: 14 }),
    color: theme.colors.mutedText
  },
  footerCard: {
    backgroundColor: "#FBF8F1",
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: 12,
    gap: 5
  },
  footerText: {
    fontSize: Platform.select({ ios: 14, android: 13, default: 14 }),
    lineHeight: 18,
    color: theme.colors.mutedText
  },
  footerWord: {
    fontSize: Platform.select({ ios: 22, android: 20, default: 22 }),
    lineHeight: Platform.select({ ios: 28, android: 26, default: 28 }),
    color: theme.colors.text,
    writingDirection: "rtl",
    textAlign: "right"
  }
});
