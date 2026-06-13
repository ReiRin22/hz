import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SpecimenOrderEntryFeature } from '../index';
import { commonHandlers } from '../test/msw/handlers';

const meta = {
  title: '05_order/05_specimen-order/01_specimen-setting/ORD023',
  component: SpecimenOrderEntryFeature,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: commonHandlers },
  },
  args: {
    patientId: 'patient-001',
    onShowSpecimenOrderPanelChange: fn(),
    onAddToConfirmation: fn(),
    confirmedOrderCodes: [],
  },
} satisfies Meta<typeof SpecimenOrderEntryFeature>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showSpecimenOrderPanel: false,
  },
};

export const PanelOpen: Story = {
  args: {
    showSpecimenOrderPanel: true,
  },
};
