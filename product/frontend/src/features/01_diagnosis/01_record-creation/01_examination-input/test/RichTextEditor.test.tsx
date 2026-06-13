import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_examination-input/molecules/RichTextEditor.stories';

const { Empty, WithContent, Disabled } = composeStories(stories);

beforeEach(() => {
  cleanup();
});

describe('RichTextEditor', () => {
  // C0: 基本レンダリング
  test('Empty: エディター要素が存在する', () => {
    render(<Empty />);
    const editor = document.querySelector('[contenteditable]');
    expect(editor).toBeInTheDocument();
  });

  test('WithContent: コンテンツが表示される', () => {
    render(<WithContent />);
    const editor = document.querySelector('[contenteditable="true"]');
    expect(editor).toBeInTheDocument();
  });

  // C1: disabled 分岐
  test('Disabled: contentEditable が false になる', () => {
    render(<Disabled />);
    const editor = document.querySelector('[contenteditable="false"]');
    expect(editor).toBeInTheDocument();
  });

  test('Empty: contentEditable が true になる', () => {
    render(<Empty />);
    const editor = document.querySelector('[contenteditable="true"]');
    expect(editor).toBeInTheDocument();
  });
});
