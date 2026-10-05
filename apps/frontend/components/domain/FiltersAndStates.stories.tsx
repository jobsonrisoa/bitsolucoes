import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmDialog } from "./ConfirmDialog";
import { EmptyState } from "./EmptyState";
import { FilterBar } from "./FilterBar";

const meta: Meta = {
  title: "Domain/Filters And States",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Filters: Story = {
  render: () => <FilterBar />,
};

export const Empty: Story = {
  render: () => <EmptyState />,
};

export const Confirmation: Story = {
  render: () => (
    <ConfirmDialog
      open
      onOpenChange={() => undefined}
      onConfirm={() => undefined}
      title="Excluir solicitação"
      description="Esta solicitação aberta será removida da lista."
    />
  ),
};
