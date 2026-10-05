import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "@/context/ThemeContext";
import { HomeActions } from "./domain/HomeActions";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { ShortcutsHint } from "./ShortcutsHint";
import { ThemeToggle } from "./ThemeToggle";
import { Topbar } from "./Topbar";

const meta: Meta = {
  title: "App/Chrome",
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const LoggedInTopbar: Story = {
  render: () => {
    (globalThis as any).__ATRIO_STORYBOOK_AUTH__ = {
      user: { id: 1, username: "ana", name: "Ana" },
      isLoading: false,
    };
    return <Topbar />;
  },
};

export const PublicTopbar: Story = {
  render: () => {
    (globalThis as any).__ATRIO_STORYBOOK_AUTH__ = {
      user: null,
      isLoading: false,
    };
    return <Topbar />;
  },
};

export const ThemeSwitcher: Story = {
  render: () => <ThemeToggle />,
};

export const HomeCallToActions: Story = {
  render: () => <HomeActions />,
};

export const ShortcutsMounted: Story = {
  render: () => <KeyboardShortcuts />,
};

export const HomeShortcutsHint: Story = {
  render: () => <ShortcutsHint />,
};
