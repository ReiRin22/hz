import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useRightSideMenuStore } from '../../stores/use-right-side-menu.store';
import { MemoDialog } from '../../components/molecules/MemoDialog';

const resetStoreDecorator: Decorator = (Story) => {
  useRightSideMenuStore.getState().reset();
  return <Story />;
};

const meta = {
  title: '16_ui-common/01_menu-header/01_right-sidemenu/molecules/MemoDialog',
  component: MemoDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [resetStoreDecorator],
  argTypes: {
    onClose: { action: 'closed' },
  },
} satisfies Meta<typeof MemoDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MemoList: Story = {
  args: {
    onClose: fn(),
  },
};

export const SentTab: Story = {
  args: {
    onClose: fn(),
  },
  decorators: [
    (Story) => {
      useRightSideMenuStore.getState().reset();
      useRightSideMenuStore.getState().setMemoTab('sent');
      return <Story />;
    },
  ],
};

export const MemoDetail: Story = {
  args: {
    onClose: fn(),
  },
  decorators: [
    (Story) => {
      useRightSideMenuStore.getState().reset();
      useRightSideMenuStore.getState().selectMemo('memo1');
      return <Story />;
    },
  ],
};

export const CreateForm: Story = {
  args: {
    onClose: fn(),
  },
  decorators: [
    (Story) => {
      useRightSideMenuStore.getState().reset();
      useRightSideMenuStore.getState().startCreatingMemo();
      return <Story />;
    },
  ],
};
