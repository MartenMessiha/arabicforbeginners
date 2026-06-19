import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DropdownSection } from "../components/DropdownSection";
import { PrimaryButton } from "../components/PrimaryButton";
import { diacritics } from "../data/diacritics";
import { letters } from "../data/letters";
import { verses } from "../data/verses";
import { theme } from "../theme/theme";
import { ProgressBar } from "../components/ProgressBar";
import { useLearningProgress } from "../utils/learningProgress";
import { useLearningPath } from "../utils/learningPath";

export default function HomeScreen() {
  const [openSection, setOpenSection] = useState<string>("letters");
  const progress = useLearningProgress();
  const learningPath = useLearningPath();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const compactLayout = height < 760;
  const displayTotals = useMemo(() => {
    return {
      letters: letters.length,
      diacritics: diacritics.length,
      words: 100,
      sentences: 100,
      paragraphs: 100,
      verses: 100,
      writing: 100
    } as const;
  }, []);

  function exampleLabel(count: number) {
    return `${count} Beispiele`;
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        compactLayout && styles.containerCompact,
        { paddingTop: Math.max(insets.top, Platform.select({ ios: 12, android: 10, default: 12 })) }
      ]}
      bounces={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroHeading}>
          <Text style={styles.heroTitle}>Arabisch lesen</Text>
          <Text style={styles.heroSubtitle}>Buchstaben, Zeichen und Texte in ruhigen Schritten.</Text>
        </View>

        <View style={[styles.overviewCard, compactLayout && styles.overviewCardCompact]}>
          <View style={styles.focusHeader}>
            <View>
              <Text style={styles.focusLabel}>Weiterlernen</Text>
              <Text style={styles.focusTitle}>{learningPath.label}</Text>
            </View>
            <View style={styles.focusBadge}>
              <Text style={styles.focusBadgeText}>Empfohlen</Text>
            </View>
          </View>
          <Text style={styles.focusText}>
            Setze genau dort fort, wo du aufgehört hast. So bleibt der Lernfluss ruhig und klar.
          </Text>

          <View style={styles.goalRow}>
            <View>
              <Text style={styles.goalLabel}>Tagesziel</Text>
              <Text style={styles.goalValue}>
                {progress.points} / {progress.goal}
              </Text>
            </View>
            <View style={styles.goalBadge}>
              <Text style={styles.goalBadgeText}>Heute</Text>
            </View>
          </View>
          <ProgressBar progress={progress.points / progress.goal} />
          <Text style={styles.goalHint}>
            Ein kleiner Lernschritt für diese Sitzung. Lokal, ruhig und ohne Konto.
          </Text>

          <View style={styles.focusActions}>
            <PrimaryButton
              label="Weiter lernen"
              onPress={() => router.push(learningPath.route)}
              style={styles.focusPrimaryButton}
            />
            <PrimaryButton
              label="Neu starten"
              variant="ghost"
              onPress={() => setOpenSection("letters")}
              style={styles.focusSecondaryButton}
            />
          </View>
        </View>

      </View>

      <View style={styles.dropdownList}>
        <DropdownSection
          title="Stufe 1: Buchstaben"
          subtitle="Buchstabenformen sicher erkennen."
          icon="1"
          featured
          badge={`${displayTotals.letters} Zeichen`}
          expanded={openSection === "letters"}
          onPress={() => setOpenSection((current) => (current === "letters" ? "" : "letters"))}
        >
          <Text style={styles.dropdownText}>
            Wiederhole ruhig Anfang, Mitte und Ende, bis die Formen sitzen.
          </Text>
          <PrimaryButton label="Buchstaben starten" onPress={() => router.push("/letters")} />
        </DropdownSection>

        <DropdownSection
          title="Stufe 1+: Vokalzeichen"
          subtitle="Die Zeichen über und unter den Buchstaben."
          icon="+"
          badge={`${displayTotals.diacritics} Zeichen`}
          expanded={openSection === "letters-plus"}
          onPress={() =>
            setOpenSection((current) => (current === "letters-plus" ? "" : "letters-plus"))
          }
        >
          <Text style={styles.dropdownText}>
            Fatha, Kasra, Damma, Sukun, Shadda und die typischen Endungen machen das Lesen
            genauer.
          </Text>
          <PrimaryButton label="Vokalzeichen starten" onPress={() => router.push("/letters-plus")} />
        </DropdownSection>

        <DropdownSection
          title="Stufe 2: Wörter"
          subtitle="Wörter ruhig lesen."
          icon="2"
          badge={exampleLabel(displayTotals.words)}
          expanded={openSection === "words"}
          onPress={() => setOpenSection((current) => (current === "words" ? "" : "words"))}
        >
          <Text style={styles.dropdownText}>
            Wortkarten mit ruhigem Tap-to-reveal für Gebete, Kirche und Liturgie.
          </Text>
          <PrimaryButton label="Wörter starten" onPress={() => router.push("/words")} />
        </DropdownSection>

        <DropdownSection
          title="Stufe 3: Sätze"
          subtitle="Sätze ruhig erfassen."
          icon="3"
          badge={exampleLabel(displayTotals.sentences)}
          expanded={openSection === "sentences"}
          onPress={() => setOpenSection((current) => (current === "sentences" ? "" : "sentences"))}
        >
          <Text style={styles.dropdownText}>
            Große Karten, klare Zeilen und ruhige Rückmeldung bei jedem Tipp.
          </Text>
          <PrimaryButton label="Sätze starten" onPress={() => router.push("/sentences")} />
        </DropdownSection>

        <DropdownSection
          title="Stufe 4: Absätze"
          subtitle="Längere Texte ruhig lesen."
          icon="4"
          badge={exampleLabel(displayTotals.paragraphs)}
          expanded={openSection === "paragraphs"}
          onPress={() => setOpenSection((current) => (current === "paragraphs" ? "" : "paragraphs"))}
        >
          <Text style={styles.dropdownText}>
            Absätze zum langsamen Mitlesen mit Franko und Bedeutung auf Wunsch.
          </Text>
          <PrimaryButton label="Absätze starten" onPress={() => router.push("/paragraphs")} />
        </DropdownSection>

        <DropdownSection
          title="Stufe 5: Verse"
          subtitle="Bibel, Agpeya und Liturgie getrennt üben."
          icon="5"
          badge={`${verses.length} Beispiele`}
          expanded={openSection === "verses"}
          onPress={() => setOpenSection((current) => (current === "verses" ? "" : "verses"))}
        >
          <Text style={styles.dropdownText}>
            Verse aus Bibel, Agpeya und der koptisch-orthodoxen Messe, sauber nach Quellen
            sortiert.
          </Text>
          <PrimaryButton label="Verse starten" onPress={() => router.push("/verses")} />
        </DropdownSection>

        <DropdownSection
          title="Stufe 6: Schreiben"
          subtitle="Wörter selbst auf Arabisch schreiben."
          icon="6"
          badge={exampleLabel(displayTotals.writing)}
          expanded={openSection === "writing"}
          onPress={() => setOpenSection((current) => (current === "writing" ? "" : "writing"))}
        >
          <Text style={styles.dropdownText}>
            Du siehst ein Wort, hörst die Umschrift und schreibst das arabische Wort selbst.
          </Text>
          <PrimaryButton label="Schreiben starten" onPress={() => router.push("/writing")} />
        </DropdownSection>
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
    gap: 8,
    backgroundColor: theme.colors.background
  },
  containerCompact: {
    paddingTop: 2,
    gap: 6
  },
  hero: {
    gap: 5
  },
  heroHeading: {
    gap: 3,
    paddingTop: 0
  },
  heroTitle: {
    fontSize: Platform.select({ ios: 31, android: 30, default: 31 }),
    lineHeight: Platform.select({ ios: 32, android: 31, default: 32 }),
    color: theme.colors.text,
    fontFamily: theme.fonts.display,
    fontWeight: "700"
  },
  heroSubtitle: {
    fontSize: Platform.select({ ios: 16, android: 15, default: 16 }),
    lineHeight: Platform.select({ ios: 21, android: 19, default: 21 }),
    color: theme.colors.mutedText,
    maxWidth: 310
  },
  overviewCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.xl,
    padding: 13,
    gap: 8,
    marginTop: 0
  },
  overviewCardCompact: {
    padding: 12,
    gap: 7
  },
  focusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  focusLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.accent,
    letterSpacing: 0.6,
    textTransform: "uppercase"
  },
  focusTitle: {
    fontSize: Platform.select({ ios: 21, android: 20, default: 21 }),
    lineHeight: Platform.select({ ios: 25, android: 23, default: 25 }),
    color: theme.colors.text,
    fontWeight: "700",
    marginTop: 0
  },
  focusBadge: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  focusBadgeText: {
    color: theme.colors.accent,
    fontSize: 11,
    fontWeight: "700"
  },
  focusText: {
    fontSize: Platform.select({ ios: 15, android: 14, default: 15 }),
    lineHeight: Platform.select({ ios: 21, android: 19, default: 21 }),
    color: theme.colors.mutedText
  },
  focusActions: {
    flexDirection: "column",
    gap: 8,
    paddingTop: 2
  },
  focusPrimaryButton: {
    width: "100%"
  },
  focusSecondaryButton: {
    width: "100%"
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  goalLabel: {
    fontSize: Platform.select({ ios: 13, android: 12, default: 13 }),
    fontWeight: "700",
    color: theme.colors.text
  },
  goalValue: {
    fontSize: Platform.select({ ios: 22, android: 21, default: 22 }),
    lineHeight: 26,
    color: theme.colors.accent,
    fontWeight: "700"
  },
  goalBadge: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  goalBadgeText: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: "700"
  },
  goalHint: {
    fontSize: Platform.select({ ios: 13, android: 12, default: 13 }),
    lineHeight: Platform.select({ ios: 18, android: 16, default: 18 }),
    color: theme.colors.mutedText
  },
  dropdownList: {
    gap: 7,
    marginTop: 0
  },
  dropdownText: {
    fontSize: Platform.select({ ios: 14, android: 13, default: 14 }),
    lineHeight: Platform.select({ ios: 21, android: 19, default: 21 }),
    color: theme.colors.mutedText
  }
});
