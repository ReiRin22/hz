import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RecordDateInputMolecule } from '../../components/molecules/RecordDateInputMolecule';

const meta = {
  title: '01_diagnosis/01_record-creation/01_examination-input/molecules/RecordDateInputMolecule',
  component: RecordDateInputMolecule,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof RecordDateInputMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '2026-05-12',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: '2026-05-12',
    disabled: true,
  },
};
