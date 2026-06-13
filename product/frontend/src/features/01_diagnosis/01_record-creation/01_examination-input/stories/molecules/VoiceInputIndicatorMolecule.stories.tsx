import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { VoiceInputIndicatorMolecule } from '../../components/molecules/VoiceInputIndicatorMolecule';

const meta = {
  title: '01_diagnosis/01_record-creation/01_examination-input/molecules/VoiceInputIndicatorMolecule',
  component: VoiceInputIndicatorMolecule,
  tags: ['autodocs'],
  args: {
    onStop: fn(),
  },
} satisfies Meta<typeof VoiceInputIndicatorMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const LowAudioLevel: Story = {
  args: {
    audioLevel: 20,
    interimTranscript: '',
  },
};

export const HighAudioLevel: Story = {
  args: {
    audioLevel: 80,
    interimTranscript: '患者は頭痛を訴えて',
  },
};

export const WithTranscript: Story = {
  args: {
    audioLevel: 55,
    interimTranscript: '患者は発熱と頭痛を訴えており、体温は38度5分であった。',
  },
};
