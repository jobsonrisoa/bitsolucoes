import type { Meta, StoryObj } from "@storybook/react";
import { RequestsTable } from "./RequestsTable";

const meta: Meta<typeof RequestsTable> = {
  title: "Domain/RequestsTable",
  component: RequestsTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RequestsTable>;

export const Default: Story = {
  args: {
    data: {
      data: [
        {
          id: "SOL-000128",
          title: "Acesso ao sistema financeiro",
          description: "Liberar perfil financeiro para fechamento mensal.",
          category: "FINANCEIRO",
          status: "OPEN",
          requesterId: 1,
          createdAt: "2026-01-02T10:00:00.000Z",
          updatedAt: "2026-01-02T10:00:00.000Z",
        },
        {
          id: "129",
          title: "Notebook para onboarding",
          description: "Separar equipamento para novo colaborador.",
          category: "TI",
          status: "IN_PROGRESS",
          requesterId: 2,
          createdAt: "2026-01-03T10:00:00.000Z",
          updatedAt: "2026-01-03T12:00:00.000Z",
        },
      ],
      page: 1,
      pageSize: 10,
      total: 2,
    },
    onPageChange: () => undefined,
    onSortChange: () => undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};
