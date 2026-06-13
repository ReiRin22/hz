import type { Meta, StoryObj } from '@storybook/react';
import { DoctorBadges } from '../../components/molecules/DoctorBadges';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };
const blackTheme = { name: 'ブラック', value: 'black', primary: '#9CA3AF', secondary: '#0D0D0D' };

const mockDoctorSummary = [
  { doctorId: 1, doctorName: '田中 一郎', unapprovedCount: 5 },
  { doctorId: 2, doctorName: '鈴木 美香', unapprovedCount: 2 },
  { doctorId: 3, doctorName: '佐藤 健二', unapprovedCount: 0 },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/molecules/DoctorBadges',
  component: DoctorBadges,
  tags: ['autodocs'],
} satisfies Meta<typeof DoctorBadges>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { doctorSummary: mockDoctorSummary, theme: blueTheme },
};

export const WithUnapproved: Story = {
  args: {
    doctorSummary: [
      { doctorId: 1, doctorName: '田中 一郎', unapprovedCount: 3 },
      { doctorId: 2, doctorName: '鈴木 美香', unapprovedCount: 1 },
      { doctorId: 3, doctorName: '佐藤 健二', unapprovedCount: 0 },
    ],
    theme: blueTheme,
  },
};

export const AllApproved: Story = {
  args: {
    doctorSummary: mockDoctorSummary.map((d) => ({ ...d, unapprovedCount: 0 })),
    theme: blueTheme,
  },
};

export const AllZero: Story = {
  args: {
    doctorSummary: mockDoctorSummary.map((d) => ({ ...d, unapprovedCount: 0 })),
    theme: blueTheme,
  },
};

export const BlackTheme: Story = {
  args: { doctorSummary: mockDoctorSummary, theme: blackTheme },
};
