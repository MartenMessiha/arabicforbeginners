import { type ReactNode } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/theme";

type Props = {
  title: string;
  subtitle: string;
  badge?: string;
  icon?: string;
  featured?: boolean;
  expanded: boolean;
  onPress: () => void;
  children: ReactNode;
};

export function DropdownSection({
  title,
  subtitle,
  badge,
  icon,
  featured,
  expanded,
  onPress,
  children
}: Props) {
  return (
    <View style={[styles.card, featured && styles.featuredCard]}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
      >
        <View style={styles.titleRow}>
          <View style={styles.titleGroup}>
            {icon ? (
              <View style={styles.iconBadge}>
                <Text style={styles.iconText}>{icon}</Text>
              </View>
            ) : null}
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.metaRow}>
            {badge ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ) : null}
            <Text style={styles.chevron}>{expanded ? "–" : "+"}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </Pressable>

      {expanded ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1
  },
  featuredCard: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.backgroundAlt
  },
  header: {
    paddingHorizontal: 13,
    paddingVertical: Platform.select({ ios: 10, android: 9, default: 10 }),
    gap: 5
  },
  pressed: {
    backgroundColor: theme.colors.backgroundAlt
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7
  },
  iconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.accentSoft
  },
  iconText: {
    color: theme.colors.accent,
    fontSize: 13,
    fontWeight: "700"
  },
  title: {
    fontSize: Platform.select({ ios: 16, android: 15, default: 16 }),
    lineHeight: Platform.select({ ios: 20, android: 18, default: 20 }),
    color: theme.colors.text,
    fontWeight: "700"
  },
  subtitle: {
    fontSize: Platform.select({ ios: 12, android: 11, default: 12 }),
    lineHeight: Platform.select({ ios: 17, android: 16, default: 17 }),
    color: theme.colors.mutedText
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  badge: {
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  badgeText: {
    color: theme.colors.mutedText,
    fontSize: Platform.select({ ios: 10, android: 9, default: 10 }),
    fontWeight: "700"
  },
  chevron: {
    fontSize: Platform.select({ ios: 18, android: 17, default: 18 }),
    color: theme.colors.accent,
    fontWeight: "700"
  },
  body: {
    paddingHorizontal: 13,
    paddingTop: 2,
    paddingBottom: Platform.select({ ios: 10, android: 9, default: 10 }),
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  }
});
