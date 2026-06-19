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
    minHeight: 50,
    borderRadius: theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18
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
    opacity: 0.92,
    transform: [{ scale: 0.99 }]
  },
  label: {
    color: theme.colors.onAccent,
    fontSize: 16,
    fontWeight: "700"
  },
  ghostLabel: {
    color: theme.colors.text
  }
});
