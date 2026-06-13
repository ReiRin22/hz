import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_examination-input/molecules/RecordRecorderSelectMolecule.stories';

const { WithName, EmptyName } = composeStories(stories);

beforeEach(() => {
  cleanup();
});

describe('RecordRecorderSelectMolecule', () => {
  // C0: 基本レンダリング
  test('WithName: 記載者ラベルと名前が表示される', () => {
    render(<WithName />);
    expect(screen.getByText('記載者')).toBeInTheDocument();
    expect(screen.getByText('山田 太郎')).toBeInTheDocument();
  });

  // C1: 名前なしの場合のフォールバック
  test('EmptyName: 名前が空のとき「—」が表示される', () => {
    render(<EmptyName />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
