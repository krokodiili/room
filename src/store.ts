import { create } from 'zustand';

export interface CharacterData {
  id: string;
  name: string;
  bodyColor: string;
  eyeColor: string;
  accessory: 'none' | 'hat' | 'glasses';
}

interface AppState {
  isCreatorOpen: boolean;
  npcs: CharacterData[];
  openCreator: () => void;
  closeCreator: () => void;
  addNPC: (npc: Omit<CharacterData, 'id'>) => void;
}

export const useStore = create<AppState>((set) => ({
  isCreatorOpen: false,
  npcs: [],
  openCreator: () => set({ isCreatorOpen: true }),
  closeCreator: () => set({ isCreatorOpen: false }),
  addNPC: (npc) => set((state) => ({
    npcs: [...state.npcs, { ...npc, id: Math.random().toString(36).substr(2, 9) }],
    isCreatorOpen: false
  })),
}));
