import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { DropdownSection } from "../components/DropdownSection";
import { PrimaryButton } from "../components/PrimaryButton";
import { diacritics } from "../data/diacritics";
import { letters } from "../data/letters";
import { theme } from "../theme/theme";
import { ProgressBar } from "../components/ProgressBar";
import { useLearningProgress } from "../utils/learningProgress";
import { useLearningPath } from "../utils/learningPath";

export default function HomeScreen() {
  const [openSection, setOpenSection] = useState<string>("letters");
  const progress = useLearningProgress();
  const learningPath = useLearningPath();
  const { height } = useWindowDimensions();
  const compactLayout = height < 760;
  const displayTotals = useMemo(() => {
    return {
      letters: letters.length,
      diacritics: diacritics.length,
      words: 100,
      sentences: 100,
      paragraphs: 100,
      verses: 100
    } as const;
  }, []);

  return (
    <ScrollView
      contentContainerStyle={[styles.container, compactLayout && styles.containerCompact]}
      bounces={false}
    >
      <View style={styles.hero}>
        <View style={styles.topRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Zurück"
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
                return;
              }
              router.replace("/");
            }}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <Text style={styles.backButtonText}>← Zurück</Text>
          </Pressable>

          <View style={styles.homeBadge}>
            <Text style={styles.homeBadgeText}>Lernpfad</Text>
          </View>
        </View>

        <Text style={[styles.title, compactLayout && styles.titleCompact]}>
          Koptisch-Orthodox Arabisch Lesen
        </Text>
        <Text style={[styles.subtitle, compactLayout && styles.subtitleCompact]}>
          Lerne arabische Schrift mit kirchlichen Wörtern, Sätzen und Texten Schritt für Schritt.
        </Text>

        <View style={[styles.focusCard, compactLayout && styles.focusCardCompact]}>
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

        <View style={[styles.goalCard, compactLayout && styles.goalCardCompact]}>
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
        </View>

        <View style={[styles.overviewCard, compactLayout && styles.overviewCardCompact]}>
          <View style={styles.overviewHeader}>
            <View>
              <Text style={styles.overviewTitle}>Lernumfang</Text>
              <Text style={styles.overviewText}>Alles ist lokal, übersichtlich und in Ruhe aufgebaut.</Text>
            </View>
          </View>
          <View style={styles.quickStats}>
            {[
              { value: displayTotals.letters, label: "Buchstaben" },
              { value: displayTotals.diacritics, label: "Vokalzeichen" },
              { value: displayTotals.words, label: "Wörter" },
              { value: displayTotals.sentences, label: "Sätze" },
              { value: displayTotals.verses, label: "Verse" }
            ]
              .slice(0, compactLayout ? 4 : 5)
              .map((item) => (
                <View key={item.label} style={[styles.statCard, compactLayout && styles.statCardCompact]}>
                  <Text style={[styles.statValue, compactLayout && styles.statValueCompact]}>
                    {item.value}
                  </Text>
                  <Text style={[styles.statLabel, compactLayout && styles.statLabelCompact]}>
                    {item.label}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </View>

      <View style={styles.dropdownList}>
        <DropdownSection
          title="Stufe 1: Buchstaben"
          subtitle="Buchstabenformen sicher erkennen."
          icon="1"
          featured
          badge={`${displayTotals.letters}`}
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
          badge={`${displayTotals.diacritics}`}
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
          badge={`${displayTotals.words}`}
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
          badge={`${displayTotals.sentences}`}
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
          badge={`${displayTotals.paragraphs}`}
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
          badge={`${displayTotals.verses}`}
          expanded={openSection === "verses"}
          onPress={() => setOpenSection((current) => (current === "verses" ? "" : "verses"))}
        >
          <Text style={styles.dropdownText}>
            Verse aus Bibel, Agpeya und der koptisch-orthodoxen Messe, sauber nach Quellen
            sortiert.
          </Text>
          <PrimaryButton label="Verse starten" onPress={() => router.push("/verses")} />
        </DropdownSection>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 8,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background
  },
  containerCompact: {
    paddingTop: 6,
    gap: 8
  },
  hero: {
    gap: 10
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2
  },
  backButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  backButtonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }]
  },
  backButtonText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "600"
  },
  homeBadge: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  homeBadgeText: {
    fontSize: 12,
    color: theme.colors.accent,
    fontWeight: "700",
    letterSpacing: 0.3
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: theme.fonts.display,
    fontWeight: "700"
  },
  titleCompact: {
    fontSize: 26,
    lineHeight: 32
  },
  subtitle: {
    color: theme.colors.mutedText,
    fontSize: 15,
    lineHeight: 22
  },
  subtitleCompact: {
    fontSize: 14,
    lineHeight: 20
  },
  continueCard: {
    display: "none"
  },
  focusCard: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accent,
    borderWidth: 1,
    borderRadius: theme.radius.xl,
    padding: 14,
    gap: 7,
    marginTop: 2
  },
  focusCardCompact: {
    padding: 12,
    gap: 6
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
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "700",
    marginTop: 2
  },
  focusBadge: {
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  focusBadgeText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700"
  },
  focusText: {
    fontSize: 12,
    lineHeight: 17,
    color: theme.colors.mutedText
  },
  focusActions: {
    flexDirection: "row",
    gap: 8
  },
  focusPrimaryButton: {
    flex: 1
  },
  focusSecondaryButton: {
    flex: 1
  },
  goalCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.xl,
    padding: 12,
    gap: 6,
    marginTop: 2
  },
  goalCardCompact: {
    padding: 11
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  goalLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text
  },
  goalValue: {
    fontSize: 19,
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
    fontSize: 11,
    lineHeight: 16,
    color: theme.colors.mutedText
  },
  quickStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 6,
    marginTop: 2
  },
  overviewCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.xl,
    padding: 14,
    gap: 8,
    marginTop: 2
  },
  overviewCardCompact: {
    padding: 12,
    gap: 7
  },
  overviewHeader: {
    gap: 2
  },
  overviewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text
  },
  overviewText: {
    fontSize: 12,
    lineHeight: 17,
    color: theme.colors.mutedText
  },
  statCard: {
    flexBasis: "31%",
    flexGrow: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 7,
    paddingHorizontal: 10,
    gap: 1
  },
  statCardCompact: {
    flexBasis: "48%",
    paddingVertical: 6
  },
  statValue: {
    fontSize: 19,
    fontWeight: "700",
    color: theme.colors.text
  },
  statValueCompact: {
    fontSize: 17
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.mutedText
  },
  statLabelCompact: {
    fontSize: 11
  },
  dropdownList: {
    gap: 6,
    marginTop: 2
  },
  dropdownText: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.mutedText
  }
});
