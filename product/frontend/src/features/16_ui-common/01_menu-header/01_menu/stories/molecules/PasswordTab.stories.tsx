import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PasswordTab } from '../../components/molecules/PasswordTab';

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/molecules/PasswordTab',
  component: PasswordTab,
  tags: ['autodocs'],
  argTypes: {
    onCurrentPasswordChange: { action: 'current-password-changed' },
    onNewPasswordChange: { action: 'new-password-changed' },
    onConfirmPasswordChange: { action: 'confirm-password-changed' },
    onChangePassword: { action: 'password-change-submitted' },
  },
} satisfies Meta<typeof PasswordTab>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    passwordError: '',
    onCurrentPasswordChange: fn(),
    onNewPasswordChange: fn(),
    onConfirmPasswordChange: fn(),
    onChangePassword: fn(),
  },
};

export const WithValues: Story = {
  args: {
    currentPassword: 'currentpass',
    newPassword: 'newpassword1',
    confirmPassword: 'newpassword1',
    passwordError: '',
    onCurrentPasswordChange: fn(),
    onNewPasswordChange: fn(),
    onConfirmPasswordChange: fn(),
    onChangePassword: fn(),
  },
};

export const WithError: Story = {
  args: {
    currentPassword: 'currentpass',
    newPassword: 'newpassword1',
    confirmPassword: 'differentpass',
    passwordError: '新しいパスワードと確認用パスワードが一致しません',
    onCurrentPasswordChange: fn(),
    onNewPasswordChange: fn(),
    onConfirmPasswordChange: fn(),
    onChangePassword: fn(),
  },
};

export const FilledMatch: Story = {
  args: {
    currentPassword: 'currentpass',
    newPassword: 'newpassword1',
    confirmPassword: 'newpassword1',
    passwordError: '',
    onCurrentPasswordChange: fn(),
    onNewPasswordChange: fn(),
    onConfirmPasswordChange: fn(),
    onChangePassword: fn(),
  },
};

export const MismatchError: Story = {
  args: {
    currentPassword: 'currentpass',
    newPassword: 'newpassword1',
    confirmPassword: 'differentpass',
    passwordError: '新しいパスワードが一致しません',
    onCurrentPasswordChange: fn(),
    onNewPasswordChange: fn(),
    onConfirmPasswordChange: fn(),
    onChangePassword: fn(),
  },
};
