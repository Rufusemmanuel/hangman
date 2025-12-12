import type { FC } from 'react';

type HeaderProps = {
  onNewGame: () => void;
  newGameLabel?: string;
  newGameDisabled?: boolean;
  newGameError?: string | null;
  lives: number;
  maxLives: number;
  difficulty: string;
  points: number;
  lastAward: number | null;
};

const Header: FC<HeaderProps> = ({
  onNewGame,
  lives,
  maxLives,
  difficulty,
  points,
  lastAward,
  newGameLabel = 'New Game',
  newGameDisabled = false,
  newGameError,
}) => {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start">
        <div>
          <h1 className="text-3xl font-semibold text-white drop-shadow-lg md:text-4xl">Guess the secret word</h1>
          <p className="text-sm text-white/70">Difficulty: {difficulty.toUpperCase()} - LIVES {lives}/{maxLives}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="btn border border-white/15 bg-white/10 text-left text-sm font-semibold shadow-glow"
          type="button"
          aria-label="Points"
        >
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/70">Points</span>
          <span className="text-lg leading-none text-white">{points}</span>
          {lastAward !== null && (
            <span className="pointer-events-none absolute -top-1 right-2 select-none text-sm font-semibold text-emerald-200 animate-points-float">
              +{lastAward}
            </span>
          )}
        </button>
        <button
          className="btn btn-primary"
          onClick={onNewGame}
          aria-label="Start a new game"
          disabled={newGameDisabled}
        >
          {newGameLabel}
        </button>
        {newGameError && <span className="text-xs text-rose-200/90">{newGameError}</span>}
      </div>
    </header>
  );
};

export default Header;
