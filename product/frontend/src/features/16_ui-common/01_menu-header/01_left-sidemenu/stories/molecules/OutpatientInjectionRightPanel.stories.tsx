import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { OutpatientInjectionRightPanel } from '../../components/molecules/OutpatientInjectionRightPanel';

const sampleOrders = [
  {
    id: 'order-001',
    name: 'ビタミンB1注射液10mg',
    dosage: '10mg',
    usage: '筋肉内注射',
    route: '筋肉内注射',
    frequency: '1日1回',
    period: '1日間',
  },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/molecules/OutpatientInjectionRightPanel',
  component: OutpatientInjectionRightPanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onUpdateOrder: fn(),
    onRemoveOrder: fn(),
    onConfirmAllOrders: fn(),
  },
} satisfies Meta<typeof OutpatientInjectionRightPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithOrders: Story = {
  args: {
    confirmedOrders: sampleOrders,
  },
};

export const Empty: Story = {
  args: {
    confirmedOrders: [],
  },
};
