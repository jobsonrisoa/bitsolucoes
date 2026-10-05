import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from "../domain/StatusBadge";

const meta = {
  title: "Domain/StatusBadge",
  component: StatusBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["OPEN", "IN_PROGRESS", "COMPLETED"],
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { status: "OPEN" },
};

export const InProgress: Story = {
  args: { status: "IN_PROGRESS" },
};

export const Completed: Story = {
  args: { status: "COMPLETED" },
};

export const AllStatuses: Story = {
  args: { status: "OPEN" },
  render: () => (
    <div className="flex gap-4">
      <StatusBadge status="OPEN" />
      <StatusBadge status="IN_PROGRESS" />
      <StatusBadge status="COMPLETED" />
    </div>
  ),
};
