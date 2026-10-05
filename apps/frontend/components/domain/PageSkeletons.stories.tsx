import type { Meta, StoryObj } from "@storybook/react";
import {
  BrandbookSkeleton,
  DashboardSkeleton,
  RequestDetailsSkeleton,
  RequestFormSkeleton,
  RequestsListSkeleton,
  RouteSkeleton,
} from "./PageSkeletons";

const meta: Meta = {
  title: "Domain/Page Skeletons",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Painel: Story = { render: () => <DashboardSkeleton /> };
export const RequestsList: Story = { render: () => <RequestsListSkeleton /> };
export const RequestDetails: Story = { render: () => <RequestDetailsSkeleton /> };
export const RequestForm: Story = { render: () => <RequestFormSkeleton /> };
export const ManualDaMarca: Story = { render: () => <BrandbookSkeleton /> };
export const Route: Story = { render: () => <RouteSkeleton /> };
