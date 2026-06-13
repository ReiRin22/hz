import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MailFilterBar } from '../../components/molecules/MailFilterBar';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };
const blackTheme = { name: 'ブラック', value: 'black', primary: '#9CA3AF', secondary: '#0D0D0D' };

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/molecules/MailFilterBar',
  component: MailFilterBar,
  tags: ['autodocs'],
  argTypes: {
    onShowReadChange: { action: 'show-read-changed' },
    onShowDeletedChange: { action: 'show-deleted-changed' },
    onComposeClick: { action: 'compose-clicked' },
  },
} satisfies Meta<typeof MailFilterBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showRead: false,
    showDeleted: false,
    selectedEmailId: null,
    onShowReadChange: fn(),
    onShowDeletedChange: fn(),
    onComposeClick: fn(),
    theme: blueTheme,
  },
};

export const AllChecked: Story = {
  args: {
    showRead: true,
    showDeleted: false,
    selectedEmailId: 'mail-001',
    onShowReadChange: fn(),
    onShowDeletedChange: fn(),
    onComposeClick: fn(),
    theme: blueTheme,
  },
};

export const WithSelectedEmail: Story = {
  args: {
    showRead: true,
    showDeleted: false,
    selectedEmailId: 'mail-001',
    onShowReadChange: fn(),
    onShowDeletedChange: fn(),
    onComposeClick: fn(),
    theme: blueTheme,
  },
};

export const BlackTheme: Story = {
  args: {
    showRead: false,
    showDeleted: true,
    selectedEmailId: null,
    onShowReadChange: fn(),
    onShowDeletedChange: fn(),
    onComposeClick: fn(),
    theme: blackTheme,
  },
};
