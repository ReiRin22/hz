import type { Meta, StoryObj } from '@storybook/react';
import { InjectionOrderPanel } from '../../components/organisms/InjectionOrderPanel';

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/organisms/InjectionOrderPanel',
  component: InjectionOrderPanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    onConfirmOrder: { action: 'order-confirmed' },
    onAddToUnifiedOrderList: { action: 'add-to-unified-order-list' },
  },
} satisfies Meta<typeof InjectionOrderPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onConfirmOrder: () => {},
    onAddToUnifiedOrderList: () => {},
  },
};

export const NoCallbacks: Story = {
  args: {},
};
