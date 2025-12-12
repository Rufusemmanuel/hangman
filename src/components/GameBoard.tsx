import type { FC } from 'react';
import { SparkleDivider } from './icons';

type GameBoardProps = {
  displayWord: string[];
  hint: string;
  hintRevealed: boolean;
  onToggleHint: () => void;
  lastResult?: 'correct' | 'wrong';
  wrongLetters: string[];
  correctLetters: string[];
  lives: number;
  maxLives: number;
  status: 'playing' | 'won' | 'lost';
};

const GameBoard: FC<GameBoardProps> = ({
  displayWord,
  hint,
  hintRevealed,
  onToggleHint,
  lastResult,
  wrongLetters,
  correctLetters,
  lives,
  maxLives,
  status,
}) => {
  const statusTone =
    status === 'won'
      ? 'text-emerald-200 bg-emerald-500/10 border-emerald-400/30'
      : status === 'lost'
        ? 'text-rose-200 bg-rose-500/10 border-rose-400/30'
        : lastResult === 'correct'
          ? 'text-emerald-200 bg-emerald-500/10 border-emerald-300/30'
          : lastResult === 'wrong'
            ? 'text-amber-200 bg-amber-500/10 border-amber-300/30'
            : 'text-sky-200 bg-sky-500/10 border-sky-300/30';

  return (
    <div className={`card space-y-5 ${lastResult === 'wrong' && status === 'playing' ? 'animate-shake' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-sm text-white/70">Hidden word</p>
          <div className="text-2xl font-semibold tracking-wide text-white md:text-3xl">
            {displayWord.map((char, idx) => (
              <span
                key={`${char}-${idx}`}
                className={`word-letter transition-all duration-300 ${
                  char !== '_' ? 'text-white' : 'text-white/30'
                } ${char !== '_' ? 'drop-shadow-[0_0_12px_rgba(167,139,250,0.45)]' : ''}`}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
        <div className={`rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.18em] ${statusTone}`}>
          {status === 'won' ? 'You win' : status === 'lost' ? 'Game over' : lastResult || 'Ready'}
        </div>
      </div>

      <div className="relative flex flex-wrap items-start gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="rounded-lg bg-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-fuchsia-100">
          Hint
        </div>
        <div className="relative flex-1 min-h-[28px]">
          <span
            className={`absolute inset-0 text-sm md:text-base text-white/60 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none ${hintRevealed ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}
          >
            Hint available tap to reveal
          </span>
          <span
            className={`absolute inset-0 text-sm md:text-base transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none ${hintRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
          >
            {hint}
          </span>
          {hintRevealed && (
            <span className="pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(120deg,rgba(255,255,255,0.1),rgba(168,85,247,0.12),rgba(255,255,255,0.08))] animate-hint-sheen" />
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            className="btn text-xs md:text-sm"
            onClick={onToggleHint}
            aria-label={hintRevealed ? 'Hide hint' : 'Reveal hint'}
          >
            {hintRevealed ? 'Hide hint' : 'Reveal hint'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Lives</p>
          <p className="text-2xl font-semibold text-fuchsia-100">{lives}</p>
          <p className="text-xs text-white/50">{maxLives - lives} mistakes</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Correct</p>
          <p className="text-lg font-semibold text-emerald-200">{correctLetters.length}</p>
          <div className="mt-1 flex flex-wrap gap-1 text-xs text-white/70">
            {correctLetters.length === 0 ? 'None' : correctLetters.join(' ')}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Wrong</p>
          <p className="text-lg font-semibold text-amber-200">{wrongLetters.length}</p>
          <div className="mt-1 flex flex-wrap gap-1 text-xs text-white/70">
            {wrongLetters.length === 0 ? 'None' : wrongLetters.join(' ')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
