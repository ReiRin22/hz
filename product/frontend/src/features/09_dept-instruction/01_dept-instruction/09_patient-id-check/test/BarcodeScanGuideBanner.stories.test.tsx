import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { describe, expect, test } from 'vitest';
import { i18n } from '@/shared/i18n';
import * as stories from '../stories/molecules/BarcodeScanGuideBanner.stories';

const { Default } = composeStories(stories);

describe('BarcodeScanGuideBanner', () => {
  test('Default: バナーテキストが表示される', () => {
    render(<Default />);
    expect(
      screen.getByText(i18n.deptInstruction.patientIdCheck.barcodeScanGuide.message),
    ).toBeInTheDocument();
  });
});
