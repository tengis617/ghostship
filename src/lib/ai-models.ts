import { gateway } from "ai";
import { google } from "@ai-sdk/google";


export function getAgentModel() {
  return google("gemini-3-flash-preview");
}

export function getVisionModel() {
  return google("gemini-3.1-flash-image-preview");
}
