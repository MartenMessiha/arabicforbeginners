import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { ScreenHeader } from "../components/ScreenHeader";
import { theme } from "../theme/theme";
import { diacritics } from "../data/diacritics";
import { useRecordLearningPath } from "../utils/learningPath";
import { recordLearningPoint } from "../utils/learningProgress";

const GROUP_ORDER = ["Grundzeichen", "Verdopplung", "Endungen"] as const;

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
  const [selectedId, setSelectedId] = useState<string>(diacritics[0]?.id ?? "");
  const selectedEntry = diacritics.find((entry) => entry.id === selectedId) ?? diacritics[0];

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <ScreenHeader
        title="Stufe 1+: Vokalzeichen"
        subtitle="Kleine Zeichen, die das Lesen und die Aussprache verändern."
      />

      <View style={styles.introCard}>
        <Text style={styles.introTag}>Tashkīl / Harakāt</Text>
        <Text style={styles.introTitle}>Die Zeichen über und unter den Buchstaben</Text>
        <Text style={styles.introText}>
          Tippe auf ein Zeichen, um Wirkung und Beispiel zu sehen. So lernst du die Markierungen
          ruhig und Schritt für Schritt.
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Aktuell gewählt</Text>
        <Text style={styles.summarySymbol}>{selectedEntry.symbol}</Text>
        <Text style={styles.summaryName}>{selectedEntry.name}</Text>
        <Text style={styles.summaryEffect}>{selectedEntry.effect}</Text>
        <Text style={styles.summaryExample}>{selectedEntry.exampleArabic}</Text>
        <Text style={styles.summaryFranko}>{selectedEntry.exampleFranko}</Text>
        <Text style={styles.summaryMeaning}>{selectedEntry.meaningGerman}</Text>
      </View>

      <View style={styles.groupList}>
        {groupedDiacritics.map((section) => (
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

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>Lesehilfe</Text>
        <Text style={styles.tipText}>
          Ein Vokalzeichen macht aus einem harten Konsonanten ein lesbares kleines Wortstück.
          Mit Sukun endet der Laut, mit Shadda wird er verdoppelt.
        </Text>
      </View>
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
  introCard: {
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    gap: 8
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
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    gap: 6,
    alignItems: "center"
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
    minHeight: 120
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
  tipTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text
  },
  tipText: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.mutedText
  }
});
