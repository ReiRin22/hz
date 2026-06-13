import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ConfirmReasonForm } from '@/features/09_dept-instruction/01_dept-instruction/09_patient-id-check/components/molecules/ConfirmReasonForm';

const TEMPLATES = [
  { code: 'T001', label: '本人確認書類（保険証）で確認' },
  { code: 'T002', label: '医療スタッフ2名で確認' },
];

const meta = {
  title: '09_dept-instruction/01_dept-instruction/09_patient-id-check/molecules/ConfirmReasonForm',
  component: ConfirmReasonForm,
  tags: ['autodocs'],
  args: {
    templates: TEMPLATES,
    presetCode: '',
    customText: '',
    isSaving: false,
    saveError: null,
    onPresetChange: fn(),
    onCustomTextChange: fn(),
    onSave: fn(),
  },
} satisfies Meta<typeof ConfirmReasonForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Saving: Story = {
  args: {
    isSaving: true,
  },
};

export const WithError: Story = {
  args: {
    saveError: '定型文を選択するか、自由記入欄に入力してください。',
  },
};
