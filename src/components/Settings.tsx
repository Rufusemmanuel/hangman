import type { FC } from 'react';
import { LightningIcon, SoundOffIcon, SoundOnIcon } from './icons';
import type { Difficulty } from '../data/words';

type SettingsProps = {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  lives: number;
  maxLives: number;
};

const Settings: FC<SettingsProps> = ({ difficulty, onDifficultyChange, soundEnabled, onToggleSound, lives, maxLives }) => {
  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/70">Settings</p>
          <p className="text-xs text-white/50">Tune the vibe & challenge</p>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
          {lives} / {maxLives} lives
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
          <button
            key={level}
            className={`btn ${
              difficulty === level
                ? 'btn-primary shadow-neon'
                : 'border-white/10 bg-white/5 text-white hover:border-white/20'
            }`}
            onClick={() => onDifficultyChange(level)}
            aria-label={`Set difficulty ${level}`}
          >
            <LightningIcon className="h-4 w-4" />
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
        <div>
          <p className="text-sm font-semibold">Sound</p>
          <p className="text-xs text-white/60">Key clicks & reactions</p>
        </div>
        <button
          className="btn"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
        >
          {soundEnabled ? <SoundOnIcon className="h-5 w-5" /> : <SoundOffIcon className="h-5 w-5" />}
          {soundEnabled ? 'On' : 'Muted'}
        </button>
      </div>

      <div className="grid gap-2 text-xs text-white/70">
        <p className="text-sm font-semibold text-white">Tips</p>
        <p>• Use your keyboard or tap the neon keys.</p>
        <p>• Wrong guesses add strokes to the glowing hangman.</p>
        <p>• Switch difficulty to swap the word bank and lives.</p>
      </div>
    </div>
  );
};

export default Settings;
