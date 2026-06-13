import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import DEP002Page from '@/features/09_dept-instruction/01_dept-instruction/02_lab-instruction';
import { useDeptInstructionStore } from '../stores/useDeptInstructionStore';
import {
  deptInstructionSuccessHandlers,
  deptInstructionFetchErrorHandlers,
  deptInstructionStatusUpdateErrorHandlers,
} from '../test/msw/handlers';

const meta = {
  title: '09_dept-instruction/01_dept-instruction/02_lab-instruction/DEP002',
  component: DEP002Page,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: deptInstructionSuccessHandlers },
  },
  args: {
    onStatusUpdated: fn(),
  },
} satisfies Meta<typeof DEP002Page>;
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
