export function AppSection() {
  return (
    <section
      id="the-app"
      aria-labelledby="the-app-heading"
      className="section-depth-bg min-h-dvh w-full scroll-mt-0 px-6 py-24 sm:px-10 md:px-14 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-center font-sans text-[0.7rem] font-semibold tracking-[0.26em] text-[#E5E4E2]/50 md:text-left">
          THE APP
        </p>
        <h2
          id="the-app-heading"
          className="mb-6 text-center font-sans text-3xl font-bold tracking-[0.18em] text-[#E5E4E2] sm:text-4xl md:text-left md:text-4xl"
        >
          Built for the cage and the weight room
        </h2>
        <p className="mx-auto mb-14 max-w-3xl text-center text-sm leading-relaxed text-[#E5E4E2]/75 md:mx-0 md:text-base">
          Antifragil is becoming a real training platform—not a marketing demo. The Command Center is
          being shaped for{" "}
          <span className="font-semibold text-[#E5E4E2]">MMA athletes</span> and{" "}
          <span className="font-semibold text-[#E5E4E2]">
            MMA strength and conditioning coaches
          </span>{" "}
          who need one system for assignments, progression, and accountability.
        </p>

        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <article className="rounded-xl border border-white/10 bg-black/25 p-8 backdrop-blur-sm md:p-10">
            <h3 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#FF69B4]">
              Athletes
            </h3>
            <p className="text-[0.95rem] leading-relaxed text-[#E5E4E2] sm:text-base">
              A focused place to see what&apos;s on deck, log work, and stay consistent—without noise
              from generic fitness apps.
            </p>
          </article>
          <article className="rounded-xl border border-white/10 bg-black/25 p-8 backdrop-blur-sm md:p-10">
            <h3 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#FF69B4]">
              Coaches
            </h3>
            <p className="text-[0.95rem] leading-relaxed text-[#E5E4E2] sm:text-base">
              Tools to program for fight camps and S&amp;C blocks, keep a roster organized, and
              support athletes with clear structure—not spreadsheets and group chats alone.
            </p>
          </article>
        </div>

        <p className="mx-auto mt-14 max-w-2xl text-center text-sm leading-relaxed text-[#E5E4E2]/55 md:text-left">
          We&apos;re shipping in stages. What you see on the web and in the mobile app today is the
          foundation; capability will grow as we lock the product to how fighters and coaches
          actually train.
        </p>
      </div>
    </section>
  );
}
