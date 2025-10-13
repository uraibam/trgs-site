import Hero from "../components/Hero";
import ProofSection from "../components/ProofSection";

export default function Page() {
  return (
    <main className="bg-black text-white">
      <Hero />

      <ProofSection />

      {/* (Next sections will follow here) */}
      <section className="px-6 py-20">
        <h2 className="text-lg font-medium opacity-80">Amin / Philosophy — coming next</h2>
        <p className="mt-2 max-w-prose opacity-70">
          We’ll introduce the philosophy and journey after you approve Proof.
        </p>
      </section>
      
    </main>
  );
}
