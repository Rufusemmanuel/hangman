import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  useAccount,
  useChainId,
  usePublicClient,
  useReadContract,
  useSwitchChain,
} from 'wagmi';
import { useSendCalls } from 'wagmi/experimental';
import { encodeFunctionData } from 'viem';
import { waitForCallsStatus } from '@wagmi/core';
import { sdk } from '@farcaster/miniapp-sdk';
import GameBoard from './components/GameBoard';
import HangmanSVG from './components/HangmanSVG';
import Header from './components/Header';
import Keyboard from './components/Keyboard';
import ResultModal from './components/ResultModal';
import Settings from './components/Settings';
import MobileGameLayout from './components/MobileGameLayout';
import { PAY_TO_PLAY_ABI, PAY_TO_PLAY_ADDRESS } from './config/contract';
import { Difficulty, WordEntry, wordBank } from './data/words';
import { useSound } from './hooks/useSound';
import WalletPanel from './wallet/WalletPanel';
import {
  appendDataSuffix,
  getBuilderDataSuffixHex,
  walletSupportsDataSuffix,
} from './utils/builderAttribution';
import { config } from './wagmi';

const BASE_CHAIN_ID = 8453;

type GameStatus = 'playing' | 'won' | 'lost';

type GameState = {
  wordEntry: WordEntry;
  guessed: Set<string>;
  lives: number;
  status: GameStatus;
  difficulty: Difficulty;
  roundDifficulty: Difficulty;
  lastResult?: 'correct' | 'wrong';
};

type GameAction =
  | { type: 'NEW_GAME'; difficulty?: Difficulty }
  | { type: 'GUESS'; letter: string };

const livesByDifficulty: Record<Difficulty, number> = {
  easy: 8,
  medium: 7,
  hard: 6,
};

function getRandomEntry(difficulty: Difficulty): WordEntry {
  const pool = wordBank[difficulty];
  const entry = pool[Math.floor(Math.random() * pool.length)];
  return { ...entry, word: entry.word.toUpperCase() };
}

function createGame(difficulty: Difficulty): GameState {
  return {
    wordEntry: getRandomEntry(difficulty),
    guessed: new Set(),
    lives: livesByDifficulty[difficulty],
    status: 'playing',
    difficulty,
    roundDifficulty: difficulty,
    lastResult: undefined,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NEW_GAME': {
      const difficulty = action.difficulty ?? state.difficulty;
      return createGame(difficulty);
    }
    case 'GUESS': {
      if (state.status !== 'playing') return state;
      const letter = action.letter.toUpperCase();
      if (!/^[A-Z]$/.test(letter) || state.guessed.has(letter)) return state;

      const guessed = new Set(state.guessed);
      guessed.add(letter);

      if (state.wordEntry.word.includes(letter)) {
        const allRevealed = state.wordEntry.word
          .split('')
          .every((ch) => ch === ' ' || guessed.has(ch));
        return {
          ...state,
          guessed,
          status: allRevealed ? 'won' : 'playing',
          lastResult: 'correct',
        };
      }

      const lives = state.lives - 1;
      return {
        ...state,
        guessed,
        lives,
        status: lives <= 0 ? 'lost' : 'playing',
        lastResult: 'wrong',
      };
    }
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createGame('medium'));
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [feedbackPulse, setFeedbackPulse] = useState(0);
  const [hintRevealed, setHintRevealed] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isRevealingResult, setIsRevealingResult] = useState(false);
  const loseTimer = useRef<number | null>(null);
  const [points, setPoints] = useState(0);
  const [lastAward, setLastAward] = useState<number | null>(null);
  const awardTimer = useRef<number | null>(null);
  const roundAwarded = useRef(false);
  const { play } = useSound(soundEnabled);
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const publicClient = usePublicClient({ chainId: BASE_CHAIN_ID });
  const { data: hasEnteredData, refetch: refetchHasEntered, isFetching: checkingEntered } = useReadContract({
    address: PAY_TO_PLAY_ADDRESS as `0x${string}`,
    abi: PAY_TO_PLAY_ABI,
    functionName: 'hasEntered',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    chainId: BASE_CHAIN_ID,
    query: { enabled: Boolean(address) },
  });
  const { data: entryFeeWei } = useReadContract({
    address: PAY_TO_PLAY_ADDRESS as `0x${string}`,
    abi: [
      ...PAY_TO_PLAY_ABI,
      {
        type: 'function',
        name: 'entryFeeWei',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ] as const,
    functionName: 'entryFeeWei',
    chainId: BASE_CHAIN_ID,
  });
  const isUnlocked = Boolean(hasEnteredData);
  const { sendCallsAsync, isPending: sendingCalls } = useSendCalls();
  const [newGameLoading, setNewGameLoading] = useState(false);
  const [newGameError, setNewGameError] = useState<string | null>(null);
  const [clearingError, setClearingError] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const builderDataSuffixHex = useMemo(() => getBuilderDataSuffixHex(), []);
  const [dataSuffixSupported, setDataSuffixSupported] = useState(false);

  useEffect(() => {
    // Signal readiness to the Farcaster Mini App host so the splash can dismiss.
    sdk.actions?.ready().catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supported = await walletSupportsDataSuffix(connector, BASE_CHAIN_ID);
      if (!cancelled) {
        setDataSuffixSupported(supported);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [connector]);

  const maxLives = livesByDifficulty[state.difficulty];
  const wrongLetters = Array.from(state.guessed).filter((l) => !state.wordEntry.word.includes(l));
  const correctLetters = Array.from(state.guessed).filter((l) => state.wordEntry.word.includes(l));
  const mistakes = wrongLetters.length;

  const displayWord = useMemo(
    () =>
      state.wordEntry.word.split('').map((char) => {
        if (char === ' ') return ' ';
        return state.guessed.has(char) || state.status === 'lost' ? char : '_';
      }),
    [state.guessed, state.status, state.wordEntry.word],
  );

  const startNewGame = (difficulty?: Difficulty) => {
    if (loseTimer.current) {
      window.clearTimeout(loseTimer.current);
      loseTimer.current = null;
    }
    dispatch({ type: 'NEW_GAME', difficulty });
    setFeedbackPulse((v) => v + 1);
    setHintRevealed(false);
    setResult(null);
    setShowResultModal(false);
    setIsRevealingResult(false);
    roundAwarded.current = false;
  };

  const waitForCallBundle = async (callId: string) => {
    const status = await waitForCallsStatus(config, {
      id: callId,
      connector: connector ?? undefined,
      throwOnFailure: true,
    });
    const receiptHash = status.receipts?.[0]?.transactionHash;
    if (receiptHash && publicClient) {
      await publicClient.waitForTransactionReceipt({ hash: receiptHash });
    }
  };

  const handlePlay = async (newDifficulty?: Difficulty) => {
    if (newGameLoading || sendingCalls) return;
    setNewGameError(null);
    setNewGameLoading(true);
    if (!isConnected || !address) {
      setNewGameError('Connect wallet to start.');
      setNewGameLoading(false);
      return;
    }
    if (chainId !== BASE_CHAIN_ID) {
      try {
        await switchChainAsync({ chainId: BASE_CHAIN_ID });
      } catch {
        setNewGameError('Switch to Base to start a new game.');
        setNewGameLoading(false);
        return;
      }
    }
    try {
      if (entryFeeWei === undefined) {
        setNewGameError('Entry fee not loaded yet');
        setNewGameLoading(false);
        return;
      }
      let hasEntered = Boolean(hasEnteredData);
      try {
        const refreshed = await refetchHasEntered();
        if (refreshed?.data !== undefined) {
          hasEntered = Boolean(refreshed.data);
        }
      } catch {
        // ignore read errors, fall back to cached
      }

      if (!hasEntered) {
        const enterData = encodeFunctionData({
          abi: PAY_TO_PLAY_ABI,
          functionName: 'enter',
        });
        const enterCallData = dataSuffixSupported
          ? enterData
          : appendDataSuffix(enterData, builderDataSuffixHex);
        console.log({ supportsSuffix: dataSuffixSupported, suffixHex: builderDataSuffixHex });
        const enterCall = await sendCallsAsync({
          calls: [
            {
              to: PAY_TO_PLAY_ADDRESS as `0x${string}`,
              data: enterCallData,
              value: entryFeeWei,
            },
          ],
          chainId: BASE_CHAIN_ID,
          capabilities: dataSuffixSupported
            ? { dataSuffix: { value: builderDataSuffixHex } }
            : undefined,
        });
        if (!publicClient) {
          throw new Error('Missing Base client');
        }
        await waitForCallBundle(enterCall.id);
        await refetchHasEntered();
        startNewGame(newDifficulty);
        return;
      }

      const pingData = encodeFunctionData({
        abi: PAY_TO_PLAY_ABI,
        functionName: 'ping',
      });
      const pingCallData = dataSuffixSupported ? pingData : appendDataSuffix(pingData, builderDataSuffixHex);
      console.log({ supportsSuffix: dataSuffixSupported, suffixHex: builderDataSuffixHex });
      const pingCall = await sendCallsAsync({
        calls: [
          {
            to: PAY_TO_PLAY_ADDRESS as `0x${string}`,
            data: pingCallData,
          },
        ],
        chainId: BASE_CHAIN_ID,
        capabilities: dataSuffixSupported
          ? { dataSuffix: { value: builderDataSuffixHex } }
          : undefined,
      });
      if (!publicClient) {
        throw new Error('Missing Base client');
      }
      await waitForCallBundle(pingCall.id);
      startNewGame(newDifficulty);
    } catch (err) {
      setNewGameError(err instanceof Error ? err.message : 'Transaction failed or rejected');
      if (clearingError) {
        window.clearTimeout(clearingError);
      }
      const t = window.setTimeout(() => setNewGameError(null), 4000);
      setClearingError(t);
    } finally {
      setNewGameLoading(false);
    }
  };

  const handleGuess = (letter: string) => {
    if (state.status !== 'playing' || result !== null || isRevealingResult) return;
    if (state.guessed.has(letter.toUpperCase())) return;
    play('press');
    dispatch({ type: 'GUESS', letter });
  };

  useEffect(() => {
    if (state.lastResult === 'correct') {
      play('correct');
    } else if (state.lastResult === 'wrong') {
      play('wrong');
    }
  }, [state.lastResult, play]);

  useEffect(() => {
    if (state.status === 'won') {
      play('win');
    } else if (state.status === 'lost') {
      play('lose');
    }
  }, [play, state.status]);

  useEffect(() => {
    const stored = localStorage.getItem('neonHangmanPoints');
    if (stored) {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed)) {
        setPoints(parsed);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('neonHangmanPoints', String(points));
  }, [points]);

  useEffect(() => {
    if (state.status === 'won') {
      setResult('win');
      setShowResultModal(true);
      setIsRevealingResult(false);
      if (loseTimer.current) {
        window.clearTimeout(loseTimer.current);
        loseTimer.current = null;
      }
      return;
    }

    if (state.status === 'lost') {
      setResult('lose');
      setShowResultModal(false);
      setIsRevealingResult(true);
      if (loseTimer.current) {
        window.clearTimeout(loseTimer.current);
      }
      loseTimer.current = window.setTimeout(() => {
        setShowResultModal(true);
        setIsRevealingResult(false);
        loseTimer.current = null;
      }, 800);
      return;
    }

    // back to playing
    setResult(null);
    setShowResultModal(false);
    setIsRevealingResult(false);
  }, [state.status]);

  useEffect(() => {
    if (state.status === 'won' && !roundAwarded.current) {
      const award =
        state.roundDifficulty === 'easy'
          ? 5
          : state.roundDifficulty === 'medium'
            ? 10
            : 20;
      setPoints((p) => p + award);
      setLastAward(award);
      roundAwarded.current = true;
      if (awardTimer.current) {
        window.clearTimeout(awardTimer.current);
      }
      awardTimer.current = window.setTimeout(() => {
        setLastAward(null);
        awardTimer.current = null;
      }, 500);
    }
  }, [state.status, state.roundDifficulty]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = (event: MediaQueryListEvent | MediaQueryList) => setIsMobileView(event.matches);
    update(media);
    const listener = (event: MediaQueryListEvent) => update(event);
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, []);

  useEffect(() => {
    return () => {
      if (loseTimer.current) {
        window.clearTimeout(loseTimer.current);
      }
      if (awardTimer.current) {
        window.clearTimeout(awardTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (result !== null || isRevealingResult) {
        return;
      }
      if (!isUnlocked) return;
      if (e.key === 'Enter' && state.status !== 'playing') {
        handlePlay();
        return;
      }
      if (/^[a-zA-Z]$/.test(e.key)) {
        handleGuess(e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.status, state.guessed, result, isRevealingResult, address, chainId, handlePlay, handleGuess, isUnlocked]);

  const newGameLabel = newGameLoading || sendingCalls ? 'Confirming...' : 'New Game';
  const keyboardDisabled = !isUnlocked || state.status !== 'playing' || result !== null || isRevealingResult;
  const locked = !isUnlocked;

  return (
    <div className="min-h-screen w-full relative overflow-hidden text-white bg-[linear-gradient(135deg,#1b043e_0%,#240654_45%,#3a0b7a_100%)]">
      {isMobileView ? (
        <MobileGameLayout
          displayWord={displayWord}
          hint={state.wordEntry.hint}
          hintRevealed={hintRevealed}
          onToggleHint={() => setHintRevealed((v) => !v)}
          lastResult={state.lastResult}
          wrongLetters={wrongLetters}
          correctLetters={correctLetters}
          lives={state.lives}
          maxLives={maxLives}
          status={state.status}
          onGuess={handleGuess}
          usedLetters={state.guessed}
          locked={locked}
          keyboardDisabled={keyboardDisabled}
          showHint={isConnected && !isUnlocked}
          mistakes={mistakes}
          difficulty={state.difficulty}
          points={points}
          lastAward={lastAward}
          onNewGame={() => handlePlay()}
          newGameLabel={newGameLabel}
          newGameDisabled={newGameLoading || checkingEntered || sendingCalls}
          newGameError={newGameError}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((v) => !v)}
          onDifficultyChange={(d) => handlePlay(d)}
          menuOpen={mobileMenuOpen}
          onOpenMenu={() => setMobileMenuOpen(true)}
          onCloseMenu={() => setMobileMenuOpen(false)}
        />
      ) : (
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-12 pt-8 md:px-8 lg:pt-12">
          <Header
            onNewGame={() => handlePlay()}
            newGameLabel={newGameLabel}
            newGameDisabled={newGameLoading || checkingEntered || sendingCalls}
            newGameError={newGameError}
            lives={state.lives}
            maxLives={maxLives}
            difficulty={state.difficulty}
            points={points}
            lastAward={lastAward}
          />

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="card space-y-4">
              <GameBoard
                displayWord={displayWord}
                hint={state.wordEntry.hint}
                hintRevealed={hintRevealed}
                onToggleHint={() => setHintRevealed((v) => !v)}
                lastResult={state.lastResult}
                wrongLetters={wrongLetters}
                correctLetters={correctLetters}
                lives={state.lives}
                maxLives={maxLives}
                status={state.status}
              />
              <Keyboard
                onGuess={handleGuess}
                usedLetters={state.guessed}
                correctLetters={new Set(correctLetters)}
                wrongLetters={new Set(wrongLetters)}
                disabled={keyboardDisabled}
                locked={locked}
                showHint={isConnected && !isUnlocked}
              />
              <WalletPanel />
            </section>

            <section className="space-y-4">
              <div className="card flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">Hangman</p>
                    <p className="text-xl font-semibold">{state.lives} / {maxLives} lives</p>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-fuchsia-200">
                    {state.difficulty}
                  </div>
                </div>
                <HangmanSVG mistakes={mistakes} maxMistakes={maxLives} status={state.status} />
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Wrong letters</span>
                  <div className="flex flex-wrap gap-2">
                    {wrongLetters.length === 0 && <span className="text-white/40">None yet</span>}
                    {wrongLetters.map((l) => (
                      <span key={l} className="rounded-lg bg-fuchsia-500/10 px-2 py-1 text-fuchsia-200">{l}</span>
                    ))}
                  </div>
                </div>
              </div>

              <Settings
                difficulty={state.difficulty}
                onDifficultyChange={(d) => handlePlay(d)}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled((v) => !v)}
                lives={state.lives}
                maxLives={maxLives}
              />
            </section>
          </div>
        </div>
      )}

      <ResultModal
        open={showResultModal}
        status={result === 'win' ? 'won' : result === 'lose' ? 'lost' : 'playing'}
        word={state.wordEntry.word}
        onPlayAgain={() => handlePlay()}
        mistakes={mistakes}
      />
    </div>
  );
}

export default App;
