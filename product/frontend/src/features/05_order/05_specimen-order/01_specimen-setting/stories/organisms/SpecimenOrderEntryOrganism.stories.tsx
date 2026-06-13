import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SpecimenOrderEntryOrganism } from '../../components/organisms/SpecimenOrderEntryOrganism';
import { commonHandlers } from '../../test/msw/handlers';

const meta = {
  title: '05_order/05_specimen-order/01_specimen-setting/organisms/SpecimenOrderEntryOrganism',
  component: SpecimenOrderEntryOrganism,
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
} satisfies Meta<typeof SpecimenOrderEntryOrganism>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PanelClosed: Story = {
  args: {
    showSpecimenOrderPanel: false,
  },
};

export const PanelOpen: Story = {
  args: {
    showSpecimenOrderPanel: true,
  },
};

export const WithConfirmedCodes: Story = {
  args: {
    showSpecimenOrderPanel: true,
    confirmedOrderCodes: ['CBC', 'UA'],
  },
};
