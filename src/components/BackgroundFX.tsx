import type { FC } from 'react';

type BackgroundFXProps = {
  pulseKey?: number;
};

const BackgroundFX: FC<BackgroundFXProps> = ({ pulseKey }) => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,96,255,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.08),transparent_25%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.08),transparent_28%)]" />
      <div
        key={pulseKey}
        className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl animate-pulseGlow"
      />
      <div className="absolute -right-16 top-24 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl animate-float" />
      <div className="absolute bottom-10 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-700/20 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff0a,transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.0)_35%,rgba(255,255,255,0.03)_70%)]" />
    </div>
  );
};

export default BackgroundFX;
