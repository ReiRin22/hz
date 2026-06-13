import type { DeptInstructionConfig } from '../types/deptInstructionConfig.type';

export const labInstructionConfig: DeptInstructionConfig = {
  deptCode: 'lab',
  title: '臨床検査科指示受け一覧',
  description: '全オーダー種を横断的に表示し、実施・確認・3点チェックを行います',
  targetOrderTypes: ['SPECIMEN_TEST', 'PHYSIOLOGICAL_TEST', 'PATHOLOGY', 'BACTERIA'],
  resultInputOrderTypes: ['SPECIMEN_TEST'],
  showExternalLabSlip: true,
  billingLinkTriggerStatuses: ['specimen_received', 'result_entered'],
  hideTitle: true,
};
