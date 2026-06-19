import { PropsWithChildren } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
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
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 164,
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1
  }
});
