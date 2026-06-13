import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { describe, expect, test, vi } from 'vitest';
import * as stories from '../stories/molecules/ConfirmerRadioGroup.stories';

const { Person, Proxy, Other } = composeStories(stories);

describe('ConfirmerRadioGroup', () => {
  test('Person: 「本人」が選択済みで表示される', () => {
    render(<Person />);
    const radio = screen.getByRole('radio', { name: '本人' });
    expect(radio).toBeChecked();
  });

  test('Proxy: 「代理人」が選択済みで表示される', () => {
    render(<Proxy />);
    expect(screen.getByRole('radio', { name: '代理人' })).toBeChecked();
  });

  test('Other: 別の選択肢をクリックすると onChange が呼ばれる', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Other onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: '本人' }));

    expect(onChange).toHaveBeenCalledWith('PERSON');
  });

  test('全4選択肢が表示される', () => {
    render(<Person />);
    expect(screen.getByRole('radio', { name: '本人' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '代理人' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '医療スタッフ2名' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'その他' })).toBeInTheDocument();
  });
});
