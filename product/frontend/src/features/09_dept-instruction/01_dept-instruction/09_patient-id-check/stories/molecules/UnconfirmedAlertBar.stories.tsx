import type { Meta, StoryObj } from '@storybook/react';
import { UnconfirmedAlertBar } from '@/features/09_dept-instruction/01_dept-instruction/09_patient-id-check/components/molecules/UnconfirmedAlertBar';

const meta = {
  title: '09_dept-instruction/01_dept-instruction/09_patient-id-check/molecules/UnconfirmedAlertBar',
  component: UnconfirmedAlertBar,
  tags: ['autodocs'],
} satisfies Meta<typeof UnconfirmedAlertBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: '未確認の項目があります',
  },
};
