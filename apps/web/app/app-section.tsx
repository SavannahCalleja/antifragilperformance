import { ChromeMenuIcon } from "./chrome-menu-icon";
import { SafariShareIcon } from "./safari-share-icon";

function AppPreviewPhone() {
  return (
    <figure
      className="mx-auto w-full max-w-[300px]"
      aria-label="Preview of Antifragil Performance as an installed app"
    >
      <div className="relative rounded-[2.5rem] border border-[#1a1a1a] bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-[10px] shadow-[0_24px_80px_rgba(0,0,0,0.65)] ring-1 ring-[#FF69B4]/25">
        <div className="overflow-hidden rounded-[2rem] bg-black">
          <div className="flex h-8 items-end justify-center bg-[#050305] pb-1.5">
            <div className="h-5 w-[5.5rem] rounded-full bg-black ring-1 ring-white/10" />
          </div>
          <div className="hero-depth-bg flex aspect-[9/17] w-full flex-col">
            <div className="flex flex-1 flex-col items-center justify-center px-5 pb-8 pt-5">
              <div className="relative flex aspect-square w-[min(72%,200px)] max-w-[200px] items-center justify-center">
                <div
                  className="diamond-outline pointer-events-none absolute inset-[8%] rotate-45"
                  aria-hidden
                />
                <div className="relative z-10 px-3 text-center">
                  <p className="hero-diamond-wordmark font-sans text-[0.62rem] uppercase leading-tight sm:text-[0.7rem]">
                    Antifragil Performance
                  </p>
                  <p className="mt-2 font-sans text-[0.5rem] font-bold uppercase tracking-widest text-[#E5E4E2] sm:text-[0.55rem]">
                    Refined by Fire
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 bg-black/40 px-4 py-3">
              <div className="mx-auto h-1 w-28 rounded-full bg-white/15" />
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center font-sans text-[0.65rem] tracking-[0.12em] text-[#E5E4E2]/45">
        Preview: home screen experience
      </figcaption>
    </figure>
  );
}

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
          className="mb-4 text-center font-sans text-3xl font-bold tracking-[0.18em] text-[#E5E4E2] sm:text-4xl md:text-left md:text-4xl"
        >
          The App
        </h2>
        <p className="mx-auto mb-14 max-w-2xl text-center text-sm leading-relaxed text-[#E5E4E2]/75 md:mx-0 md:text-left md:text-base">
          Run Antifragil Performance like a native app: add it to your home screen for a full-screen
          experience, faster return visits, and the same diamond identity you see on the web.
        </p>

        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-16">
          <AppPreviewPhone />

          <div className="rounded-2xl border border-[#FF69B4]/70 bg-[#0a0305]/50 p-8 shadow-[0_8px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl backdrop-saturate-150 sm:p-10">
            <h3 className="mb-6 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E5E4E2]">
              How to install
            </h3>

            <div className="space-y-8 font-sans text-sm leading-relaxed text-[#E5E4E2]/88 sm:text-[0.95rem]">
              <div>
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#FF69B4]">
                  iPhone or iPad (Safari)
                </p>
                <ol className="list-none space-y-4 pl-0">
                  <li className="flex gap-3">
                    <span className="mt-0.5 shrink-0 font-bold text-[#E5E4E2]">1</span>
                    <span className="flex flex-1 items-start gap-3">
                      <SafariShareIcon className="mt-0.5 h-7 w-7 shrink-0 text-[#E5E4E2]" />
                      <span>Tap the Share icon in Safari.</span>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 shrink-0 font-bold text-[#E5E4E2]">2</span>
                    <span>Scroll and choose &apos;Add to Home Screen&apos;, then confirm.</span>
                  </li>
                </ol>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div>
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#FF69B4]">
                  Android (Chrome)
                </p>
                <p className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
                  <ChromeMenuIcon className="h-7 w-7 shrink-0 text-[#E5E4E2]" />
                  <span>
                    Open the menu{" "}
                    <span className="whitespace-nowrap text-[#E5E4E2]">(⋮)</span> and tap{" "}
                    <span className="font-medium text-[#E5E4E2]">Install app</span> or{" "}
                    <span className="font-medium text-[#E5E4E2]">Add to Home screen</span>, depending on
                    your version of Chrome.
                  </span>
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div>
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#FF69B4]">
                  Computer (Chrome or Edge)
                </p>
                <p>
                  Look for the install icon in the address bar or the browser menu and follow the
                  prompts to install this site as an app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
