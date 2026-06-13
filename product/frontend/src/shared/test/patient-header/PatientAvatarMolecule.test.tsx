import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../../../../test/stories/shared/patient-header/molecules/PatientAvatarMolecule.stories';

const { Male, Female, PrivacyMode } = composeStories(stories);

describe('PatientAvatarMolecule', () => {
  beforeEach(() => {
    Male.args?.onPrivacyToggle?.mockClear?.();
    Male.args?.onPatientIdClick?.mockClear?.();
    Female.args?.onPrivacyToggle?.mockClear?.();
    Female.args?.onPatientIdClick?.mockClear?.();
    PrivacyMode.args?.onPrivacyToggle?.mockClear?.();
    PrivacyMode.args?.onPatientIdClick?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('Male: 患者名が表示される', () => {
    render(<Male />);
    expect(screen.getByText('山田 太郎')).toBeInTheDocument();
  });

  test('Female: 患者名が表示される', () => {
    render(<Female />);
    expect(screen.getByText('鈴木 花子')).toBeInTheDocument();
  });

  test('Male: 患者IDが表示される', () => {
    render(<Male />);
    // "ID: P001234" はスパン分割されるため getAllByText または getAllByText で照合
    expect(screen.getByText(/P001234/)).toBeInTheDocument();
  });

  // C1: プライバシーモード分岐
  test('PrivacyMode: プライバシーモード時は患者IDがマスクされる', () => {
    render(<PrivacyMode />);
    // プライバシーモードでは名前またはIDが非表示になることを確認
    expect(screen.queryByText('山田 太郎')).not.toBeInTheDocument();
  });

  test('Male (非プライバシー): 患者名が表示される', () => {
    render(<Male />);
    expect(screen.getByText('山田 太郎')).toBeInTheDocument();
  });

  // C2: コールバック操作
  test('患者ID クリックで onPatientIdClick が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Male />);
    const patientIdBtn = screen.getByText(/P001234/);
    await user.click(patientIdBtn);
    expect(Male.args?.onPatientIdClick).toHaveBeenCalledOnce();
  });
});
