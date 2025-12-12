import { useCallback, useEffect, useRef } from 'react';

export type SoundKind = 'press' | 'correct' | 'wrong' | 'win' | 'lose';

const soundMap: Record<SoundKind, number[]> = {
  press: [420],
  correct: [660, 520],
  wrong: [140],
  win: [620, 760, 920],
  lose: [220, 180],
};

export function useSound(enabled: boolean) {
  const contextRef = useRef<AudioContext | null>(null);

  const playTone = useCallback(
    (freq: number, offset: number, duration = 0.08) => {
      const ctx = contextRef.current;
      if (!ctx) return;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + duration);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(ctx.currentTime + offset);
      oscillator.stop(ctx.currentTime + offset + duration + 0.02);
    },
    [],
  );

  const play = useCallback(
    (kind: SoundKind) => {
      if (!enabled) return;
      if (!contextRef.current) {
        contextRef.current = new AudioContext();
      }
      const ctx = contextRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      const notes = soundMap[kind];
      notes.forEach((freq, idx) => playTone(freq, idx * 0.1));
    },
    [enabled, playTone],
  );

  useEffect(
    () => () => {
      void contextRef.current?.close();
    },
    [],
  );

  return { play };
}
