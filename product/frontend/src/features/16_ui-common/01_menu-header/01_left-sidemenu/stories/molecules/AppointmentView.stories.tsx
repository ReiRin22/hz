import type { Meta, StoryObj } from '@storybook/react';
import { AppointmentView } from '../../components/molecules/AppointmentView';

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/molecules/AppointmentView',
  component: AppointmentView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppointmentView>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
