"use client";

import { useEffect, useState } from "react";
import { actionShortcuts, navigationShortcuts } from "./shortcuts";

export function ShortcutsHint() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsOpen(false), 5200);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-[calc(100vw-40px)] flex-col items-end gap-3">
      {isOpen ? (
        <section
          id="home-shortcuts"
          role="tooltip"
          className="relative w-[min(320px,calc(100vw-40px))] border-2 border-ink bg-paper p-4 shadow-lg max-h-[50vh] overflow-y-auto"
        >
          <div className="absolute -bottom-[7px] right-5 h-3 w-3 rotate-45 border-b-2 border-r-2 border-ink bg-paper" aria-hidden="true" />
          <div className="mb-3">
            <h2 className="font-archivo text-lg">Atalhos rápidos</h2>
            <p className="mt-1 text-xs text-muted">Use o teclado para navegar mais rápido pelo Átrio.</p>
          </div>
          <div className="grid gap-2 text-xs">
            {navigationShortcuts.map((shortcut) => (
              <div key={shortcut.key} className="flex items-center justify-between gap-4">
                <kbd className="border-2 border-ink bg-bg px-1.5 py-0.5 font-ibm text-[10px] font-bold">g + {shortcut.key}</kbd>
                <span>{shortcut.label}</span>
              </div>
            ))}
            {actionShortcuts.map((shortcut) => (
              <div key={shortcut.key} className="flex items-center justify-between gap-4">
                <kbd className="border-2 border-ink bg-bg px-1.5 py-0.5 font-ibm text-[10px] font-bold">{shortcut.key}</kbd>
                <span>{shortcut.label}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-red font-archivo text-xl text-white shadow-sm transition-transform active:translate-y-1 active:shadow-none"
        aria-controls="home-shortcuts"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Ocultar atalhos" : "Mostrar atalhos"}
        title={isOpen ? "Ocultar atalhos" : "Mostrar atalhos"}
      >
        ?
      </button>
    </div>
  );
}
