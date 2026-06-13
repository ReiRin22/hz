import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ImplementerInputDialog } from '../../components/molecules/ImplementerInputDialog';

const meta = {
  title: '09_dept-instruction/01_dept-instruction/02_lab-instruction/molecules/ImplementerInputDialog',
  component: ImplementerInputDialog,
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'closed' },
    onSave: { action: 'saved' },
  },
} satisfies Meta<typeof ImplementerInputDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    onClose: fn(),
    onSave: fn(),
    currentUser: '看護師C',
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: fn(),
    onSave: fn(),
    currentUser: '看護師C',
  },
};
