import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../ui/Badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "open", "prog", "done"],
    },
    children: { control: "text" },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Badge", variant: "default" },
};

export const Open: Story = {
  args: { children: "ABERTO", variant: "open" },
};

export const InProgress: Story = {
  args: { children: "EM ATENDIMENTO", variant: "prog" },
};

export const Done: Story = {
  args: { children: "CONCLUÍDO", variant: "done" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Badge variant="open">ABERTO</Badge>
      <Badge variant="prog">EM ATENDIMENTO</Badge>
      <Badge variant="done">CONCLUÍDO</Badge>
    </div>
  ),
};
