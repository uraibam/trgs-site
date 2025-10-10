// app/page.tsx
import Header from "../components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-20">
        <section>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
            Are you the 3%?
          </h1>
          <p className="mt-4 text-white/70 max-w-prose">
            Clarity for founders. Systems for teams. Fire for CEOs.
          </p>
        </section>

        {/* Temporary spacer so you can see the header compress on scroll */}
        <div className="h-[120vh]" />
        <section id="newsletter" className="py-24 border-t border-white/10">
          <h2 className="text-2xl font-medium">Newsletter placeholder</h2>
        </section>
      </main>
    </>
  );
}
