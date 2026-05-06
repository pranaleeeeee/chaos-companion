import { useEffect, useRef, useState } from "react";
import { useChaos } from "@/hooks/useChaos";

export const FlashlightCursor = () => {
  const { level } = useChaos();
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [trail, setTrail] = useState<{ x: number; y: number; t: number }[]>([]);
  const [flicker, setFlicker] = useState(1);
  const [size, setSize] = useState(180);
  const [invert, setInvert] = useState(false);
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // delayed/inverted follow
  useEffect(() => {
    if (level < 2) { setPos({ x: -500, y: -500 }); return; }
    let raf: number;
    const tick = () => {
      setPos((p) => {
        const t = targetRef.current;
        const lag = 0.18 - Math.min(0.12, level * 0.02);
        const dir = invert ? -1 : 1;
        return {
          x: p.x + (t.x - p.x) * lag * dir + (invert ? 0 : 0),
          y: p.y + (t.y - p.y) * lag * dir,
        };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [level, invert]);

  // ghost trail
  useEffect(() => {
    if (level < 3) { setTrail([]); return; }
    const id = setInterval(() => {
      setTrail((prev) => [...prev.slice(-6), { ...targetRef.current, t: Date.now() }]);
    }, 70);
    return () => clearInterval(id);
  }, [level]);

  // random flicker, size warp, invert teleport
  useEffect(() => {
    if (level < 2) return;
    const id = setInterval(() => {
      const r = Math.random();
      if (level >= 4 && r < 0.1) {
        setFlicker(0); setTimeout(() => setFlicker(1), 120);
      }
      if (level >= 3 && r < 0.08) {
        setSize(60 + Math.random() * 400);
        setTimeout(() => setSize(180), 600);
      }
      if (level >= 4 && r < 0.05) {
        setInvert(true); setTimeout(() => setInvert(false), 500);
      }
    }, 600);
    return () => clearInterval(id);
  }, [level]);

  if (level < 2) return null;

  return (
    <>
      {/* darkness with cursor cutout */}
      <div
        className="pointer-events-none fixed inset-0 z-[55] transition-opacity duration-200"
        style={{
          opacity: 0.55 * flicker + (level - 2) * 0.08,
          background: `radial-gradient(circle ${size}px at ${pos.x}px ${pos.y}px, transparent 0%, transparent 40%, hsl(0 0% 0% / 0.95) 100%)`,
          mixBlendMode: "multiply",
        }}
      />
      {/* warm flashlight glow */}
      <div
        className="pointer-events-none fixed inset-0 z-[56] transition-opacity duration-150"
        style={{
          opacity: 0.6 * flicker,
          background: `radial-gradient(circle ${size * 0.6}px at ${pos.x}px ${pos.y}px, hsl(45 100% 70% / 0.35), transparent 70%)`,
          mixBlendMode: "screen",
        }}
      />
      {/* burn marks (ghost trail) */}
      {trail.map((p, i) => (
        <div
          key={p.t + "-" + i}
          className="pointer-events-none fixed z-[57] rounded-full"
          style={{
            left: p.x - 4, top: p.y - 4, width: 8, height: 8,
            background: "radial-gradient(circle, hsl(20 100% 50% / 0.6), transparent 70%)",
            opacity: (i + 1) / trail.length * 0.6,
          }}
        />
      ))}
    </>
  );
};
