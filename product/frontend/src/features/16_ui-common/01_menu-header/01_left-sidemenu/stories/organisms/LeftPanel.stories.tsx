import type { Meta, StoryObj } from '@storybook/react';
import { LeftPanel } from '../../components/organisms/LeftPanel';

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/organisms/LeftPanel',
  component: LeftPanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    onTabChange: { action: 'tab-changed' },
    onAddCandidate: { action: 'candidate-added' },
    onAddMultipleCandidates: { action: 'multiple-candidates-added' },
    onAddToDetail: { action: 'add-to-detail' },
    onAddMultipleToDetail: { action: 'add-multiple-to-detail' },
    onSubTabChange: { action: 'sub-tab-changed' },
    onAddSetOrders: { action: 'set-orders-added' },
  },
} satisfies Meta<typeof LeftPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PrescriptionTab: Story = {
  args: {
    activeTab: 'prescription',
    onTabChange: () => {},
    onAddCandidate: () => {},
    onAddMultipleCandidates: () => {},
    onAddToDetail: () => {},
    onAddMultipleToDetail: () => {},
    onAddSetOrders: () => {},
  },
};

export const InjectionTab: Story = {
  args: {
    activeTab: 'injection',
    onTabChange: () => {},
    onAddCandidate: () => {},
    onAddMultipleCandidates: () => {},
    onAddToDetail: () => {},
    onAddMultipleToDetail: () => {},
    onAddSetOrders: () => {},
  },
};

export const LabTab: Story = {
  args: {
    activeTab: 'lab',
    onTabChange: () => {},
    onAddCandidate: () => {},
    onAddMultipleCandidates: () => {},
    onAddToDetail: () => {},
    onAddMultipleToDetail: () => {},
    onAddSetOrders: () => {},
  },
};
