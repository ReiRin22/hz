import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RecordInputHeaderMolecule } from '../../components/molecules/RecordInputHeaderMolecule';

const meta = {
  title: '01_diagnosis/01_record-creation/01_examination-input/molecules/RecordInputHeaderMolecule',
  component: RecordInputHeaderMolecule,
  tags: ['autodocs'],
  args: {
    onSaveDraft: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof RecordInputHeaderMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Editable: Story = {
  args: {
    isEditable: true,
    confirmButtonDisabled: false,
  },
};

export const ConfirmDisabled: Story = {
  args: {
    isEditable: true,
    confirmButtonDisabled: true,
  },
};

export const NotEditable: Story = {
  args: {
    isEditable: false,
    confirmButtonDisabled: true,
  },
};

export const WithValidationErrors: Story = {
  args: {
    isEditable: true,
    confirmButtonDisabled: true,
    validationErrors: {
      recordDate: '記載日は必須です',
      soapContent: 'SOAPテキストは必須です',
    },
  },
};
