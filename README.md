# Neon Tic-Tac-Toe

A modern Tic-Tac-Toe game built with React 18, Vite and Tailwind CSS. No backend and no sign-up.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173. Use `npm run build` for a production build in `dist/`.

## Features

- Player vs Player, or Player vs Computer with Easy, Medium and Hard levels. Hard uses minimax with alpha-beta pruning and cannot be beaten.
- Animated X/O strokes, a highlighted winning line, confetti on a win, and separate defeat and draw animations
- A scoreboard for X wins, O wins and draws, plus a per-match round tracker
- Custom player names and a choice of X or O
- Sound effects made with the Web Audio API, with mute and volume controls
- Settings for who moves first each round and how fast the computer plays
- Match history (the last 50 results); preferences and history are saved in `localStorage`
- Keyboard play: keys `1`–`9` place a mark, `R` restarts

## Project layout

```
src/
  lib/            game rules, AI, reducer, sounds, constants (no React)
  hooks/          useLocalStorage, useSound
  components/     screens, modals, UI controls
    game/         GameScreen, Board, Scoreboard, ResultOverlay
scripts/verify-ai.mjs   exhaustive check that Hard AI never loses
```

Check the AI with `node scripts/verify-ai.mjs`. It plays every possible human move sequence against Hard, with the AI as both X and O.
