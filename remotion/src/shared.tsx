import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";

/* ─── Design tokens matching GhostShip ─── */
export const colors = {
  bg: "#0a0a0a",
  surface: "#141414",
  surfaceLight: "#1a1a1a",
  border: "#222222",
  borderLight: "#2a2a2a",
  ghost: "#D4F5F5",
  ghostDim: "rgba(212, 245, 245, 0.12)",
  text: "#EAEAEA",
  textMuted: "#888888",
  textDim: "#555555",
  textDimmer: "#333333",
  green: "#22c55e",
  greenDim: "rgba(34, 197, 94, 0.15)",
  red: "#FF6B6B",
  amber: "#f59e0b",
  amberDim: "rgba(245, 158, 11, 0.08)",
  pink: "#F5D4E6",
  lavender: "#E0D4F5",
  mint: "#D4F5D8",
  cream: "#F5EED4",
};

export const fonts = {
  sans: "'Geist', 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif",
  mono: "'Geist Mono', 'JetBrains Mono', 'SF Mono', ui-monospace, monospace",
};

/* ─── Reusable animation helpers ─── */
export function useFadeIn(delay: number, duration = 15) {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function useSlideUp(delay: number, distance = 20) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });
  const y = interpolate(progress, [0, 1], [distance, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  return { y, opacity };
}

export function useTypewriter(
  text: string,
  startFrame: number,
  charsPerFrame = 0.8
) {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const chars = Math.min(Math.floor(elapsed * charsPerFrame), text.length);
  return text.slice(0, chars);
}

/* ─── GhostShip Logo Component ─── */
export function GhostShipLogo({
  size = 40,
  style,
}: {
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <Img
      src={staticFile("images/logo-square.png")}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.2,
        ...style,
      }}
    />
  );
}

/* ─── Cursor blink ─── */
export function Cursor({ color = colors.ghost }: { color?: string }) {
  const frame = useCurrentFrame();
  const opacity = Math.round(Math.sin(frame * 0.15) * 0.5 + 0.5);
  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: "1.1em",
        backgroundColor: color,
        opacity,
        marginLeft: 1,
        verticalAlign: "text-bottom",
      }}
    />
  );
}

/* ─── Dot pulse indicator ─── */
export function DotPulse({
  color = colors.ghost,
  delay = 0,
}: {
  color?: string;
  delay?: number;
}) {
  const frame = useCurrentFrame();
  const dotCount = 3;
  return (
    <span style={{ display: "inline-flex", gap: 4 }}>
      {Array.from({ length: dotCount }).map((_, i) => {
        const phase = (frame - delay + i * 5) * 0.12;
        const scale = 0.5 + Math.sin(phase) * 0.5;
        return (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: 0.3 + scale * 0.7,
              transform: `scale(${0.7 + scale * 0.3})`,
            }}
          />
        );
      })}
    </span>
  );
}
