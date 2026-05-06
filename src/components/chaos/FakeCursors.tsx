import { useChaos } from "@/hooks/useChaos";
import { useEffect, useRef, useState } from "react";

export const FakeCursors = () => {
  const { level } = useChaos();
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const real = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      real.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const count = level >= 5 ? 4 : level >= 4 ? 2 : level >= 3 ? 1 : 0;
    if (count === 0) { setPositions([]); return; }
    const id = setInterval(() => {
      setPositions(
        Array.from({ length: count }, () => ({
          x: real.current.x + (Math.random() - 0.5) * 200,
          y: real.current.y + (Math.random() - 0.5) * 200,
        }))
      );
    }, 90);
    return () => clearInterval(id);
  }, [level]);

  return (
    <>
      {positions.map((p, i) => (
        <svg
          key={i}
          className="pointer-events-none fixed z-[80] transition-all duration-75"
          style={{ left: p.x, top: p.y }}
          width="20" height="20" viewBox="0 0 20 20"
        >
          <path d="M2 2 L2 16 L6 12 L9 18 L11 17 L8 11 L14 11 Z"
                fill={i % 2 ? "hsl(var(--neon-pink))" : "hsl(var(--neon-cyan))"}
                stroke="black" strokeWidth="0.5" opacity="0.8" />
        </svg>
      ))}
    </>
  );
};
