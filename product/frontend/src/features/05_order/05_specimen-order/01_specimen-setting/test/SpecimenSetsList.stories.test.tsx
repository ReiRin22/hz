import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as stories from '../stories/molecules/SpecimenSetsList.stories';

const { Default, Empty, WithConfirmedCodes } = composeStories(stories);

describe('SpecimenSetsList / Default', () => {
  beforeEach(() => {
    stories.default.args?.onSetTypeChange?.mockClear?.();
    stories.default.args?.onAddItems?.mockClear?.();
    stories.default.args?.onSubTabChange?.mockClear?.();
  });

  test('初期表示: セット名が表示される', () => {
    render(<Default />);
    expect(screen.getByText('基本血液検査セット')).toBeInTheDocument();
    expect(screen.getByText('尿検査セット')).toBeInTheDocument();
  });

  test('セット行クリック: onAddItemsとonSubTabChangeが呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByRole('button', { name: /基本血液検査セット/i }));
    expect(Default.args.onAddItems).toHaveBeenCalledOnce();
    expect(Default.args.onSubTabChange).toHaveBeenCalledWith('search');
  });

  test('Enterキー押下: onAddItemsとonSubTabChangeが呼ばれる（C1: onKeyDown分岐）', async () => {
    const user = userEvent.setup();
    render(<Default />);
    const setBtn = screen.getByRole('button', { name: /基本血液検査セット/i });
    setBtn.focus();
    await user.keyboard('{Enter}');
    expect(Default.args.onAddItems).toHaveBeenCalledOnce();
    expect(Default.args.onSubTabChange).toHaveBeenCalledWith('search');
  });
});

describe('SpecimenSetsList / Empty', () => {
  test('空状態: セットが表示されない', () => {
    render(<Empty />);
    expect(screen.queryByText('基本血液検査セット')).not.toBeInTheDocument();
  });
});

describe('SpecimenSetsList / WithConfirmedCodes', () => {
  beforeEach(() => {
    stories.default.args?.onSetTypeChange?.mockClear?.();
    stories.default.args?.onAddItems?.mockClear?.();
  });

  test('確定済みコードあり: セット名が表示される', () => {
    render(<WithConfirmedCodes />);
    expect(screen.getByText('基本血液検査セット')).toBeInTheDocument();
  });

  test('全アイテム追加済みセット: クリックしてもonAddItemsが呼ばれない（C1: allAdded分岐）', async () => {
    const user = userEvent.setup();
    render(<WithConfirmedCodes />);
    // 基本血液検査セット は CBC, BMP が confirmedOrderCodes に含まれる → allAdded=true
    const disabledSetBtn = screen.getByRole('button', { name: /基本血液検査セット/i });
    await user.click(disabledSetBtn);
    expect(WithConfirmedCodes.args.onAddItems).not.toHaveBeenCalled();
  });
});
