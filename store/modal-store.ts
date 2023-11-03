import { create } from "zustand";

interface modalStore {
  open: boolean;
  column: TypedColumn;
  onOpen: (column: TypedColumn) => void;
  onClose: () => void;
}

const useModalStore = create<modalStore>((set) => ({
  open: false,
  column: "todo",
  onOpen: (column) => set({ open: true, column }),
  onClose: () => set({ open: false }),
}));

export default useModalStore;
