import type { Meta, StoryObj } from "@storybook/react";
import { TransitionLink } from "./TransitionLink";
import { TransitionProvider } from "./TransitionProvider";
import { TransitionStage } from "./TransitionStage";

const meta: Meta = {
  title: "App/Transitions",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const LinkWithoutStage: Story = {
  render: () => (
    <TransitionProvider>
      <TransitionStage />
      <TransitionLink href="/painel" className="font-bold underline">
        Navegar sem transição
      </TransitionLink>
    </TransitionProvider>
  ),
};

export const ProviderOnly: Story = {
  render: () => (
    <TransitionProvider>
      <div className="border-2 border-ink bg-paper p-6">TransitionProvider montado</div>
    </TransitionProvider>
  ),
};
