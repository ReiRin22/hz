import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { DraftDropdownMolecule } from '../../components/molecules/DraftDropdownMolecule';

const SAMPLE_DRAFTS = [
  {
    id: 'draft-001',
    soapContent: 'S: 患者は頭痛と発熱を訴えている。体温38.5度。O: バイタル安定。A: 急性上気道炎疑い。P: 解熱剤処方、経過観察。',
    savedAt: '2026-05-12T10:30:00Z',
  },
  {
    id: 'draft-002',
    soapContent: 'S: 慢性腰痛のフォローアップ。前回より改善傾向あり。O: 可動域制限軽度。A: 腰椎変性疾患。P: 理学療法継続。',
    savedAt: '2026-05-11T15:00:00Z',
  },
];

const meta = {
  title: '01_diagnosis/01_record-creation/01_examination-input/molecules/DraftDropdownMolecule',
  component: DraftDropdownMolecule,
  tags: ['autodocs'],
  args: {
    onOpenChange: fn(),
    onApplyDraft: fn(),
    onDeleteDraft: fn(),
  },
} satisfies Meta<typeof DraftDropdownMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: {
    drafts: SAMPLE_DRAFTS,
    open: false,
  },
};

export const Open: Story = {
  args: {
    drafts: SAMPLE_DRAFTS,
    open: true,
  },
};

export const SingleDraft: Story = {
  args: {
    drafts: [SAMPLE_DRAFTS[0]],
    open: false,
  },
};
