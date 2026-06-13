import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { BulletinBoardDialog } from '../../components/molecules/BulletinBoardDialog';

const meta = {
  title: '16_ui-common/01_menu-header/01_right-sidemenu/molecules/BulletinBoardDialog',
  component: BulletinBoardDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    onClose: { action: 'closed' },
  },
} satisfies Meta<typeof BulletinBoardDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    onClose: fn(),
  },
};
