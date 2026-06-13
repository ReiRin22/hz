import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PatientInfoPanel } from '../../components/molecules/PatientInfoPanel';

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/molecules/PatientInfoPanel',
  component: PatientInfoPanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onCategoryChange: fn(),
  },
} satisfies Meta<typeof PatientInfoPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BasicInfo: Story = {
  args: {
    activeCategory: 'basic',
    patientGender: 'male',
  },
};

export const AllergyInfo: Story = {
  args: {
    activeCategory: 'allergy',
    patientGender: 'female',
  },
};

export const PregnancyHistory: Story = {
  args: {
    activeCategory: 'pregnancy',
    patientGender: 'female',
  },
};
