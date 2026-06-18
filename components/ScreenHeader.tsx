import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { theme } from "../theme/theme";

type Props = {
  title: string;
  subtitle?: string;
};

export function ScreenHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
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
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Text style={styles.backText}>← Zurück</Text>
      </Pressable>

      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: theme.spacing.sm
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
  backText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "600"
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }]
  },
  textBlock: {
    gap: 6
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontFamily: theme.fonts.display,
    color: theme.colors.text,
    fontWeight: "700"
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.mutedText
  }
});
