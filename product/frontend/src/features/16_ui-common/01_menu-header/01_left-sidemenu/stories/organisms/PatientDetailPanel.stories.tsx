import type { Meta, StoryObj } from '@storybook/react';
import { PatientDetailPanel } from '../../components/organisms/PatientDetailPanel';

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/organisms/PatientDetailPanel',
  component: PatientDetailPanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PatientDetailPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BasicCategory: Story = {
  args: {
    activeCategory: 'basic',
  },
};

export const AllergyCategory: Story = {
  args: {
    activeCategory: 'allergy',
  },
};

export const HistoryCategory: Story = {
  args: {
    activeCategory: 'history',
  },
};
