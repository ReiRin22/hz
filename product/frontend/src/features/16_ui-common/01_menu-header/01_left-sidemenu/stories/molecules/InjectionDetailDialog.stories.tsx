import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { InjectionDetailDialog } from '../../components/molecules/InjectionDetailDialog';

const sampleDrug = {
  id: 'inj-001',
  name: 'ビタミンB1注射液10mg',
  dosage: '10mg',
  usage: '筋肉内注射',
};

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/molecules/InjectionDetailDialog',
  component: InjectionDetailDialog,
  tags: ['autodocs'],
  args: {
    onClose: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof InjectionDetailDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    drug: sampleDrug,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    drug: sampleDrug,
  },
};

export const NoDrug: Story = {
  args: {
    isOpen: true,
    drug: null,
  },
};
