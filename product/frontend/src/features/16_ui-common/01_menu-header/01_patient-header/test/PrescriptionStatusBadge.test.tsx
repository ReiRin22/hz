import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/PrescriptionStatusBadge.stories';

const { Electronic, Paper, Disconnected, NoClickHandler } = composeStories(stories);

describe('PrescriptionStatusBadge', () => {
  beforeEach(() => {
    Electronic.args?.onClick?.mockClear?.();
    Paper.args?.onClick?.mockClear?.();
    Disconnected.args?.onClick?.mockClear?.();
  });

  // C0: 基本レンダリング（全ステータス）
  test('Electronic: 「電子」ラベルが表示される', () => {
    render(<Electronic />);
    expect(screen.getByText('電子')).toBeInTheDocument();
  });

  test('Paper: 「紙」ラベルが表示される', () => {
    render(<Paper />);
    expect(screen.getByText('紙')).toBeInTheDocument();
  });

  test('Disconnected: 「未連携」ラベルが表示される', () => {
    render(<Disconnected />);
    expect(screen.getByText('未連携')).toBeInTheDocument();
  });

  test('NoClickHandler: クリックハンドラーなしで表示される', () => {
    render(<NoClickHandler />);
    expect(screen.getByText('電子')).toBeInTheDocument();
  });

  // C1: ステータス別のラベル分岐
  test('Electronic: title属性にステータスが含まれる', () => {
    render(<Electronic />);
    const badge = screen.getByTitle(/電子/);
    expect(badge).toBeInTheDocument();
  });

  test('Disconnected: 未連携ラベルが表示される', () => {
    render(<Disconnected />);
    expect(screen.getByTitle(/未連携/)).toBeInTheDocument();
  });

  // C2: コールバック操作
  test('Electronic: クリックで onClick が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Electronic />);
    await user.click(screen.getByText('電子'));
    expect(Electronic.args?.onClick).toHaveBeenCalledOnce();
  });

  test('Paper: クリックで onClick が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Paper />);
    await user.click(screen.getByText('紙'));
    expect(Paper.args?.onClick).toHaveBeenCalledOnce();
  });

  test('Disconnected: クリックで onClick が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Disconnected />);
    await user.click(screen.getByText('未連携'));
    expect(Disconnected.args?.onClick).toHaveBeenCalledOnce();
  });
});
