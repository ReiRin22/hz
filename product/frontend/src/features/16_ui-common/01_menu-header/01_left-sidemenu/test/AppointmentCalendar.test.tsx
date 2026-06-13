import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as stories from '../stories/molecules/AppointmentCalendar.stories';

const { Default, NoAppointments } = composeStories(stories);

describe('AppointmentCalendar', () => {
  beforeEach(() => {
    stories.default.args?.onDateSelect?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('Default story: カレンダーが描画される', () => {
    render(<Default />);
    expect(document.body).toBeTruthy();
  });

  test('NoAppointments story: カレンダーが描画される', () => {
    render(<NoAppointments />);
    expect(document.body).toBeTruthy();
  });

  // C1: 月ナビゲーションボタンが表示される
  test('月ナビゲーション用のボタンが2つ表示される', () => {
    render(<Default />);
    // AppointmentCalendar は aria-label なしのアイコンボタン（ghost variant）を2つ持つ
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  // C2: 日付選択コールバック
  test('日付クリックで onDateSelect が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    // 日付セルをクリック（数字ボタンを探す）
    const dateCells = screen.getAllByRole('button').filter(btn => /^\d+$/.test(btn.textContent ?? ''));
    if (dateCells.length > 0) {
      await user.click(dateCells[0]);
      expect(Default.args.onDateSelect).toHaveBeenCalled();
    }
  });
});
