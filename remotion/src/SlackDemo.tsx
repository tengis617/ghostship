import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Img,
  staticFile,
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
const TYPING_DONE = 75;
const SEND_FLASH = 78;
const BOT_THINKING = 95;
const RESULTS_START = 130;
const PERSONA_STAGGER = 12;

/* ─── Slack sidebar channel list ─── */
function SlackSidebar() {
  return (
    <div
      style={{
        width: 220,
        height: "100%",
        backgroundColor: "#0f0f0f",
        borderRight: `1px solid ${colors.border}`,
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
        fontFamily: fonts.sans,
      }}
    >
      {/* Workspace header */}
      <div
        style={{
          padding: "0 16px 16px",
          borderBottom: `1px solid ${colors.border}`,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: colors.text,
            letterSpacing: "-0.02em",
          }}
        >
          Acme Corp
        </div>
        <div style={{ fontSize: 11, color: colors.textDim, marginTop: 2 }}>
          Engineering
        </div>
      </div>

      {/* Channels */}
      {[
        { name: "general", unread: false },
        { name: "engineering", unread: true },
        { name: "deployments", unread: false, active: true },
        { name: "design", unread: false },
        { name: "random", unread: false },
      ].map((ch) => (
        <div
          key={ch.name}
          style={{
            padding: "4px 16px",
            fontSize: 13,
            color: ch.active
              ? colors.text
              : ch.unread
                ? colors.text
                : colors.textDim,
            fontWeight: ch.unread || ch.active ? 600 : 400,
            backgroundColor: ch.active ? "rgba(255,255,255,0.06)" : undefined,
            borderRadius: 4,
            margin: "0 8px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ color: colors.textDimmer, fontSize: 14 }}>#</span>
          {ch.name}
        </div>
      ))}
    </div>
  );
}

/* ─── Message bubble ─── */
function Message({
  avatar,
  name,
  nameColor = colors.text,
  time,
  children,
  opacity = 1,
  translateY = 0,
}: {
  avatar: React.ReactNode;
  name: string;
  nameColor?: string;
  time: string;
  children: React.ReactNode;
  opacity?: number;
  translateY?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "8px 24px",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ flexShrink: 0, marginTop: 2 }}>{avatar}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: nameColor,
              fontFamily: fonts.sans,
            }}
          >
            {name}
          </span>
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
        <div style={{ marginTop: 4 }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── User avatar ─── */
function UserAvatar() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        fontWeight: 700,
        color: "white",
        fontFamily: fonts.sans,
      }}
    >
      JD
    </div>
  );
}

/* ─── Persona result row ─── */
function PersonaResult({
  name,
  verdict,
  color,
  emoji,
  delay,
}: {
  name: string;
  verdict: string;
  color: string;
  emoji: string;
  delay: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const x = interpolate(progress, [0, 1], [16, 0]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 12px",
        borderRadius: 8,
        backgroundColor: `${color}08`,
        border: `1px solid ${color}20`,
        opacity,
        transform: `translateX(${x}px)`,
        fontFamily: fonts.sans,
      }}
    >
      <span style={{ fontSize: 14 }}>{emoji}</span>
      <span
        style={{
          fontSize: 12,
          color: colors.textMuted,
          flex: 1,
          fontFamily: fonts.mono,
          letterSpacing: "0.02em",
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color,
          fontFamily: fonts.mono,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {verdict}
      </span>
    </div>
  );
}

/* ─── Main Slack Demo Composition ─── */
export const SlackDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const messageText = "@ghostship https://preview-abc123.vercel.app";
  const typedText = useTypewriter(messageText, TYPING_START, 0.7);
  const isTypingDone = frame >= TYPING_DONE;
  const showSent = frame >= SEND_FLASH;
  const showThinking = frame >= BOT_THINKING && frame < RESULTS_START;
  const showResults = frame >= RESULTS_START;

  // Send flash effect
  const sendFlash =
    frame >= SEND_FLASH && frame < SEND_FLASH + 8
      ? interpolate(frame, [SEND_FLASH, SEND_FLASH + 8], [0.15, 0], {
          extrapolateRight: "clamp",
        })
      : 0;

  // Bot message entrance
  const botEntrance = spring({
    frame: frame - BOT_THINKING,
    fps,
    config: { damping: 200 },
  });

  // Results card entrance
  const resultsEntrance = spring({
    frame: frame - RESULTS_START,
    fps,
    config: { damping: 200 },
  });

  // Verdict entrance
  const verdictDelay = RESULTS_START + 5 * PERSONA_STAGGER + 15;
  const verdictProgress = spring({
    frame: frame - verdictDelay,
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
      {/* Subtle grid pattern */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${colors.textDimmer}15 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Flash on send */}
      {sendFlash > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: colors.ghost,
            opacity: sendFlash,
          }}
        />
      )}

      {/* Layout: sidebar + main */}
      <div style={{ display: "flex", height: "100%" }}>
        <SlackSidebar />

        {/* Main chat area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Channel header */}
          <div
            style={{
              padding: "12px 24px",
              borderBottom: `1px solid ${colors.border}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: colors.textDimmer,
              }}
            >
              #
            </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: colors.text,
                letterSpacing: "-0.01em",
              }}
            >
              deployments
            </span>
            <div
              style={{
                width: 1,
                height: 16,
                backgroundColor: colors.border,
                marginLeft: 8,
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: colors.textDim,
                marginLeft: 4,
              }}
            >
              Preview deployment reviews
            </span>
          </div>

          {/* Messages area */}
          <div
            style={{
              flex: 1,
              padding: "20px 0",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {/* User typing message */}
            <Sequence from={0} layout="none">
              <Message
                avatar={<UserAvatar />}
                name="Jane Developer"
                time="2:34 PM"
              >
                {!showSent ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: 14,
                        color: colors.text,
                        fontFamily: fonts.sans,
                      }}
                    >
                      {typedText.includes("@ghostship") ? (
                        <>
                          <span
                            style={{
                              color: colors.ghost,
                              backgroundColor: colors.ghostDim,
                              padding: "2px 4px",
                              borderRadius: 4,
                              fontWeight: 600,
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
                  <span style={{ fontSize: 14, color: colors.text }}>
                    <span
                      style={{
                        color: colors.ghost,
                        backgroundColor: colors.ghostDim,
                        padding: "2px 4px",
                        borderRadius: 4,
                        fontWeight: 600,
                      }}
                    >
                      @ghostship
                    </span>{" "}
                    <span
                      style={{
                        color: "#5B9BD5",
                        textDecoration: "underline",
                        textDecorationColor: "rgba(91,155,213,0.3)",
                      }}
                    >
                      https://preview-abc123.vercel.app
                    </span>
                  </span>
                )}
              </Message>
            </Sequence>

            {/* Bot thinking / response */}
            {(showThinking || showResults) && (
              <Sequence from={BOT_THINKING} layout="none">
                <Message
                  avatar={
                    <GhostShipLogo size={36} style={{ borderRadius: 8 }} />
                  }
                  name="GhostShip"
                  nameColor={colors.ghost}
                  time="2:34 PM"
                  opacity={botEntrance}
                  translateY={interpolate(botEntrance, [0, 1], [12, 0])}
                >
                  {showThinking && !showResults && (
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
                      <span>Deploying phantom crew…</span>
                    </div>
                  )}

                  {showResults && (
                    <div
                      style={{
                        opacity: resultsEntrance,
                        transform: `translateY(${interpolate(resultsEntrance, [0, 1], [8, 0])}px)`,
                      }}
                    >
                      {/* Report card */}
                      <div
                        style={{
                          backgroundColor: colors.surface,
                          border: `1px solid ${colors.border}`,
                          borderRadius: 12,
                          padding: 16,
                          maxWidth: 520,
                        }}
                      >
                        {/* Header */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 12,
                            paddingBottom: 10,
                            borderBottom: `1px solid ${colors.border}`,
                          }}
                        >
                          <GhostShipLogo size={20} />
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: colors.ghost,
                              fontFamily: fonts.mono,
                              letterSpacing: "0.02em",
                            }}
                          >
                            EVALUATION REPORT
                          </span>
                          <span
                            style={{
                              marginLeft: "auto",
                              fontSize: 10,
                              color: colors.textDim,
                              fontFamily: fonts.mono,
                            }}
                          >
                            30.2s
                          </span>
                        </div>

                        {/* Persona results */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          <PersonaResult
                            name="First-timer"
                            verdict="Prefers B"
                            color={colors.ghost}
                            emoji="👻"
                            delay={RESULTS_START - BOT_THINKING + PERSONA_STAGGER * 0}
                          />
                          <PersonaResult
                            name="Buyer"
                            verdict="Prefers B"
                            color={colors.pink}
                            emoji="💰"
                            delay={RESULTS_START - BOT_THINKING + PERSONA_STAGGER * 1}
                          />
                          <PersonaResult
                            name="Accessibility"
                            verdict="Prefers B"
                            color={colors.mint}
                            emoji="♿"
                            delay={RESULTS_START - BOT_THINKING + PERSONA_STAGGER * 2}
                          />
                          <PersonaResult
                            name="Executive"
                            verdict="Prefers A"
                            color={colors.cream}
                            emoji="👔"
                            delay={RESULTS_START - BOT_THINKING + PERSONA_STAGGER * 3}
                          />
                          <PersonaResult
                            name="Power User"
                            verdict="Prefers B"
                            color={colors.lavender}
                            emoji="⚡"
                            delay={RESULTS_START - BOT_THINKING + PERSONA_STAGGER * 4}
                          />
                        </div>

                        {/* Verdict */}
                        <div
                          style={{
                            marginTop: 12,
                            paddingTop: 10,
                            borderTop: `1px solid ${colors.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            opacity: verdictProgress,
                            transform: `scale(${interpolate(verdictProgress, [0, 1], [0.95, 1])})`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: colors.green,
                                fontFamily: fonts.mono,
                                letterSpacing: "0.05em",
                              }}
                            >
                              VERDICT: SHIP IT
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: 18,
                              fontWeight: 800,
                              color: colors.green,
                              fontFamily: fonts.mono,
                            }}
                          >
                            4–1
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Message>
              </Sequence>
            )}
          </div>

          {/* Input bar (decorative) */}
          <div
            style={{
              padding: "12px 24px 16px",
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <div
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.borderLight}`,
                borderRadius: 10,
                padding: "10px 16px",
                fontSize: 13,
                color: colors.textDim,
                fontFamily: fonts.sans,
              }}
            >
              Message #deployments
            </div>
          </div>
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
