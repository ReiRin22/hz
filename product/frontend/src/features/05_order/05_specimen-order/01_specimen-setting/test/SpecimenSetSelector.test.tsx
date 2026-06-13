import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { SpecimenSetSelector } from '../components/molecules/SpecimenSetSelector';
import type { SpecimenSetItem } from '../types/specimen-order-entry.type';

const SETS: SpecimenSetItem[] = [
  {
    id: 's1',
    name: '基本セット',
    description: '基本的な血液検査',
    setType: 'hospital',
    items: [],
  },
  {
    id: 's2',
    name: '感染症セット',
    description: '感染症スクリーニング',
    setType: 'hospital',
    items: [],
  },
];

describe('SpecimenSetSelector', () => {
  test('C0: セット名が表示される', () => {
    render(<SpecimenSetSelector sets={SETS} onSelectSet={vi.fn()} />);
    expect(screen.getByText('基本セット')).toBeInTheDocument();
    expect(screen.getByText('感染症セット')).toBeInTheDocument();
  });

  test('C1: sets が空のとき null を返す（何も描画されない）', () => {
    const { container } = render(<SpecimenSetSelector sets={[]} onSelectSet={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  test('C2: セットボタン押下で onSelectSet が呼ばれる', async () => {
    const onSelectSet = vi.fn();
    const user = userEvent.setup();
    render(<SpecimenSetSelector sets={SETS} onSelectSet={onSelectSet} />);
    await user.click(screen.getByText('基本セット'));
    expect(onSelectSet).toHaveBeenCalledWith(SETS[0]);
  });
});
