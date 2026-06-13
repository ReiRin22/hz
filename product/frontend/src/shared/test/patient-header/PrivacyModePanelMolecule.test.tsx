import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../../../../test/stories/shared/patient-header/molecules/PrivacyModePanelMolecule.stories';

const { Default, ConsultationStarted } = composeStories(stories);

describe('PrivacyModePanelMolecule', () => {
  beforeEach(() => {
    Default.args?.onConsultationToggle?.mockClear?.();
    Default.args?.onPrescriptionClick?.mockClear?.();
    Default.args?.onMedicalInfoSharingClick?.mockClear?.();
    ConsultationStarted.args?.onConsultationToggle?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('Default: プライバシー保護の見出しが表示される', () => {
    render(<Default />);
    expect(screen.getByText('個人情報保護措置')).toBeInTheDocument();
  });

  test('Default: 説明テキストが表示される', () => {
    render(<Default />);
    expect(screen.getByText('すべての個人情報が非表示になっています')).toBeInTheDocument();
  });

  test('Default: 診察開始ボタンが表示される', () => {
    render(<Default />);
    expect(screen.getByRole('button', { name: '診察開始' })).toBeInTheDocument();
  });

  // C1: isConsultationStarted の分岐
  test('ConsultationStarted: 診察終了ボタンが表示される', () => {
    render(<ConsultationStarted />);
    expect(screen.getByRole('button', { name: '診察終了' })).toBeInTheDocument();
  });

  test('Default: 診察中バッジが非表示', () => {
    render(<Default />);
    expect(screen.queryByText('診察中')).not.toBeInTheDocument();
  });

  // C2: コールバック操作
  test('診察開始ボタン押下で onConsultationToggle が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByRole('button', { name: '診察開始' }));
    expect(Default.args?.onConsultationToggle).toHaveBeenCalledOnce();
  });
});
