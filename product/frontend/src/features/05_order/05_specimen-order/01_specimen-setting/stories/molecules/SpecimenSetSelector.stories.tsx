import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SpecimenSetSelector } from '../../components/molecules/SpecimenSetSelector';

const meta = {
  title: '05_order/05_specimen-order/01_specimen-setting/molecules/SpecimenSetSelector',
  component: SpecimenSetSelector,
  tags: ['autodocs'],
  args: {
    onSelectSet: fn(),
  },
} satisfies Meta<typeof SpecimenSetSelector>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sets: [
      {
        id: 'set-001',
        name: '基本血液検査セット',
        description: '血算・生化学・凝固を含む基本セット',
        setType: 'hospital',
        items: [
          { id: 'item-001', specimenType: 'blood', testName: '血算（CBC）', orderCode: 'CBC' },
          { id: 'item-002', specimenType: 'blood', testName: '生化学', orderCode: 'BMP' },
        ],
      },
      {
        id: 'set-002',
        name: '尿検査セット',
        description: '尿一般・尿培養を含むセット',
        setType: 'hospital',
        items: [
          { id: 'item-003', specimenType: 'urine', testName: '尿一般', orderCode: 'UA' },
        ],
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    sets: [],
  },
};

export const SingleSet: Story = {
  args: {
    sets: [
      {
        id: 'set-001',
        name: '基本血液検査セット',
        description: '血算・生化学・凝固を含む基本セット',
        setType: 'hospital',
        items: [
          { id: 'item-001', specimenType: 'blood', testName: '血算（CBC）', orderCode: 'CBC' },
        ],
      },
    ],
  },
};
