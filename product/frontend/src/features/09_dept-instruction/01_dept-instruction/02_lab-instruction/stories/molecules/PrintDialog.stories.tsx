import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PrintDialog } from '../../components/molecules/PrintDialog';

const meta = {
  title: '09_dept-instruction/01_dept-instruction/02_lab-instruction/molecules/PrintDialog',
  component: PrintDialog,
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'closed' },
    onPrint: { action: 'printed' },
  },
} satisfies Meta<typeof PrintDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const LabelPrint: Story = {
  args: {
    open: true,
    onClose: fn(),
    onPrint: fn(),
    selectedCount: 2,
    type: 'label',
    selectedOrderTypes: ['SPECIMEN_TEST'],
  },
};

export const DocumentIssue: Story = {
  args: {
    open: true,
    onClose: fn(),
    onPrint: fn(),
    selectedCount: 1,
    type: 'document',
    selectedOrderTypes: ['PRESCRIPTION'],
  },
};

export const NoDocumentTypes: Story = {
  args: {
    open: true,
    onClose: fn(),
    onPrint: fn(),
    selectedCount: 1,
    type: 'document',
    selectedOrderTypes: ['SPECIMEN_TEST'],
  },
};
