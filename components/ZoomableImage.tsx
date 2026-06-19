import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../theme/theme";

type Props = {
  source: ImageSourcePropType;
  accessibilityLabel: string;
  previewHeight?: number;
  caption?: string;
};

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.4;

export function ZoomableImage({ source, accessibilityLabel, previewHeight = 220, caption }: Props) {
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const lastTapAt = useRef(0);
  const pendingTapPoint = useRef<{ x: number; y: number } | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const imageFrame = useMemo(() => {
    const widthFactor = Platform.OS === "ios" ? 0.84 : 0.82;
    const heightFactor = Platform.OS === "ios" ? 0.58 : 0.54;
    const maxWidth = Platform.OS === "ios" ? 700 : 640;
    const maxHeight = Platform.OS === "ios" ? 820 : 760;
    const baseWidth = Math.min(width * widthFactor, maxWidth);
    const baseHeight = Math.min(height * heightFactor, maxHeight);
    return {
      width: baseWidth * scale,
      height: baseHeight * scale
    };
  }, [height, scale, width]);

  function open() {
    setScale(1);
    pendingTapPoint.current = null;
    setVisible(true);
  }

  function close() {
    setVisible(false);
    setScale(1);
    pendingTapPoint.current = null;
  }

  function zoom(delta: number) {
    setScale((current) => {
      const next = Number((current + delta).toFixed(2));
      return Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
    });
  }

  function handleImageRelease(x: number, y: number) {
    const now = Date.now();
    const isDoubleTap = now - lastTapAt.current < 280;
    lastTapAt.current = now;

    if (!isDoubleTap) {
      return;
    }

    if (scale > 1) {
      pendingTapPoint.current = null;
      setScale(1);
      return;
    }

    pendingTapPoint.current = { x, y };
    setScale(2.25);
  }

  useEffect(() => {
    if (!visible || scale <= 1 || !pendingTapPoint.current) {
      return;
    }

    const point = pendingTapPoint.current;
    const viewportWidth = Math.min(width * (Platform.OS === "ios" ? 0.88 : 0.84), Platform.OS === "ios" ? 720 : 640);
    const viewportHeight = Math.min(height * (Platform.OS === "ios" ? 0.64 : 0.58), Platform.OS === "ios" ? 860 : 760);
    const targetScale = scale;

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        x: Math.max(0, point.x * targetScale - viewportWidth / 2),
        y: Math.max(0, point.y * targetScale - viewportHeight / 2),
        animated: true
      });
      pendingTapPoint.current = null;
    });
  }, [height, scale, visible, width]);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={open}
        style={({ pressed }) => [styles.previewWrap, pressed && styles.previewPressed]}
      >
        <Image
          source={source}
          style={[styles.previewImage, { height: previewHeight }]}
          resizeMode="contain"
        />
        <Text style={styles.previewHint}>Tippen zum Öffnen, doppelt tippen zum Zoomen</Text>
        {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      </Pressable>

      <Modal visible={visible} animationType="fade" onRequestClose={close}>
        <SafeAreaView
          style={[styles.modalSafe, { paddingTop: Math.max(insets.top, 24) }]}
          edges={["top", "left", "right"]}
        >
          <View style={styles.modalTopRow}>
            <View style={styles.modalTitleBlock}>
              <Text style={styles.modalTitle}>Übersicht öffnen</Text>
              <Text style={styles.modalSubtitle}>
                Mit Doppel-Tap direkt auf einen Punkt zoomen oder mit Pinch frei bewegen.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Schließen"
              onPress={close}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>

          <View style={styles.zoomBar}>
            <Pressable onPress={() => zoom(-SCALE_STEP)} style={({ pressed }) => [styles.zoomButton, pressed && styles.pressed]}>
              <Text style={styles.zoomButtonText}>−</Text>
            </Pressable>
            <Text style={styles.zoomLabel}>{Math.round(scale * 100)}%</Text>
            <Pressable onPress={() => zoom(SCALE_STEP)} style={({ pressed }) => [styles.zoomButton, pressed && styles.pressed]}>
              <Text style={styles.zoomButtonText}>+</Text>
            </Pressable>
            <Pressable onPress={() => setScale(1)} style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
          </View>

          <View style={styles.zoomHint}>
            <Text style={styles.zoomHintText}>Tipp: Doppelt tippen fokussiert die Stelle, die du anschaust.</Text>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.viewer}
            contentContainerStyle={styles.viewerContent}
            maximumZoomScale={MAX_SCALE}
            minimumZoomScale={MIN_SCALE}
            centerContent
            pinchGestureEnabled
            bouncesZoom
            bounces={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            <Pressable
              onPressIn={(event) => handleImageRelease(event.nativeEvent.locationX, event.nativeEvent.locationY)}
              style={styles.imagePressable}
            >
              <Image
                source={source}
                accessibilityLabel={accessibilityLabel}
                style={[styles.fullImage, imageFrame]}
                resizeMode="contain"
              />
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  previewWrap: {
    gap: 8
  },
  previewPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }]
  },
  previewImage: {
    width: "100%",
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "rgba(36,57,44,0.10)",
    backgroundColor: theme.colors.backgroundAlt
  },
  previewHint: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.colors.accent,
    fontWeight: "700"
  },
  caption: {
    fontSize: 13,
    color: theme.colors.mutedText,
    lineHeight: 18
  },
  modalSafe: {
    flex: 1,
    backgroundColor: "#111418",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md
  },
  modalTopRow: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10
  },
  modalTitleBlock: {
    flex: 1,
    paddingRight: 48
  },
  modalTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
    color: "#F7F3EB"
  },
  modalSubtitle: {
    fontSize: 10,
    lineHeight: 14,
    color: "#C7D0C7",
    marginTop: 2
  },
  closeButton: {
    position: "absolute",
    top: -2,
    right: 0,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1B2125",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#2A3338",
    zIndex: 2
  },
  closeButtonText: {
    fontSize: 26,
    lineHeight: 30,
    color: "#F7F3EB",
    fontWeight: "700"
  },
  zoomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    flexWrap: "wrap"
  },
  zoomHint: {
    backgroundColor: "#1A2024",
    borderWidth: 1,
    borderColor: "#2A3338",
    borderRadius: theme.radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 8
  },
  zoomHintText: {
    fontSize: 12,
    lineHeight: 17,
    color: "#C7D0C7"
  },
  zoomButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1B2125",
    borderWidth: 1,
    borderColor: "#2A3338"
  },
  zoomButtonText: {
    fontSize: 22,
    lineHeight: 24,
    color: "#F7F3EB",
    fontWeight: "700"
  },
  resetButton: {
    marginLeft: "auto",
    backgroundColor: theme.colors.accentSoft,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  resetButtonText: {
    fontSize: 13,
    color: theme.colors.accent,
    fontWeight: "700"
  },
  zoomLabel: {
    fontSize: 14,
    color: "#F7F3EB",
    fontWeight: "700",
    minWidth: 52,
    textAlign: "center"
  },
  viewer: {
    flex: 1,
    marginTop: 2,
    borderRadius: theme.radius.xl,
    backgroundColor: "#0C1013",
    borderWidth: 1,
    borderColor: "#2A3338"
  },
  viewerContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
    flexGrow: 1
  },
  fullImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: theme.radius.lg,
    backgroundColor: "#F7F3EB"
  },
  imagePressable: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%"
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }]
  }
});
