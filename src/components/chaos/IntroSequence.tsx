import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const IntroSequence = ({ onDone }: { onDone: () => void }) => {
  const [step, setStep] = useState(0);
  const lines = [
    "booting chaos.ai v0.0.∞ ...",
    "loading consciousness modules ✓",
    "calibrating user expectations ✗",
    "ready.",
  ];
  useEffect(() => {
    if (step >= lines.length) { const t = setTimeout(onDone, 600); return () => clearTimeout(t); }
    const t = setTimeout(() => setStep((s) => s + 1), 550);
    return () => clearTimeout(t);
  }, [step, onDone, lines.length]);

  return (
    <motion.div
      initial={{ opacity: 1 }} animate={{ opacity: step >= lines.length ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-background font-mono text-sm"
    >
      <div className="mb-6 text-2xl font-semibold chaos-text">chaos.ai</div>
      <div className="space-y-1">
        {lines.slice(0, step).map((l, i) => (
          <div key={i} className="text-primary/80">{">"} {l}</div>
        ))}
      </div>
    </motion.div>
  );
};
