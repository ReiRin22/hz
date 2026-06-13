import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ImageViewerDialog } from '../../components/organisms/ImageViewerDialog';

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/organisms/ImageViewerDialog',
  component: ImageViewerDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof ImageViewerDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    patientId: 'P001234',
    patientName: '山田 太郎',
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    patientId: 'P001234',
    patientName: '山田 太郎',
  },
};
