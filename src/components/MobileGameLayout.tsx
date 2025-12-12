import type { FC } from 'react';
import type { Difficulty } from '../data/words';
import HangmanSVG from './HangmanSVG';
import Settings from './Settings';
import WalletPanel from '../wallet/WalletPanel';
import KeyboardTray from './KeyboardTray';

type MobileGameLayoutProps = {
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
  onGuess: (letter: string) => void;
  usedLetters: Set<string>;
  locked: boolean;
  keyboardDisabled: boolean;
  showHint: boolean;
  mistakes: number;
  difficulty: Difficulty;
  points: number;
  lastAward: number | null;
  onNewGame: () => void;
  newGameLabel: string;
  newGameDisabled: boolean;
  newGameError?: string | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  menuOpen: boolean;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
};

const KEYBOARD_COLLAPSED_HEIGHT = '26vh';
const KEYBOARD_EXPANDED_HEIGHT = '44vh';

const MobileGameLayout: FC<MobileGameLayoutProps> = ({
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
  onGuess,
  usedLetters,
  locked,
  keyboardDisabled,
  showHint,
  mistakes,
  difficulty,
  points,
  lastAward,
  onNewGame,
  newGameLabel,
  newGameDisabled,
  newGameError,
  soundEnabled,
  onToggleSound,
  onDifficultyChange,
  menuOpen,
  onOpenMenu,
  onCloseMenu,
}) => {
  const statusTone =
    status === 'won'
      ? 'text-emerald-200 border-emerald-300/30 bg-emerald-500/10'
      : status === 'lost'
        ? 'text-rose-200 border-rose-300/30 bg-rose-500/10'
        : lastResult === 'correct'
          ? 'text-emerald-200 border-emerald-300/30 bg-emerald-500/10'
          : lastResult === 'wrong'
            ? 'text-amber-200 border-amber-300/30 bg-amber-500/10'
            : 'text-sky-200 border-sky-300/30 bg-sky-500/10';

  return (
    <div className="md:hidden">
      <div
        className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col gap-3 px-4 pt-3"
        style={{ paddingBottom: KEYBOARD_COLLAPSED_HEIGHT }}
      >
        <header className="flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Neon Hangman</p>
            <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-fuchsia-100">
              {difficulty}
            </span>
            <span className="text-[11px] text-white/70">Lives {lives}/{maxLives}</span>
            <span className="text-[11px] text-fuchsia-200 font-semibold">{points} pts</span>
            {lastAward !== null && <span className="text-[11px] text-emerald-200">+{lastAward}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn px-3 py-1.5 text-xs"
              onClick={onOpenMenu}
              aria-label="Open menu"
            >
              Menu
            </button>
            <button
              className="btn btn-primary px-3 py-1.5 text-xs font-semibold"
              onClick={onNewGame}
              aria-label="Start a new game"
              disabled={newGameDisabled}
            >
              {newGameLabel}
            </button>
          </div>
        </header>
        {newGameError && <p className="text-[11px] text-rose-200/90">{newGameError}</p>}

        <section className="flex flex-1 flex-col gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.16em] text-white/60">Hidden word</span>
                <button className="btn px-3 py-1.5 text-xs" onClick={onToggleHint} aria-label={hintRevealed ? 'Hide hint' : 'Reveal hint'}>
                  {hintRevealed ? 'Hide hint' : 'Reveal hint'}
                </button>
              </div>
              <div className={`rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.18em] ${statusTone}`}>
                {status === 'won' ? 'You win' : status === 'lost' ? 'Game over' : lastResult || 'Ready'}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 text-xl font-semibold tracking-[0.14em] text-white">
              {displayWord.map((char, idx) => (
                <span
                  key={`${char}-${idx}`}
                  className={`inline-flex min-w-[22px] justify-center text-xl font-semibold ${
                    char !== '_' ? 'text-white' : 'text-white/30'
                  } ${
                    char !== '_' ? 'drop-shadow-[0_0_12px_rgba(167,139,250,0.45)]' : ''
                  }`}
                >
                  {char}
                </span>
              ))}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-white/70">
              <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-fuchsia-100">Hint</span>
              <span className="truncate text-sm text-white/70">{hintRevealed ? hint : 'Tap reveal to view hint'}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/60">
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">Lives {lives}/{maxLives}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">Correct {correctLetters.length}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">Wrong {wrongLetters.length}</span>
            </div>
          </div>

          <div className="flex flex-1 flex-col rounded-2xl border border-white/10 bg-white/5 p-2">
            <div className="mb-1 flex items-center justify-between text-xs text-white/70">
              <span>Hangman</span>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-white/70">
                {mistakes}/{maxLives} mistakes
              </span>
            </div>
            <div className="flex-1 min-h-[45vh]">
              <HangmanSVG mistakes={mistakes} maxMistakes={maxLives} status={status} compact className="h-full" />
            </div>
          </div>
        </section>
      </div>

      <KeyboardTray
        collapsedHeight={KEYBOARD_COLLAPSED_HEIGHT}
        expandedHeight={KEYBOARD_EXPANDED_HEIGHT}
        onGuess={onGuess}
        usedLetters={usedLetters}
        correctLetters={new Set(correctLetters)}
        wrongLetters={new Set(wrongLetters)}
        disabled={keyboardDisabled}
        locked={locked}
        showHint={showHint}
      />

      {menuOpen && (
        <div className="fixed inset-0 z-30 flex items-end justify-center">
          <div className="modal-backdrop absolute inset-0" onClick={onCloseMenu} />
          <div className="relative w-full max-w-2xl rounded-t-3xl border border-white/10 bg-neutral-900/95 p-4 shadow-neon animate-pop">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Menu</p>
                <p className="text-sm text-white/80">Wallet & Settings</p>
              </div>
              <button className="btn px-3 py-1.5 text-xs" onClick={onCloseMenu} aria-label="Close menu">Close</button>
            </div>
            <div className="grid gap-3">
              <WalletPanel />
              <Settings
                difficulty={difficulty}
                onDifficultyChange={onDifficultyChange}
                soundEnabled={soundEnabled}
                onToggleSound={onToggleSound}
                lives={lives}
                maxLives={maxLives}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileGameLayout;
