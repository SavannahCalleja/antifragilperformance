import { SignupForm } from "./signup-form";

function Roman({ children }: { children: React.ReactNode }) {
  return <span className="roman-numeral">{children}</span>;
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex w-full flex-1 flex-col items-center px-5 py-16 sm:px-8 md:py-20">
        {/* Hero */}
        <section className="flex w-full max-w-4xl flex-col items-center text-center">
          <p className="font-sans text-4xl font-bold tracking-[0.35em] text-[#E5E4E2] sm:text-5xl md:text-6xl md:tracking-[0.4em]">
            ANTIFRAGIL
          </p>

          <h1 className="hero-slogan mt-10 max-w-4xl font-sans text-lg font-semibold leading-snug tracking-[0.12em] sm:text-xl md:text-2xl">
            ADAPT OR BREAK. THE CHOICE IS YOURS.
          </h1>

          <SignupForm />
        </section>

        {/* Why Antifragil */}
        <section
          aria-labelledby="why-heading"
          className="mt-24 w-full max-w-6xl border-t border-white/10 pt-20 md:mt-32 md:pt-28"
        >
          <h2
            id="why-heading"
            className="mb-14 text-center font-sans text-2xl font-bold tracking-[0.2em] text-[#E5E4E2] sm:text-3xl md:mb-16 md:text-4xl md:tracking-[0.24em]"
          >
            WHY ANTIFRAGIL PERFORMANCE?
          </h2>

          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <article className="flex flex-col rounded-lg border border-white/10 bg-black/15 p-8 text-left backdrop-blur-sm md:p-10">
              <h3 className="mb-4 font-sans text-sm font-bold tracking-[0.18em] text-[#E5E4E2] sm:text-base">
                <Roman>I.</Roman> THE MISSION
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-[#E5E4E2] sm:text-base">
                To find comfort in the uncomfortable through intentional stressors that cause our physiology to adapt and our brains to rewire. We are building a system that doesn&apos;t just handle the stressors of life, but thrives in them.
              </p>
            </article>

            <article className="flex flex-col rounded-lg border border-white/10 bg-black/15 p-8 text-left backdrop-blur-sm md:p-10">
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
            <div className="rounded-xl border border-white/[0.08] bg-[#1a0406]/80 px-6 py-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:px-10 sm:py-14 md:px-14 md:py-16">
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
        </section>
      </main>

      <footer className="shrink-0 px-6 pb-10 text-center font-mono text-xs tracking-wide text-[#E5E4E2]/65">
        Refined by Fire // James 1:12
      </footer>
    </div>
  );
}
