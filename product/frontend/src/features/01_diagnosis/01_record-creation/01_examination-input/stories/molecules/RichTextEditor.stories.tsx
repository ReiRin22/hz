import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RichTextEditor } from '../../components/molecules/RichTextEditor';

const meta = {
  title: '01_diagnosis/01_record-creation/01_examination-input/molecules/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
    onActiveFormatsChange: fn(),
  },
} satisfies Meta<typeof RichTextEditor>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    value: '',
    placeholder: 'SOAPテキストを入力してください',
    disabled: false,
  },
};

export const WithContent: Story = {
  args: {
    value: 'S: 患者は頭痛と発熱を訴えている。\nO: バイタル安定。体温38.5度。\nA: 急性上気道炎疑い。\nP: 解熱剤処方、経過観察。',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: 'S: 既存の記録内容\nO: バイタル安定\nA: 診断済み\nP: 治療継続',
    disabled: true,
  },
};
