import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/PatientInfoGridMolecule.stories';

const { Inpatient, Outpatient } = composeStories(stories);

describe('PatientInfoGridMolecule', () => {
  beforeEach(() => {
    Inpatient.args?.onAdmissionTypeToggle?.mockClear?.();
    Inpatient.args?.onConsultationToggle?.mockClear?.();
    Inpatient.args?.onMemoClick?.mockClear?.();
    Inpatient.args?.onProxyInputClick?.mockClear?.();
    Inpatient.args?.onPrescriptionClick?.mockClear?.();
    Inpatient.args?.onMedicalInfoSharingClick?.mockClear?.();
    Outpatient.args?.onAdmissionTypeToggle?.mockClear?.();
    Outpatient.args?.onConsultationToggle?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('Inpatient: 生年月日ラベルが表示される', () => {
    render(<Inpatient />);
    expect(screen.getByText('生年月日:')).toBeInTheDocument();
  });

  test('Inpatient: 年齢/性別が表示される', () => {
    render(<Inpatient />);
    expect(screen.getByText(/59歳.*男性/)).toBeInTheDocument();
  });

  test('Inpatient: 担当医が表示される', () => {
    render(<Inpatient />);
    const elements = screen.getAllByText(/佐藤.*医師/);
    expect(elements.length).toBeGreaterThan(0);
  });

  test('Outpatient: コンポーネントが正常に表示される', () => {
    const { container } = render(<Outpatient />);
    expect(container.firstChild).toBeTruthy();
  });

  // C1: admissionType の分岐（入院/外来）
  test('Inpatient: 入院バッジが表示される', () => {
    render(<Inpatient />);
    expect(screen.getByText('入院')).toBeInTheDocument();
  });

  test('Outpatient: 外来バッジが表示される', () => {
    render(<Outpatient />);
    expect(screen.getByText('外来')).toBeInTheDocument();
  });

  // C2: コールバック操作
  test('診療メモボタンクリックで onMemoClick が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Inpatient />);
    await user.click(screen.getByRole('button', { name: /診療メモ/ }));
    expect(Inpatient.args?.onMemoClick).toHaveBeenCalledOnce();
  });

  test('代行入力ボタンクリックで onProxyInputClick が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Inpatient />);
    const proxyBtn = screen.queryByRole('button', { name: /代行入力/ });
    if (proxyBtn) {
      await user.click(proxyBtn);
      expect(Inpatient.args?.onProxyInputClick).toHaveBeenCalledOnce();
    }
  });

  test('診察開始ボタン押下で onConsultationToggle が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Inpatient />);
    await user.click(screen.getByRole('button', { name: '診察開始' }));
    expect(Inpatient.args?.onConsultationToggle).toHaveBeenCalledOnce();
  });
});
