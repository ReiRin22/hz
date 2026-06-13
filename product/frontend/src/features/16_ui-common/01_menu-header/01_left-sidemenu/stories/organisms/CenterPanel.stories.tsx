import type { Meta, StoryObj } from '@storybook/react';
import { CenterPanel } from '../../components/organisms/CenterPanel';

const sampleCandidates = [
  { id: 'c1', name: 'アムロジピン錠5mg', dosage: '5mg', usage: '1日1回', type: 'prescription' as const, source: 'history' as const },
  { id: 'c2', name: 'ムコダイン錠250mg', dosage: '250mg', usage: '1日3回', type: 'prescription' as const, source: 'set' as const },
  { id: 'c3', name: 'ビタミンB1注射液10mg', dosage: '10mg', usage: '筋肉内注射', type: 'injection' as const, source: 'frequent' as const },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/organisms/CenterPanel',
  component: CenterPanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    onAddToDetail: { action: 'add-to-detail' },
    onAddMultipleToDetail: { action: 'add-multiple-to-detail' },
    onFilterChange: { action: 'filter-changed' },
  },
} satisfies Meta<typeof CenterPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithCandidates: Story = {
  args: {
    candidates: sampleCandidates,
    onAddToDetail: () => {},
    onAddMultipleToDetail: () => {},
    activeFilter: 'all',
    onFilterChange: () => {},
  },
};

export const Empty: Story = {
  args: {
    candidates: [],
    onAddToDetail: () => {},
    onAddMultipleToDetail: () => {},
    activeFilter: 'all',
    onFilterChange: () => {},
  },
};
