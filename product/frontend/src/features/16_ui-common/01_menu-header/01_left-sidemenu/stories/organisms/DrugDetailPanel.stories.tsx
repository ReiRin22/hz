import type { Meta, StoryObj } from '@storybook/react';
import { DrugDetailPanel } from '../../components/organisms/DrugDetailPanel';

const sampleDrug = {
  id: 'drug-001',
  name: 'アムロジピン錠5mg',
  dosage: '5mg',
  usage: '1日1回朝食後',
  type: 'prescription' as const,
};

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/organisms/DrugDetailPanel',
  component: DrugDetailPanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    onConfirm: { action: 'confirmed' },
    onCancel: { action: 'cancelled' },
  },
} satisfies Meta<typeof DrugDetailPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SingleDrug: Story = {
  args: {
    drug: sampleDrug,
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const SetDrug: Story = {
  args: {
    drug: {
      id: 'set-001',
      name: '糖尿病セット',
      groupItems: [
        { id: 'g1', name: 'アムロジピン錠5mg', dosage: '5mg', usage: '1日1回' },
        { id: 'g2', name: 'メトホルミン錠500mg', dosage: '500mg', usage: '1日2回' },
      ],
    },
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const NoDrug: Story = {
  args: {
    drug: null,
    onConfirm: () => {},
    onCancel: () => {},
  },
};
