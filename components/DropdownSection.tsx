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
    borderColor: "rgba(36,57,44,0.10)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2
  },
  featuredCard: {
    borderColor: theme.colors.accent,
    backgroundColor: "#F3F8F1"
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: Platform.select({ ios: 14, android: 12, default: 14 }),
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
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.accentSoft
  },
  iconText: {
    color: theme.colors.accent,
    fontSize: 14,
    fontWeight: "700"
  },
  title: {
    fontSize: Platform.select({ ios: 18, android: 17, default: 18 }),
    lineHeight: Platform.select({ ios: 22, android: 20, default: 22 }),
    color: theme.colors.text,
    fontWeight: "700"
  },
  subtitle: {
    fontSize: Platform.select({ ios: 13, android: 12, default: 13 }),
    lineHeight: Platform.select({ ios: 19, android: 17, default: 19 }),
    color: theme.colors.mutedText
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  badge: {
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  badgeText: {
    color: theme.colors.mutedText,
    fontSize: Platform.select({ ios: 11, android: 10, default: 11 }),
    fontWeight: "700"
  },
  chevron: {
    fontSize: Platform.select({ ios: 18, android: 17, default: 18 }),
    color: theme.colors.accent,
    fontWeight: "700"
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: Platform.select({ ios: 14, android: 12, default: 14 }),
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  }
});
