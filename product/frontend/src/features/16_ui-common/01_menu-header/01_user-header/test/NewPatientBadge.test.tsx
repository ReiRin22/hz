import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';

import * as stories from '../stories/molecules/NewPatientBadge.stories';

const { Visible, Hidden } = composeStories(stories);

describe('NewPatientBadge', () => {
  test('Visible: 新患バッジが表示される', () => {
    render(<Visible />);
    expect(screen.getByText('新患')).toBeInTheDocument();
    expect(screen.getByText('初診患者のため過去の記録はありません')).toBeInTheDocument();
  });

  test('Hidden: show=false のとき何も描画されない', () => {
    const { container } = render(<Hidden />);
    expect(container).toBeEmptyDOMElement();
  });
});
