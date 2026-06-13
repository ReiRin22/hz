import { describe, test, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';

const mockRouterPush = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush, replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/',
}));

import * as Stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_examination-input/organisms/RecordInputOrganism.stories';
import { useRecordInputStore } from '../stores/recordInput.store';

const { NewMode, EditMode, WithDraft } = composeStories(Stories);

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  useRecordInputStore.getState().reset();
});

afterAll(() => server.close());

describe('RecordInputOrganism / NewMode', () => {
  test('初期表示: ヘッダー「記録入力」と一時保存・確定ボタンが表示される', async () => {
    // Arrange
    server.use(...Stories.commonHandlers);
    render(<NewMode />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('記録入力')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /一時保存/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /確定/ })).toBeInTheDocument();
  });

  test('初期表示: 記載日フィールドが表示される', async () => {
    // Arrange
    server.use(...Stories.commonHandlers);
    render(<NewMode />);

    // Assert
    await waitFor(() => {
      expect(screen.getByLabelText('記載日')).toBeInTheDocument();
    });
  });

  test('初期表示: SOAPテキストエリアが表示される', async () => {
    // Arrange
    server.use(...Stories.commonHandlers);
    render(<NewMode />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('診察記録（SOAP形式）')).toBeInTheDocument();
    });
  });

  test('NewMode: 下書きなし初期表示で下書きドロップダウンが表示されない', async () => {
    // Arrange
    server.use(...Stories.commonHandlers);
    render(<NewMode />);

    // Wait for init to complete
    await waitFor(() => {
      expect(screen.getByText('記録入力')).toBeInTheDocument();
    });

    // Assert — hasDraft=false なのでドロップダウンなし
    expect(screen.queryByRole('button', { name: /下書き/ })).not.toBeInTheDocument();
  });
});

describe('RecordInputOrganism / WithDraft', () => {
  test('下書きAPIが下書き一覧を返す場合: ツールバーと音声ボタンが表示される', async () => {
    // Arrange — withDraftHandlers で全 API をモック
    server.use(...Stories.withDraftHandlers);
    render(<WithDraft />);

    // Assert — コンポーネントが正常に初期化されていること
    await waitFor(() => {
      expect(screen.getByText('記録入力')).toBeInTheDocument();
    }, { timeout: 3000 });
    expect(screen.getByRole('button', { name: /音声/ })).toBeInTheDocument();
  });
});

describe('RecordInputOrganism / EditMode', () => {
  test('EditMode: 記録取得後にヘッダーとボタンが表示される', async () => {
    // Arrange
    server.use(...Stories.editModeHandlers);
    render(<EditMode />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('記録入力')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /一時保存/ })).toBeInTheDocument();
  });
});
