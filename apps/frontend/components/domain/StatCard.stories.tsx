import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "../domain/StatCard";

const meta = {
  title: "Domain/StatCard",
  component: StatCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    value: { control: "number" },
    colorVar: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div
        style={
          {
            "--color-open": "#4ade80",
            "--color-prog": "#facc15",
            "--color-done": "#60a5fa",
            "--color-total": "#f472b6",
          } as React.CSSProperties
        }
        className="p-8"
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { label: "Abertos", value: 12, colorVar: "--color-open" },
};

export const InProgress: Story = {
  args: { label: "Em Atendimento", value: 5, colorVar: "--color-prog" },
};

export const Completed: Story = {
  args: { label: "Concluídos", value: 34, colorVar: "--color-done" },
};

export const Total: Story = {
  args: { label: "Total", value: 51, colorVar: "--color-total" },
};

export const AllCards: Story = {
  args: { label: "Total", value: 51, colorVar: "--color-total" },
  render: () => (
    <div
      style={
        {
          "--color-open": "#4ade80",
          "--color-prog": "#facc15",
          "--color-done": "#60a5fa",
          "--color-total": "#f472b6",
        } as React.CSSProperties
      }
      className="grid grid-cols-2 gap-4 p-8"
    >
      <StatCard label="Total" value={51} colorVar="--color-total" />
      <StatCard label="Abertos" value={12} colorVar="--color-open" />
      <StatCard label="Em Atendimento" value={5} colorVar="--color-prog" />
      <StatCard label="Concluídos" value={34} colorVar="--color-done" />
    </div>
  ),
};
