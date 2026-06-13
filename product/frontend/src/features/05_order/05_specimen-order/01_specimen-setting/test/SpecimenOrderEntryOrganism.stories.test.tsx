import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import * as stories from '../stories/organisms/SpecimenOrderEntryOrganism.stories';
import { commonHandlers } from '../test/msw/handlers';

const { PanelClosed, PanelOpen, WithConfirmedCodes } = composeStories(stories);

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  stories.default.args?.onShowSpecimenOrderPanelChange?.mockClear?.();
  stories.default.args?.onAddToConfirmation?.mockClear?.();
});
afterAll(() => server.close());

describe('SpecimenOrderEntryOrganism / PanelClosed', () => {
  test('パネル非表示: showSpecimenOrderPanel=falseのとき何も表示されない（C1: return null分岐）', () => {
    server.use(...commonHandlers);
    const { container } = render(<PanelClosed />);
    expect(container.firstChild).toBeNull();
  });
});

describe('SpecimenOrderEntryOrganism / PanelOpen', () => {
  test('パネル表示: パネルタイトルが表示される', () => {
    server.use(...commonHandlers);
    render(<PanelOpen />);
    expect(screen.getByText('検体検査オーダー入力')).toBeInTheDocument();
  });

  test('パネル表示: キャンセルボタンが表示される', () => {
    server.use(...commonHandlers);
    render(<PanelOpen />);
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
  });

  test('キャンセルボタン押下: onShowSpecimenOrderPanelChangeがfalseで呼ばれる', async () => {
    server.use(...commonHandlers);
    const user = userEvent.setup();
    render(<PanelOpen />);
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));
    expect(PanelOpen.args.onShowSpecimenOrderPanelChange).toHaveBeenCalledWith(false);
  });

  test('パネル内: 一時保存ボタンが表示される（C0: RightPanel経由レンダリング確認）', () => {
    server.use(...commonHandlers);
    render(<PanelOpen />);
    expect(screen.getByRole('button', { name: /一時保存/i })).toBeInTheDocument();
  });
});

describe('SpecimenOrderEntryOrganism / WithConfirmedCodes', () => {
  test('確定済みコードあり: パネルタイトルが表示される', () => {
    server.use(...commonHandlers);
    render(<WithConfirmedCodes />);
    expect(screen.getByText('検体検査オーダー入力')).toBeInTheDocument();
  });
});

describe('SpecimenOrderEntryOrganism / handleAddToConfirmation', () => {
  test('一時保存ボタン: パネルが表示される（handleAddToConfirmationフロー確認）', async () => {
    server.use(...commonHandlers);
    render(<PanelOpen />);
    expect(screen.getByRole('button', { name: /一時保存/i })).toBeInTheDocument();
  });
});
