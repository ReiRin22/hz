import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TempSaveDialogMolecule } from '../../components/molecules/TempSaveDialogMolecule';

const meta = {
  title: '16_ui-common/01_menu-header/01_user-header/molecules/TempSaveDialogMolecule',
  component: TempSaveDialogMolecule,
  tags: ['autodocs'],
  args: {
    onOpenChange: fn(),
    onCountChange: fn(),
  },
} satisfies Meta<typeof TempSaveDialogMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { isOpen: true, count: 3 },
};

export const Closed: Story = {
  args: { isOpen: false, count: 3 },
};

export const Empty: Story = {
  args: { isOpen: true, count: 0 },
};
