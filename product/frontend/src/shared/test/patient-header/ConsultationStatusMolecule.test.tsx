import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../../../../test/stories/shared/patient-header/molecules/ConsultationStatusMolecule.stories';

const { Waiting, InProgress, Completed, Postponed, Cancelled } = composeStories(stories);

describe('ConsultationStatusMolecule', () => {
  beforeEach(() => {
    stories.default.args?.onConsultationToggle?.mockClear?.();
  });

  // C0: 全ストーリーのレンダリング確認
  test('Waiting: 診察開始ボタンが表示される', () => {
    render(<Waiting />);
    expect(screen.getByRole('button', { name: '診察開始' })).toBeInTheDocument();
  });

  test('InProgress: 診察終了ボタンが表示される', () => {
    render(<InProgress />);
    expect(screen.getByRole('button', { name: '診察終了' })).toBeInTheDocument();
  });

  test('Completed: 診察開始ボタンが表示される', () => {
    render(<Completed />);
    expect(screen.getByRole('button', { name: '診察開始' })).toBeInTheDocument();
  });

  test('Postponed: 診察開始ボタンが表示される', () => {
    render(<Postponed />);
    expect(screen.getByRole('button', { name: '診察開始' })).toBeInTheDocument();
  });

  test('Cancelled: 診察開始ボタンが表示される', () => {
    render(<Cancelled />);
    expect(screen.getByRole('button', { name: '診察開始' })).toBeInTheDocument();
  });

  // C1: isConsultationStarted の分岐
  test('InProgress: 診察中バッジが表示される (isConsultationStarted=true)', () => {
    render(<InProgress />);
    expect(screen.getByText('診察中')).toBeInTheDocument();
  });

  test('Waiting: 診察中バッジが表示されない (isConsultationStarted=false)', () => {
    render(<Waiting />);
    expect(screen.queryByText('診察中')).not.toBeInTheDocument();
  });

  // C2: コールバック操作
  test('診察開始ボタン押下で onConsultationToggle が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Waiting />);
    await user.click(screen.getByRole('button', { name: '診察開始' }));
    expect(Waiting.args?.onConsultationToggle).toHaveBeenCalledOnce();
  });

  test('診察終了ボタン押下で onConsultationToggle が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<InProgress />);
    await user.click(screen.getByRole('button', { name: '診察終了' }));
    expect(InProgress.args?.onConsultationToggle).toHaveBeenCalledOnce();
  });
});
