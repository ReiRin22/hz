import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import * as stories from '../stories/molecules/PatientList.stories';

const { WithPatients, Empty, CalledPatient } = composeStories(stories);

beforeEach(() => {
  stories.default.args?.onCallPatient?.mockClear?.();
  stories.default.args?.onPatientClick?.mockClear?.();
  stories.default.args?.onCancelConsultation?.mockClear?.();
});

afterEach(() => {
  cleanup();
});

describe('PatientList / WithPatients', () => {
  // C0: 基本レンダリング（showReservations=false なので鈴木花子はフィルタアウト）
  test('患者名が表示される', () => {
    render(<WithPatients />);
    expect(screen.getByText('山田 太郎')).toBeInTheDocument();
  });

  // C2: onCallPatient コールバック（Story.args.fn() スパイを使う）
  test('呼出ボタン押下で onCallPatient が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<WithPatients />);

    const callButtons = screen.getAllByRole('button', { name: '呼出' });
    await user.click(callButtons[0]!);

    expect(WithPatients.args.onCallPatient).toHaveBeenCalledOnce();
  });

  // C2: onPatientClick コールバック（ダブルクリックでトリガー）
  test('患者行ダブルクリックで onPatientClick が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<WithPatients />);

    const patientRows = screen.getAllByRole('row');
    await user.dblClick(patientRows[1]!);

    expect(WithPatients.args.onPatientClick).toHaveBeenCalledOnce();
  });
});

describe('PatientList / Empty', () => {
  // C1: patients=[] 分岐
  test('患者0件: 患者名が表示されない', () => {
    render(<Empty />);
    expect(screen.queryByText('山田 太郎')).not.toBeInTheDocument();
    expect(screen.queryByText('鈴木 花子')).not.toBeInTheDocument();
  });
});

describe('PatientList / CalledPatient', () => {
  // C1: calledPatients に含まれる患者の表示状態
  test('呼び出し済み患者が含まれる場合でもリストが表示される', () => {
    render(<CalledPatient />);
    expect(screen.getByText('山田 太郎')).toBeInTheDocument();
  });
});
