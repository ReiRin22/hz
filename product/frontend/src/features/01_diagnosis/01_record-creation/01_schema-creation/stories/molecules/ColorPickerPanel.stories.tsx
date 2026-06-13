import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ColorPickerPanel from '../../components/molecules/ColorPickerPanel';

const meta = {
  title: '01_diagnosis/01_record-creation/01_schema-creation/molecules/ColorPickerPanel',
  component: ColorPickerPanel,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof ColorPickerPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Black: Story = {
  args: { color: '#000000' },
};

export const Red: Story = {
  args: { color: '#FF0000' },
};

export const Custom: Story = {
  args: { color: '#4A90D9' },
};
