import type { Meta, StoryObj } from '@storybook/react';
import { VisualIndicator } from '../../components/molecules/VisualIndicator';

const meta = {
  title: '09_dept-instruction/01_dept-instruction/02_lab-instruction/molecules/VisualIndicator',
  component: VisualIndicator,
  tags: ['autodocs'],
} satisfies Meta<typeof VisualIndicator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SpecimenTube: Story = {
  args: {
    indicator: { tubeType: 'PURPLE_CAP', tubeColor: '#8B5CF6' },
    size: 'md',
  },
};

export const SpecimenTubeSmall: Story = {
  args: {
    indicator: { tubeType: 'YELLOW_CAP', tubeColor: '#EAB308' },
    size: 'sm',
  },
};

export const PhysiologyECG: Story = {
  args: {
    indicator: { physiologicalTestType: 'ECG' },
    size: 'md',
  },
};
