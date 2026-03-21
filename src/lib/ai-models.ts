import { gateway } from "ai";
import { google } from "@ai-sdk/google";

const useGateway = Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL);

// Model IDs verified against the AI Gateway model list on 2026-03-21.
const AGENT_MODEL_ID = "gemini-3-flash";
const VISION_MODEL_ID = "gemini-2.5-flash";

export function getAgentModel() {
  return useGateway
    ? gateway(`google/${AGENT_MODEL_ID}`)
    : google(AGENT_MODEL_ID);
}

export function getVisionModel() {
  return useGateway
    ? gateway(`google/${VISION_MODEL_ID}`)
    : google(VISION_MODEL_ID);
}
