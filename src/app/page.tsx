import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Logo with subtle glow */}
          <div className="relative">
            <div
              className="absolute inset-0 scale-150 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, var(--color-ghost-dim), transparent 70%)" }}
            />
            <Image
              src="/images/logo-square.png"
              alt="GhostShip — pirate ghost mascot"
              width={144}
              height={144}
              priority
              className="relative z-10"
            />
          </div>

          {/* Title */}
          <h1 className="text-5xl font-black tracking-tighter text-white md:text-7xl">
            ghostship
          </h1>

          {/* Subtitle */}
          <p className="max-w-lg text-lg font-medium tracking-tight text-[#EAEAEA] md:text-xl">
            Phantom users for every pull request.
          </p>

          {/* One-liner */}
          <p className="max-w-md font-mono text-sm tracking-wide text-[#666666]">
            Every Vercel preview is already an A/B test.
            <br />
            It just has zero users.
          </p>
        </div>
      </section>
    </main>
  );
}
