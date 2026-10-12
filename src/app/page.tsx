import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Catches } from "@/components/landing/Catches";
import { Flow } from "@/components/landing/Flow";
import { Compare } from "@/components/landing/Compare";
import { Closing } from "@/components/landing/Closing";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Problem />
      <HowItWorks />
      <Catches />
      <Flow />
      <Compare />
      <Closing />
    </main>
  );
}
