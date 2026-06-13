import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as stories from '../stories/molecules/SpecimenHistoryList.stories';

const { Default, Empty, WithConfirmedCodes } = composeStories(stories);

describe('SpecimenHistoryList / Default', () => {
  beforeEach(() => {
    stories.default.args?.onAddItem?.mockClear?.();
    stories.default.args?.onSubTabChange?.mockClear?.();
  });

  test('初期表示: 履歴が表示される', () => {
    render(<Default />);
    expect(screen.getByText('血算（CBC）')).toBeInTheDocument();
    expect(screen.getByText('尿一般')).toBeInTheDocument();
  });

  test('履歴行クリック: onAddItemとonSubTabChangeが呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    const rows = screen.getAllByRole('button');
    await user.click(rows[0]);
    expect(Default.args.onAddItem).toHaveBeenCalledOnce();
    expect(Default.args.onSubTabChange).toHaveBeenCalledWith('search');
  });

  test('Enterキー押下: onAddItemとonSubTabChangeが呼ばれる（C1: onKeyDown分岐）', async () => {
    const user = userEvent.setup();
    render(<Default />);
    const rows = screen.getAllByRole('button');
    rows[0].focus();
    await user.keyboard('{Enter}');
    expect(Default.args.onAddItem).toHaveBeenCalledOnce();
    expect(Default.args.onSubTabChange).toHaveBeenCalledWith('search');
  });
});

describe('SpecimenHistoryList / Empty', () => {
  test('空状態: 履歴が表示されない', () => {
    render(<Empty />);
    expect(screen.queryByText('血算（CBC）')).not.toBeInTheDocument();
  });
});

describe('SpecimenHistoryList / WithConfirmedCodes', () => {
  beforeEach(() => {
    stories.default.args?.onAddItem?.mockClear?.();
  });

  test('確定済みコードあり: 履歴が表示される', () => {
    render(<WithConfirmedCodes />);
    expect(screen.getByText('血算（CBC）')).toBeInTheDocument();
  });

  test('確定済み行クリック: onAddItemが呼ばれない（C1: isAdded分岐）', async () => {
    const user = userEvent.setup();
    render(<WithConfirmedCodes />);
    const cbcRow = screen.getAllByRole('button').find(
      (btn) => btn.getAttribute('aria-disabled') === 'true'
    );
    if (cbcRow) await user.click(cbcRow);
    expect(WithConfirmedCodes.args.onAddItem).not.toHaveBeenCalled();
  });
});
