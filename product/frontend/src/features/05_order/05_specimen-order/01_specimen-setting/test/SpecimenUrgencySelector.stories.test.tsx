import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { describe, expect, test, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as stories from '../stories/molecules/SpecimenUrgencySelector.stories';

const { Normal, Urgent } = composeStories(stories);

describe('SpecimenUrgencySelector / Normal', () => {
  beforeEach(() => {
    stories.default.args?.onChange?.mockClear?.();
  });

  test('通常・緊急ボタンが表示される', () => {
    render(<Normal />);
    expect(screen.getByRole('button', { name: '通常' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '緊急' })).toBeInTheDocument();
  });

  test('value=normal: 通常ボタンが存在する', () => {
    render(<Normal />);
    expect(screen.getByRole('button', { name: '通常' })).toBeInTheDocument();
  });

  test('緊急ボタン押下で onChange が urgent で呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Normal />);
    await user.click(screen.getByRole('button', { name: '緊急' }));
    expect(Normal.args.onChange).toHaveBeenCalledOnce();
    expect(Normal.args.onChange).toHaveBeenCalledWith('urgent');
  });
});

describe('SpecimenUrgencySelector / Urgent', () => {
  beforeEach(() => {
    stories.default.args?.onChange?.mockClear?.();
  });

  test('value=urgent: 緊急ボタンが表示される', () => {
    render(<Urgent />);
    expect(screen.getByRole('button', { name: '緊急' })).toBeInTheDocument();
  });

  test('通常ボタン押下で onChange が normal で呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Urgent />);
    await user.click(screen.getByRole('button', { name: '通常' }));
    expect(Urgent.args.onChange).toHaveBeenCalledOnce();
    expect(Urgent.args.onChange).toHaveBeenCalledWith('normal');
  });
});
