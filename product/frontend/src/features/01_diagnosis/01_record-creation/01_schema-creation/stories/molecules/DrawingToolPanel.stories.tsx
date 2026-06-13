import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import DrawingToolPanel from '../../components/molecules/DrawingToolPanel';

const meta = {
  title: '01_diagnosis/01_record-creation/01_schema-creation/molecules/DrawingToolPanel',
  component: DrawingToolPanel,
  tags: ['autodocs'],
  args: {
    onToolSelect: fn(),
    onColorChange: fn(),
    onWidthChange: fn(),
  },
} satisfies Meta<typeof DrawingToolPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PenSelected: Story = {
  args: {
    activeTool: 'pen',
    strokeColor: '#000000',
    penSize: 3,
  },
};

export const EraserSelected: Story = {
  args: {
    activeTool: 'eraser',
    strokeColor: '#FF0000',
    penSize: 10,
  },
};

export const RectangleSelected: Story = {
  args: {
    activeTool: 'rectangle',
    strokeColor: '#0000FF',
    penSize: 2,
  },
};
