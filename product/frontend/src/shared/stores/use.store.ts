import { create } from 'zustand'
import { persist } from 'zustand/middleware';

interface StoreState {
  patientId: string | null;
  setPatientId: (id: string | null) => void;
  selectedKarteId: string | null;
  setSelectedKarteId: (id: string | null) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      patientId: null,
      setPatientId: (id) => set({ patientId: id }),
      selectedKarteId: null,
      setSelectedKarteId: (id) => set({ selectedKarteId: id }),
    }),
    {
      name: 'app-storage',
    }
  )
);
