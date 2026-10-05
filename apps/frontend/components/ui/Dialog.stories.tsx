import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

const meta: Meta<typeof Dialog> = {
  title: "UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const OpenDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Abrir modal</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <h2 className="font-archivo text-2xl">Confirmar ação</h2>
          <p>Este modal usa o dialog base do Átrio.</p>
          <Button onClick={() => setOpen(false)}>Fechar</Button>
        </Dialog>
      </div>
    );
  },
};
