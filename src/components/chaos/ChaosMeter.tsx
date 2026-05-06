import { useChaos } from "@/hooks/useChaos";

export const ChaosMeter = () => {
  const { sanity, level } = useChaos();
  return (
    <div className="glass flex flex-col gap-1 rounded-xl px-3 py-2">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>Sanity</span>
        <span style={{ color: sanity < 30 ? "hsl(var(--neon-pink))" : "hsl(var(--primary))" }}>
          {sanity.toFixed(0)}% · L{level}
        </span>
      </div>
      <div className="h-1.5 w-44 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${sanity}%`,
            background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--neon-pink)))`,
          }}
        />
      </div>
    </div>
  );
};
