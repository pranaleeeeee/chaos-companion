import { useChaos } from "@/hooks/useChaos";
import { useEffect, useState } from "react";

export const ChaosOverlay = () => {
  const { level } = useChaos();
  const [invert, setInvert] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [flip, setFlip] = useState(false);
  const [chromatic, setChromatic] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (level < 1) return;
    const id = setInterval(() => {
      const r = Math.random();
      if (level >= 4 && r < 0.07) {
        setInvert(true); setTimeout(() => setInvert(false), 600 + Math.random() * 1200);
      } else if (level >= 3 && r < 0.14) {
        setChromatic(true); setTimeout(() => setChromatic(false), 500);
      } else if (level >= 4 && r < 0.18) {
        setFlip(true); setTimeout(() => setFlip(false), 800);
      } else if (level >= 2 && r < 0.22) {
        setGrayscale(true); setTimeout(() => setGrayscale(false), 400);
      } else if (level >= 2 && r < 0.28) {
        setShake(true); setTimeout(() => setShake(false), 400);
      }
    }, 1800 - level * 200);
    return () => clearInterval(id);
  }, [level]);

  // apply filters to the body
  useEffect(() => {
    const filters: string[] = [];
    if (invert) filters.push("invert(1) hue-rotate(180deg)");
    if (grayscale) filters.push("grayscale(1) contrast(1.4)");
    document.documentElement.style.filter = filters.join(" ");
    document.documentElement.style.transform = flip ? "rotate(180deg)" : "";
    document.documentElement.style.transition = "transform 0.4s ease";
  }, [invert, grayscale, flip]);

  useEffect(() => {
    if (shake) {
      document.body.classList.add("animate-shake");
      const t = setTimeout(() => document.body.classList.remove("animate-shake"), 420);
      return () => clearTimeout(t);
    }
  }, [shake]);

  return (
    <>
      {level >= 1 && <div className="scanlines" />}
      {level >= 3 && <div className="static-overlay" />}
      {level >= 4 && <div className="vhs-overlay" />}
      {chromatic && (
        <div className="pointer-events-none fixed inset-0 z-[68] mix-blend-screen"
             style={{ background: "linear-gradient(90deg, hsl(var(--neon-pink)/0.15), transparent 20%, transparent 80%, hsl(var(--neon-cyan)/0.15))" }} />
      )}
    </>
  );
};
