import { useEffect, useState } from "react";
import { ChaosProvider } from "@/hooks/useChaos";
import { ChatApp } from "@/components/chaos/ChatApp";
import { ChaosOverlay } from "@/components/chaos/ChaosOverlay";
import { FakeCursors } from "@/components/chaos/FakeCursors";
import { SystemWarnings } from "@/components/chaos/SystemWarnings";
import { FaceApparition } from "@/components/chaos/FaceApparition";
import { InterruptModals } from "@/components/chaos/InterruptModals";
import { EndingScreen } from "@/components/chaos/EndingScreen";
import { IntroSequence } from "@/components/chaos/IntroSequence";
import { FlashlightCursor } from "@/components/chaos/FlashlightCursor";
import { MusicPunishment } from "@/components/chaos/MusicPunishment";
import { PowerPointTransitions } from "@/components/chaos/PowerPointTransitions";

const Index = () => {
  const [intro, setIntro] = useState(true);

  // SEO
  useEffect(() => {
    document.title = "chaos.ai — the assistant that breaks back";
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); return m;
    })();
    meta.setAttribute("content", "Chaos: a chatbot that decays into beautiful, glitching madness with every prompt.");
  }, []);

  // Konami easter egg
  useEffect(() => {
    const code = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === code[i]) { i++; if (i === code.length) { i = 0; document.body.classList.toggle("animate-shake"); console.log("%c👁️  the assistant sees you  👁️", "color:hsl(320 95% 60%); font-size:18px;"); } }
      else i = 0;
    };
    window.addEventListener("keydown", onKey);
    // dev console messages
    console.log("%cchaos.ai", "font-size:32px;color:hsl(160 95% 55%);text-shadow:0 0 12px hsl(160 95% 55%)");
    console.log("%cif you can read this, so can it.", "color:hsl(320 95% 60%)");
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // beforeunload nag
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = "Do not leave."; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, []);

  return (
    <ChaosProvider>
      <main className="relative">
        {intro && <IntroSequence onDone={() => setIntro(false)} />}
        <ChatApp />
        <ChaosOverlay />
        <FakeCursors />
        <SystemWarnings />
        <FaceApparition />
        <InterruptModals />
        <FlashlightCursor />
        <PowerPointTransitions />
        <MusicPunishment />
        <EndingScreen />
      </main>
    </ChaosProvider>
  );
};

export default Index;
