import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_schema-creation/molecules/ToolbarPanel.stories';

const { Default } = composeStories(stories);

beforeEach(() => {
  cleanup();
  Default.args.onUndo?.mockClear?.();
  Default.args.onRedo?.mockClear?.();
  Default.args.onClear?.mockClear?.();
  Default.args.onFlip?.mockClear?.();
});

describe('ToolbarPanel', () => {
  // C0: 基本レンダリング
  test('Default: Undo・Redo・クリア・反転ボタンが存在する', () => {
    render(<Default />);
    expect(screen.getByTitle('元に戻す')).toBeInTheDocument();
    expect(screen.getByTitle('やり直し')).toBeInTheDocument();
    expect(screen.getByText('クリア')).toBeInTheDocument();
    expect(screen.getByTitle('水平反転')).toBeInTheDocument();
  });

  // C2: コールバック操作
  test('Undo ボタン押下で onUndo が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByTitle('元に戻す'));
    expect(Default.args.onUndo).toHaveBeenCalledOnce();
  });

  test('Redo ボタン押下で onRedo が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByTitle('やり直し'));
    expect(Default.args.onRedo).toHaveBeenCalledOnce();
  });

  test('クリアボタン押下で onClear が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByText('クリア'));
    expect(Default.args.onClear).toHaveBeenCalledOnce();
  });

  test('反転ボタン押下で onFlip が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByTitle('水平反転'));
    expect(Default.args.onFlip).toHaveBeenCalledOnce();
  });
});
