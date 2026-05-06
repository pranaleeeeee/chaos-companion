import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MUSIC_GROUNDING_TASKS, AI_MOCKERY } from "@/lib/chaos-data";
import {
  startAnnoyingMusic, stopAnnoyingMusic, setMusicPanic, isMusicPlaying, siren, heartbeat,
} from "@/lib/sound";
import { useChaos } from "@/hooks/useChaos";
import { AlertTriangle } from "lucide-react";

let externalTrigger: (() => void) | null = null;
export function triggerMusicPunishment() { externalTrigger?.(); }

const validate = (text: string, need: number) => {
  const tokens = text.split(/[,\n]+|\s{2,}/).map((t) => t.trim()).filter(Boolean);
  if (need === 1) return text.trim().length >= 8;
  return tokens.length >= need;
};

export const MusicPunishment = () => {
  const { level, bump } = useChaos();
  const [open, setOpen] = useState(false);
  const [panic, setPanic] = useState(0);
  const [taskIdx, setTaskIdx] = useState(0);
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(15);
  const [mockery, setMockery] = useState<string | null>(null);
  const [muteOffset, setMuteOffset] = useState({ x: 0, y: 0 });
  const [muteHidden, setMuteHidden] = useState(false);
  const tickRef = useRef<any>(null);

  const start = () => {
    setOpen(true);
    setPanic(0);
    setTaskIdx(Math.floor(Math.random() * MUSIC_GROUNDING_TASKS.length));
    setText("");
    setTimeLeft(15);
    setMockery(null);
    startAnnoyingMusic(0);
    siren(0.8);
  };

  useEffect(() => { externalTrigger = start; return () => { externalTrigger = null; }; }, []);

  // random spontaneous trigger at higher chaos
  useEffect(() => {
    if (level < 1) return;
    const id = setInterval(() => {
      if (open || isMusicPlaying()) return;
      if (Math.random() < 0.18 + level * 0.04) start();
    }, Math.max(20000, 60000 - level * 6000));
    return () => clearInterval(id);
  }, [level, open]);

  // countdown
  useEffect(() => {
    if (!open) return;
    const dur = Math.max(6, 15 - panic * 2);
    setTimeLeft(dur);
    clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tickRef.current);
          fail();
          return dur;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, taskIdx, panic]);

  // panic side effects
  useEffect(() => {
    if (!open) return;
    setMusicPanic(panic);
    if (panic >= 2) heartbeat();
    if (panic >= 1) document.body.classList.add("animate-shake");
    const t = setTimeout(() => document.body.classList.remove("animate-shake"), 500);
    return () => clearTimeout(t);
  }, [panic, open]);

  const fail = () => {
    const mock = AI_MOCKERY[Math.floor(Math.random() * AI_MOCKERY.length)];
    setMockery(mock);
    setPanic((p) => p + 1);
    setTaskIdx(Math.floor(Math.random() * MUSIC_GROUNDING_TASKS.length));
    setText("");
    siren(1);
    bump(1);
  };

  const submit = () => {
    const task = MUSIC_GROUNDING_TASKS[taskIdx];
    if (validate(text, task.need)) {
      stopAnnoyingMusic();
      setOpen(false);
      setMockery(null);
    } else {
      fail();
    }
  };

  // mute button chaos
  const onMuteHover = () => {
    const r = Math.random();
    if (r < 0.4) setMuteOffset({ x: (Math.random() - 0.5) * 240, y: (Math.random() - 0.5) * 120 });
    else if (r < 0.55) { setMuteHidden(true); setTimeout(() => setMuteHidden(false), 600); }
  };
  const tryMute = () => {
    // fake mute most of the time
    if (Math.random() < 0.7) {
      siren(0.4);
      setMockery("Nice try.");
      return;
    }
    stopAnnoyingMusic();
    setOpen(false);
  };

  if (!open) return null;
  const task = MUSIC_GROUNDING_TASKS[taskIdx];
  const dur = Math.max(6, 15 - panic * 2);
  const pct = (timeLeft / dur) * 100;
  const danger = panic >= 2;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-center justify-center backdrop-blur-md"
        style={{
          background: danger
            ? "radial-gradient(ellipse at center, hsl(0 90% 25% / 0.85), hsl(0 0% 0% / 0.95))"
            : "hsl(0 0% 0% / 0.85)",
        }}
      >
        {/* pulsing border emergency frame */}
        <motion.div
          className="pointer-events-none fixed inset-2 rounded-2xl border-4"
          animate={{
            borderColor: danger
              ? ["hsl(0 100% 60%)", "hsl(0 100% 30%)", "hsl(0 100% 60%)"]
              : ["hsl(var(--warning))", "hsl(var(--neon-pink))", "hsl(var(--warning))"],
            boxShadow: [
              "0 0 30px hsl(0 100% 50% / 0.6) inset",
              "0 0 80px hsl(0 100% 50% / 0.9) inset",
              "0 0 30px hsl(0 100% 50% / 0.6) inset",
            ],
          }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />

        <motion.div
          initial={{ scale: 0.85, rotate: -2 }} animate={{ scale: 1, rotate: 0 }}
          className="glass relative w-[min(94vw,560px)] rounded-2xl p-6"
          style={{ borderColor: danger ? "hsl(0 100% 55%)" : undefined }}
        >
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.25em]"
               style={{ color: danger ? "hsl(0 100% 70%)" : "hsl(var(--warning))" }}>
            <AlertTriangle className="h-4 w-4 animate-pulse" />
            EMERGENCY · MUSIC LOCK · panic L{panic}
          </div>
          <h3 className="text-2xl font-bold leading-tight text-foreground">
            {task.q}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {panic === 0
              ? "Complete this to silence the music."
              : panic === 1
              ? "You failed. The music will continue. Try again."
              : panic === 2
              ? "Disappointing. Tempo increased."
              : "STAY WITH ME. NAME THINGS. NOW."}
          </p>

          {/* timer */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-mono">
              <span style={{ color: danger ? "hsl(0 100% 70%)" : "hsl(var(--primary))" }}>
                {timeLeft}s
              </span>
              <span className="text-muted-foreground">{dur}s window</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full"
                style={{
                  background: danger
                    ? "linear-gradient(90deg, hsl(0 100% 60%), hsl(30 100% 55%))"
                    : "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--neon-pink)))",
                }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
          </div>

          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={task.placeholder}
            rows={2}
            className="mt-4 w-full resize-none rounded-lg border border-border bg-input px-3 py-2 text-foreground outline-none focus:border-primary"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
          />

          {mockery && (
            <motion.div
              key={mockery}
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="mt-3 rounded-md px-3 py-2 text-sm font-medium"
              style={{
                background: "hsl(0 80% 30% / 0.4)",
                color: "hsl(0 100% 85%)",
                border: "1px solid hsl(0 100% 50% / 0.6)",
              }}
            >
              chaos.ai: "{mockery}"
            </motion.div>
          )}

          <div className="mt-5 flex items-center justify-between gap-2">
            {!muteHidden && (
              <motion.div animate={{ x: muteOffset.x, y: muteOffset.y }}
                          transition={{ type: "spring", stiffness: 250, damping: 18 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onMouseEnter={onMuteHover}
                  onClick={tryMute}
                  className="text-muted-foreground"
                >
                  Mute
                </Button>
              </motion.div>
            )}
            <button className="btn-neon" onClick={submit}>
              SUBMIT (or perish musically)
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
