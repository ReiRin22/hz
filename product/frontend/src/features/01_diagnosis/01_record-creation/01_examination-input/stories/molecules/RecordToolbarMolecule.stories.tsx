import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RecordToolbarMolecule } from '../../components/molecules/RecordToolbarMolecule';

const SAMPLE_TEMPLATES = [
  { id: 'general', name: '一般診療', content: 'S: ...\nO: ...\nA: ...\nP: ...' },
  { id: 'followup', name: 'フォローアップ', content: 'S: 前回より...\nO: ...\nA: ...\nP: ...' },
  { id: 'emergency', name: '救急外来', content: 'S: 主訴...\nO: ...\nA: 緊急度...\nP: ...' },
];

const meta = {
  title: '01_diagnosis/01_record-creation/01_examination-input/molecules/RecordToolbarMolecule',
  component: RecordToolbarMolecule,
  tags: ['autodocs'],
  args: {
    onToggleVoice: fn(),
    onOpenComment: fn(),
    onToggleTemplates: fn(),
    onApplyTemplate: fn(),
    onOpenSchema: fn(),
  },
} satisfies Meta<typeof RecordToolbarMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isEditable: true,
    isVoiceActive: false,
    showTemplates: false,
    templates: SAMPLE_TEMPLATES,
  },
};

export const VoiceActive: Story = {
  args: {
    isEditable: true,
    isVoiceActive: true,
    showTemplates: false,
    templates: SAMPLE_TEMPLATES,
  },
};

export const TemplatesOpen: Story = {
  args: {
    isEditable: true,
    isVoiceActive: false,
    showTemplates: true,
    templates: SAMPLE_TEMPLATES,
  },
};

export const Disabled: Story = {
  args: {
    isEditable: false,
    isVoiceActive: false,
    showTemplates: false,
    templates: SAMPLE_TEMPLATES,
  },
};
