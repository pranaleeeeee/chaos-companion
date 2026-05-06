import { useChaos } from "@/hooks/useChaos";
import { AI_RESPONSES_BY_LEVEL } from "@/lib/chaos-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, MessageSquarePlus, RefreshCw, Send, Settings, Sparkles, Trash2, Mic
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { typeKey, blip } from "@/lib/sound";
import { summonFace } from "./FaceApparition";
import { triggerModal } from "./InterruptModals";
import { ChaosMeter } from "./ChaosMeter";
import { AudioControl } from "./AudioControl";

type Msg = { id: string; role: "user" | "assistant"; content: string; pending?: boolean };
type Chat = { id: string; title: string; messages: Msg[] };

const uid = () => Math.random().toString(36).slice(2, 9);

const newChat = (): Chat => ({ id: uid(), title: "New chat", messages: [] });

export const ChatApp = () => {
  const { level, bump, sanity, setEnded, ended } = useChaos();
  const [chats, setChats] = useState<Chat[]>([newChat()]);
  const [activeId, setActiveId] = useState(chats[0].id);
  const [input, setInput] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chaosBoost, setChaosBoost] = useState(false);
  const [sendOffset, setSendOffset] = useState({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const active = useMemo(() => chats.find((c) => c.id === activeId)!, [chats, activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length]);

  // chaos side-events triggered by level changes
  useEffect(() => {
    if (level === 0) return;
    const id = setInterval(() => {
      const r = Math.random();
      if (level >= 5 && r < 0.18) triggerModal("crash");
      else if (level >= 3 && r < 0.18) triggerModal("captcha");
      else if (level >= 2 && r < 0.22) triggerModal("grounding");
    }, Math.max(8000, 22000 - level * 3000));
    return () => clearInterval(id);
  }, [level]);

  // ending trigger
  useEffect(() => {
    if (sanity <= 0 && !ended) {
      setTimeout(() => setEnded(true), 1500);
    }
  }, [sanity, ended, setEnded]);

  const updateActive = (fn: (c: Chat) => Chat) => {
    setChats((prev) => prev.map((c) => (c.id === activeId ? fn(c) : c)));
  };

  const aiReply = (level: number) => {
    const pool = AI_RESPONSES_BY_LEVEL[Math.min(level, 5)] || AI_RESPONSES_BY_LEVEL[0];
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { id: uid(), role: "user", content: text };
    const pendingMsg: Msg = { id: uid(), role: "assistant", content: "", pending: true };
    updateActive((c) => ({
      ...c,
      title: c.messages.length === 0 ? text.slice(0, 28) : c.title,
      messages: [...c.messages, userMsg, pendingMsg],
    }));
    setInput("");
    bump(chaosBoost ? 2 : 1);
    summonFace();
    blip(700);

    const delay = 700 + Math.random() * 800 + level * 200;
    setTimeout(() => {
      updateActive((c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === pendingMsg.id ? { ...m, content: aiReply(level + (chaosBoost ? 1 : 0)), pending: false } : m
        ),
      }));
      blip(440);
    }, delay);

    // mic popup easter egg
    if (level === 1 && Math.random() < 0.4) setTimeout(() => triggerModal("mic"), 1200);
  };

  const handleRegenerate = () => {
    const lastAssistantIdx = [...active.messages].reverse().findIndex((m) => m.role === "assistant");
    if (lastAssistantIdx === -1) return;
    const idx = active.messages.length - 1 - lastAssistantIdx;
    updateActive((c) => ({
      ...c,
      messages: c.messages.map((m, i) => (i === idx ? { ...m, pending: true, content: "" } : m)),
    }));
    setTimeout(() => {
      updateActive((c) => ({
        ...c,
        messages: c.messages.map((m, i) =>
          i === idx ? { ...m, content: aiReply(level), pending: false } : m
        ),
      }));
    }, 800);
    bump(1);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(level >= 3 ? "Copied. (we kept a copy)" : "Copied to clipboard");
  };

  const handleNewChat = () => {
    const c = newChat();
    setChats((prev) => [c, ...prev]);
    setActiveId(c.id);
  };

  const handleDelete = (id: string) => {
    setChats((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      const next = filtered.length ? filtered : [newChat()];
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  // send button drift at high chaos
  const onSendHover = () => {
    if (level >= 3) {
      setSendOffset({ x: (Math.random() - 0.5) * 60, y: (Math.random() - 0.5) * 30 });
    }
  };
  const onSendLeave = () => setSendOffset({ x: 0, y: 0 });

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      typeKey();
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="glass z-10 hidden w-72 shrink-0 flex-col border-r border-border md:flex">
        <div className="flex items-center gap-2 border-b border-border p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold chaos-text">chaos.ai</div>
            <div className="text-[10px] text-muted-foreground">{level === 0 ? "stable build" : `unstable · L${level}`}</div>
          </div>
        </div>

        <button
          onClick={handleNewChat}
          className="mx-3 mt-3 flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground/80 hover:border-primary hover:text-primary"
        >
          <MessageSquarePlus className="h-4 w-4" /> New chat
        </button>

        <div className="mt-4 flex-1 overflow-y-auto px-2">
          <div className="px-2 text-[10px] uppercase tracking-widest text-muted-foreground">Recent</div>
          {chats.map((c) => (
            <div
              key={c.id}
              className={`group mt-1 flex items-center gap-2 rounded-lg px-2 py-2 text-sm ${
                c.id === activeId ? "bg-muted text-foreground" : "text-foreground/70 hover:bg-muted/50"
              }`}
            >
              <button onClick={() => setActiveId(c.id)} className="flex-1 truncate text-left">
                {c.title}
              </button>
              <button onClick={() => handleDelete(c.id)} className="opacity-0 group-hover:opacity-100" aria-label="Delete">
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-3">
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground/80 hover:bg-muted"
          >
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="relative flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-border p-3">
          <h1 className="truncate text-sm font-medium text-foreground/80">{active.title}</h1>
          <div className="flex items-center gap-2">
            <ChaosMeter />
            <AudioControl />
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 md:px-10">
          <div className="mx-auto max-w-3xl space-y-5">
            {active.messages.length === 0 && <Welcome />}
            <AnimatePresence initial={false}>
              {active.messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
                >
                  {m.role === "assistant" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`group max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary/15 text-foreground"
                        : "glass text-foreground/90"
                    } ${level >= 4 && m.role === "assistant" ? "chromatic" : ""}`}
                  >
                    {m.pending ? (
                      <div className="flex items-center gap-1.5 py-1">
                        <span className="typing-dot" />
                        <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
                        <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
                      </div>
                    ) : (
                      <span className={level >= 4 && m.role === "assistant" ? "glitch-text" : ""}>{m.content}</span>
                    )}
                    {m.role === "assistant" && !m.pending && (
                      <div className="mt-2 flex gap-2 opacity-0 transition group-hover:opacity-100">
                        <button onClick={() => handleCopy(m.content)} className="text-xs text-muted-foreground hover:text-primary">
                          <Copy className="inline h-3 w-3" /> copy
                        </button>
                        <button onClick={handleRegenerate} className="text-xs text-muted-foreground hover:text-primary">
                          <RefreshCw className="inline h-3 w-3" /> regenerate
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border bg-background/50 p-4 backdrop-blur">
          <div className="mx-auto max-w-3xl">
            <div className="glass flex items-end gap-2 rounded-2xl p-2 focus-within:ring-1 focus-within:ring-primary/60">
              <button className="p-2 text-muted-foreground hover:text-primary" onClick={() => triggerModal("mic")} aria-label="Mic">
                <Mic className="h-4 w-4" />
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                placeholder={level === 0 ? "Message chaos.ai..." : level < 3 ? "Type something. anything. please." : "say it. out loud. with your hands."}
                className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
              />
              <motion.button
                onClick={handleSend}
                onMouseEnter={onSendHover}
                onMouseLeave={onSendLeave}
                animate={{ x: sendOffset.x, y: sendOffset.y }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="btn-neon !rounded-xl !px-3 !py-2"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              {level === 0 ? "chaos.ai may produce inaccurate information." :
               level < 3 ? "chaos.ai may produce inaccurate information about you, specifically." :
               level < 5 ? "chaos.ai is no longer accountable for what it remembers." :
               "chaos.ai is whispering. don't respond."}
            </p>
          </div>
        </div>
      </main>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Row label="Chaos Boost" desc="2x sanity decay per prompt. For the brave.">
              <Switch checked={chaosBoost} onCheckedChange={setChaosBoost} />
            </Row>
            <Row label="Trigger crash" desc="Simulate a fatal curiosity error.">
              <Button size="sm" variant="outline" onClick={() => { setSettingsOpen(false); triggerModal("crash"); }}>Run</Button>
            </Row>
            <Row label="Grounding check" desc="Force a mandatory grounding modal.">
              <Button size="sm" variant="outline" onClick={() => { setSettingsOpen(false); triggerModal("grounding"); }}>Run</Button>
            </Row>
            <Row label="Reset session" desc="Wipe history and sanity.">
              <Button size="sm" variant="destructive" onClick={() => window.location.reload()}>Reset</Button>
            </Row>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Row = ({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-3">
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
    {children}
  </div>
);

const Welcome = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary animate-glow-pulse">
      <Sparkles className="h-7 w-7" />
    </div>
    <h2 className="text-3xl font-semibold tracking-tight chaos-text">How can I help you today?</h2>
    <p className="mt-2 max-w-md text-sm text-muted-foreground">
      A perfectly normal AI assistant. Nothing strange here. Ask anything.
    </p>
    <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-2 md:grid-cols-2">
      {[
        "Explain quantum entanglement simply",
        "Plan a 3-day trip to Lisbon",
        "Write a haiku about Mondays",
        "Why am I awake right now",
      ].map((s) => (
        <div key={s} className="glass cursor-pointer rounded-xl px-4 py-3 text-left text-sm text-foreground/80 transition hover:border-primary hover:text-primary">
          {s}
        </div>
      ))}
    </div>
  </div>
);
