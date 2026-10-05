import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { Select } from "./Select";

const meta: Meta = {
  title: "UI/Form Controls",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const TextInput: Story = {
  render: () => <Input placeholder="Buscar solicitação" defaultValue="Acesso" />,
};

export const SelectInput: Story = {
  render: () => (
    <Select defaultValue="TI">
      <option value="TI">TI</option>
      <option value="RH">RH</option>
      <option value="COMPRAS">Compras</option>
    </Select>
  ),
};
