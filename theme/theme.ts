import { Platform } from "react-native";

export const theme = {
  colors: {
    background: "#F7F3EA",
    backgroundAlt: "#F1F7EF",
    surface: "#FFFDF7",
    text: "#1F2A24",
    mutedText: "#68776D",
    accent: "#426B4F",
    accentSoft: "#DDEBDD",
    onAccent: "#FFFFFF",
    border: "#DFE5DC",
    track: "#E6EDE4",
    cardPressed: "#EAF2E8"
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 20,
    xl: 32
  },
  radius: {
    lg: 22,
    xl: 28
  },
  fonts: {
    display: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "System"
    }) as string
  }
} as const;
