import { type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1
  },
  featuredCard: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.backgroundAlt
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 13,
    gap: 6
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
    gap: 8
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
    fontSize: 17,
    color: theme.colors.text,
    fontWeight: "700"
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
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
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  badgeText: {
    color: theme.colors.mutedText,
    fontSize: 11,
    fontWeight: "700"
  },
  chevron: {
    fontSize: 20,
    color: theme.colors.accent,
    fontWeight: "700"
  },
  body: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: 4,
    paddingBottom: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  }
});
