import { createDemoState } from "@/data/demo";
import type { DemoState } from "@/types/domain";
const KEY = "salonly-demo-v2";
/** Replace these three methods with your API adapter to retain the feature UI. */
export const demoRepository = {
  load(): DemoState {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<DemoState>;
        if (
          Array.isArray(parsed.clients) &&
          Array.isArray(parsed.appointments) &&
          parsed.settings
        )
          return { ...createDemoState(), ...parsed };
      }
    } catch {
      /* Unavailable storage falls back to the session demo. */
    }
    return createDemoState();
  },
  save(state: DemoState): boolean {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  },
  reset() {
    localStorage.removeItem(KEY);
    return createDemoState();
  },
};
