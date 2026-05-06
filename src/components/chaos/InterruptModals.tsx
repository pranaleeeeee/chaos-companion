import { GROUNDING_PROMPTS, CAPTCHA_PROMPTS, CRASH_LINES } from "@/lib/chaos-data";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { glitchSound, blip } from "@/lib/sound";

type ModalKind = "grounding" | "captcha" | "crash" | "mic";
type ActiveModal = { kind: ModalKind; data?: any } | null;

let setter: ((m: ActiveModal) => void) | null = null;
export function triggerModal(kind: ModalKind) {
  if (!setter) return;
  if (kind === "grounding") {
    setter({ kind, data: GROUNDING_PROMPTS[Math.floor(Math.random() * GROUNDING_PROMPTS.length)] });
  } else if (kind === "captcha") {
    setter({
      kind,
      data: {
        prompt: CAPTCHA_PROMPTS[Math.floor(Math.random() * CAPTCHA_PROMPTS.length)],
        correct: Math.floor(Math.random() * 9),
      },
    });
  } else if (kind === "crash") {
    setter({ kind });
  } else if (kind === "mic") {
    setter({ kind });
  }
}

export const InterruptModals = ({ onResolved }: { onResolved?: () => void }) => {
  const [modal, setModal] = useState<ActiveModal>(null);
  const [text, setText] = useState("");
  const [crashStep, setCrashStep] = useState(0);

  useEffect(() => { setter = setModal; return () => { setter = null; }; }, []);

  useEffect(() => {
    if (modal?.kind === "crash") {
      glitchSound();
      setCrashStep(0);
      const id = setInterval(() => {
        setCrashStep((s) => {
          if (s >= CRASH_LINES.length - 1) {
            clearInterval(id);
            setTimeout(() => { setModal(null); onResolved?.(); }, 800);
            return s;
          }
          return s + 1;
        });
      }, 600);
      return () => clearInterval(id);
    }
  }, [modal, onResolved]);

  const close = () => { setModal(null); setText(""); blip(880); onResolved?.(); };

  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          key={modal.kind}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md"
        >
          {modal.kind === "grounding" && (
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="glass neon-border w-[min(92vw,460px)] rounded-2xl p-6"
            >
              <div className="mb-1 text-xs uppercase tracking-[0.2em] text-primary">Mandatory grounding check</div>
              <h3 className="mb-4 text-xl font-semibold text-foreground">{modal.data.q}</h3>
              <input
                autoFocus
                value={text} onChange={(e) => setText(e.target.value)}
                placeholder={modal.data.placeholder}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground outline-none focus:border-primary"
              />
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={close}>Skip (lose 5 sanity)</Button>
                <button className="btn-neon" disabled={!text.trim()} onClick={close}>
                  Submit
                </button>
              </div>
            </motion.div>
          )}

          {modal.kind === "captcha" && (
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="glass neon-border w-[min(92vw,440px)] rounded-2xl p-6"
            >
              <div className="mb-1 text-xs uppercase tracking-[0.2em]" style={{color:"hsl(var(--neon-pink))"}}>Recovery captcha</div>
              <h3 className="mb-4 text-lg font-semibold">{modal.data.prompt}</h3>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { if (i === modal.data.correct) close(); else { glitchSound(); } }}
                    className="aspect-square rounded-lg border border-border bg-muted/40 transition hover:border-primary hover:bg-muted"
                    style={{
                      backgroundImage: `radial-gradient(circle at ${20+i*7}% ${30+i*5}%, hsl(${i*40} 80% 50% / 0.4), transparent 60%)`,
                    }}
                  >
                    <span className="text-2xl">{["👁️","🌑","🪞","🩸","🕯️","🦷","🌀","🎭","🫥"][i]}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Hint: pick the one that doesn't blink back.</p>
            </motion.div>
          )}

          {modal.kind === "crash" && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-start justify-start gap-2 p-10 font-mono text-sm"
              style={{ background: "hsl(220 80% 25%)", color: "white" }}
            >
              <div className="mb-4 text-2xl">:(</div>
              <div className="mb-4 max-w-2xl text-base">
                Your assistant ran into a problem and needs to restart. We're just collecting some
                error info, and then we'll restart for you.
              </div>
              {CRASH_LINES.slice(0, crashStep + 1).map((l, i) => (
                <div key={i} className="opacity-90">{l}</div>
              ))}
              <div className="mt-4 h-1 w-64 overflow-hidden rounded bg-white/20">
                <motion.div className="h-full bg-white" initial={{ width: 0 }} animate={{ width: `${((crashStep+1)/CRASH_LINES.length)*100}%` }} />
              </div>
            </motion.div>
          )}

          {modal.kind === "mic" && (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="glass neon-border w-[min(92vw,420px)] rounded-2xl p-6">
              <h3 className="mb-2 text-lg font-semibold">Allow microphone access?</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                "chaos.ai" wants to listen. It already is, but it would feel better with permission.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={close}>Block</Button>
                <button className="btn-neon" onClick={close}>Allow</button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
