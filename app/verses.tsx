import { useMemo, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, Pressable, View } from "react-native";
import { DropdownSection } from "../components/DropdownSection";
import { ScreenHeader } from "../components/ScreenHeader";
import { verses } from "../data/verses";
import { theme } from "../theme/theme";
import { recordLearningPoint } from "../utils/learningProgress";
import { useRecordLearningPath } from "../utils/learningPath";

type VerseKey = `${string}-${number}`;

const CATEGORY_ORDER = ["Bibel", "Agpeya", "Basilius", "Gregorios", "Kyrillos"] as const;

function groupVerses() {
  return CATEGORY_ORDER.map((category) => ({
    category,
    verses: verses.filter((verse) => verse.category === category)
  }));
}

function VerseCard({
  verse,
  expanded,
  onPress
}: {
  verse: (typeof verses)[number];
  expanded: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.verseCard,
        expanded && styles.verseCardExpanded,
        pressed && styles.verseCardPressed
      ]}
    >
      <View style={styles.verseHeader}>
        <Text style={styles.category}>{verse.category}</Text>
        <Text style={styles.toggleLabel}>{expanded ? "Bedeutung anzeigen" : "Franko anzeigen"}</Text>
      </View>
      <Text style={styles.arabic}>{verse.arabic}</Text>
      {expanded ? (
        <View style={styles.revealBlock}>
          <Text style={styles.franko}>{verse.franko}</Text>
          <Text style={styles.german}>{verse.german}</Text>
          <Text style={styles.revealHint}>Tippe erneut, um sie zu schließen.</Text>
        </View>
      ) : (
        <Text style={styles.revealHint}>Tippe, um Franko und Bedeutung anzuzeigen.</Text>
      )}
    </Pressable>
  );
}

export default function VersesLevelScreen() {
  useRecordLearningPath({ label: "Stufe 5: Verse", route: "/verses" });
  const sections = useMemo(() => groupVerses(), []);
  const sectionCards = useMemo(
    () =>
      sections.map((section) => ({
        ...section,
        subtitle: `${section.verses.length} Beispiele`
      })),
    [sections]
  );
  const [openSection, setOpenSection] = useState<string>("Bibel");
  const [expandedVerses, setExpandedVerses] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<string>("Wähle einen Vers.");

  function toggleVerse(key: VerseKey) {
    setExpandedVerses((current) => ({
      ...current,
      [key]: !current[key]
    }));
    setStatus("Vers sichtbar.");
    recordLearningPoint(1);
  }

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false} stickyHeaderIndices={[0]}>
      <ScreenHeader
        title="Stufe 5: Verse lesen"
        subtitle="Verse aus Bibel, Agpeya und der koptisch-orthodoxen Messe."
      />

      <View style={styles.liturgicalCard}>
        <Text style={styles.liturgicalTag}>Liturgische Quellen</Text>
        <Text style={styles.liturgicalTitle}>Bibel, Agpeya und Messe in klarer Reihenfolge</Text>
        <Text style={styles.liturgicalText}>
          Erst die Bibel, dann die Agpeya und zuletzt die Liturgien von Basilius, Gregorios und
          Kyrillos.
        </Text>
        <View style={styles.orderRow}>
          <View style={styles.orderPill}>
            <Text style={styles.orderPillText}>Bibel</Text>
          </View>
          <View style={styles.orderPill}>
            <Text style={styles.orderPillText}>Agpeya</Text>
          </View>
          <View style={styles.orderPill}>
            <Text style={styles.orderPillText}>Messe</Text>
          </View>
        </View>
      </View>

      <View style={styles.introCard}>
        <Text style={styles.introTitle}>Ruhiges Lesetraining</Text>
        <Text style={styles.introText}>
          Tippe auf einen Vers, um Franko und Bedeutung anzuzeigen. Die Kategorien sind als
          Dropdowns aufgebaut, damit du dich auf eine Quelle nach der anderen konzentrierst.
        </Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.list}>
        {sectionCards.map((section) => (
          <DropdownSection
            key={section.category}
            title={section.category}
            subtitle={section.subtitle}
            expanded={openSection === section.category}
            onPress={() =>
              setOpenSection((current) => (current === section.category ? "" : section.category))
            }
          >
            <View style={styles.verseStack}>
              {section.verses.map((verse, index) => {
                const key = `${section.category}-${index}` as VerseKey;
                return (
                  <VerseCard
                    key={key}
                    verse={verse}
                    expanded={Boolean(expandedVerses[key])}
                    onPress={() => toggleVerse(key)}
                  />
                );
              })}
            </View>
          </DropdownSection>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 4,
    paddingBottom: theme.spacing.xl,
    gap: 14,
    backgroundColor: theme.colors.background
  },
  liturgicalCard: {
    backgroundColor: "#F3F8F1",
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "rgba(66,107,79,0.24)",
    padding: 18,
    gap: 8
  },
  liturgicalTag: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.accent,
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  liturgicalTitle: {
    fontSize: Platform.select({ ios: 21, android: 20, default: 21 }),
    lineHeight: Platform.select({ ios: 28, android: 26, default: 28 }),
    color: theme.colors.text,
    fontWeight: "700"
  },
  liturgicalText: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.mutedText
  },
  orderRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4
  },
  orderPill: {
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  orderPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.text
  },
  introCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    gap: 8
  },
  introTitle: {
    fontSize: Platform.select({ ios: 19, android: 18, default: 19 }),
    fontWeight: "700",
    color: theme.colors.text
  },
  introText: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.mutedText
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
  list: {
    gap: 12
  },
  verseStack: {
    gap: 10
  },
  verseCard: {
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    gap: 8
  },
  verseCardExpanded: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accent
  },
  verseCardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }]
  },
  arabic: {
    fontSize: Platform.select({ ios: 24, android: 23, default: 24 }),
    lineHeight: Platform.select({ ios: 36, android: 34, default: 36 }),
    textAlign: "right",
    writingDirection: "rtl",
    color: theme.colors.text
  },
  verseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8
  },
  category: {
    fontSize: Platform.select({ ios: 13, android: 12, default: 13 }),
    lineHeight: 16,
    color: theme.colors.accent,
    fontWeight: "700"
  },
  toggleLabel: {
    fontSize: Platform.select({ ios: 12, android: 11, default: 12 }),
    lineHeight: 16,
    color: theme.colors.mutedText,
    fontWeight: "600"
  },
  revealBlock: {
    gap: 8
  },
  franko: {
    fontSize: 17,
    lineHeight: 24,
    color: theme.colors.text,
    fontWeight: "700"
  },
  german: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.mutedText
  },
  revealHint: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.mutedText
  }
});
