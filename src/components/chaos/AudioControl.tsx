import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { setMuted, setVolume, isMuted, startAmbient, stopAmbient } from "@/lib/sound";
import { useChaos } from "@/hooks/useChaos";

export const AudioControl = () => {
  const { level } = useChaos();
  const [muted, setM] = useState(isMuted());
  const [vol, setV] = useState(0.35);
  const [pos, setPos] = useState({ dx: 0, dy: 0 });
  const [fakeMute, setFakeMute] = useState(false);

  useEffect(() => { startAmbient(level); return () => {}; }, [level]);
  useEffect(() => () => stopAmbient(), []);

  const toggleMute = () => {
    if (level >= 3 && Math.random() < 0.4) {
      // fake mute
      setFakeMute((f) => !f);
      return;
    }
    setM((m) => { setMuted(!m); return !m; });
  };

  const onSliderHover = () => {
    if (level >= 3) setPos({ dx: (Math.random() - 0.5) * 80, dy: (Math.random() - 0.5) * 30 });
  };

  return (
    <div
      className="glass flex items-center gap-3 rounded-full px-3 py-2 transition-transform"
      style={{ transform: `translate(${pos.dx}px, ${pos.dy}px)` }}
      onMouseEnter={onSliderHover}
    >
      <button onClick={toggleMute} className="text-foreground/80 hover:text-primary" aria-label="Mute">
        {muted || fakeMute ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
      <input
        type="range" min={0} max={1} step={0.01} value={vol}
        onChange={(e) => { const v = +e.target.value; setV(v); setVolume(v); }}
        className="h-1 w-24 accent-primary"
      />
    </div>
  );
};
