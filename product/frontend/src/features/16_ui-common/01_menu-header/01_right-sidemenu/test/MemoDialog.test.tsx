import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoDialog } from '../components/molecules/MemoDialog';
import { useRightSideMenuStore } from '../stores/use-right-side-menu.store';

beforeEach(() => {
  useRightSideMenuStore.getState().reset();
});

describe('MemoDialog - 一覧表示', () => {
  it('伝言メモのタイトルが表示される', () => {
    render(<MemoDialog onClose={vi.fn()} />);
    expect(screen.getByText('伝言メモ')).toBeInTheDocument();
  });

  it('受信タブが初期選択されている', () => {
    render(<MemoDialog onClose={vi.fn()} />);
    expect(screen.getByText('看護部：患者ID12345 採血追加依頼い')).toBeInTheDocument();
  });

  it('送信タブに切り替えると送信メモが表示される', () => {
    render(<MemoDialog onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '送信' }));
    expect(screen.getByText('カンファレンス日程調整のお願い')).toBeInTheDocument();
  });

  it('閉じるボタンで onClose が呼ばれる', () => {
    const onClose = vi.fn();
    render(<MemoDialog onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('追加ボタンで新規作成フォームが表示される', () => {
    render(<MemoDialog onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /追加/ }));
    expect(screen.getByText('新規伝言メモ作成')).toBeInTheDocument();
  });
});

describe('MemoDialog - 詳細表示', () => {
  it('メモをクリックすると詳細が表示される', () => {
    render(<MemoDialog onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('看護部：患者ID12345 採血追加依頼い'));
    expect(screen.getByText('伝言詳細')).toBeInTheDocument();
  });

  it('詳細から戻るボタンで一覧に戻る', () => {
    render(<MemoDialog onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('看護部：患者ID12345 採血追加依頼い'));
    fireEvent.click(screen.getByRole('button', { name: /戻る/ }));
    expect(screen.getByText('伝言メモ')).toBeInTheDocument();
  });

  it('確認ボタンを押すと一覧に戻り、確認済みチェックが表示される', () => {
    render(<MemoDialog onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('看護部：患者ID12345 採血追加依頼い'));
    fireEvent.click(screen.getByRole('button', { name: '確認' }));
    // 一覧に戻ってチェックアイコンが表示される
    expect(screen.getByText('伝言メモ')).toBeInTheDocument();
  });
});

describe('MemoDialog - 新規作成', () => {
  it('診療科ボタンをクリックすると選択中に追加される', () => {
    render(<MemoDialog onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /追加/ }));
    fireEvent.click(screen.getByRole('button', { name: '看護部' }));
    expect(screen.getByText(/選択中: 看護部/)).toBeInTheDocument();
  });

  it('キャンセルで一覧に戻る', () => {
    render(<MemoDialog onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /追加/ }));
    fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }));
    expect(screen.getByText('伝言メモ')).toBeInTheDocument();
  });
});
