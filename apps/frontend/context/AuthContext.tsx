"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api/client';
import { User } from '@/lib/api/types';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  login: (u: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const requiresAuth = pathname.startsWith('/dashboard') || pathname.startsWith('/lista');
    const hasAuthHint = document.cookie
      .split('; ')
      .some((cookie) => cookie === 'logged_in=1');

    if (!requiresAuth && !hasAuthHint) {
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);
    fetchApi('/auth/me')
      .then((currentUser) => {
        if (isMounted) setUser(currentUser);
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
          document.cookie = 'logged_in=; Max-Age=0; path=/; SameSite=Strict';
          if (!requiresAuth) {
            return;
          }
          fetchApi('/auth/logout', { method: 'POST' }).finally(() => {
            router.replace(`/login?next=${encodeURIComponent(pathname)}`);
            router.refresh();
          });
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  const login = (u: User) => {
    document.cookie = 'logged_in=1; path=/; SameSite=Strict';
    setUser(u);
  };

  const logout = async () => {
    await fetchApi('/auth/logout', { method: 'POST' }).catch(() => undefined);
    document.cookie = 'logged_in=; Max-Age=0; path=/; SameSite=Strict';
    setUser(null);
    router.replace('/login');
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
