import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ProxyInputConfirmDialog } from '../../components/organisms/ProxyInputConfirmDialog';

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/organisms/ProxyInputConfirmDialog',
  component: ProxyInputConfirmDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof ProxyInputConfirmDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    patientName: '山田 太郎',
    primaryDoctorName: '佐藤 医師',
  },
};

export const Closed: Story = {
  args: {
    open: false,
    patientName: '山田 太郎',
    primaryDoctorName: '佐藤 医師',
  },
};
