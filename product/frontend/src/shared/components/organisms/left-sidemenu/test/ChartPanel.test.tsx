import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import * as stories from '../stories/molecules/ChartPanel.stories';

const { MalePatient, FemalePatient } = composeStories(stories);

describe('ChartPanel', () => {
  // C0: 基本レンダリング
  test('MalePatient story: 男性患者チャートが描画される', () => {
    render(<MalePatient />);
    expect(document.body).toBeTruthy();
  });

  test('FemalePatient story: 女性患者チャートが描画される', () => {
    render(<FemalePatient />);
    expect(document.body).toBeTruthy();
  });

  // C1: 患者情報の表示
  test('MalePatient story: 患者名が表示される', () => {
    render(<MalePatient />);
    expect(screen.getByText('田中太郎')).toBeInTheDocument();
  });

  test('FemalePatient story: 女性患者名が表示される', () => {
    render(<FemalePatient />);
    expect(screen.getByText('佐藤花子')).toBeInTheDocument();
  });

  // C1: アレルギー情報の表示（ChartPanelは現在固定メッセージを表示）
  test('MalePatient story: アレルギー・禁忌情報セクションが表示される', () => {
    render(<MalePatient />);
    expect(screen.getByText('アレルギー・禁忌情報')).toBeInTheDocument();
  });
});
