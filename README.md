# Neon Hangman

A purple neon, glassy Hangman game built with React + TypeScript + TailwindCSS (Vite).

## Features
- Responsive single-page experience with glassmorphism cards and animated gradient background.
- On-screen + physical keyboard input with disabled keys after use.
- Difficulty selector (easy/medium/hard) adjusts word bank and lives; 90-word bank included.
- Animated SVG hangman, shake feedback on wrong guesses, smooth letter reveal.
- Sound effects (toggleable) for press/correct/wrong/win/lose.
- Win/lose modal with confetti, focus-friendly controls, and ARIA labels.

## Run it
```bash
npm install
npm run dev
```
Then open the shown local URL. Build with `npm run build`.

## Farcaster wallet demo
- Works best when opened as a Farcaster Mini App (e.g., in Warpcast).
- The wallet panel sits under the settings card. Click **Connect wallet** to connect via the Farcaster Mini App Wagmi connector on Base (chain id 8453).
- Once connected, sign the prefilled message to verify wallet actions. The signature is shown below the button.
- Optional: enable the batch call toggle to send a zero-value EIP-5792 batch (costs gas) using `useSendCalls`.
