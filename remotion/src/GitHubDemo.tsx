import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { colors, Cursor, DotPulse, fonts, GhostShipLogo } from "./shared";

const changedFiles = [
  "src/app/pricing/page.tsx",
  "src/components/hero-form.tsx",
  "src/lib/agent.ts",
];

const personaRows = [
  { emoji: "🛍️", name: "Budget buyer", vote: "Preview", color: colors.green },
  { emoji: "💻", name: "Developer", vote: "Preview", color: colors.green },
  { emoji: "💼", name: "Executive", vote: "Production", color: colors.red },
  { emoji: "👀", name: "First-timer", vote: "Preview", color: colors.green },
  { emoji: "♿", name: "Accessibility", vote: "Preview", color: colors.green },
];

export const GitHubDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: fonts.sans,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          height: "100%",
        }}
      >
        <div
          style={{
            borderRight: `1px solid ${colors.border}`,
            backgroundColor: "#0d0d0d",
            padding: "28px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <GhostShipLogo size={40} />
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                }}
              >
                PR #42
              </div>
              <div
                style={{
                  color: colors.textMuted,
                  fontFamily: fonts.mono,
                  fontSize: 11,
                }}
              >
                compare pricing hero variants
              </div>
            </div>
          </div>

          <div
            style={{
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              backgroundColor: colors.surface,
              padding: "18px 16px",
            }}
          >
            <div
              style={{
                fontFamily: fonts.mono,
                color: colors.textMuted,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                marginBottom: 14,
              }}
            >
              Changed Files
            </div>
            {changedFiles.map((file) => (
              <div
                key={file}
                style={{
                  padding: "9px 10px",
                  borderRadius: 10,
                  backgroundColor: colors.surfaceLight,
                  border: `1px solid ${colors.border}`,
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  marginBottom: 8,
                }}
              >
                {file}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "28px 32px", position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: fonts.mono,
                  color: colors.textMuted,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                }}
              >
                ghostship review
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  marginTop: 8,
                }}
              >
                Preview wins 4-1
              </div>
            </div>

            <div
              style={{
                border: `1px solid rgba(34,197,94,0.28)`,
                backgroundColor: colors.greenDim,
                color: colors.green,
                borderRadius: 999,
                padding: "10px 14px",
                fontFamily: fonts.mono,
                fontSize: 12,
              }}
            >
              76% confidence
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 20,
            }}
          >
            <div
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: 18,
                overflow: "hidden",
                backgroundColor: colors.surface,
              }}
            >
              <div
                style={{
                  padding: "14px 18px",
                  borderBottom: `1px solid ${colors.border}`,
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  color: colors.textMuted,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Vercel preview comparison</span>
                <span>@ghostship review</span>
              </div>
              <Img
                src={staticFile("images/personas/power-user.png")}
                style={{
                  width: "100%",
                  height: 340,
                  objectFit: "cover",
                  opacity: 0.9,
                }}
              />
            </div>

            <div
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: 18,
                backgroundColor: colors.surface,
                padding: "18px 18px 16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <GhostShipLogo size={24} />
                <span
                  style={{
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                  }}
                >
                  ghostship
                </span>
                <span
                  style={{
                    color: colors.textDim,
                    fontSize: 12,
                  }}
                >
                  posted a review
                </span>
              </div>

              <div
                style={{
                  color: colors.text,
                  fontSize: 14,
                  lineHeight: 1.5,
                  marginBottom: 16,
                }}
              >
                The preview is clearer for first-time visitors and developers.
                The one dissenter preferred production because the current pricing
                table feels more conservative.
              </div>

              {personaRows.map((row) => (
                <div
                  key={row.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: 12,
                    backgroundColor: colors.surfaceLight,
                    border: `1px solid ${colors.border}`,
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  <span>
                    {row.emoji} {row.name}
                  </span>
                  <span
                    style={{
                      color: row.color,
                      fontFamily: fonts.mono,
                      fontSize: 12,
                    }}
                  >
                    {row.vote}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Sequence from={150}>
            <div
              style={{
                position: "absolute",
                bottom: 28,
                right: 32,
                border: `1px solid ${colors.borderLight}`,
                backgroundColor: colors.surface,
                borderRadius: 14,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              }}
            >
              <DotPulse />
              <span
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 12,
                  color: colors.textMuted,
                }}
              >
                posting PR comment
              </span>
              <Cursor />
            </div>
          </Sequence>
        </div>
      </div>
    </AbsoluteFill>
  );
};
