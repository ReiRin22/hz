import type { Meta, StoryObj } from '@storybook/react';
import { NewPatientBadge } from '../../components/molecules/NewPatientBadge';

const meta = {
  title: '16_ui-common/01_menu-header/01_user-header/molecules/NewPatientBadge',
  component: NewPatientBadge,
  tags: ['autodocs'],
} satisfies Meta<typeof NewPatientBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {
  args: { show: true },
};

export const Hidden: Story = {
  args: { show: false },
};
