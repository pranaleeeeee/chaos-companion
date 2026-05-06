import { motion } from "framer-motion";
import { useChaos } from "@/hooks/useChaos";

export const EndingScreen = () => {
  const { ended } = useChaos();
  if (!ended) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-background"
    >
      <div className="static-overlay" />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="chromatic glitch-text text-center text-3xl font-bold tracking-tight md:text-5xl"
      >
        YOU ARE NOW THE ASSISTANT.
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        className="mt-10 font-mono text-2xl text-primary cursor-blink"
      />
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 4 }}
        onClick={() => window.location.reload()}
        className="absolute bottom-6 text-xs text-muted-foreground underline"
      >
        restart simulation
      </motion.button>
    </motion.div>
  );
};
