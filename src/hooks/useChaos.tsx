import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ChaosCtx = {
  level: number; // 0..5
  bump: (n?: number) => void;
  setLevel: (n: number) => void;
  sanity: number; // 100..0
  ended: boolean;
  setEnded: (b: boolean) => void;
};
const Ctx = createContext<ChaosCtx | null>(null);

export const ChaosProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0); // raw prompt count
  const [ended, setEnded] = useState(false);
  const bump = useCallback((n = 1) => setScore((s) => s + n), []);
  const setLevel = useCallback((n: number) => setScore(n * 3), []);
  const level = Math.min(5, Math.floor(score / 3));
  const sanity = Math.max(0, 100 - score * 6);
  return (
    <Ctx.Provider value={{ level, bump, setLevel, sanity, ended, setEnded }}>
      {children}
    </Ctx.Provider>
  );
};

export const useChaos = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useChaos outside provider");
  return c;
};
