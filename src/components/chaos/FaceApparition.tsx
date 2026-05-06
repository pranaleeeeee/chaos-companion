import devFace from "@/assets/dev-face.png";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Apparition = { id: number; x: number; y: number; scale: number; rot: number; ghost: boolean; behind: boolean };

let pending = 0;
const listeners = new Set<() => void>();
export function summonFace() { pending++; listeners.forEach((l) => l()); }

export const FaceApparition = () => {
  const [items, setItems] = useState<Apparition[]>([]);

  useEffect(() => {
    const tick = () => {
      while (pending > 0) {
        pending--;
        const a: Apparition = {
          id: Date.now() + Math.random(),
          x: Math.random() * 70 + 10,
          y: Math.random() * 60 + 10,
          scale: 0.4 + Math.random() * 1.4,
          rot: (Math.random() - 0.5) * 30,
          ghost: Math.random() < 0.4,
          behind: Math.random() < 0.3,
        };
        setItems((p) => [...p, a]);
        setTimeout(() => setItems((p) => p.filter((x) => x.id !== a.id)), 1800 + Math.random() * 1200);
      }
    };
    listeners.add(tick);
    return () => { listeners.delete(tick); };
  }, []);

  return (
    <>
      <AnimatePresence>
        {items.map((a) => (
          <motion.img
            key={a.id}
            src={devFace}
            alt=""
            initial={{ opacity: 0, scale: a.scale * 0.6, rotate: a.rot - 10 }}
            animate={{ opacity: a.ghost ? 0.35 : 0.95, scale: a.scale, rotate: a.rot }}
            exit={{ opacity: 0, scale: a.scale * 1.2 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="pointer-events-none fixed h-48 w-48 rounded-2xl object-cover"
            style={{
              left: `${a.x}%`,
              top: `${a.y}%`,
              zIndex: a.behind ? 5 : 90,
              filter: a.ghost
                ? "hue-rotate(140deg) blur(1px) drop-shadow(0 0 30px hsl(var(--neon-cyan)))"
                : "drop-shadow(0 0 40px hsl(var(--neon-pink)/0.6))",
              mixBlendMode: a.ghost ? "screen" : "normal",
            }}
          />
        ))}
      </AnimatePresence>
    </>
  );
};
