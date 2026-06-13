import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import * as stories from '../stories/molecules/FilterBar.stories';

const { Default, AllDepartments, ShowCompleted } = composeStories(stories);

beforeEach(() => {
  stories.default.args?.onFilterChange?.mockClear?.();
});

afterEach(() => {
  cleanup();
});

describe('FilterBar / Default', () => {
  // C0: 基本レンダリング
  test('統計数値が表示される', () => {
    render(<Default />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  test('診療科フィルターが表示される', () => {
    render(<Default />);
    expect(screen.getByText('内科')).toBeInTheDocument();
  });

  // C1: showCompleted=false 分岐
  test('showCompleted=false: 診察済含むチェックボックスが未チェック', () => {
    render(<Default />);
    const checkbox = screen.getAllByRole('checkbox').find(
      (el) => el.getAttribute('type') === 'checkbox' && !(el as HTMLInputElement).checked,
    );
    expect(checkbox).toBeDefined();
  });

  // C2: onFilterChange コールバック（Story.args.fn() スパイを使う）
  test('診察済含むチェックボックスを変更すると onFilterChange が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]!);

    expect(Default.args.onFilterChange).toHaveBeenCalledOnce();
  });
});

describe('FilterBar / AllDepartments', () => {
  // C1: departmentId=all 分岐
  test('全診療科選択時は統計が多い値で表示される', () => {
    render(<AllDepartments />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('22')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });
});

describe('FilterBar / ShowCompleted', () => {
  // C1: showCompleted=true 分岐
  test('showCompleted=true: 診察済含むチェックボックスがチェック済み', () => {
    render(<ShowCompleted />);
    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    const checkedBoxes = checkboxes.filter((el) => el.checked);
    expect(checkedBoxes.length).toBeGreaterThan(0);
  });
});
