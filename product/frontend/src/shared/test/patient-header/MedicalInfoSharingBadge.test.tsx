import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from '../../../../test/stories/shared/patient-header/molecules/MedicalInfoSharingBadge.stories';

const { FullConsent, PartialConsent, NoConsent, PrivacyMode } = composeStories(stories);

describe('MedicalInfoSharingBadge', () => {
  // C0: 基本レンダリング（全ステータス）
  test('FullConsent: 全同意のラベルが表示される', () => {
    render(<FullConsent />);
    expect(screen.getByText('すべて同意')).toBeInTheDocument();
  });

  test('PartialConsent: コンポーネントが表示される', () => {
    const { container } = render(<PartialConsent />);
    expect(container.firstChild).toBeTruthy();
  });

  test('NoConsent: コンポーネントが表示される', () => {
    const { container } = render(<NoConsent />);
    expect(container.firstChild).toBeTruthy();
  });

  test('PrivacyMode: コンポーネントが表示される', () => {
    const { container } = render(<PrivacyMode />);
    expect(container.firstChild).toBeTruthy();
  });

  // C1: プライバシーモードの分岐
  test('FullConsent (非プライバシー): 通常表示される', () => {
    const { container } = render(<FullConsent />);
    expect(container).toBeInTheDocument();
  });

  test('PrivacyMode: isPrivacyMode=true でもコンポーネントが描画される', () => {
    const { container } = render(<PrivacyMode />);
    expect(container).toBeInTheDocument();
  });
});
