import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { describe, expect, test, vi } from 'vitest';
import * as stories from '../stories/molecules/PrintDialog.stories';

const { LabelPrint, DocumentIssue, NoDocumentTypes } = composeStories(stories);

describe('PrintDialog / LabelPrint', () => {
  // C0: 基本レンダリング
  test('ラベル印刷ダイアログが表示される', () => {
    render(<LabelPrint />);
    expect(screen.getByRole('heading', { name: /ラベル印刷/ })).toBeInTheDocument();
  });

  test('選択件数が表示される', () => {
    render(<LabelPrint />);
    expect(screen.getByText(/2件のオーダが選択されています/)).toBeInTheDocument();
  });

  // C1: type=label 分岐
  test('ラベル選択肢が表示される', () => {
    render(<LabelPrint />);
    expect(screen.getByText('検体ラベル')).toBeInTheDocument();
    expect(screen.getByText('スピッツラベル')).toBeInTheDocument();
  });

  // C2: 印刷ボタンは何も選択されていないと無効
  test('初期状態では印刷ボタンが無効', () => {
    render(<LabelPrint />);
    const printButtons = screen.getAllByRole('button');
    const printButton = printButtons.find((btn) => btn.textContent?.includes('ラベル印刷'));
    expect(printButton).toBeDisabled();
  });
});

describe('PrintDialog / DocumentIssue', () => {
  // C1: type=document かつ 処方オーダ 分岐
  test('帳票発行ダイアログが表示される', () => {
    render(<DocumentIssue />);
    expect(screen.getByRole('heading', { name: /帳票発行/ })).toBeInTheDocument();
  });

  test('処方箋（院外）が表示される', () => {
    render(<DocumentIssue />);
    expect(screen.getByText('処方箋（院外）')).toBeInTheDocument();
  });
});

describe('PrintDialog / NoDocumentTypes', () => {
  // C1: 発行可能な帳票なし分岐
  test('帳票なし時にメッセージが表示される', () => {
    render(<NoDocumentTypes />);
    expect(
      screen.getByText('選択されたオーダ種では発行可能な帳票がありません'),
    ).toBeInTheDocument();
  });
});
