import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_examination-input/molecules/DraftDropdownMolecule.stories';

const { Closed, Open, SingleDraft } = composeStories(stories);

beforeEach(() => {
  cleanup();
  Closed.args.onOpenChange?.mockClear?.();
  Closed.args.onApplyDraft?.mockClear?.();
  Closed.args.onDeleteDraft?.mockClear?.();
  Open.args.onApplyDraft?.mockClear?.();
  Open.args.onDeleteDraft?.mockClear?.();
});

describe('DraftDropdownMolecule', () => {
  // C0: 基本レンダリング
  test('Closed: 下書きボタンが表示される', () => {
    render(<Closed />);
    expect(screen.getByRole('button', { name: /下書き/ })).toBeInTheDocument();
  });

  test('Open: 「保存された下書き」テキストが表示される', () => {
    render(<Open />);
    expect(screen.getByText('保存された下書き')).toBeInTheDocument();
  });

  test('Open: 下書き内容のプレビューが表示される', () => {
    render(<Open />);
    expect(screen.getByText(/患者は頭痛と発熱/)).toBeInTheDocument();
  });

  // C2: コールバック
  test('下書きトリガーボタン押下で onOpenChange が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Closed />);
    await user.click(screen.getByRole('button', { name: /下書き/ }));
    expect(Closed.args.onOpenChange).toHaveBeenCalled();
  });
});
