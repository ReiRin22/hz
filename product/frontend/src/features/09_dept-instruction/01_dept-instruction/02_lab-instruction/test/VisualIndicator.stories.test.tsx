import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { describe, expect, test } from 'vitest';
import * as stories from '../stories/molecules/VisualIndicator.stories';

const { SpecimenTube, SpecimenTubeSmall, PhysiologyECG } = composeStories(stories);

describe('VisualIndicator / SpecimenTube', () => {
  // C0: 基本レンダリング
  test('チューブ種別が表示される', () => {
    render(<SpecimenTube />);
    expect(screen.getByText('紫キャップ')).toBeInTheDocument();
  });
});

describe('VisualIndicator / SpecimenTubeSmall', () => {
  // C1: size=sm 分岐
  test('黄キャップが表示される', () => {
    render(<SpecimenTubeSmall />);
    expect(screen.getByText('黄キャップ')).toBeInTheDocument();
  });
});

describe('VisualIndicator / PhysiologyECG', () => {
  // C1: physiologicalTestType 分岐
  test('心電図が表示される', () => {
    render(<PhysiologyECG />);
    expect(screen.getByText('心電図')).toBeInTheDocument();
  });
});
