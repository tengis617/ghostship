import Link from "next/link";
import {
  getPreviewBranchUrl,
  isPreviewBranchPersistentStorageEnabled,
} from "@/lib/preview-branch";

type SettingsSearchParams = Promise<{
  error?: string;
  status?: string;
}>;

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: SettingsSearchParams;
}) {
  const [{ error, status }, savedUrl] = await Promise.all([
    searchParams,
    getPreviewBranchUrl(),
  ]);
  const isPersistentStorageEnabled = isPreviewBranchPersistentStorageEnabled();

  return (
    <main className="min-h-[100dvh] bg-[#0A0A0A] px-6 py-12 text-[#EAEAEA]">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#666]">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Preview Branch Settings
            </h1>
          </div>
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.2em] text-[#888] transition-colors hover:text-white"
          >
            Back Home
          </Link>
        </div>

        <section className="rounded-2xl border border-[#1f1f1f] bg-[#111] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <h2 className="text-lg font-semibold text-white">Webhook Proxy Target</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#8A8A8A]">
            Set the preview deployment that production webhook traffic should be
            rewritten to. Allowed hosts default to <code>.vercel.app</code>.
          </p>

          {!isPersistentStorageEnabled && (
            <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-sm text-amber-200">
              Redis is not configured, so this value is stored locally for
              development only.
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          {status === "saved" && !error && (
            <p className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-200">
              Preview branch URL saved.
            </p>
          )}

          {status === "cleared" && !error && (
            <p className="mt-4 rounded-lg border border-[#2a2a2a] bg-[#161616] px-4 py-3 text-sm text-[#CFCFCF]">
              Preview branch URL cleared.
            </p>
          )}

          <form action="/settings/preview-branch" method="post" className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="preview-url"
                className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-[#777]"
              >
                Preview Branch URL
              </label>
              <input
                id="preview-url"
                name="preview-url"
                type="url"
                defaultValue={savedUrl ?? ""}
                placeholder="https://your-preview-branch.vercel.app"
                className="w-full rounded-lg border border-[#2A2A2A] bg-[#0D0D0D] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#555] focus:border-[#666]"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-lg bg-[#EAEAEA] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] transition-opacity hover:opacity-90"
              >
                Save
              </button>

              {savedUrl && (
                <button
                  type="submit"
                  name="intent"
                  value="clear"
                  className="rounded-lg border border-[#363636] bg-transparent px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#D6D6D6] transition-colors hover:border-[#555] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 rounded-xl border border-[#1D1D1D] bg-[#0D0D0D] px-4 py-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#666]">
              Current status
            </p>
            {savedUrl ? (
              <p className="mt-3 text-sm leading-6 text-[#DADADA]">
                Production webhook traffic is being proxied to{" "}
                <span className="break-all font-mono text-[#F5F5F5]">{savedUrl}</span>.
              </p>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[#8A8A8A]">
                No preview branch configured. Webhooks stay on this deployment.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
