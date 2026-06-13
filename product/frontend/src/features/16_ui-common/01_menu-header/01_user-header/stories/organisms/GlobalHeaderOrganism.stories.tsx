import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { GlobalHeaderOrganism } from '../../components/organisms/GlobalHeaderOrganism';
import type { GetCurrentUserResponse } from '@/../front_bff_shared/features/current-user/types/response/current-user.api.response';
import type { GetPatientHeaderResponse } from '@/../front_bff_shared/features/karte/patientHeader/types/response/patient-header.api.response';

const BASE = '/api';

const mockPatientHeaderResponse: GetPatientHeaderResponse = {
  patientHeader: {
    patientId: 'P001',
    name: '山田 花子',
    nameKana: 'ヤマダ ハナコ',
    birthDate: '1960-04-15',
    age: 65,
    gender: 'female',
    ward: '3病棟',
    room: '305号室',
    department: '内科',
    doctor: '田中 一郎',
    proxyDoctor: null,
    admissionType: 'inpatient',
    consultationStatus: 'in-progress',
    prescriptionStatus: 'electronic',
    medicalInfoSharing: { status: 'full-consent' },
    insurance: { type: '社保', burden: '3割' },
    allergies: [],
    infections: [],
  },
};

const mockCurrentUserResponse: GetCurrentUserResponse = {
  currentUser: {
    id: 'D0001',
    name: '田中 一郎',
    role: '医師',
    department: '内科',
    loginTime: '08:30',
  },
  userAlerts: [
    {
      id: 'alert-1',
      type: 'warning',
      title: '期限超過タスクあり',
      message: '本日期限のタスクが3件あります。',
      priority: 'high',
      timestamp: '2026-05-14T09:00:00',
      dismissed: false,
      userId: 'D0001',
    },
    {
      id: 'alert-2',
      type: 'system',
      title: 'システムメンテナンス予定',
      message: '2026/05/20 02:00〜04:00 にメンテナンスを実施します。',
      priority: 'medium',
      timestamp: '2026-05-13T18:00:00',
      dismissed: false,
      userId: 'D0001',
    },
  ],
  proxyApprovalCount: 0,
  hpkiRemainingTime: '48:00',
};

export const commonHandlers = [
  http.get(`${BASE}/current-user`, () => HttpResponse.json(mockCurrentUserResponse)),
  http.patch(`${BASE}/user-alerts/:alertId/dismiss`, () => new HttpResponse(null, { status: 204 })),
  // PatientHeaderOrganism (ETC003) が内包されているため患者ヘッダーAPIもモック
  http.get('/api/patients/:patientId/header', () =>
    HttpResponse.json(mockPatientHeaderResponse)
  ),
];

export const errorHandlers = [
  http.get(`${BASE}/current-user`, () =>
    HttpResponse.json({ message: 'ユーザー情報の取得に失敗しました' }, { status: 500 })
  ),
  http.get('/api/patients/:patientId/header', () =>
    HttpResponse.json(mockPatientHeaderResponse)
  ),
];

const meta = {
  title: '16_ui-common/01_menu-header/01_user-header/organisms/GlobalHeaderOrganism',
  component: GlobalHeaderOrganism,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: commonHandlers },
  },
} satisfies Meta<typeof GlobalHeaderOrganism>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FetchError: Story = {
  parameters: {
    msw: { handlers: errorHandlers },
  },
};
