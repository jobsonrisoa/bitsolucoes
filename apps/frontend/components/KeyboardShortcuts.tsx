"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { actionShortcuts, navigationShortcuts } from "./shortcuts";

export function KeyboardShortcuts() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    let gPressed = false;
    let timer: any = null;
    const focusSearch = () => {
      window.setTimeout(() => {
        document.querySelector<HTMLInputElement>('input[name="search"]')?.focus();
      }, pathname.startsWith('/lista') ? 0 : 850);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'g') {
        gPressed = true;
        clearTimeout(timer);
        timer = setTimeout(() => { gPressed = false; }, 1000);
        return;
      }

      if (gPressed) {
        const shortcut = navigationShortcuts.find((item) => item.key === e.key);
        if (shortcut) {
          e.preventDefault();
          setShowPanel(false);
          router.push(shortcut.href);
        }
        gPressed = false;
        return;
      }

      if (e.key === '?') {
        setShowPanel(true);
      } else if (e.key === 'd') {
        toggleTheme();
      } else if (e.key === '/') {
        e.preventDefault();
        if (!pathname.startsWith('/lista')) router.push('/lista');
        focusSearch();
      } else if (e.key === 'Escape') {
        setShowPanel(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pathname, router, toggleTheme]);

  if (!showPanel) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-paper border-2 border-ink p-8 shadow-lg max-w-md w-full relative">
        <button onClick={() => setShowPanel(false)} className="absolute top-4 right-4 text-ink hover:text-red font-bold" aria-label="Fechar atalhos" title="Fechar atalhos">X</button>
        <h2 className="text-2xl font-black font-archivo mb-6">Atalhos de Teclado</h2>
        <ul className="space-y-4">
          {navigationShortcuts.map((shortcut) => (
            <li key={shortcut.key} className="flex justify-between items-center">
              <span className="font-bold">g + {shortcut.key}</span>
              <span>{shortcut.label}</span>
            </li>
          ))}
          {actionShortcuts.map((shortcut) => (
            <li key={shortcut.key} className="flex justify-between items-center">
              <span className="font-bold">{shortcut.key}</span>
              <span>{shortcut.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
