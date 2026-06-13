import { create } from "zustand";
import { registerStore } from "@/shared/stores/storeRegistry";
import type { CurrentUser, UserAlert } from "../types/patient-types";

type GlobalHeaderStore = {
  // --- State ---
  currentUser: CurrentUser | null;
  userAlerts: UserAlert[];
  isLoading: boolean;
  selectedRecord: string | undefined;
  darkMode: boolean;
  autoSaveEnabled: boolean;
  alertsEnabled: boolean;
  themeColor: string;
  autoLogoutEnabled: boolean;
  autoLogoutTimeout: number;
  autoLogoutWarningTime: number;
  // --- Actions ---
  setCurrentUser: (user: CurrentUser) => void;
  setUserAlerts: (alerts: UserAlert[]) => void;
  setIsLoading: (loading: boolean) => void;
  setSelectedRecord: (record: string | undefined) => void;
  setDarkMode: (darkMode: boolean) => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
  setAlertsEnabled: (enabled: boolean) => void;
  setThemeColor: (color: string) => void;
  setAutoLogoutEnabled: (enabled: boolean) => void;
  setAutoLogoutTimeout: (minutes: number) => void;
  reset: () => void;
};

const INITIAL_GLOBAL_HEADER_STATE = {
  currentUser: null,
  userAlerts: [],
  isLoading: false,
  selectedRecord: undefined,
  darkMode: false,
  autoSaveEnabled: true,
  alertsEnabled: true,
  themeColor: "blue",
  autoLogoutEnabled: false,
  autoLogoutTimeout: 30,
  autoLogoutWarningTime: 60,
} satisfies Omit<
  GlobalHeaderStore,
  | "setCurrentUser"
  | "setUserAlerts"
  | "setIsLoading"
  | "setSelectedRecord"
  | "setDarkMode"
  | "setAutoSaveEnabled"
  | "setAlertsEnabled"
  | "setThemeColor"
  | "setAutoLogoutEnabled"
  | "setAutoLogoutTimeout"
  | "reset"
>;

export const useGlobalHeaderStore = create<GlobalHeaderStore>()((set) => ({
  ...INITIAL_GLOBAL_HEADER_STATE,
  setCurrentUser: (user) => set({ currentUser: user }),
  setUserAlerts: (alerts) => set({ userAlerts: alerts }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setSelectedRecord: (record) => set({ selectedRecord: record }),
  setDarkMode: (darkMode) => set({ darkMode }),
  setAutoSaveEnabled: (enabled) => set({ autoSaveEnabled: enabled }),
  setAlertsEnabled: (enabled) => set({ alertsEnabled: enabled }),
  setThemeColor: (color) => set({ themeColor: color }),
  setAutoLogoutEnabled: (enabled) => set({ autoLogoutEnabled: enabled }),
  setAutoLogoutTimeout: (minutes) => set({ autoLogoutTimeout: minutes }),
  reset: () => set(INITIAL_GLOBAL_HEADER_STATE),
}));

registerStore(() => useGlobalHeaderStore.getState().reset());
