import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    label: "Abrir painel",
    children: <Button>Focar botão</Button>,
  },
};
