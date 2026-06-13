import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import TemplateSelectorPanel from '../../components/molecules/TemplateSelectorPanel';

const meta = {
  title: '01_diagnosis/01_record-creation/01_schema-creation/molecules/TemplateSelectorPanel',
  component: TemplateSelectorPanel,
  tags: ['autodocs'],
  args: {
    onBodyPartChange: fn(),
    onTemplateSelect: fn(),
    onFavoriteToggle: fn(),
    onImageImport: fn(),
  },
} satisfies Meta<typeof TemplateSelectorPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedBodyPart: 'fullBody',
    selectedTemplateId: '',
    favoriteTemplateIds: [],
  },
};

export const WithSelectedTemplate: Story = {
  args: {
    selectedBodyPart: 'fullBody',
    selectedTemplateId: 'fullBody1',
    favoriteTemplateIds: ['fullBody1'],
  },
};

export const WithFavorites: Story = {
  args: {
    selectedBodyPart: 'fullBody',
    selectedTemplateId: '',
    favoriteTemplateIds: ['fullBody1', 'fullBody2'],
  },
};
