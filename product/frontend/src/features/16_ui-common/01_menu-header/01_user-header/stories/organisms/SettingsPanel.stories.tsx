import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SettingsPanel } from '../../components/organisms/SettingsPanel';

const meta = {
  title: '16_ui-common/01_menu-header/01_user-header/organisms/SettingsPanel',
  component: SettingsPanel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    onDarkModeToggle: fn(),
    onAutoSaveToggle: fn(),
    onAutoSave: fn(),
    onAlertsToggle: fn(),
    onAutoLogoutToggle: fn(),
    onAutoLogoutTimeoutChange: fn(),
  },
} satisfies Meta<typeof SettingsPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    darkMode: false,
    autoSaveEnabled: true,
    alertsEnabled: true,
    autoLogoutEnabled: false,
    autoLogoutTimeout: 30,
  },
};

export const DarkModeEnabled: Story = {
  args: {
    darkMode: true,
    autoSaveEnabled: true,
    alertsEnabled: true,
    autoLogoutEnabled: true,
    autoLogoutTimeout: 15,
  },
};

export const AllDisabled: Story = {
  args: {
    darkMode: false,
    autoSaveEnabled: false,
    alertsEnabled: false,
    autoLogoutEnabled: false,
    autoLogoutTimeout: 30,
  },
};
