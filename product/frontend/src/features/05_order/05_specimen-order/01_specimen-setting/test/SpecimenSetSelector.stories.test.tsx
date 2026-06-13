import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as stories from '../stories/molecules/SpecimenSetSelector.stories';

const { Default, Empty, SingleSet } = composeStories(stories);

describe('SpecimenSetSelector / Default', () => {
  beforeEach(() => {
    stories.default.args?.onSelectSet?.mockClear?.();
  });

  test('初期表示: セット名の一覧が表示される', () => {
    render(<Default />);
    expect(screen.getByText('基本血液検査セット')).toBeInTheDocument();
    expect(screen.getByText('尿検査セット')).toBeInTheDocument();
  });

  test('セットボタン押下: onSelectSetが正しいセットデータで呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByRole('button', { name: /基本血液検査セット/ }));
    expect(Default.args.onSelectSet).toHaveBeenCalledOnce();
    expect(Default.args.onSelectSet).toHaveBeenCalledWith(
      expect.objectContaining({ name: '基本血液検査セット' })
    );
  });
});

describe('SpecimenSetSelector / Empty', () => {
  test('空状態: セットが表示されない', () => {
    render(<Empty />);
    expect(screen.queryByText('基本血液検査セット')).not.toBeInTheDocument();
  });
});

describe('SpecimenSetSelector / SingleSet', () => {
  beforeEach(() => {
    stories.default.args?.onSelectSet?.mockClear?.();
  });

  test('1件: 基本血液検査セットのみ表示される', () => {
    render(<SingleSet />);
    expect(screen.getByText('基本血液検査セット')).toBeInTheDocument();
    expect(screen.queryByText('尿検査セット')).not.toBeInTheDocument();
  });
});
