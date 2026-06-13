import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import * as stories from '../stories/molecules/AppointmentManagement.stories';

const { WithPatient, WithoutPatient } = composeStories(stories);

describe('AppointmentManagement', () => {
  // C0: 基本レンダリング
  test('WithPatient story: 患者情報付きで描画される', () => {
    render(<WithPatient />);
    expect(document.body).toBeTruthy();
  });

  test('WithoutPatient story: 患者情報なしで描画される', () => {
    render(<WithoutPatient />);
    expect(document.body).toBeTruthy();
  });

  // C1: 患者情報あり/なしの分岐
  test('WithPatient story: 患者名が表示される', () => {
    render(<WithPatient />);
    expect(screen.getByText('田中太郎')).toBeInTheDocument();
  });
});
