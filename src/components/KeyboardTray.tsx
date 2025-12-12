import { useState, type FC } from 'react';
import Keyboard from './Keyboard';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

type KeyboardTrayProps = {
  onGuess: (letter: string) => void;
  usedLetters: Set<string>;
  correctLetters: Set<string>;
  wrongLetters: Set<string>;
  disabled: boolean;
  locked: boolean;
  showHint: boolean;
  collapsedHeight: string;
  expandedHeight: string;
};

const KeyboardTray: FC<KeyboardTrayProps> = ({
  onGuess,
  usedLetters,
  correctLetters,
  wrongLetters,
  disabled,
  locked,
  showHint,
  collapsedHeight,
  expandedHeight,
}) => {
  const [expanded, setExpanded] = useState(false);
  const height = expanded ? expandedHeight : collapsedHeight;
  const gridMaxHeight = expanded ? '999px' : '9.5rem';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      <div className="mx-auto w-full max-w-6xl px-3 pb-[env(safe-area-inset-bottom)]">
        <div
          className="relative overflow-hidden rounded-t-3xl border border-white/15 bg-[#0b061c]/95 shadow-[0_-10px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          style={{ height }}
        >
          <div className="flex items-center justify-between px-3 pt-2 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-2 py-1 uppercase tracking-[0.16em] text-[10px] text-white/70">Keyboard</span>
              <span className="text-[11px] text-white/50">Tap to guess</span>
            </div>
            <button
              type="button"
              className="btn px-3 py-1.5 text-xs"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? 'Collapse keyboard' : 'Expand keyboard'}
            >
              {expanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />}
            </button>
          </div>
          <div className="h-full px-2 pb-3">
            <div className={`h-full ${expanded ? '' : 'overflow-hidden'}`} style={{ maxHeight: gridMaxHeight }}>
              <Keyboard
                variant="mobile"
                hideHeader
                onGuess={onGuess}
                usedLetters={usedLetters}
                correctLetters={correctLetters}
                wrongLetters={wrongLetters}
                disabled={disabled}
                locked={locked}
                showHint={showHint}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardTray;
