import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComposeMail } from '../../components/molecules/ComposeMail';

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/molecules/ComposeMail',
  component: ComposeMail,
  tags: ['autodocs'],
  argTypes: {
    onToChange: { action: 'to-changed' },
    onSubjectChange: { action: 'subject-changed' },
    onBodyChange: { action: 'body-changed' },
    onSend: { action: 'sent' },
    onCancel: { action: 'cancelled' },
  },
} satisfies Meta<typeof ComposeMail>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    to: '',
    subject: '',
    body: '',
    onToChange: fn(),
    onSubjectChange: fn(),
    onBodyChange: fn(),
    onSend: fn(),
    onCancel: fn(),
  },
};

export const Filled: Story = {
  args: {
    to: '田中 一郎',
    subject: '患者情報の確認について',
    body: 'お疲れ様です。患者情報をご確認ください。',
    onToChange: fn(),
    onSubjectChange: fn(),
    onBodyChange: fn(),
    onSend: fn(),
    onCancel: fn(),
  },
};

export const WithContent: Story = {
  args: {
    to: '臨床検査科 佐藤次郎',
    subject: 'Re: 検査結果の確認依頼',
    body: 'お疲れ様です。確認いたしました。至急対応します。',
    onToChange: fn(),
    onSubjectChange: fn(),
    onBodyChange: fn(),
    onSend: fn(),
    onCancel: fn(),
  },
};
