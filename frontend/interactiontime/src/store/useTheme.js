import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "coffee", // Default theme
      setTheme: (theme) => set({ theme }), // Function to change it
    }),
    {
      name: 'user-theme', // Key in localStorage
    }
  )
);