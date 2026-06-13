import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import * as stories from '../stories/organisms/ReceptionPatientListOrganism.stories';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const { WithData, Empty, FetchError } = composeStories(stories);

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());

describe('ReceptionPatientListOrganism / WithData', () => {
  test('データ取得成功: 患者行が表示される', async () => {
    server.use(...stories.commonHandlers);
    render(<WithData />);

    await waitFor(() => {
      expect(screen.getByText('山田 太郎')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('ローディング中: role=status が表示される', () => {
    server.use(...stories.commonHandlers);
    render(<WithData />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

describe('ReceptionPatientListOrganism / Empty', () => {
  test('データ0件: 患者行が表示されない', async () => {
    server.use(...stories.emptyHandlers);
    render(<Empty />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.queryByText('山田 太郎')).not.toBeInTheDocument();
  });
});

describe('ReceptionPatientListOrganism / FetchError', () => {
  test('API失敗: role=alert でエラーメッセージが表示される', async () => {
    server.use(...stories.fetchErrorHandlers);
    render(<FetchError />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByRole('alert')).toHaveTextContent(
      '受診者一覧の取得に失敗しました。再読み込みしてください。',
    );
  });
});
