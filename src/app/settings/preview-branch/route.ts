import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  createSettingsAuthChallengeResponse,
  isAuthorizedSettingsRequest,
} from "@/lib/admin-auth";
import { setPreviewBranchUrl } from "@/lib/preview-branch";

function redirectToSettings(request: Request, params: URLSearchParams) {
  const url = new URL("/settings", request.url);
  url.search = params.toString();
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  if (!isAuthorizedSettingsRequest(request.headers)) {
    return createSettingsAuthChallengeResponse();
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "clear") {
      await setPreviewBranchUrl(null);
      revalidatePath("/settings");
      return redirectToSettings(
        request,
        new URLSearchParams({ status: "cleared" })
      );
    }

    const rawUrl = formData.get("preview-url");
    const url =
      typeof rawUrl === "string" && rawUrl.trim() ? rawUrl.trim() : null;

    await setPreviewBranchUrl(url);
    revalidatePath("/settings");
    return redirectToSettings(
      request,
      new URLSearchParams({ status: "saved" })
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update preview branch URL";
    return redirectToSettings(
      request,
      new URLSearchParams({ error: message })
    );
  }
}
