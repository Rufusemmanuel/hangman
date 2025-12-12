import type { FC } from 'react';

type HangmanSVGProps = {
  mistakes: number;
  maxMistakes: number;
  status: 'playing' | 'won' | 'lost';
};

const HangmanSVG: FC<HangmanSVGProps> = ({ mistakes, maxMistakes, status }) => {
  const beamY = 40;
  const headCx = 170;
  const headCy = 85;
  const headR = 20;
  const headTop = headCy - headR;
  const ropeY1 = beamY + 6;
  const ropeY2 = headTop - 2;

  const Rope = (
    <g key="rope">
      {/* Knot */}
      <circle cx={headCx} cy={ropeY1 + 2} r={3} />
      <path d={`M${headCx - 3} ${ropeY1 + 1}l6 6`} />

      {/* Main rope */}
      <path
        d={`M${headCx} ${ropeY1 + 6}V${ropeY2}`}
        strokeDasharray="4 6"
      />

      {/* Twist overlay */}
      <path
        d={`M${headCx + 1} ${ropeY1 + 6}V${ropeY2}`}
        strokeDasharray="1 7"
        opacity={0.35}
      />
    </g>
  );

  const parts = [
    Rope,
    <circle key="head" cx={headCx} cy={headCy} r={headR} />, // 2
    <path key="body" d="M170 105v70" />, // 3
    <path key="armL" d="M170 125l-32 28" />, // 4
    <path key="armR" d="M170 125l32 28" />, // 5
    <path key="legL" d="M170 175l-26 38" />, // 6
    <path key="legR" d="M170 175l26 38" />, // 7
    <path key="face" d="M162 82l6 6m0-6-6 6m10 0 8 8" />, // 8 (eyes + smile)
  ];

  const visibleCount = Math.min(mistakes, parts.length);
  const accent = status === 'won' ? '#34d399' : status === 'lost' ? '#fb7185' : '#a855f7';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-4">
      <svg viewBox="0 0 240 260" className="w-full drop-shadow-[0_10px_40px_rgba(124,96,255,0.35)]">
        <defs>
          <linearGradient id="hangmanStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#a855f7" offset="0%" />
            <stop stopColor="#ec4899" offset="100%" />
          </linearGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="rgba(168,85,247,0.6)" />
          </filter>
        </defs>

        <g stroke="rgba(255,255,255,0.12)" strokeWidth={6} strokeLinecap="round" fill="none">
          <path d="M30 230h180" />
          <path d="M70 230V40" />
          <path d="M70 40h100" />
        </g>

        <g stroke="url(#hangmanStroke)" strokeWidth={6} strokeLinecap="round" fill="none" filter="url(#glow)">
          {parts.map((element, idx) => {
            const show = idx < visibleCount;
            const isRope = (element.key as string) === 'rope';
            const dash = isRope ? 60 : 220;
            return (
              <g
                key={element.key as string}
                style={{
                  opacity: show ? 1 : 0,
                  transition: 'opacity 0.25s ease',
                }}
              >
                <g
                  style={{
                    strokeDasharray: dash,
                    strokeDashoffset: show ? 0 : dash,
                    transition: 'stroke-dashoffset 0.55s ease, opacity 0.35s ease',
                  }}
                >
                  <g
                    stroke={isRope ? '#e5e7eb' : undefined}
                    strokeWidth={isRope ? 7 : 6}
                    strokeLinecap="round"
                    filter={isRope ? 'none' : 'url(#glow)'}
                  >
                    {element}
                  </g>
                </g>
              </g>
            );
          })}
        </g>

        <g stroke="rgba(255,255,255,0.08)" strokeWidth={2} strokeDasharray="6 10">
          <path d="M18 238h204" />
          <path d="M70 230V46" />
        </g>

        {status === 'won' && (
          <g fill={accent} fillOpacity={0.85}>
            <circle cx="170" cy="85" r="6" />
            <circle cx="170" cy="115" r="4" />
          </g>
        )}
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(168,85,247,0.2),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05),transparent)] opacity-60" />
      <div className="absolute bottom-3 right-4 text-xs uppercase tracking-[0.14em] text-white/50">
        {mistakes}/{maxMistakes} mistakes
      </div>
    </div>
  );
};

export default HangmanSVG;
