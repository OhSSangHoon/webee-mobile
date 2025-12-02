import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserState {
  userName: string | null;
  realName: string | null;
  isLoggedIn: boolean;
  login: (username: string, realName: string) => void;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: null,
      realName: null,
      isLoggedIn: false,
      login: (userName, realName) =>
        set({ userName, realName, isLoggedIn: true }),
      logout: async () => {
        set({ userName: null, realName: null, isLoggedIn: false });
      },
    }),
    {
      name: "userStorage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
