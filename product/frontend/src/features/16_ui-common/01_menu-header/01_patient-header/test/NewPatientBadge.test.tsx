import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/NewPatientBadge.stories';

const { Visible, Hidden } = composeStories(stories);

describe('NewPatientBadge', () => {
  // C0: 基本レンダリング
  test('Visible: 新患バッジが表示される', () => {
    render(<Visible />);
    expect(screen.getByText(/新患/)).toBeInTheDocument();
  });

  // C1: show フラグの分岐
  test('Hidden: show=false のとき新患バッジが非表示', () => {
    render(<Hidden />);
    expect(screen.queryByText(/新患/)).not.toBeInTheDocument();
  });

  test('Visible: show=true のとき新患バッジが表示される', () => {
    render(<Visible />);
    expect(screen.queryByText(/新患/)).toBeInTheDocument();
  });
});
