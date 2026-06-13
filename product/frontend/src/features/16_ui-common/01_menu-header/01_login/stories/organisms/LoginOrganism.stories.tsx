import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { LoginOrganism } from '../../components/organisms/LoginOrganism';

const BASE_URL = 'http://localhost:3001/bff';

export const commonHandlers = [
  http.post(`${BASE_URL}/auth/login`, () =>
    HttpResponse.json({ userId: 'demo', userName: 'デモユーザー', role: 'doctor', token: 'mock-token' })
  ),
];

export const loginErrorHandlers = [
  http.post(`${BASE_URL}/auth/login`, () =>
    HttpResponse.json({ errorCode: 'E004', message: 'ユーザーIDまたはパスワードが正しくありません。' }, { status: 401 })
  ),
];

const meta = {
  title: '16_ui-common/01_menu-header/01_login/organisms/LoginOrganism',
  component: LoginOrganism,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: commonHandlers },
  },
} satisfies Meta<typeof LoginOrganism>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LoginError: Story = {
  parameters: {
    msw: { handlers: loginErrorHandlers },
  },
};
