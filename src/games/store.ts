import { create } from 'zustand';

export type GameType = 'none' | 'pinball';

interface GameState {
  activeGame: GameType;
  highScores: Record<string, number>; // gameId -> score
  startGame: (game: GameType) => void;
  exitGame: () => void;
  updateHighScore: (gameId: string, score: number) => void;
  getHighScore: (gameId: string) => number;
}

export const useGameStore = create<GameState>((set, get) => ({
  activeGame: 'none',
  highScores: {},
  startGame: (game) => set({ activeGame: game }),
  exitGame: () => set({ activeGame: 'none' }),
  updateHighScore: (gameId, score) => set((state) => {
    const currentHigh = state.highScores[gameId] || 0;
    if (score > currentHigh) {
      return { highScores: { ...state.highScores, [gameId]: score } };
    }
    return {};
  }),
  getHighScore: (gameId) => get().highScores[gameId] || 0,
}));
