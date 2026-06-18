import { StyleSheet, View } from "react-native";
import { theme } from "../theme/theme";

type Props = {
  progress: number;
};

export function ProgressBar({ progress }: Props) {
  const safeProgress = Math.max(0, Math.min(progress, 1));

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${safeProgress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.track
  },
  fill: {
    height: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.accent
  }
});
