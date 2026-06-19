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
    paddingVertical: Platform.select({ ios: 16, android: 14, default: 16 }),
    paddingHorizontal: Platform.select({ ios: 16, android: 14, default: 16 }),
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: Platform.select({ ios: 164, android: 156, default: 164 }),
    justifyContent: "center",
    gap: Platform.select({ ios: 10, android: 8, default: 10 }),
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1
  }
});
