import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { DraggableCommentPopup } from '../../components/organisms/DraggableCommentPopup';

const SAMPLE_COMMENTS = [
  { id: 'c-001', content: '次回フォローアップ必要', type: 'MY' as const },
  { id: 'c-002', content: 'アレルギー確認済み', type: 'MY' as const },
  { id: 'c-003', content: '患者同意書取得済み', type: 'PATIENT' as const },
  { id: 'c-004', content: '科内共有事項：要注意患者', type: 'DEPT' as const },
];

const meta = {
  title: '01_diagnosis/01_record-creation/01_examination-input/organisms/DraggableCommentPopup',
  component: DraggableCommentPopup,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onClose: fn(),
    onCommentSelect: fn(),
    onCommentTabChange: fn(),
    onMyCommentManagementOpen: fn(),
  },
} satisfies Meta<typeof DraggableCommentPopup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    comments: SAMPLE_COMMENTS,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    comments: SAMPLE_COMMENTS,
  },
};

export const EmptyComments: Story = {
  args: {
    isOpen: true,
    comments: [],
  },
};
