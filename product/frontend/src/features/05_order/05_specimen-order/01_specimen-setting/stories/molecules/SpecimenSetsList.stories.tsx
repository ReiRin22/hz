import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SpecimenSetsList } from '../../components/molecules/SpecimenSetsList';

const meta = {
  title: '05_order/05_specimen-order/01_specimen-setting/molecules/SpecimenSetsList',
  component: SpecimenSetsList,
  tags: ['autodocs'],
  args: {
    selectedSetType: 'hospital',
    onSetTypeChange: fn(),
    onAddItems: fn(),
    onSubTabChange: fn(),
  },
} satisfies Meta<typeof SpecimenSetsList>;
export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_SETS = [
  {
    id: 'set-001',
    name: '基本血液検査セット',
    description: '血算・生化学を含む基本セット',
    setType: 'hospital' as const,
    items: [
      { id: 'item-001', specimenType: 'blood' as const, testName: '血算（CBC）', orderCode: 'CBC' },
      { id: 'item-002', specimenType: 'blood' as const, testName: '生化学', orderCode: 'BMP' },
    ],
  },
  {
    id: 'set-002',
    name: '尿検査セット',
    description: '尿一般を含むセット',
    setType: 'hospital' as const,
    items: [
      { id: 'item-003', specimenType: 'urine' as const, testName: '尿一般', orderCode: 'UA' },
    ],
  },
];

export const Default: Story = {
  args: {
    setsData: SAMPLE_SETS,
    confirmedOrderCodes: [],
  },
};

export const Empty: Story = {
  args: {
    setsData: [],
    confirmedOrderCodes: [],
  },
};

export const WithConfirmedCodes: Story = {
  args: {
    setsData: SAMPLE_SETS,
    confirmedOrderCodes: ['CBC', 'BMP'],
  },
};
