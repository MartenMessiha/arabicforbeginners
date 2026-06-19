import { useMemo, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { LearningCard } from "../components/LearningCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { ScreenHeader } from "../components/ScreenHeader";
import { paragraphs } from "../data/paragraphs";
import { pickNextIndex } from "../utils/learningCycle";
import { shuffle } from "../utils/shuffle";
import { theme } from "../theme/theme";
import { recordLearningPoint } from "../utils/learningProgress";
import { useRecordLearningPath } from "../utils/learningPath";

export default function ParagraphLevelScreen() {
  useRecordLearningPath({ label: "Stufe 4: Absätze", route: "/paragraphs" });
  const deck = useMemo(() => shuffle(paragraphs), []);
  const displayTotal = 100;
  const [index, setIndex] = useState(0);
  const [showFranko, setShowFranko] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [recent, setRecent] = useState<number[]>([0]);
  const [status, setStatus] = useState<string>("Bereit zum Lesen.");

  const current = deck[index % deck.length];

  function nextParagraph() {
    const nextIndex = pickNextIndex(index, deck.length, recent);
    setRecent((currentRecent) => [...currentRecent, nextIndex].slice(-4));
    setIndex(nextIndex);
    setShowFranko(false);
    setShowMeaning(false);
    setStatus("Nächster Absatz bereit.");
  }

  return (
    <ScrollView contentContainerStyle={styles.container} stickyHeaderIndices={[0]}>
      <ScreenHeader
        title="Stufe 4: Absätze lesen"
        subtitle="Lies den Absatz ruhig. Tippe für Franko und Bedeutung."
      />

      <LearningCard>
        <Text style={styles.arabicParagraph}>{current.arabic}</Text>
        {showFranko ? <Text style={styles.franko}>{current.franko}</Text> : null}
        {showMeaning ? <Text style={styles.meaning}>{current.german}</Text> : null}
      </LearningCard>

      <View style={styles.actions}>
        <PrimaryButton
          label="Franko anzeigen"
          onPress={() => {
            setShowFranko((value) => !value);
            setStatus("Franko sichtbar.");
          }}
        />
        <PrimaryButton
          label="Bedeutung anzeigen"
          variant="ghost"
          onPress={() => {
            setShowMeaning((value) => !value);
            setStatus("Bedeutung sichtbar.");
          }}
        />
        <PrimaryButton
          label="Ich habe es gelesen"
          variant="ghost"
          onPress={() => {
            recordLearningPoint(1);
            setStatus("Gut gelesen.");
          }}
        />
        <PrimaryButton label="Nächster Absatz" onPress={nextParagraph} />
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Absatz {index + 1} von {displayTotal}</Text>
          <Text style={styles.progressLabel}>Langsam und ruhig</Text>
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
  arabicParagraph: {
    fontSize: Platform.select({ ios: 25, android: 24, default: 25 }),
    lineHeight: Platform.select({ ios: 40, android: 38, default: 40 }),
    color: theme.colors.text,
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: theme.spacing.md
  },
  franko: {
    fontSize: Platform.select({ ios: 18, android: 17, default: 18 }),
    lineHeight: Platform.select({ ios: 26, android: 24, default: 26 }),
    color: theme.colors.text,
    marginTop: 12
  },
  meaning: {
    fontSize: Platform.select({ ios: 17, android: 16, default: 17 }),
    lineHeight: Platform.select({ ios: 25, android: 23, default: 25 }),
    color: theme.colors.mutedText,
    marginTop: 10
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
