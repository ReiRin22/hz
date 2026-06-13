import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import DrawingCanvas from '../../components/organisms/DrawingCanvas';

const meta = {
  title: '01_diagnosis/01_record-creation/01_schema-creation/organisms/DrawingCanvas',
  component: DrawingCanvas,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    onCanvasChange: fn(),
  },
} satisfies Meta<typeof DrawingCanvas>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PenTool: Story = {
  args: {
    tool: 'pen',
    color: '#000000',
    brushSize: 3,
    onCanvasChange: fn(),
  },
};

export const EraserTool: Story = {
  args: {
    tool: 'eraser',
    color: '#000000',
    brushSize: 10,
    onCanvasChange: fn(),
  },
};

export const WithTemplate: Story = {
  args: {
    tool: 'pen',
    color: '#FF0000',
    brushSize: 2,
    templateComponent: null,
    onCanvasChange: fn(),
  },
};
