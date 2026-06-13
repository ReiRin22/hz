import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_examination-input/molecules/RecordToolbarMolecule.stories';

const { Default, VoiceActive, Disabled } = composeStories(stories);

beforeEach(() => {
  cleanup();
  Default.args.onToggleVoice?.mockClear?.();
  Default.args.onOpenComment?.mockClear?.();
  Default.args.onToggleTemplates?.mockClear?.();
  Default.args.onApplyTemplate?.mockClear?.();
  Default.args.onOpenSchema?.mockClear?.();
  VoiceActive.args.onToggleVoice?.mockClear?.();
});

describe('RecordToolbarMolecule', () => {
  // C0: 基本レンダリング
  test('Default: 音声・コメント・テンプレート・シェーマボタンが表示される', () => {
    render(<Default />);
    expect(screen.getByRole('button', { name: /音声/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /コメント/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /テンプレート/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /シェーマ/ })).toBeInTheDocument();
  });

  // C1: isEditable=false のとき全ボタンが無効
  test('Disabled: 全ボタンが無効になる', () => {
    render(<Disabled />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  // C1: VoiceActive のとき停止ボタンに変わる
  test('VoiceActive: 停止ボタンが表示される', () => {
    render(<VoiceActive />);
    expect(screen.getByRole('button', { name: /停止/ })).toBeInTheDocument();
  });

  // C2: 全コールバック操作
  test('音声ボタン押下で onToggleVoice が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByRole('button', { name: /音声/ }));
    expect(Default.args.onToggleVoice).toHaveBeenCalledOnce();
  });

  test('コメントボタン押下で onOpenComment が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByRole('button', { name: /コメント/ }));
    expect(Default.args.onOpenComment).toHaveBeenCalledOnce();
  });

  test('シェーマボタン押下で onOpenSchema が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByRole('button', { name: /シェーマ/ }));
    expect(Default.args.onOpenSchema).toHaveBeenCalledOnce();
  });

  test('テンプレートボタン押下で onToggleTemplates が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByRole('button', { name: /テンプレート/ }));
    expect(Default.args.onToggleTemplates).toHaveBeenCalled();
  });

  test('VoiceActive: 停止ボタン押下で onToggleVoice が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<VoiceActive />);
    await user.click(screen.getByRole('button', { name: /停止/ }));
    expect(VoiceActive.args.onToggleVoice).toHaveBeenCalledOnce();
  });
});
