import type { Meta, StoryObj } from '@storybook/react';
import { TemporarySaveSection } from '../../components/organisms/TemporarySaveSection';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };
const blackTheme = { name: 'ブラック', value: 'black', primary: '#9CA3AF', secondary: '#0D0D0D' };

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/organisms/TemporarySaveSection',
  component: TemporarySaveSection,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TemporarySaveSection>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { theme: blueTheme },
};

export const BlackTheme: Story = {
  args: { theme: blackTheme },
};
