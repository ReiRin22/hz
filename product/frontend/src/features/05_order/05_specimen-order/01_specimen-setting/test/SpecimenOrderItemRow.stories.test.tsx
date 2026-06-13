import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { describe, expect, test, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as stories from '../stories/molecules/SpecimenOrderItemRow.stories';

const { Default, Urgent } = composeStories(stories);

describe('SpecimenOrderItemRow / Default', () => {
  beforeEach(() => {
    stories.default.args?.onRemove?.mockClear?.();
  });

  test('テスト名・オーダーコードが表示される', () => {
    render(<Default />);
    expect(screen.getByText('血算（CBC）')).toBeInTheDocument();
    expect(screen.getByText('CBC')).toBeInTheDocument();
    expect(screen.getByText('血液')).toBeInTheDocument();
  });

  test('clinicalPurpose なし: 目的テキストが表示されない', () => {
    render(<Default />);
    expect(screen.queryByText('発熱精査')).not.toBeInTheDocument();
  });

  test('削除ボタン押下で onRemove が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByRole('button'));
    expect(Default.args.onRemove).toHaveBeenCalledOnce();
    expect(Default.args.onRemove).toHaveBeenCalledWith('CBC');
  });
});

describe('SpecimenOrderItemRow / Urgent', () => {
  beforeEach(() => {
    stories.default.args?.onRemove?.mockClear?.();
  });

  test('尿一般・UAが表示される', () => {
    render(<Urgent />);
    expect(screen.getByText('尿一般')).toBeInTheDocument();
    expect(screen.getByText('UA')).toBeInTheDocument();
  });

  test('specimenType=urine: 尿ラベルが表示される', () => {
    render(<Urgent />);
    expect(screen.getByText('尿')).toBeInTheDocument();
  });

  test('削除ボタン押下で onRemove が UA で呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Urgent />);
    await user.click(screen.getByRole('button'));
    expect(Urgent.args.onRemove).toHaveBeenCalledWith('UA');
  });
});
