import type { FC } from 'react';
import { SparklesIcon } from './icons';

type ResultModalProps = {
  open: boolean;
  status: 'playing' | 'won' | 'lost';
  word: string;
  mistakes: number;
  onPlayAgain: () => void;
};

const Confetti: FC = () => {
  const pieces = Array.from({ length: 50 }, (_, i) => i);
  const colors = ['#a855f7', '#ec4899', '#6366f1', '#22d3ee', '#facc15'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 1.4 + Math.random() * 0.6;
        const size = 6 + Math.random() * 6;
        const color = colors[i % colors.length];
        return (
          <span
            key={i}
            className="absolute animate-fall rounded-sm"
            style={{
              left: `${left}%`,
              top: '-10px',
              width: `${size}px`,
              height: `${size * 0.4}px`,
              background: color,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
};

const ResultModal: FC<ResultModalProps> = ({ open, status, word, mistakes, onPlayAgain }) => {
  if (!open) return null;

  const win = status === 'won';

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 md:p-8">
      <div className="modal-backdrop absolute inset-0 backdrop-blur-md" />
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-neutral-900/90 p-8 shadow-neon animate-pop">
        {win && <Confetti />}
        <div className="relative flex flex-col gap-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-glow">
            <SparklesIcon className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-semibold">
            {win ? 'Victory!' : 'Try again'}
          </h2>
          <p className="text-white/70">
            The word was <span className="font-semibold text-fuchsia-200">{word}</span>. You made {mistakes} mistake{mistakes === 1 ? '' : 's'}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button className="btn btn-primary" onClick={onPlayAgain} autoFocus>
              Play again
            </button>
            <button
              className="btn border border-white/10 bg-white/5 text-white"
              onClick={() => navigator.clipboard?.writeText(word)}
            >
              Copy word
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
