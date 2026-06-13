import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as stories from '../stories/molecules/PatientInfoPanel.stories';

const { BasicInfo, AllergyInfo, PregnancyHistory } = composeStories(stories);

describe('PatientInfoPanel', () => {
  beforeEach(() => {
    stories.default.args?.onCategoryChange?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('BasicInfo story: 基本情報カテゴリが表示される', () => {
    render(<BasicInfo />);
    expect(screen.getByText('基本情報')).toBeInTheDocument();
  });

  test('AllergyInfo story: アレルギーカテゴリが表示される', () => {
    render(<AllergyInfo />);
    expect(screen.getByText('アレルギー')).toBeInTheDocument();
  });

  test('PregnancyHistory story: 妊娠・出産歴カテゴリが表示される', () => {
    render(<PregnancyHistory />);
    expect(screen.getByText('妊娠・出産歴')).toBeInTheDocument();
  });

  // C1: カテゴリ一覧の表示
  test('全カテゴリナビゲーションが表示される', () => {
    render(<BasicInfo />);
    expect(screen.getByText('既往歴・家族歴')).toBeInTheDocument();
    expect(screen.getByText('感染症')).toBeInTheDocument();
  });

  // C2: コールバック操作（カテゴリ切り替え）
  // PatientInfoPanelのカテゴリ項目は div[onClick] で実装（button role なし）
  test('アレルギーカテゴリクリックで onCategoryChange が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<BasicInfo />);
    const allergyText = screen.getByText('アレルギー');
    await user.click(allergyText);
    expect(BasicInfo.args.onCategoryChange).toHaveBeenCalledWith('allergy');
  });

  test('感染症カテゴリクリックで onCategoryChange が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<BasicInfo />);
    const infectionText = screen.getByText('感染症');
    await user.click(infectionText);
    expect(BasicInfo.args.onCategoryChange).toHaveBeenCalledWith('infection');
  });
});
