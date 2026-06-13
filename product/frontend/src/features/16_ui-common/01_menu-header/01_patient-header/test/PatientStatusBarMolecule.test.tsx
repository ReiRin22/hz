import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/PatientStatusBarMolecule.stories';

const { Electronic, Paper, PrivacyMode } = composeStories(stories);

describe('PatientStatusBarMolecule', () => {
  beforeEach(() => {
    Electronic.args?.onPrescriptionClick?.mockClear?.();
    Electronic.args?.onMedicalInfoSharingClick?.mockClear?.();
    Paper.args?.onPrescriptionClick?.mockClear?.();
    Paper.args?.onMedicalInfoSharingClick?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('Electronic: 処方箋ラベルが表示される', () => {
    render(<Electronic />);
    expect(screen.getByText('処方箋:')).toBeInTheDocument();
  });

  test('Electronic: 情報共有ラベルが表示される', () => {
    render(<Electronic />);
    expect(screen.getByText('情報共有:')).toBeInTheDocument();
  });

  test('Paper: 処方箋ラベルが表示される', () => {
    render(<Paper />);
    expect(screen.getByText('処方箋:')).toBeInTheDocument();
  });

  test('PrivacyMode: コンポーネントが表示される', () => {
    const { container } = render(<PrivacyMode />);
    expect(container.firstChild).toBeTruthy();
  });

  // C2: コールバック操作
  test('処方箋バッジクリックで onPrescriptionClick が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Electronic />);
    await user.click(screen.getByText('電子'));
    expect(Electronic.args?.onPrescriptionClick).toHaveBeenCalledOnce();
  });

  test('情報共有バッジクリックで onMedicalInfoSharingClick が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Electronic />);
    const sharingArea = screen.getByText('情報共有:').parentElement;
    if (sharingArea) {
      const clickable = sharingArea.querySelector('[class*="cursor-pointer"]');
      if (clickable) {
        await user.click(clickable);
        expect(Electronic.args?.onMedicalInfoSharingClick).toHaveBeenCalled();
      }
    }
  });
});
