import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { describe, expect, test } from 'vitest';
import * as stories from '../stories/molecules/UnconfirmedAlertBar.stories';

const { Default } = composeStories(stories);

describe('UnconfirmedAlertBar', () => {
  test('Default: アラートメッセージが role=alert で表示される', () => {
    render(<Default />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('未確認の項目があります');
  });
});
