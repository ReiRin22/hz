import type { Meta, StoryObj } from '@storybook/react';
import { RecordRecorderSelectMolecule } from '../../components/molecules/RecordRecorderSelectMolecule';

const meta = {
  title: '01_diagnosis/01_record-creation/01_examination-input/molecules/RecordRecorderSelectMolecule',
  component: RecordRecorderSelectMolecule,
  tags: ['autodocs'],
} satisfies Meta<typeof RecordRecorderSelectMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithName: Story = {
  args: {
    authorName: '山田 太郎',
  },
};

export const EmptyName: Story = {
  args: {
    authorName: '',
  },
};
