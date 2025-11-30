import { create } from "zustand";

/**
 * 챗봇 모달 상태 타입
 */
interface ChatbotStore {
  isOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
}

/**
 * 챗봇 모달 상태 관리
 */
export const useChatbotStore = create<ChatbotStore>((set) => ({
  isOpen: false,
  openChatbot: () => set({ isOpen: true }),
  closeChatbot: () => set({ isOpen: false }),
  toggleChatbot: () => set((state) => ({ isOpen: !state.isOpen })),
}));
