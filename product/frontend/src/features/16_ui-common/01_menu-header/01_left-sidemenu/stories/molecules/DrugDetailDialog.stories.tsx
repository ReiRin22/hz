import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { DrugDetailDialog } from '../../components/molecules/DrugDetailDialog';

const sampleDrug = {
  id: 'drug-001',
  name: 'アムロジピン錠5mg',
  dosage: '5mg',
  usage: '1日1回',
};

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/molecules/DrugDetailDialog',
  component: DrugDetailDialog,
  tags: ['autodocs'],
  args: {
    onClose: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof DrugDetailDialog>;
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
