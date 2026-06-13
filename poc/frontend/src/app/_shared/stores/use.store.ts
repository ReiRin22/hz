import { create } from 'zustand'
import { persist } from 'zustand/middleware';
console.log("[useStore] module loaded at", Date.now());

interface StoreState {
  count: number;
  text: string;
  selectedKarteId: string | null; // 追加：選択中のカルテID
  increase: () => void;
  decrease: () => void;
  setText: (newText: string) => void;
  setSelectedKarteId: (id: string | null) => void; // 追加：IDをセットする関数
}
// persist用のstoreを作成
export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      count: 0,
      text: '',
      selectedKarteId: null, // 初期値
      increase: () => set((state) => ({ count: state.count + 1 })),
      decrease: () => set((state) => ({ count: state.count - 1 })),
      setText: (newText) => set({ text: newText }),
      setSelectedKarteId: (id) => set({ selectedKarteId: id }), // 更新関数
    }),
    {
      name: 'app-storage', // localStorageに保存されるキー名
    }
  )
);