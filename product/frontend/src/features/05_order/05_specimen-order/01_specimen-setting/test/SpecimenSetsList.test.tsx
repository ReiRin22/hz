import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { SpecimenSetsList } from '../components/molecules/SpecimenSetsList';
import type { SpecimenSetItem } from '../types/specimen-order-entry.type';

const SETS_DATA: SpecimenSetItem[] = [
  {
    id: 's1',
    name: '院内共通セット A',
    description: '基本的な血液検査セット',
    setType: 'hospital',
    items: [
      { id: 'i1', specimenType: 'blood', orderCode: 'CBC01', testName: '血算（CBC）' },
      { id: 'i2', specimenType: 'blood', orderCode: 'CRP01', testName: 'CRP' },
    ],
  },
];

describe('SpecimenSetsList', () => {
  test('C0: セット名とアイテム名が表示される', () => {
    render(
      <SpecimenSetsList
        setsData={SETS_DATA}
        selectedSetType="hospital"
        onSetTypeChange={vi.fn()}
        onAddItems={vi.fn()}
        onSubTabChange={vi.fn()}
      />,
    );
    expect(screen.getByText('院内共通セット A')).toBeInTheDocument();
    expect(screen.getByText('血算（CBC）')).toBeInTheDocument();
    expect(screen.getByText('CRP')).toBeInTheDocument();
  });

  test('C1: setsData が空のとき行が表示されない', () => {
    render(
      <SpecimenSetsList
        setsData={[]}
        selectedSetType="hospital"
        onSetTypeChange={vi.fn()}
        onAddItems={vi.fn()}
        onSubTabChange={vi.fn()}
      />,
    );
    expect(screen.queryByText('院内共通セット A')).not.toBeInTheDocument();
  });

  test('C2: セット行クリックで onAddItems と onSubTabChange が呼ばれる', async () => {
    const onAddItems = vi.fn();
    const onSubTabChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SpecimenSetsList
        setsData={SETS_DATA}
        selectedSetType="hospital"
        onSetTypeChange={vi.fn()}
        onAddItems={onAddItems}
        onSubTabChange={onSubTabChange}
      />,
    );
    await user.click(screen.getByText('院内共通セット A'));
    expect(onAddItems).toHaveBeenCalledOnce();
    expect(onSubTabChange).toHaveBeenCalledWith('search');
  });
});
