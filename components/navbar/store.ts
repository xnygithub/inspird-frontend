import { create } from 'zustand';

type NavbarState = {
    open: boolean;
    setOpen: (open: boolean) => void;
    clearStore: () => void;
};

export const useNavbarStore = create<NavbarState>((set) => ({
    open: false,
    setOpen: (open: boolean) => set({ open }),
    clearStore: () => set({ open: false }),
}));


