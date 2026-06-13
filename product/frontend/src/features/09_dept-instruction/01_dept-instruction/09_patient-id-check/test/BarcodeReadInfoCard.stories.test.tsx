import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { describe, expect, test } from 'vitest';
import * as stories from '../stories/molecules/BarcodeReadInfoCard.stories';

const { Waiting, Ok, Ng } = composeStories(stories);

describe('BarcodeReadInfoCard', () => {
  test('Waiting: 「バーコード読み取り待ち」が表示される', () => {
    render(<Waiting />);
    expect(screen.getByText('バーコード読み取り待ち')).toBeInTheDocument();
  });

  test('Ok: 照合OKと読取値が表示される', () => {
    render(<Ok />);
    expect(screen.getByText('照合 OK')).toBeInTheDocument();
    expect(screen.getByText(/PT-12345678/)).toBeInTheDocument();
  });

  test('Ng: 照合NGと読取値・期待値が両方表示される', () => {
    render(<Ng />);
    expect(screen.getByText('照合 NG')).toBeInTheDocument();
    expect(screen.getByText(/PT-99999999/)).toBeInTheDocument();
    expect(screen.getByText(/PT-12345678/)).toBeInTheDocument();
  });
});
