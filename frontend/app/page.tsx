import BuiltForEveryone from "@/components/(app)/built-for-everyone";
import AppHero from "@/components/(app)/hero";
import ReadyToTransform from "@/components/(app)/ready-to-transform";
import SimpleSecureProcess from "@/components/(app)/simple-secure-process";
import TrustAndTransparency from "@/components/(app)/trust-and-transparency";
import WhyPrismAgro from "@/components/(app)/why-prism-agro";
import Footer from "@/components/(common)/footer";
import Navbar from "@/components/(common)/navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <AppHero />
      <WhyPrismAgro />
      <BuiltForEveryone />
      <SimpleSecureProcess />
      <TrustAndTransparency />
      <ReadyToTransform />
      <Footer />
    </main>
  );
}
