import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { DeptInstructionScreen } from '../../components/organisms/DeptInstructionScreen';
import { useDeptInstructionStore } from '../../stores/useDeptInstructionStore';
import type { DeptInstructionConfig } from '../../types/deptInstructionConfig.type';
import {
  deptInstructionSuccessHandlers,
  deptInstructionFetchErrorHandlers,
  deptInstructionStatusUpdateErrorHandlers,
} from '../../test/msw/handlers';

const labInstructionConfig: DeptInstructionConfig = {
  deptCode: 'lab',
  title: '臨床検査科指示受け一覧',
  description: '全オーダー種を横断的に表示し、実施・確認・3点チェックを行います',
  targetOrderTypes: ['SPECIMEN_TEST', 'PHYSIOLOGICAL_TEST', 'PATHOLOGY', 'BACTERIA'],
  resultInputOrderTypes: ['SPECIMEN_TEST'],
  showExternalLabSlip: true,
  billingLinkTriggerStatuses: ['specimen_received', 'result_entered'],
  hideTitle: false,
};

const meta = {
  title: '09_dept-instruction/01_dept-instruction/02_lab-instruction/organisms/DeptInstructionScreen',
  component: DeptInstructionScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: deptInstructionSuccessHandlers },
  },
  args: {
    config: labInstructionConfig,
    onStatusUpdated: fn(),
  },
} satisfies Meta<typeof DeptInstructionScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ApiError: Story = {
  decorators: [
    (Story) => {
      useDeptInstructionStore.getState().reset();
      return <Story />;
    },
  ],
  parameters: {
    msw: { handlers: deptInstructionFetchErrorHandlers },
  },
};

export const StatusUpdateError: Story = {
  decorators: [
    (Story) => {
      useDeptInstructionStore.getState().reset();
      return <Story />;
    },
  ],
  parameters: {
    msw: { handlers: deptInstructionStatusUpdateErrorHandlers },
  },
};
