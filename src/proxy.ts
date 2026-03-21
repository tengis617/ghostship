import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  createSettingsAuthChallengeResponse,
  getSettingsAuthError,
  isAuthorizedSettingsRequest,
  isSettingsAuthEnabled,
} from "@/lib/admin-auth";
import { getPreviewBranchUrl } from "@/lib/preview-branch";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/settings" ||
    pathname.startsWith("/settings/preview-branch") ||
    pathname.startsWith("/api/settings/preview-branch")
  ) {
    const authError = getSettingsAuthError();
    if (authError) {
      return createSettingsAuthChallengeResponse();
    }

    if (isSettingsAuthEnabled() && !isAuthorizedSettingsRequest(request.headers)) {
      return createSettingsAuthChallengeResponse();
    }
  }

  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  if (process.env.VERCEL_ENV !== "production") {
    return NextResponse.next();
  }

  // Check if we have a preview branch configured
  const previewBranchUrl = await getPreviewBranchUrl();

  if (!previewBranchUrl) {
    // No preview branch configured, continue normally
    return NextResponse.next();
  }

  // Rewrite the request to the preview branch URL
  const targetUrl = new URL(
    pathname + request.nextUrl.search,
    previewBranchUrl
  );

  console.warn(`[proxy] Proxying ${pathname} to ${targetUrl.hostname}`);

  // Proxy the request to the preview branch
  return NextResponse.rewrite(targetUrl);
}

export const config = {
  matcher: [
    "/settings",
    "/settings/preview-branch",
    "/api/settings/preview-branch",
    // Match webhook API routes
    "/api/webhooks/:path*",
  ],
};
