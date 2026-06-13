import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { describe, expect, test, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as stories from '../stories/molecules/SpecimenTypeSelector.stories';

const { Unselected, BloodSelected } = composeStories(stories);

describe('SpecimenTypeSelector / Unselected', () => {
  beforeEach(() => {
    stories.default.args?.onChange?.mockClear?.();
  });

  test('セレクトボックスが表示される', () => {
    render(<Unselected />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('value 未選択時: プレースホルダーが表示される', () => {
    render(<Unselected />);
    expect(screen.getByText('選択してください')).toBeInTheDocument();
  });
});

describe('SpecimenTypeSelector / BloodSelected', () => {
  test('value=blood: 血液が表示される', () => {
    render(<BloodSelected />);
    expect(screen.getByText('血液')).toBeInTheDocument();
  });
});
