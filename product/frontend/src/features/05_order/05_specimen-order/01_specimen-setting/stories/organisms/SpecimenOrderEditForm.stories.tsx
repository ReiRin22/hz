import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SpecimenOrderEditForm } from '../../components/organisms/SpecimenOrderEditForm';
import { editFormHandlers, itemsFetchErrorHandlers } from '../../test/msw/handlers';

const meta = {
  title: '05_order/05_specimen-order/01_specimen-setting/organisms/SpecimenOrderEditForm',
  component: SpecimenOrderEditForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: editFormHandlers },
  },
  args: {
    onAddItems: fn(),
    onRemoveItem: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof SpecimenOrderEditForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    addedOrderCodes: [],
  },
};

export const WithAddedCodes: Story = {
  args: {
    addedOrderCodes: ['CBC'],
  },
};

export const FetchError: Story = {
  parameters: {
    msw: { handlers: itemsFetchErrorHandlers },
  },
  args: {
    addedOrderCodes: [],
  },
};
