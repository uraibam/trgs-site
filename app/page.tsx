import Hero from "../components/Hero";
import ProofSection from "../components/ProofSection";
import Philosophy from '../components/Philosophy';
import Journey from "../components/Journey";
import Pillars from "../components/Pillars";

export default function Page() {
  return (
    <main className="bg-black text-white">
      <Hero />

      <ProofSection />
      <Philosophy />
      <Journey />
      <Pillars />
    </main>
  );
}
