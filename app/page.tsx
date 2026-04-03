import { SignupForm } from "./signup-form";

function Roman({ children }: { children: React.ReactNode }) {
  return <span className="roman-numeral">{children}</span>;
}

function PlaceholderSection({
  id,
  title,
  kicker,
}: {
  id: string;
  title: string;
  kicker: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="section-depth-bg flex min-h-dvh w-full scroll-mt-0 flex-col justify-center px-6 py-24 sm:px-10 md:px-14"
    >
      <div className="mx-auto w-full max-w-2xl border border-white/[0.08] bg-black/25 p-12 text-center backdrop-blur-sm sm:p-16">
        <p className="mb-4 font-sans text-[0.7rem] font-semibold tracking-[0.26em] text-[#E5E4E2]/50">
          {kicker}
        </p>
        <h2
          id={`${id}-heading`}
          className="font-sans text-2xl font-bold tracking-[0.2em] text-[#E5E4E2] sm:text-3xl md:text-4xl"
        >
          {title}
        </h2>
        <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-[#E5E4E2]/72 sm:text-base">
          Content coming soon. Check back as we build the system.
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-black text-[#E5E4E2]">
      <main className="flex w-full flex-1 flex-col">
        {/* Hero: full viewport, diamond only */}
        <section
          id="home"
          className="relative left-1/2 w-screen max-w-none -translate-x-1/2 scroll-mt-0"
        >
          <div className="hero-depth-bg flex min-h-dvh flex-col">
            <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-28 sm:px-10 sm:pb-20 sm:pt-32 md:pt-36">
              <div className="relative flex h-[min(88vw,30rem)] w-[min(88vw,30rem)] max-h-[520px] max-w-[520px] items-center justify-center md:h-[min(78vw,34rem)] md:w-[min(78vw,34rem)] md:max-h-[560px] md:max-w-[560px]">
                <div
                  className="diamond-outline pointer-events-none absolute inset-[8%] rotate-45"
                  aria-hidden
                />
                <div className="relative z-10 flex max-w-[17rem] flex-col items-center gap-3 px-4 text-center sm:max-w-[22rem] sm:gap-3.5 md:max-w-[26rem]">
                  <h1 className="hero-diamond-wordmark font-sans text-3xl leading-[0.92] uppercase sm:text-4xl md:text-5xl md:leading-[0.9]">
                    Antifragil Performance
                  </h1>
                  <p className="font-sans text-[0.68rem] font-bold uppercase leading-tight tracking-[0.08em] text-[#E5E4E2] sm:text-xs md:text-sm">
                    Refined by Fire
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why: full viewport section, revealed via nav scroll */}
        <section
          id="why-antifragil"
          aria-labelledby="why-heading"
          className="section-depth-bg min-h-dvh w-full scroll-mt-0 px-6 py-24 sm:px-10 md:px-12 md:py-28"
        >
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-12 flex justify-center md:mb-14">
              <div
                className="h-px w-28 bg-gradient-to-r from-transparent via-[#FF69B4]/45 to-transparent md:w-36"
                aria-hidden
              />
            </div>

            <h2
              id="why-heading"
              className="mb-12 text-center font-sans text-2xl font-bold tracking-[0.2em] text-[#E5E4E2] sm:mb-14 sm:text-3xl md:text-4xl md:tracking-[0.24em]"
            >
              WHY ANTIFRAGIL PERFORMANCE?
            </h2>

            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              <article className="flex flex-col rounded-lg border border-white/10 bg-black/25 p-8 text-left backdrop-blur-sm md:p-10">
                <h3 className="mb-4 font-sans text-sm font-bold tracking-[0.18em] text-[#E5E4E2] sm:text-base">
                  <Roman>I.</Roman> THE MISSION
                </h3>
                <p className="text-[0.95rem] leading-relaxed text-[#E5E4E2] sm:text-base">
                  To find comfort in the uncomfortable through intentional stressors that cause our physiology to adapt and our brains to rewire. We are building a system that doesn&apos;t just handle the stressors of life, but thrives in them.
                </p>
              </article>

              <article className="flex flex-col rounded-lg border border-white/10 bg-black/25 p-8 text-left backdrop-blur-sm md:p-10">
                <h3 className="mb-4 font-sans text-sm font-bold tracking-[0.18em] text-[#E5E4E2] sm:text-base">
                  <Roman>II.</Roman> THE VISION
                </h3>
                <p className="text-[0.95rem] leading-relaxed text-[#E5E4E2] sm:text-base">
                  To build a community that challenges one another to push our limits and reach our ultimate potential through the intersection of fitness, connection, and faith.
                </p>
              </article>
            </div>

            <div className="relative mt-12 md:mt-16">
              <div
                className="pointer-events-none absolute inset-x-0 -top-6 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent md:-top-8"
                aria-hidden
              />
              <div className="rounded-xl border border-white/[0.08] bg-black/35 px-6 py-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm sm:px-10 sm:py-14 md:px-14 md:py-16">
                <h3 className="mb-10 text-center font-sans text-sm font-bold tracking-[0.16em] text-[#E5E4E2] sm:mb-12 sm:text-base md:text-lg">
                  <Roman>III.</Roman> THE ARCHITECT: SAVANNAH CALLEJA
                </h3>

                <div className="mx-auto max-w-3xl space-y-10 text-left sm:space-y-12">
                  <div>
                    <h4 className="mb-3 font-sans text-xs font-bold tracking-[0.14em] text-[#E5E4E2] sm:text-sm">
                      <Roman>I.</Roman> THE PHILOSOPHY
                    </h4>
                    <p className="text-[0.95rem] leading-relaxed text-[#E5E4E2] sm:text-base">
                      Antifragil Performance, created by Savannah Calleja, is a company that incorporates science and faith into building an antifragile individual. As a researcher, I know there is clear evidence that doing hard things is good for the brain. My goal for this company is to encourage people to get comfortable in the uncomfortable because I believe that is what truly grows a person.
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-3 font-sans text-xs font-bold tracking-[0.14em] text-[#E5E4E2] sm:text-sm">
                      <Roman>II.</Roman> THE SCIENCE OF STRESS
                    </h4>
                    <p className="text-[0.95rem] leading-relaxed text-[#E5E4E2] sm:text-base">
                      The concept of antifragility was established by Nassim Taleb to describe systems that thrive, grow, or improve when exposed to stress, volatility, and disorder. At Antifragil, the &quot;system&quot; is us. We are individuals exposed to the daily stressors of life. By purposely putting ourselves in stressful situations, we engage our physiology and force it to adapt. We become better at coping with stress because our bodies are not fragile; they were engineered to handle the load.
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-3 font-sans text-xs font-bold tracking-[0.14em] text-[#E5E4E2] sm:text-sm">
                      <Roman>III.</Roman> THE CALL TO FAITH
                    </h4>
                    <p className="text-[0.95rem] leading-relaxed text-[#E5E4E2] sm:text-base">
                      Currently in the US, there is an epidemic of inactivity and a culture of comfort.
                    </p>
                    <p className="callout-comfort my-8 text-center text-base tracking-[0.12em] sm:my-10 sm:text-lg">
                      comfort is the greatest sin
                    </p>
                    <p className="text-[0.95rem] leading-relaxed text-[#E5E4E2] sm:text-base">
                      I believe that we can commit this sin as humans because it prevents us from reaching our true potential. This is why faith is a vital component of this company. As believers in Jesus, we are called to live a life that might look &quot;uncomfortable&quot; to others, but it is exactly what allows us to thrive.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-16 flex w-full max-w-md justify-center md:mt-20">
              <SignupForm />
            </div>
          </div>
        </section>

        <PlaceholderSection id="the-app" kicker="THE APP" title="The App" />
        <PlaceholderSection id="blog" kicker="BLOG" title="Blog" />
        <PlaceholderSection id="merch" kicker="MERCH" title="Merch" />
      </main>

      <footer className="shrink-0 border-t border-white/[0.06] bg-black px-6 py-10 text-center font-mono text-xs tracking-wide text-[#E5E4E2]/55">
        Refined by Fire // James 1:12
      </footer>
    </div>
  );
}
