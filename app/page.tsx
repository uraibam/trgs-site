// app/page.tsx
import Header from "../components/Header";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />

      {/* Proof Layer (placeholder) */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-xl font-medium text-white/80">Proof Layer — coming next</h2>
        <p className="mt-2 text-white/60 max-w-prose">
          Logos and key metrics will live here. We already added a soft fade from the hero.
        </p>
      </section>
    </>
  );
}
