import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { OutpatientInjectionCenterPanel } from '../../components/molecules/OutpatientInjectionCenterPanel';

const sampleCandidates = [
  { id: 'c1', name: 'ビタミンB1注射液10mg', dosage: '10mg', usage: '筋肉内注射', source: 'history' as const },
  { id: 'c2', name: 'デキサメタゾン注射液4mg', dosage: '4mg', usage: '筋肉内注射', source: 'set' as const },
  { id: 'c3', name: 'インスリン（速効型）', dosage: '10単位', usage: '皮下注射', source: 'frequent' as const },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/molecules/OutpatientInjectionCenterPanel',
  component: OutpatientInjectionCenterPanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onAddToDetail: fn(),
    onAddMultipleToDetail: fn(),
    onFilterChange: fn(),
  },
} satisfies Meta<typeof OutpatientInjectionCenterPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithCandidates: Story = {
  args: {
    candidates: sampleCandidates,
    activeFilter: 'all',
  },
};

export const Empty: Story = {
  args: {
    candidates: [],
    activeFilter: 'all',
  },
};
