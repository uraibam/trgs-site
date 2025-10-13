/ app/page.tsx
import Hero from "../components/Hero";

export default function Page() {
  return (
    <main className="bg-black text-white">
        <Hero />

      {/* Anchor target for the scroll cue */}
      <section id="proof" className="px-6 py-20">
        <h2 className="text-lg font-medium opacity-80">Proof Layer — coming next</h2>
        <p className="mt-2 max-w-prose opacity-70">
          Logos and key metrics will live here. We already added a soft fade from the hero.
        </p>
      </section>
    </main>
  );
}
