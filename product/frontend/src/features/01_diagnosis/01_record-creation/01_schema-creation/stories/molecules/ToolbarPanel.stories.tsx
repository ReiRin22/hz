import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ToolbarPanel from '../../components/molecules/ToolbarPanel';

const meta = {
  title: '01_diagnosis/01_record-creation/01_schema-creation/molecules/ToolbarPanel',
  component: ToolbarPanel,
  tags: ['autodocs'],
  args: {
    onUndo: fn(),
    onRedo: fn(),
    onClear: fn(),
    onFlip: fn(),
  },
} satisfies Meta<typeof ToolbarPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
