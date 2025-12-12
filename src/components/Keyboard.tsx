import type { FC } from 'react';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type KeyboardProps = {
  onGuess: (letter: string) => void;
  usedLetters: Set<string>;
  correctLetters: Set<string>;
  wrongLetters: Set<string>;
  disabled?: boolean;
  locked?: boolean;
  showHint?: boolean;
  variant?: 'default' | 'mobile';
  hideHeader?: boolean;
  className?: string;
};

const Keyboard: FC<KeyboardProps> = ({
  onGuess,
  usedLetters,
  correctLetters,
  wrongLetters,
  disabled,
  locked,
  showHint,
  variant = 'default',
  hideHeader = false,
  className = '',
}) => {
  const gridStateClass = locked ? 'opacity-50 cursor-not-allowed' : '';
  const isMobile = variant === 'mobile';
  const containerClass = isMobile
    ? `relative flex h-full flex-col rounded-2xl border border-white/15 bg-[#0b061c]/95 p-2.5 pb-3 shadow-[0_-10px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl ${
        locked ? 'cursor-not-allowed' : ''
      }`
    : `card relative overflow-hidden ${locked ? 'cursor-not-allowed' : ''}`;
  const keycapClass = isMobile ? 'mobile-keycap' : 'keycap';
  const gridCols = isMobile ? 'grid-cols-9 gap-1.5 auto-rows-[minmax(44px,1fr)]' : 'grid-cols-7 gap-2 md:grid-cols-9';

  return (
    <div className={`${containerClass} ${className}`}>
      {!hideHeader && (
        <div className={`mb-3 flex items-center justify-between text-sm text-white/70 ${isMobile ? 'px-1' : ''}`}>
          <span className="text-xs uppercase tracking-[0.18em] text-white/60 md:text-sm">Keyboard</span>
          <span className="text-[11px] text-white/50 md:text-sm">Tap keys or use your keyboard</span>
        </div>
      )}
      <div className={`grid ${gridCols} ${gridStateClass}`}>
        {LETTERS.map((letter) => {
          const isUsed = usedLetters.has(letter);
          const stateClass = correctLetters.has(letter)
            ? 'bg-emerald-500/20 border-emerald-300/30 text-emerald-100'
            : wrongLetters.has(letter)
              ? 'bg-amber-500/15 border-amber-300/30 text-amber-100'
              : 'border-white/10';
          return (
            <button
              key={letter}
              className={`${keycapClass} focus-ring ${stateClass}`}
              onClick={() => onGuess(letter)}
              disabled={disabled || isUsed || locked}
              aria-label={`Letter ${letter}`}
            >
              {letter}
            </button>
          );
        })}
      </div>
      {locked && showHint && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0b061c]/60 backdrop-blur-sm">
          <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white/90">
            🔒 Start a new game to unlock and play
          </span>
        </div>
      )}
    </div>
  );
};

export default Keyboard;
