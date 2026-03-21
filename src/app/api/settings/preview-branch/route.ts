import {
  createSettingsAuthChallengeResponse,
  isAuthorizedSettingsRequest,
} from "@/lib/admin-auth";
import { getPreviewBranchUrl, setPreviewBranchUrl } from "@/lib/preview-branch";

function authorize(request: Request) {
  if (isAuthorizedSettingsRequest(request.headers)) {
    return null;
  }

  return createSettingsAuthChallengeResponse();
}

export async function GET(request: Request): Promise<Response> {
  const authResponse = authorize(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    const value = await getPreviewBranchUrl();
    return Response.json({ url: value });
  } catch (error) {
    console.error("[settings] Error getting preview branch URL:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  const authResponse = authorize(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    const body = await request.json();
    const normalizedUrl =
      typeof body.url === "string" && body.url.trim() ? body.url.trim() : null;
    const savedUrl = await setPreviewBranchUrl(normalizedUrl);
    return Response.json({ success: true, url: savedUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    const status = message.startsWith("Preview branch URL") || message === "Invalid URL"
      ? 400
      : 500;

    console.error("[settings] Error setting preview branch URL:", error);
    return Response.json(
      { error: message },
      { status }
    );
  }
}
