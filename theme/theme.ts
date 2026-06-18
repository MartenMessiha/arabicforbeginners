import { Platform } from "react-native";

export const theme = {
  colors: {
    background: "#F7F3EB",
    backgroundAlt: "#FCFAF6",
    surface: "#FFFDF9",
    text: "#1F2A24",
    mutedText: "#5C6B63",
    accent: "#56735E",
    accentSoft: "#E4EFE5",
    onAccent: "#FFFFFF",
    border: "#D9DDD6",
    track: "#DCE5DB",
    cardPressed: "#F1F4EE"
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28
  },
  radius: {
    lg: 18,
    xl: 24
  },
  fonts: {
    display: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "System"
    }) as string
  }
} as const;
