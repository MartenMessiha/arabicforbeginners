import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { theme } from "../theme/theme";

export function LearningCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 200,
    justifyContent: "center"
  }
});
