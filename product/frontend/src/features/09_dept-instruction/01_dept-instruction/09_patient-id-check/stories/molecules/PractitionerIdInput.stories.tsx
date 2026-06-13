import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PractitionerIdInput } from '@/features/09_dept-instruction/01_dept-instruction/09_patient-id-check/components/molecules/PractitionerIdInput';

const meta = {
  title: '09_dept-instruction/01_dept-instruction/09_patient-id-check/molecules/PractitionerIdInput',
  component: PractitionerIdInput,
  tags: ['autodocs'],
  args: {
    value: '',
    validationError: null,
    onChange: fn(),
    onRegister: fn(),
  },
} satisfies Meta<typeof PractitionerIdInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithValue: Story = {
  args: {
    value: 'ABC123',
  },
};

export const WithError: Story = {
  args: {
    value: 'abc-123',
    validationError: 'E001: 半角英数字で入力してください。',
  },
};
