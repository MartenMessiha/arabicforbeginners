import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../theme/theme";

type Props = {
  title: string;
  subtitle?: string;
};

export function ScreenHeader({ title, subtitle }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: Math.max(insets.top, 8) }]}>
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
    gap: Platform.select({ ios: 3, android: 2, default: 3 }),
    backgroundColor: theme.colors.background,
    zIndex: 20,
    elevation: 2,
    paddingBottom: 6,
    marginBottom: 2
  },
  backButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: Platform.select({ ios: 7, android: 6, default: 7 }),
    borderRadius: 999,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  backText: {
    fontSize: 13,
    lineHeight: Platform.select({ ios: 16, android: 15, default: 16 }),
    color: theme.colors.text,
    fontWeight: "600"
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }]
  },
  textBlock: {
    gap: Platform.select({ ios: 3, android: 2, default: 3 })
  },
  title: {
    fontSize: Platform.select({ ios: 22, android: 21, default: 22 }),
    lineHeight: Platform.select({ ios: 26, android: 24, default: 26 }),
    fontFamily: theme.fonts.display,
    color: theme.colors.text,
    fontWeight: "700"
  },
  subtitle: {
    fontSize: Platform.select({ ios: 13, android: 12, default: 13 }),
    lineHeight: Platform.select({ ios: 18, android: 16, default: 18 }),
    color: theme.colors.mutedText
  }
});
