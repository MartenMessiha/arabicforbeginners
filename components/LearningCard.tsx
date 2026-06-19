import { PropsWithChildren } from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { theme } from "../theme/theme";

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function LearningCard({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingVertical: Platform.select({ ios: 18, android: 16, default: 18 }),
    paddingHorizontal: Platform.select({ ios: 18, android: 16, default: 18 }),
    borderWidth: 1,
    borderColor: "rgba(36,57,44,0.10)",
    minHeight: Platform.select({ ios: 160, android: 154, default: 160 }),
    justifyContent: "center",
    gap: Platform.select({ ios: 12, android: 10, default: 12 }),
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  }
});
