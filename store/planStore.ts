import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserInput, PlanData } from '@/types/plan';

interface PlanState {
  userInfo: UserInput | null;
  generatedPlan: PlanData | null;
  isGenerating: boolean;
  
  setUserInfo: (info: UserInput) => void;
  setGeneratedPlan: (plan: PlanData) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  resetStore: () => void;
  hasPlan: () => boolean;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      generatedPlan: null,
      isGenerating: false,

      setUserInfo: (info) => set({ userInfo: info }),
      setGeneratedPlan: (plan) => set({ generatedPlan: plan }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      resetStore: () => set({ userInfo: null, generatedPlan: null, isGenerating: false }),
      hasPlan: () => !!get().generatedPlan,
    }),
    {
      name: 'ai-fitness-buddy-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
