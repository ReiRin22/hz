import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MyCommentManagementDialog } from '../../components/organisms/MyCommentManagementDialog';

const SAMPLE_COMMENTS = [
  { id: 'mc-001', content: '次回フォローアップ必要' },
  { id: 'mc-002', content: 'アレルギー確認済み（ペニシリン）' },
  { id: 'mc-003', content: '患者は聴力低下があるため、ゆっくり説明が必要' },
];

const meta = {
  title: '01_diagnosis/01_record-creation/01_examination-input/organisms/MyCommentManagementDialog',
  component: MyCommentManagementDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onOpenChange: fn(),
    onSaveComment: fn(),
    onDeleteComment: fn(),
  },
} satisfies Meta<typeof MyCommentManagementDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    comments: SAMPLE_COMMENTS,
  },
};

export const Closed: Story = {
  args: {
    open: false,
    comments: SAMPLE_COMMENTS,
  },
};

export const EmptyComments: Story = {
  args: {
    open: true,
    comments: [],
  },
};
