import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChaos } from "@/hooks/useChaos";
import { whoosh } from "@/lib/sound";

type Kind =
  | "paperPlane"
  | "curtain"
  | "cube"
  | "blinds"
  | "spin"
  | "bounce"
  | "starWipe"
  | "zoomExplosion"
  | "morphGlitch";

const KINDS: Kind[] = [
  "paperPlane", "curtain", "cube", "blinds", "spin", "bounce", "starWipe", "zoomExplosion", "morphGlitch",
];

let trigger: ((k?: Kind) => void) | null = null;
export function triggerTransition(k?: Kind) { trigger?.(k); }

export const PowerPointTransitions = () => {
  const { level } = useChaos();
  const [kind, setKind] = useState<Kind | null>(null);

  useEffect(() => {
    trigger = (k?: Kind) => {
      const chosen = k ?? KINDS[Math.floor(Math.random() * KINDS.length)];
      setKind(chosen);
      whoosh();
      setTimeout(() => setKind(null), 1100);
    };
    return () => { trigger = null; };
  }, []);

  // random transitions
  useEffect(() => {
    if (level < 2) return;
    const id = setInterval(() => {
      if (Math.random() < 0.35) trigger?.();
    }, Math.max(6000, 14000 - level * 1500));
    return () => clearInterval(id);
  }, [level]);

  return (
    <AnimatePresence>
      {kind && (
        <motion.div
          key={kind}
          className="pointer-events-none fixed inset-0 z-[110] overflow-hidden"
          initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          {kind === "paperPlane" && <PaperPlane />}
          {kind === "curtain" && <Curtain />}
          {kind === "cube" && <Cube />}
          {kind === "blinds" && <Blinds />}
          {kind === "spin" && <Spin />}
          {kind === "bounce" && <Bounce />}
          {kind === "starWipe" && <StarWipe />}
          {kind === "zoomExplosion" && <ZoomExplosion />}
          {kind === "morphGlitch" && <MorphGlitch />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Panel = ({ style, children }: any) => (
  <div className="absolute inset-0" style={style}>{children}</div>
);

const PaperPlane = () => (
  <motion.div
    className="absolute inset-0"
    initial={{ x: "-120%", y: "-60%", rotate: -25, scale: 0.6 }}
    animate={{ x: "120%", y: "60%", rotate: 25, scale: 0.6 }}
    transition={{ duration: 1, ease: "easeInOut" }}
    style={{ background: "linear-gradient(135deg, hsl(var(--neon-cyan)/0.6), hsl(var(--neon-pink)/0.6))" }}
  />
);

const Curtain = () => (
  <>
    <motion.div className="absolute inset-y-0 left-0 w-1/2"
      initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
      transition={{ duration: 0.7 }}
      style={{ background: "repeating-linear-gradient(90deg, hsl(0 70% 25%), hsl(0 80% 18%) 30px, hsl(0 90% 30%) 60px)" }} />
    <motion.div className="absolute inset-y-0 right-0 w-1/2"
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ duration: 0.7 }}
      style={{ background: "repeating-linear-gradient(90deg, hsl(0 70% 25%), hsl(0 80% 18%) 30px, hsl(0 90% 30%) 60px)" }} />
  </>
);

const Cube = () => (
  <motion.div
    className="absolute inset-0"
    initial={{ rotateY: 0 }} animate={{ rotateY: 180 }}
    transition={{ duration: 0.9 }}
    style={{
      transformStyle: "preserve-3d",
      background: "linear-gradient(135deg, hsl(var(--neon-violet)/0.7), hsl(var(--neon-cyan)/0.7))",
      perspective: 1200,
    }}
  />
);

const Blinds = () => (
  <div className="absolute inset-0 flex flex-col">
    {Array.from({ length: 12 }).map((_, i) => (
      <motion.div key={i} className="flex-1"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} exit={{ scaleY: 0 }}
        transition={{ duration: 0.5, delay: i * 0.04 }}
        style={{ background: i % 2 ? "hsl(var(--neon-pink)/0.85)" : "hsl(var(--neon-cyan)/0.85)", transformOrigin: "top" }} />
    ))}
  </div>
);

const Spin = () => (
  <motion.div
    className="absolute left-1/2 top-1/2 h-[200vmax] w-[200vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
    initial={{ rotate: 0, scale: 0 }} animate={{ rotate: 720, scale: 1 }}
    transition={{ duration: 0.9 }}
    style={{ background: "conic-gradient(from 0deg, hsl(var(--neon-pink)), hsl(var(--neon-cyan)), hsl(var(--neon-yellow)), hsl(var(--neon-pink)))" }}
  />
);

const Bounce = () => (
  <motion.div
    className="absolute inset-0"
    initial={{ scale: 0, y: 200 }}
    animate={{ scale: [0, 1.4, 0.8, 1.1, 1], y: [200, -80, 30, -10, 0] }}
    transition={{ duration: 1, ease: "easeOut" }}
    style={{ background: "radial-gradient(circle, hsl(var(--neon-yellow)/0.85), hsl(var(--neon-pink)/0.5))" }}
  />
);

const StarWipe = () => (
  <motion.div
    className="absolute inset-0 grid place-items-center"
    initial={{ scale: 0 }} animate={{ scale: 6 }} exit={{ scale: 0 }}
    transition={{ duration: 0.9 }}
  >
    <svg viewBox="0 0 100 100" className="h-[20vmin] w-[20vmin]">
      <polygon
        points="50,2 61,38 98,38 68,60 79,96 50,74 21,96 32,60 2,38 39,38"
        fill="hsl(var(--neon-yellow))"
        style={{ filter: "drop-shadow(0 0 30px hsl(var(--neon-yellow)))" }}
      />
    </svg>
  </motion.div>
);

const ZoomExplosion = () => (
  <motion.div
    className="absolute inset-0"
    initial={{ scale: 0.1, opacity: 0 }}
    animate={{ scale: [0.1, 1, 8], opacity: [0, 1, 0] }}
    transition={{ duration: 1, ease: "easeIn" }}
    style={{
      background: "radial-gradient(circle, white 0%, hsl(var(--neon-pink)) 30%, transparent 70%)",
    }}
  />
);

const MorphGlitch = () => (
  <motion.div
    className="absolute inset-0"
    initial={{ borderRadius: "0%", scale: 0.5, rotate: 0 }}
    animate={{
      borderRadius: ["0%", "50%", "10%", "60%", "0%"],
      scale: [0.5, 1.2, 0.9, 1.05, 1],
      rotate: [0, 90, -45, 30, 0],
    }}
    transition={{ duration: 1 }}
    style={{
      background: "linear-gradient(135deg, hsl(var(--neon-cyan)/0.7), hsl(var(--neon-violet)/0.7), hsl(var(--neon-pink)/0.7))",
      filter: "hue-rotate(0deg) blur(0px)",
    }}
  />
);
