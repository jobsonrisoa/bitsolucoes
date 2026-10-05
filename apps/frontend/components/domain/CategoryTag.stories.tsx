import type { Meta, StoryObj } from "@storybook/react";
import { CategoryTag } from "../domain/CategoryTag";
import type { Category } from "@/lib/api/types";

const meta = {
  title: "Domain/CategoryTag",
  component: CategoryTag,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    category: {
      control: "select",
      options: ["MAINTENANCE", "IT", "HR", "FACILITIES", "OTHER"] satisfies Category[],
    },
  },
} satisfies Meta<typeof CategoryTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Maintenance: Story = {
  args: { category: "MAINTENANCE" },
};

export const IT: Story = {
  args: { category: "IT" },
};

export const HR: Story = {
  args: { category: "HR" },
};

export const Facilities: Story = {
  args: { category: "FACILITIES" },
};

export const Other: Story = {
  args: { category: "OTHER" },
};

export const AllCategories: Story = {
  args: { category: "IT" },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <CategoryTag category="MAINTENANCE" />
      <CategoryTag category="IT" />
      <CategoryTag category="HR" />
      <CategoryTag category="FACILITIES" />
      <CategoryTag category="OTHER" />
    </div>
  ),
};
