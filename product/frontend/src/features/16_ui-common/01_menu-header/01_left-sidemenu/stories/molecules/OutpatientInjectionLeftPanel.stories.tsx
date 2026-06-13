import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { OutpatientInjectionLeftPanel } from '../../components/molecules/OutpatientInjectionLeftPanel';

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/molecules/OutpatientInjectionLeftPanel',
  component: OutpatientInjectionLeftPanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onAddCandidate: fn(),
    onAddMultipleCandidates: fn(),
    onAddToDetail: fn(),
    onAddMultipleToDetail: fn(),
    onSubTabChange: fn(),
  },
} satisfies Meta<typeof OutpatientInjectionLeftPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const HistoryTab: Story = {
  args: {
    activeSubTab: 'history',
  },
};

export const SearchTab: Story = {
  args: {
    activeSubTab: 'search',
  },
};
