import type { Meta, StoryObj } from '@storybook/react';
import { DashboardSection } from '../../components/organisms/DashboardSection';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };
const greenTheme = { name: 'グリーン', value: 'green', primary: '#10B981', secondary: '#D1FAE5' };
const blackTheme = { name: 'ブラック', value: 'black', primary: '#9CA3AF', secondary: '#0D0D0D' };

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/organisms/DashboardSection',
  component: DashboardSection,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DashboardSection>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { theme: blueTheme },
};

export const GreenTheme: Story = {
  args: { theme: greenTheme },
};

export const BlackTheme: Story = {
  args: { theme: blackTheme },
};
