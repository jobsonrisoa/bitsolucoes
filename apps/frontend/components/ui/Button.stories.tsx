import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../ui/Button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "ghost"],
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Button", variant: "default" },
};

export const Outline: Story = {
  args: { children: "Button", variant: "outline" },
};

export const Ghost: Story = {
  args: { children: "Button", variant: "ghost" },
};

export const Disabled: Story = {
  args: { children: "Button", variant: "default", disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};
