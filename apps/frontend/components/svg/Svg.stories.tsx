import type { Meta, StoryObj } from "@storybook/react";
import { Arch } from "./Arch";
import { Chevron } from "./Chevron";
import { Fan } from "./Fan";
import { Mark } from "./Mark";
import { SvgDefs } from "./SvgDefs";

const meta: Meta = {
  title: "Brand/SVG",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Marks: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8 text-red">
      <SvgDefs />
      <Mark className="h-24 w-24" />
      <Fan className="h-32 w-48 text-blue" />
      <Chevron className="h-20 w-20 text-ink" />
      <Arch className="h-24 w-24 text-moss" />
    </div>
  ),
};
