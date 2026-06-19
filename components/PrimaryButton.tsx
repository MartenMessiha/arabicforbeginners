import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { theme } from "../theme/theme";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "solid" | "ghost";
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, variant = "solid", style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "ghost" ? styles.ghost : styles.solid,
        pressed && styles.pressed,
        style
      ]}
    >
      <Text style={[styles.label, variant === "ghost" && styles.ghostLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  solid: {
    backgroundColor: theme.colors.accent
  },
  ghost: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }]
  },
  label: {
    color: theme.colors.onAccent,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "700"
  },
  ghostLabel: {
    color: theme.colors.text
  }
});
