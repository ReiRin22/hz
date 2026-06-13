import type { Meta, StoryObj } from '@storybook/react';
import { GlobalMenu } from '../../components/organisms/GlobalMenu';

const samplePatient = {
  id: 'p001',
  name: '田中太郎',
  age: 65,
  gender: 'male' as const,
  patientNumber: 'P-001234',
  visitDate: '2026-05-14',
};

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/organisms/GlobalMenu',
  component: GlobalMenu,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    onOrderTypeChange: { action: 'order-type-changed' },
    onMenuClick: { action: 'menu-clicked' },
    onAddSetOrders: { action: 'set-orders-added' },
  },
} satisfies Meta<typeof GlobalMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PrescriptionMode: Story = {
  args: {
    activeOrderType: 'prescription',
    onOrderTypeChange: () => {},
    onMenuClick: () => {},
    currentView: 'order',
    currentPatient: samplePatient,
    onAddSetOrders: () => {},
  },
};

export const InjectionMode: Story = {
  args: {
    activeOrderType: 'injection',
    onOrderTypeChange: () => {},
    onMenuClick: () => {},
    currentView: 'order',
    currentPatient: samplePatient,
    onAddSetOrders: () => {},
  },
};

export const NoPatient: Story = {
  args: {
    activeOrderType: 'prescription',
    onOrderTypeChange: () => {},
    onMenuClick: () => {},
    currentView: 'order',
    onAddSetOrders: () => {},
  },
};
