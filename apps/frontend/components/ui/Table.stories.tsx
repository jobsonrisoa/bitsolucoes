import type { Meta, StoryObj } from "@storybook/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>SOL-000128</TableCell>
          <TableCell>Acesso ao sistema financeiro</TableCell>
          <TableCell>Aberto</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
