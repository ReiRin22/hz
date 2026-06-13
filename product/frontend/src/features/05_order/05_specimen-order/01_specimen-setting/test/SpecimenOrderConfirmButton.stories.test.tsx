import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { describe, expect, test, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as stories from '../stories/molecules/SpecimenOrderConfirmButton.stories';

const { Enabled, Disabled, Loading } = composeStories(stories);

describe('SpecimenOrderConfirmButton / Enabled', () => {
  beforeEach(() => {
    stories.default.args?.onClick?.mockClear?.();
  });

  test('ボタンが表示される', () => {
    render(<Enabled />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('disabled=false: ボタンが有効', () => {
    render(<Enabled />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  test('クリックで onClick が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Enabled />);
    await user.click(screen.getByRole('button'));
    expect(Enabled.args.onClick).toHaveBeenCalledOnce();
  });
});

describe('SpecimenOrderConfirmButton / Disabled', () => {
  test('disabled=true: ボタンが無効', () => {
    render(<Disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('disabled 時はクリックしても onClick が呼ばれない', async () => {
    stories.default.args?.onClick?.mockClear?.();
    const user = userEvent.setup();
    render(<Disabled />);
    await user.click(screen.getByRole('button'));
    expect(Disabled.args.onClick).not.toHaveBeenCalled();
  });
});

describe('SpecimenOrderConfirmButton / Loading', () => {
  test('isLoading=true: 確定中... テキストが表示される', () => {
    render(<Loading />);
    expect(screen.getByText('確定中...')).toBeInTheDocument();
  });

  test('isLoading=true: ボタンが無効', () => {
    render(<Loading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
