import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { describe, expect, test } from 'vitest';
import * as stories from '../stories/molecules/PatientIdCheckSection.stories';

const { Pending, Ok, Ng } = composeStories(stories);

describe('PatientIdCheckSection', () => {
  test('Pending: セクションタイトルが表示される', () => {
    render(<Pending />);
    expect(screen.getByText('患者確認')).toBeInTheDocument();
  });

  test('Ok: タイムスタンプが表示される', () => {
    render(<Ok />);
    expect(screen.getByText('14:32:10')).toBeInTheDocument();
  });

  test('Ng: セクションタイトルが表示される', () => {
    render(<Ng />);
    expect(screen.getByText('患者確認')).toBeInTheDocument();
  });
});
