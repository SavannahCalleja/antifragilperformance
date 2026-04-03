import { SignupForm } from "./signup-form";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <p className="font-sans text-4xl font-bold tracking-[0.35em] text-[#E5E4E2] sm:text-5xl md:text-6xl md:tracking-[0.4em]">
          ANTIFRAGIL
        </p>

        <h1 className="hero-slogan mt-10 max-w-4xl font-sans text-lg font-semibold leading-snug tracking-[0.12em] sm:text-xl md:text-2xl">
          ADAPT OR BREAK. THE CHOICE IS YOURS.
        </h1>

        <SignupForm />
      </main>

      <footer className="shrink-0 px-6 pb-10 text-center font-mono text-xs tracking-wide text-[#E5E4E2]/65">
        Refined by Fire // James 1:12
      </footer>
    </div>
  );
}
