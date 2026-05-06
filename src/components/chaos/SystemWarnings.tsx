import { useChaos } from "@/hooks/useChaos";
import { SYSTEM_WARNINGS, FAKE_NOTIFICATIONS } from "@/lib/chaos-data";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { notify } from "@/lib/sound";

type Toast = { id: number; text: string; kind: "warn" | "info" };

export const SystemWarnings = () => {
  const { level } = useChaos();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (level < 1) return;
    const id = setInterval(() => {
      const useWarn = Math.random() > 0.4;
      const list = useWarn ? SYSTEM_WARNINGS : FAKE_NOTIFICATIONS;
      const text = list[Math.floor(Math.random() * list.length)];
      const t: Toast = { id: Date.now() + Math.random(), text, kind: useWarn ? "warn" : "info" };
      setToasts((prev) => [...prev.slice(-4), t]);
      if (level >= 2) notify();
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 4200);
    }, Math.max(1500, 6000 - level * 900));
    return () => clearInterval(id);
  }, [level]);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[75] flex w-80 flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="glass pointer-events-auto flex items-start gap-2 rounded-xl border-l-2 px-3 py-2 text-sm"
            style={{ borderLeftColor: t.kind === "warn" ? "hsl(var(--warning))" : "hsl(var(--neon-cyan))" }}
          >
            {t.kind === "warn" ? (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "hsl(var(--warning))" }} />
            ) : (
              <Bell className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "hsl(var(--neon-cyan))" }} />
            )}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {t.kind === "warn" ? "System" : "Notification"}
              </div>
              <div className="text-foreground/90">{t.text}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
