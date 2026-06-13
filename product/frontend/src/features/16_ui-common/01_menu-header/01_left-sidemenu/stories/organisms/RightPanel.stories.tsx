import type { Meta, StoryObj } from '@storybook/react';
import { RightPanel } from '../../components/organisms/RightPanel';

const sampleOrders = [
  {
    id: 'order-001',
    name: 'アムロジピン錠5mg',
    dosage: '5mg',
    usage: '1日1回朝食後',
    quantity: '1錠',
    frequency: '1日1回',
    timing: '朝食後',
    period: '28日分',
    rpNumber: 1,
    type: 'prescription' as const,
  },
  {
    id: 'order-002',
    name: 'ムコダイン錠250mg',
    dosage: '250mg',
    usage: '1日3回食後',
    quantity: '1錠',
    frequency: '1日3回',
    timing: '食後',
    period: '7日分',
    rpNumber: 1,
    type: 'prescription' as const,
  },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/organisms/RightPanel',
  component: RightPanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    onUpdateOrder: { action: 'order-updated' },
    onRemoveOrder: { action: 'order-removed' },
    onConfirmAllOrders: { action: 'all-orders-confirmed' },
    onSaveTemporary: { action: 'temporary-saved' },
    onLoadTemporary: { action: 'temporary-loaded' },
    onDeleteSavedData: { action: 'saved-data-deleted' },
    onNavigateToExamination: { action: 'navigate-to-examination' },
    onAddSetOrders: { action: 'set-orders-added' },
  },
} satisfies Meta<typeof RightPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithOrders: Story = {
  args: {
    confirmedOrders: sampleOrders,
    onUpdateOrder: () => {},
    onRemoveOrder: () => {},
    onConfirmAllOrders: () => {},
    isSubmitting: false,
    activeOrderType: 'prescription',
    savedOrderDataList: [],
    onSaveTemporary: () => {},
    onLoadTemporary: () => {},
    onDeleteSavedData: () => {},
    patientAllergies: ['ペニシリン'],
  },
};

export const Submitting: Story = {
  args: {
    confirmedOrders: sampleOrders,
    onUpdateOrder: () => {},
    onRemoveOrder: () => {},
    onConfirmAllOrders: () => {},
    isSubmitting: true,
    activeOrderType: 'prescription',
    savedOrderDataList: [],
    onSaveTemporary: () => {},
    onLoadTemporary: () => {},
    onDeleteSavedData: () => {},
  },
};

export const Empty: Story = {
  args: {
    confirmedOrders: [],
    onUpdateOrder: () => {},
    onRemoveOrder: () => {},
    onConfirmAllOrders: () => {},
    isSubmitting: false,
    activeOrderType: 'prescription',
    savedOrderDataList: [],
    onSaveTemporary: () => {},
    onLoadTemporary: () => {},
    onDeleteSavedData: () => {},
  },
};
