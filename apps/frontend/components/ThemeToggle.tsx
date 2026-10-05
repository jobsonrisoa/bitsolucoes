"use client";
import { useTheme } from "@/context/ThemeContext";
import { Icon } from "./ui/Icon";
import { Tooltip } from "./ui/Tooltip";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === 'dark' ? 'Usar tema claro (d)' : 'Usar tema escuro (d)';

  return (
    <Tooltip label={label}>
      <button
        onClick={toggleTheme}
        className="p-2 border-2 border-ink rounded-sm transition-transform duration-250 active:scale-95"
        aria-label={label}
        title={label}
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>
    </Tooltip>
  );
}
