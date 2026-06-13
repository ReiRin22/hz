import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MenuSettingsDialogMolecule } from '../../components/molecules/MenuSettingsDialogMolecule';

const meta = {
  title: '16_ui-common/01_menu-header/01_user-header/molecules/MenuSettingsDialogMolecule',
  component: MenuSettingsDialogMolecule,
  tags: ['autodocs'],
  args: {
    onOpenChange: fn(),
    onThemeColorChange: fn(),
    onDarkModeToggle: fn(),
    onAutoSaveToggle: fn(),
    onAutoSave: fn(),
    onAlertsToggle: fn(),
    onAutoLogoutToggle: fn(),
    onAutoLogoutTimeoutChange: fn(),
  },
} satisfies Meta<typeof MenuSettingsDialogMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    themeColor: 'blue',
    darkMode: false,
    autoSaveEnabled: true,
    alertsEnabled: true,
    autoLogoutEnabled: false,
    autoLogoutTimeout: 30,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    themeColor: 'blue',
    darkMode: false,
    autoSaveEnabled: true,
    alertsEnabled: true,
    autoLogoutEnabled: false,
    autoLogoutTimeout: 30,
  },
};

export const DarkMode: Story = {
  args: {
    isOpen: true,
    themeColor: 'green',
    darkMode: true,
    autoSaveEnabled: false,
    alertsEnabled: true,
    autoLogoutEnabled: true,
    autoLogoutTimeout: 15,
  },
};
