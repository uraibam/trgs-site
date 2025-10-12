// app/page.tsx
import Hero from '../components/Hero';

export default function Page() {
  return (
    <main className="bg-black text-white">
      {/* Force the hero region to fill the viewport so no black strip shows */}
      <section className="relative min-h-[100svh]">
        <Hero />
      </section>

      <section className="px-6 py-20">
        <h2 className="text-lg font-medium opacity-80">Proof Layer — coming next</h2>
        <p className="mt-2 max-w-prose opacity-70">
          Logos and key metrics will live here. We already added a soft fade from the hero.
        </p>
      </section>
    </main>
  );
}
