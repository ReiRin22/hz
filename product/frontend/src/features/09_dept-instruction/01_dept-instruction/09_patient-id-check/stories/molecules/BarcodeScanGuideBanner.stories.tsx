import type { Meta, StoryObj } from '@storybook/react';
import { BarcodeScanGuideBanner } from '@/features/09_dept-instruction/01_dept-instruction/09_patient-id-check/components/molecules/BarcodeScanGuideBanner';

const meta = {
  title: '09_dept-instruction/01_dept-instruction/09_patient-id-check/molecules/BarcodeScanGuideBanner',
  component: BarcodeScanGuideBanner,
  tags: ['autodocs'],
} satisfies Meta<typeof BarcodeScanGuideBanner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
