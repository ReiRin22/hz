import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_examination-input/molecules/VoiceInputIndicatorMolecule.stories';

const { LowAudioLevel, HighAudioLevel, WithTranscript } = composeStories(stories);

beforeEach(() => {
  cleanup();
  LowAudioLevel.args.onStop?.mockClear?.();
  HighAudioLevel.args.onStop?.mockClear?.();
});

describe('VoiceInputIndicatorMolecule', () => {
  // C0: 基本レンダリング
  test('LowAudioLevel: 音声入力中メッセージと停止ボタンが表示される', () => {
    render(<LowAudioLevel />);
    expect(screen.getByText('音声入力中... 話してください')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /停止/ })).toBeInTheDocument();
  });

  test('LowAudioLevel: 音声レベルが表示される', () => {
    render(<LowAudioLevel />);
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  // C1: 認識テキストの表示分岐
  test('WithTranscript: 認識中テキストが表示される', () => {
    render(<WithTranscript />);
    expect(screen.getByText('認識中:')).toBeInTheDocument();
    expect(screen.getByText(/患者は発熱と頭痛を訴えており/)).toBeInTheDocument();
  });

  test('LowAudioLevel: 認識テキストがないとき「認識中」が非表示', () => {
    render(<LowAudioLevel />);
    expect(screen.queryByText('認識中:')).not.toBeInTheDocument();
  });

  // C2: 停止コールバック
  test('停止ボタン押下で onStop が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<LowAudioLevel />);
    await user.click(screen.getByRole('button', { name: /停止/ }));
    expect(LowAudioLevel.args.onStop).toHaveBeenCalledOnce();
  });
});
