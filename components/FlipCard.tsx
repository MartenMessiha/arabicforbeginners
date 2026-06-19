import { PropsWithChildren, ReactNode, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { theme } from "../theme/theme";

type Props = PropsWithChildren<{
  front: ReactNode;
  back: ReactNode;
}>;

export function FlipCard({ front, back }: Props) {
  const [showBack, setShowBack] = useState(false);

  return (
    <Pressable onPress={() => setShowBack((value) => !value)}>
      <View style={[styles.container, showBack ? styles.back : styles.front]}>
        {showBack ? back : front}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 240,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    backgroundColor: theme.colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1
  },
  front: {
    backgroundColor: theme.colors.surface
  },
  back: {
    backgroundColor: theme.colors.accentSoft
  }
});
