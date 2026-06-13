import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PatientAvatarMolecule } from '../../components/molecules/PatientAvatarMolecule';

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/molecules/PatientAvatarMolecule',
  component: PatientAvatarMolecule,
  tags: ['autodocs'],
  args: {
    onPrivacyToggle: fn(),
    onPatientIdClick: fn(),
  },
} satisfies Meta<typeof PatientAvatarMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Male: Story = {
  args: {
    name: '山田 太郎',
    kana: 'ヤマダ タロウ',
    patientId: 'P001234',
    gender: '男性',
    isPrivacyMode: false,
  },
};

export const Female: Story = {
  args: {
    name: '鈴木 花子',
    kana: 'スズキ ハナコ',
    patientId: 'P005678',
    gender: '女性',
    isPrivacyMode: false,
  },
};

export const PrivacyMode: Story = {
  args: {
    name: '山田 太郎',
    kana: 'ヤマダ タロウ',
    patientId: 'P001234',
    gender: '男性',
    isPrivacyMode: true,
  },
};
