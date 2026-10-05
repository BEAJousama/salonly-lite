"use client";
import { createDemoState } from "@/data/demo";
import { uid } from "@/lib/format";
import { demoRepository } from "@/lib/repository";
import type { AppointmentStatus, DemoState } from "@/types/domain";
import { ThemeProvider } from "next-themes";
import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Toaster, toast } from "sonner";
interface StudioContext {
  state: DemoState;
  location: string;
  setLocation: (id: string) => void;
  update: (recipe: (s: DemoState) => DemoState, message?: string) => boolean;
  setStatus: (id: string, status: AppointmentStatus) => void;
  reset: () => void;
  ready: boolean;
}
const Context = createContext<StudioContext | null>(null);
export function Providers({ children }: { children: ReactNode }) {
  const [state, setState] = useState(createDemoState);
  const current = useRef(state);
  const [ready, setReady] = useState(false);
  const [location, setLocation] = useState("downtown");
  useEffect(() => {
    const loaded = demoRepository.load();
    current.current = loaded;
    startTransition(() => {
      setState(loaded);
      setReady(true);
    });
  }, []);
  function update(recipe: (s: DemoState) => DemoState, message?: string) {
    try {
      const next = recipe(current.current);
      current.current = next;
      setState(next);
      if (!demoRepository.save(next))
        toast.warning(
          "Saved for this session. Browser storage is unavailable.",
        );
      if (message) toast.success(message);
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save this change.",
      );
      return false;
    }
  }
  function setStatus(id: string, status: AppointmentStatus) {
    update(
      (s) => ({
        ...s,
        appointments: s.appointments.map((a) =>
          a.id === id
            ? {
                ...a,
                status,
                history: [
                  ...a.history,
                  {
                    id: uid("event"),
                    text: `Status changed to ${status.replaceAll("-", " ")}`,
                    date: new Date().toISOString(),
                  },
                ],
              }
            : a,
        ),
        activity: [
          {
            id: uid("activity"),
            text: `${s.clients.find((c) => c.id === s.appointments.find((a) => a.id === id)?.clientId)?.name ?? "Client"} · ${status.replaceAll("-", " ")}`,
            date: new Date().toISOString(),
          },
          ...s.activity,
        ],
      }),
      `Appointment ${status.replaceAll("-", " ")}`,
    );
  }
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Context.Provider
        value={{
          state,
          location,
          setLocation,
          update,
          setStatus,
          ready,
          reset: () => {
            const next = demoRepository.reset();
            current.current = next;
            setState(next);
            toast.success("Demo restored");
          },
        }}
      >
        {children}
        <Toaster richColors position="bottom-right" closeButton />
      </Context.Provider>
    </ThemeProvider>
  );
}
export function useStudio() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("Studio provider is required");
  return ctx;
}
