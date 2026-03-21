import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import {
  colors,
  fonts,
  useTypewriter,
  GhostShipLogo,
  Cursor,
  DotPulse,
} from "./shared";

/* ─── Timing (in frames at 30fps) ─── */
const TYPING_START = 15;
const TYPING_DONE = 60;
const SUBMIT_FLASH = 65;
const BOT_APPEAR = 85;
const SCREENSHOTS_START = 110;
const VERDICT_START = 160;
const CHECK_APPEAR = 200;

/* ─── GitHub-style avatar ─── */
function GitHubAvatar({
  initials,
  bg,
  size = 32,
}: {
  initials: string;
  bg: string;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 700,
        color: "white",
        fontFamily: fonts.sans,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

/* ─── PR file header bar ─── */
function PRHeader() {
  return (
    <div
      style={{
        padding: "16px 24px",
        borderBottom: `1px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* PR icon */}
      <svg width="16" height="16" viewBox="0 0 16 16" fill={colors.green}>
        <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
      </svg>
      <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
        feat: redesign checkout flow
      </span>
      <span
        style={{
          fontSize: 12,
          color: colors.textDim,
          fontFamily: fonts.mono,
        }}
      >
        #247
      </span>
      <div style={{ flex: 1 }} />
      {/* Status badges */}
      <span
        style={{
          fontSize: 11,
          padding: "3px 10px",
          borderRadius: 20,
          backgroundColor: colors.greenDim,
          color: colors.green,
          fontWeight: 600,
          fontFamily: fonts.mono,
        }}
      >
        Open
      </span>
    </div>
  );
}

/* ─── Tabs ─── */
function PRTabs() {
  return (
    <div
      style={{
        display: "flex",
        gap: 0,
        borderBottom: `1px solid ${colors.border}`,
        padding: "0 24px",
      }}
    >
      {[
        { label: "Conversation", count: 3, active: true },
        { label: "Commits", count: 4, active: false },
        { label: "Files changed", count: 12, active: false },
      ].map((tab) => (
        <div
          key={tab.label}
          style={{
            padding: "10px 16px",
            fontSize: 13,
            color: tab.active ? colors.text : colors.textDim,
            fontWeight: tab.active ? 600 : 400,
            borderBottom: tab.active
              ? `2px solid ${colors.ghost}`
              : "2px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: fonts.sans,
          }}
        >
          {tab.label}
          <span
            style={{
              fontSize: 10,
              padding: "1px 6px",
              borderRadius: 10,
              backgroundColor: tab.active
                ? colors.ghostDim
                : "rgba(255,255,255,0.06)",
              color: tab.active ? colors.ghost : colors.textDim,
              fontFamily: fonts.mono,
            }}
          >
            {tab.count}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Comment component ─── */
function Comment({
  avatar,
  name,
  time,
  isBot = false,
  children,
  opacity = 1,
  translateY = 0,
}: {
  avatar: React.ReactNode;
  name: string;
  time: string;
  isBot?: boolean;
  children: React.ReactNode;
  opacity?: number;
  translateY?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "16px 24px",
        borderBottom: `1px solid ${colors.border}`,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ flexShrink: 0 }}>{avatar}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: isBot ? colors.ghost : colors.text,
              fontFamily: fonts.sans,
            }}
          >
            {name}
          </span>
          {isBot && (
            <span
              style={{
                fontSize: 9,
                padding: "2px 6px",
                borderRadius: 4,
                backgroundColor: colors.ghostDim,
                color: colors.ghost,
                fontWeight: 600,
                fontFamily: fonts.mono,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              bot
            </span>
          )}
          <span
            style={{
              fontSize: 11,
              color: colors.textDimmer,
              fontFamily: fonts.mono,
            }}
          >
            {time}
          </span>
        </div>
        <div style={{ marginTop: 6 }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── Screenshot comparison block ─── */
function ScreenshotComparison({ delay }: { delay: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        marginTop: 12,
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(progress, [0, 1], [12, 0])}px)`,
      }}
    >
      {/* Production */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            color: colors.textDim,
            fontFamily: fonts.mono,
            marginBottom: 4,
            letterSpacing: "0.04em",
          }}
        >
          PRODUCTION
        </div>
        <div
          style={{
            height: 80,
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.surface,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Mock page */}
          <div style={{ width: "100%", height: "100%", padding: 8 }}>
            <div
              style={{
                width: "60%",
                height: 6,
                backgroundColor: colors.borderLight,
                borderRadius: 3,
                marginBottom: 4,
              }}
            />
            <div
              style={{
                width: "40%",
                height: 4,
                backgroundColor: colors.textDimmer,
                borderRadius: 2,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                display: "flex",
                gap: 4,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 40,
                  backgroundColor: "rgba(255,107,107,0.08)",
                  borderRadius: 4,
                  border: `1px solid rgba(255,107,107,0.15)`,
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: 40,
                  backgroundColor: colors.border,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* VS */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 18,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: colors.textDimmer,
            fontFamily: fonts.mono,
            fontWeight: 700,
          }}
        >
          vs
        </span>
      </div>

      {/* Preview */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            color: colors.ghost,
            fontFamily: fonts.mono,
            marginBottom: 4,
            letterSpacing: "0.04em",
          }}
        >
          PREVIEW
        </div>
        <div
          style={{
            height: 80,
            borderRadius: 8,
            border: `1px solid rgba(212,245,245,0.15)`,
            backgroundColor: colors.surface,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Mock page — improved version */}
          <div style={{ width: "100%", height: "100%", padding: 8 }}>
            <div
              style={{
                width: "60%",
                height: 6,
                backgroundColor: colors.borderLight,
                borderRadius: 3,
                marginBottom: 4,
              }}
            />
            <div
              style={{
                width: "40%",
                height: 4,
                backgroundColor: colors.textDimmer,
                borderRadius: 2,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                display: "flex",
                gap: 4,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 40,
                  backgroundColor: "rgba(34,197,94,0.08)",
                  borderRadius: 4,
                  border: `1px solid rgba(34,197,94,0.15)`,
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: 40,
                  backgroundColor: colors.border,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Status check row ─── */
function StatusCheck({ delay }: { delay: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 200 },
  });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 24px",
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: "rgba(34,197,94,0.03)",
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "left center",
      }}
    >
      {/* Check icon */}
      <svg width="16" height="16" viewBox="0 0 16 16" fill={colors.green}>
        <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-1.042-1.042L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042 1.042l2 2a.75.75 0 0 0 1.042 0l4.5-4.5Z" />
      </svg>
      <div style={{ flex: 1 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: colors.text,
            fontFamily: fonts.sans,
          }}
        >
          GhostShip Evaluation
        </span>
        <span
          style={{
            fontSize: 11,
            color: colors.textDim,
            marginLeft: 8,
            fontFamily: fonts.mono,
          }}
        >
          — 4 of 5 phantoms prefer preview
        </span>
      </div>
      <span
        style={{
          fontSize: 11,
          color: colors.green,
          fontWeight: 600,
          fontFamily: fonts.mono,
        }}
      >
        Passed
      </span>
    </div>
  );
}

/* ─── Main GitHub Demo Composition ─── */
export const GitHubDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const commentText = "@ghostship evaluate this PR";
  const typedText = useTypewriter(commentText, TYPING_START, 0.8);
  const isTypingDone = frame >= TYPING_DONE;
  const showSent = frame >= SUBMIT_FLASH;
  const showBot = frame >= BOT_APPEAR;
  const showScreenshots = frame >= SCREENSHOTS_START;
  const showVerdict = frame >= VERDICT_START;
  const showCheck = frame >= CHECK_APPEAR;

  // Submit flash
  const submitFlash =
    frame >= SUBMIT_FLASH && frame < SUBMIT_FLASH + 8
      ? interpolate(frame, [SUBMIT_FLASH, SUBMIT_FLASH + 8], [0.12, 0], {
          extrapolateRight: "clamp",
        })
      : 0;

  // Bot entrance
  const botEntrance = spring({
    frame: frame - BOT_APPEAR,
    fps,
    config: { damping: 200 },
  });

  // Verdict
  const verdictProgress = spring({
    frame: frame - VERDICT_START,
    fps,
    config: { damping: 15, stiffness: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.sans,
      }}
    >
      {/* Subtle pattern */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${colors.textDimmer}15 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Submit flash */}
      {submitFlash > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: colors.ghost,
            opacity: submitFlash,
          }}
        />
      )}

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxWidth: 960,
          margin: "0 auto",
          width: "100%",
          borderLeft: `1px solid ${colors.border}`,
          borderRight: `1px solid ${colors.border}`,
          backgroundColor: "rgba(10,10,10,0.8)",
        }}
      >
        <PRHeader />
        <PRTabs />

        {/* Status check area */}
        {showCheck && <StatusCheck delay={CHECK_APPEAR} />}

        {/* Scrollable comment area */}
        <div
          style={{
            flex: 1,
            overflowY: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* User comment */}
          <Comment
            avatar={<GitHubAvatar initials="JD" bg="#4F46E5" />}
            name="janedev"
            time="2 minutes ago"
          >
            {!showSent ? (
              <div
                style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.borderLight}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: colors.text,
                  minHeight: 36,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span>
                  {typedText.includes("@ghostship") ? (
                    <>
                      <span
                        style={{
                          color: colors.ghost,
                          fontWeight: 600,
                          backgroundColor: colors.ghostDim,
                          padding: "1px 4px",
                          borderRadius: 4,
                        }}
                      >
                        @ghostship
                      </span>
                      {typedText.slice("@ghostship".length)}
                    </>
                  ) : (
                    typedText
                  )}
                </span>
                {!isTypingDone && <Cursor />}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.6 }}>
                <span
                  style={{
                    color: colors.ghost,
                    fontWeight: 600,
                    backgroundColor: colors.ghostDim,
                    padding: "1px 4px",
                    borderRadius: 4,
                  }}
                >
                  @ghostship
                </span>{" "}
                evaluate this PR
              </div>
            )}
          </Comment>

          {/* Bot response */}
          {showBot && (
            <Sequence from={BOT_APPEAR} layout="none" premountFor={fps}>
              <Comment
                avatar={
                  <GhostShipLogo
                    size={32}
                    style={{ borderRadius: "50%" }}
                  />
                }
                name="ghostship[bot]"
                isBot
                time="just now"
                opacity={botEntrance}
                translateY={interpolate(botEntrance, [0, 1], [12, 0])}
              >
                {!showScreenshots ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: colors.textDim,
                      fontFamily: fonts.mono,
                    }}
                  >
                    <DotPulse color={colors.ghost} />
                    <span>Capturing screenshots & deploying phantoms…</span>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        color: colors.textMuted,
                        lineHeight: 1.5,
                      }}
                    >
                      Evaluated{" "}
                      <span
                        style={{
                          fontFamily: fonts.mono,
                          color: colors.ghost,
                          fontWeight: 600,
                        }}
                      >
                        production
                      </span>{" "}
                      vs{" "}
                      <span
                        style={{
                          fontFamily: fonts.mono,
                          color: colors.ghost,
                          fontWeight: 600,
                        }}
                      >
                        preview-abc123
                      </span>{" "}
                      with 5 phantom personas.
                    </div>

                    <ScreenshotComparison delay={SCREENSHOTS_START} />

                    {/* Verdict block */}
                    {showVerdict && (
                      <div
                        style={{
                          marginTop: 14,
                          padding: 14,
                          borderRadius: 10,
                          backgroundColor: "rgba(34,197,94,0.04)",
                          border: `1px solid rgba(34,197,94,0.15)`,
                          opacity: verdictProgress,
                          transform: `translateY(${interpolate(verdictProgress, [0, 1], [8, 0])}px)`,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: colors.green,
                                fontFamily: fonts.mono,
                                letterSpacing: "0.03em",
                              }}
                            >
                              ✅ SHIP IT — Preview wins 4–1
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: colors.textDim,
                                marginTop: 4,
                                fontFamily: fonts.mono,
                              }}
                            >
                              Checkout redesign improves clarity, better CTA
                              hierarchy
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 3,
                            }}
                          >
                            {["👻", "💰", "♿", "⚡"].map((e, i) => (
                              <span
                                key={i}
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  backgroundColor: colors.greenDim,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 12,
                                }}
                              >
                                {e}
                              </span>
                            ))}
                            <span
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                backgroundColor: "rgba(255,107,107,0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                              }}
                            >
                              👔
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Comment>
            </Sequence>
          )}
        </div>
      </div>

      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 16,
          fontSize: 10,
          color: colors.textDimmer,
          fontFamily: fonts.mono,
          opacity: 0.5,
        }}
      >
        ghostship.dev
      </div>
    </AbsoluteFill>
  );
};
