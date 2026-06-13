import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TextFormattingToolbar } from '../../components/molecules/TextFormattingToolbar';

const meta = {
  title: '01_diagnosis/01_record-creation/01_examination-input/molecules/TextFormattingToolbar',
  component: TextFormattingToolbar,
  tags: ['autodocs'],
  args: {
    onFormatApply: fn(),
  },
} satisfies Meta<typeof TextFormattingToolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
    activeFormats: new Set(),
  },
};

export const WithActiveFormats: Story = {
  args: {
    disabled: false,
    activeFormats: new Set(['bold', 'underline']),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    activeFormats: new Set(),
  },
};
