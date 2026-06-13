import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_examination-input/molecules/RecordDateInputMolecule.stories';

const { Default, Disabled } = composeStories(stories);

beforeEach(() => {
  cleanup();
  Default.args.onChange?.mockClear?.();
});

describe('RecordDateInputMolecule', () => {
  // C0: 基本レンダリング
  test('Default: 記載日ラベルと日付入力が表示される', () => {
    render(<Default />);
    expect(screen.getByLabelText('記載日')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-05-12')).toBeInTheDocument();
  });

  // C1: disabled 分岐
  test('Disabled: 日付入力が無効になる', () => {
    render(<Disabled />);
    expect(screen.getByLabelText('記載日')).toBeDisabled();
  });

  test('Default: 日付入力が有効', () => {
    render(<Default />);
    expect(screen.getByLabelText('記載日')).toBeEnabled();
  });

  // C2: 入力変更コールバック（fireEvent で date input を変更）
  test('日付変更で onChange が呼ばれる', async () => {
    const { fireEvent } = await import('@testing-library/react');
    render(<Default />);
    const input = screen.getByLabelText('記載日');
    fireEvent.change(input, { target: { value: '2026-06-01' } });
    expect(Default.args.onChange).toHaveBeenCalled();
  });
});
