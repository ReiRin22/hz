import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { StickyNotesDialogMolecule } from '../../components/molecules/StickyNotesDialogMolecule';

const meta = {
  title: '16_ui-common/01_menu-header/01_user-header/molecules/StickyNotesDialogMolecule',
  component: StickyNotesDialogMolecule,
  tags: ['autodocs'],
  args: {
    onOpenChange: fn(),
    onCountChange: fn(),
  },
} satisfies Meta<typeof StickyNotesDialogMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { isOpen: true },
};

export const Closed: Story = {
  args: { isOpen: false },
};
