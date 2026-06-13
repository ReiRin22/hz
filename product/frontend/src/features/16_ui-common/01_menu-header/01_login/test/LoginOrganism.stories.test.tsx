import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import * as Stories from '../stories/organisms/LoginOrganism.stories';
import { LoginOrganism } from '../components/organisms/LoginOrganism';

const mockRouterPush = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  usePathname: () => '/',
}));

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());

describe('LoginOrganism stories', () => {
  // C0: 基本レンダリング
  test('ログインフォームが表示される', () => {
    server.use(...Stories.commonHandlers);
    render(<LoginOrganism />);
    expect(screen.getByPlaceholderText('ユーザーID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
  });

  // C0: フッター表示
  test('「パスワードをお忘れの方はこちら」リンクが表示される', () => {
    server.use(...Stories.commonHandlers);
    render(<LoginOrganism />);
    expect(screen.getByText('パスワードをお忘れの方はこちら')).toBeInTheDocument();
  });

  // C1: API エラー時のエラー表示分岐
  test('ログイン失敗時にエラーメッセージが表示される', async () => {
    server.use(...Stories.loginErrorHandlers);

    const user = userEvent.setup();
    render(<LoginOrganism />);

    await user.type(screen.getByPlaceholderText('ユーザーID'), 'wronguser');
    await user.type(screen.getByPlaceholderText('パスワード'), 'wrongpass');
    await user.click(screen.getByRole('button', { name: 'ログイン' }));

    await waitFor(
      () => expect(screen.getByText('ユーザーIDまたはパスワードが正しくありません。')).toBeInTheDocument(),
      { timeout: 3000 }
    );
  });
});
