import Hero from "../components/Hero";
import ProofSection from "../components/ProofSection";
import Philosophy from '../components/Philosophy';

export default function Page() {
  return (
    <main className="bg-black text-white">
      <Hero />

      <ProofSection />
      <Philosophy />
      
    </main>
  );
}
