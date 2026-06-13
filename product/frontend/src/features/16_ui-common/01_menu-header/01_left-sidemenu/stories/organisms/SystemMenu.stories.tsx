import type { Meta, StoryObj } from '@storybook/react';
import { SystemMenu } from '../../components/organisms/SystemMenu';

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/organisms/SystemMenu',
  component: SystemMenu,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    onMenuClick: { action: 'menu-clicked' },
  },
} satisfies Meta<typeof SystemMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onMenuClick: () => {},
  },
};

export const NoCallback: Story = {
  args: {},
};
