import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { Skeleton } from "./Skeleton";
import { Toast } from "./Toast";
import { Icon } from "./Icon";

const meta: Meta = {
  title: "UI/Surfaces",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const CardSurface: Story = {
  render: () => (
    <Card className="max-w-sm p-6">
      <h3 className="font-archivo text-xl">Solicitação aberta</h3>
      <p className="mt-2 text-sm text-muted">Card base para blocos destacados.</p>
    </Card>
  ),
};

export const LoadingSkeleton: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  ),
};

export const ToastMessage: Story = {
  render: () => (
    <Toast
      title="Solicitação atualizada"
      description="O status foi alterado com sucesso."
      variant="success"
      onClose={() => undefined}
    />
  ),
};

export const IconSet: Story = {
  render: () => (
    <div className="flex gap-3">
      {(["home", "list", "plus", "log-out", "moon", "sun"] as const).map((name) => (
        <div key={name} className="border-2 border-ink p-3">
          <Icon name={name} />
        </div>
      ))}
    </div>
  ),
};
