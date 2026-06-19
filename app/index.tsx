import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { DropdownSection } from "../components/DropdownSection";
import { PrimaryButton } from "../components/PrimaryButton";
import { letters } from "../data/letters";
import { theme } from "../theme/theme";
import { ProgressBar } from "../components/ProgressBar";
import { useLearningProgress } from "../utils/learningProgress";
import { useLearningPath } from "../utils/learningPath";

export default function HomeScreen() {
  const [openSection, setOpenSection] = useState<string>("letters");
  const progress = useLearningProgress();
  const learningPath = useLearningPath();
  const displayTotals = useMemo(() => {
    const letterDeckTotal = letters.reduce((total, letter) => {
      const forms = [
        letter.forms.isolated,
        letter.forms.initial,
        letter.forms.medial,
        letter.forms.final
      ];
      return total + forms.filter(Boolean).length;
    }, 0);

    return {
      letters: letterDeckTotal,
      words: 100,
      sentences: 100,
      paragraphs: 100,
      verses: 100
    } as const;
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
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

        <Text style={styles.title}>Koptisch-Orthodox Arabisch Lesen</Text>
        <Text style={styles.subtitle}>
          Lerne arabische Schrift mit kirchlichen Wörtern, Sätzen und Texten.
        </Text>

        <View style={styles.focusCard}>
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

        <View style={styles.goalCard}>
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

        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{displayTotals.letters}</Text>
            <Text style={styles.statLabel}>Formen</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{displayTotals.words}</Text>
            <Text style={styles.statLabel}>Wörter</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{displayTotals.sentences}</Text>
            <Text style={styles.statLabel}>Sätze</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{displayTotals.verses}</Text>
            <Text style={styles.statLabel}>Verse</Text>
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
    paddingTop: 10,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background
  },
  hero: {
    gap: 8
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
    fontSize: 30,
    lineHeight: 36,
    fontFamily: theme.fonts.display,
    fontWeight: "700"
  },
  subtitle: {
    color: theme.colors.mutedText,
    fontSize: 16,
    lineHeight: 23
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
    gap: 8,
    marginTop: 2
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
    fontSize: 17,
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
    lineHeight: 18,
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
    gap: 7,
    marginTop: 2
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
    gap: 6,
    marginTop: 2
  },
  statCard: {
    minWidth: "47%",
    flexGrow: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 9,
    paddingHorizontal: 11,
    gap: 1
  },
  statValue: {
    fontSize: 19,
    fontWeight: "700",
    color: theme.colors.text
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.mutedText
  },
  dropdownList: {
    gap: 8,
    marginTop: 2
  },
  dropdownText: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.mutedText
  }
});
