import type { ReactNode } from "react";
import type { User } from "@/lib/api/types";

type StorybookAuthState = {
  user: User | null;
  isLoading: boolean;
};

const defaultAuthState: StorybookAuthState = {
  user: { id: 1, username: "ana", name: "Ana" },
  isLoading: false,
};

export function useAuth() {
  const state = (globalThis as any).__ATRIO_STORYBOOK_AUTH__ as StorybookAuthState | undefined;
  const auth = state ?? defaultAuthState;

  return {
    ...auth,
    login: () => undefined,
    logout: async () => undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
