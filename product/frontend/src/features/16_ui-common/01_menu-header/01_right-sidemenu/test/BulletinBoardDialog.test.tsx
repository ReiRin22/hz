import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BulletinBoardDialog } from '../components/molecules/BulletinBoardDialog';

describe('BulletinBoardDialog', () => {
  it('院内掲示板のタイトルが表示される', () => {
    render(<BulletinBoardDialog onClose={vi.fn()} />);
    expect(screen.getByText('院内掲示板')).toBeInTheDocument();
  });

  it('掲示板アイテムが表示される', () => {
    render(<BulletinBoardDialog onClose={vi.fn()} />);
    expect(screen.getByText('年末年始の診療体制について')).toBeInTheDocument();
  });

  it('閉じるボタン押下で onClose が呼ばれる', () => {
    const onClose = vi.fn();
    render(<BulletinBoardDialog onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('オーバーレイクリックで onClose が呼ばれる', () => {
    const onClose = vi.fn();
    const { container } = render(<BulletinBoardDialog onClose={onClose} />);
    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ダイアログ本体クリックでは onClose が呼ばれない', () => {
    const onClose = vi.fn();
    render(<BulletinBoardDialog onClose={onClose} />);
    fireEvent.click(screen.getByText('院内掲示板'));
    expect(onClose).not.toHaveBeenCalled();
  });
});
