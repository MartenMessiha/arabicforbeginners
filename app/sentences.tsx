import { useMemo, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { FlipCard } from "../components/FlipCard";
import { LearningCard } from "../components/LearningCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { ScreenHeader } from "../components/ScreenHeader";
import { sentences } from "../data/sentences";
import { pickNextIndex } from "../utils/learningCycle";
import { shuffle } from "../utils/shuffle";
import { theme } from "../theme/theme";
import { recordLearningPoint } from "../utils/learningProgress";
import { useRecordLearningPath } from "../utils/learningPath";

export default function SentenceLevelScreen() {
  useRecordLearningPath({ label: "Stufe 3: Sätze", route: "/sentences" });
  const deck = useMemo(() => shuffle(sentences), []);
  const displayTotal = 100;
  const [index, setIndex] = useState(0);
  const [revealKey, setRevealKey] = useState(0);
  const [recent, setRecent] = useState<number[]>([0]);
  const [status, setStatus] = useState<string>("Bereit zum Lesen.");

  const current = deck[index % deck.length];

  function nextSentence() {
    const nextIndex = pickNextIndex(index, deck.length, recent);
    setRecent((currentRecent) => [...currentRecent, nextIndex].slice(-4));
    setIndex(nextIndex);
    setRevealKey((value) => value + 1);
    setStatus("Nächster Satz bereit.");
  }

  return (
    <ScrollView contentContainerStyle={styles.container} stickyHeaderIndices={[0]}>
      <ScreenHeader
        title="Stufe 3: Sätze lesen"
        subtitle="Lies den Satz. Tippe für Franko und Bedeutung."
      />

      <FlipCard
        key={`${current.arabic}-${revealKey}`}
        front={
          <LearningCard>
            <Text style={styles.arabicSentence}>{current.arabic}</Text>
          </LearningCard>
        }
        back={
          <LearningCard>
            <Text style={styles.franko}>{current.franko}</Text>
            <Text style={styles.meaning}>{current.german}</Text>
          </LearningCard>
        }
      />

      <View style={styles.actions}>
        <PrimaryButton label="Nächster Satz" onPress={nextSentence} />
        <PrimaryButton
          label="Ich habe es gelesen"
          variant="ghost"
          onPress={() => {
            recordLearningPoint(1);
            setStatus("Gut gelesen.");
          }}
        />
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Lesen: {index + 1} von {displayTotal}</Text>
          <Text style={styles.progressLabel}>Ruhiger Wechsel</Text>
        </View>
        <ProgressBar progress={(index + 1) / displayTotal} />
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
  arabicSentence: {
    fontSize: Platform.select({ ios: 32, android: 30, default: 32 }),
    lineHeight: Platform.select({ ios: 46, android: 42, default: 46 }),
    textAlign: "right",
    writingDirection: "rtl",
    color: theme.colors.text
  },
  franko: {
    textAlign: "center",
    fontSize: Platform.select({ ios: 22, android: 21, default: 22 }),
    lineHeight: 28,
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
  }
});
