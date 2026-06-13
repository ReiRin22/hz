import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { SpecimenHistoryList } from '../components/molecules/SpecimenHistoryList';
import type { SpecimenHistoryItem } from '../types/specimen-order-entry.type';

const HISTORY: SpecimenHistoryItem[] = [
  {
    id: 'h1',
    date: '2026-01-15',
    testName: '血算（CBC）',
    orderCode: 'CBC01',
    specimenType: 'blood',
    status: 'confirmed',
    confirmedAt: '2026-01-15T10:00:00',
    confirmedBy: '医師A',
    quantity: 1,
    priority: 'normal',
    clinicalPurpose: '発熱精査',
  },
];

describe('SpecimenHistoryList', () => {
  test('C0: 過去オーダーの testName が表示される', () => {
    render(
      <SpecimenHistoryList
        historyData={HISTORY}
        onAddItem={vi.fn()}
        onSubTabChange={vi.fn()}
      />,
    );
    expect(screen.getByText('血算（CBC）')).toBeInTheDocument();
  });

  test('C1: 空データのとき何も表示されない', () => {
    render(
      <SpecimenHistoryList
        historyData={[]}
        onAddItem={vi.fn()}
        onSubTabChange={vi.fn()}
      />,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('C2: 行クリックで onAddItem が正しい引数で呼ばれ onSubTabChange が search に切り替わる', async () => {
    const onAddItem = vi.fn();
    const onSubTabChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SpecimenHistoryList
        historyData={HISTORY}
        onAddItem={onAddItem}
        onSubTabChange={onSubTabChange}
      />,
    );
    await user.click(screen.getByText('血算（CBC）'));
    expect(onAddItem).toHaveBeenCalledOnce();
    expect(onAddItem).toHaveBeenCalledWith({
      specimenType: 'blood',
      orderCode: 'CBC01',
      testName: '血算（CBC）',
      quantity: 1,
      priority: 'normal',
      clinicalPurpose: '発熱精査',
      specialInstructions: undefined,
    });
    expect(onSubTabChange).toHaveBeenCalledWith('search');
  });

  test('C3: onAddItem がエラーメッセージを返したとき alert が表示される', async () => {
    const onAddItem = vi.fn().mockReturnValue('同一内容のオーダーがすでに登録されています。');
    const user = userEvent.setup();
    render(
      <SpecimenHistoryList
        historyData={HISTORY}
        onAddItem={onAddItem}
        onSubTabChange={vi.fn()}
      />,
    );
    await user.click(screen.getByText('血算（CBC）'));
    expect(screen.getByRole('alert')).toHaveTextContent('同一内容のオーダーがすでに登録されています。');
  });
});
