import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { FilterBar } from '../components/molecules/FilterBar';
import type { FilterState, Doctor, Department, ReceptionStats } from '../types/receptionPatientList.types';

const DOCTORS: Doctor[] = [
  { id: 'doctor1', name: '田中 太郎', departmentIds: ['dept1'], mainDepartmentId: 'dept1' },
  { id: 'doctor2', name: '佐藤 花子', departmentIds: ['dept1'], mainDepartmentId: 'dept1' },
];
const DEPARTMENTS: Department[] = [
  { id: 'dept1', name: '内科' },
  { id: 'dept2', name: '外科' },
];
const STATS: ReceptionStats = { consulted: 3, recepted: 8, target: 10 };
const DEFAULT_FILTERS: FilterState = {
  date: '2026-05-08',
  showCompleted: false,
  showReservations: false,
  departmentId: 'dept1',
  doctorIds: ['doctor1'],
};

describe('FilterBar – 診療科ドロップダウン', () => {
  test('診療科ボタンをクリックするとドロップダウンが開く', async () => {
    const user = userEvent.setup();
    render(
      <FilterBar
        filters={DEFAULT_FILTERS}
        onFilterChange={vi.fn()}
        doctors={DOCTORS}
        departments={DEPARTMENTS}
        stats={STATS}
      />,
    );
    const deptBtn = screen.getByRole('button', { name: /内科/ });
    await user.click(deptBtn);
    expect(screen.getByText('外科')).toBeInTheDocument();
  });

  test('診療科を選択すると onFilterChange が新しい departmentId で呼ばれる', async () => {
    const onFilterChange = vi.fn();
    const user = userEvent.setup();
    render(
      <FilterBar
        filters={DEFAULT_FILTERS}
        onFilterChange={onFilterChange}
        doctors={DOCTORS}
        departments={DEPARTMENTS}
        stats={STATS}
      />,
    );
    const deptBtn = screen.getByRole('button', { name: /内科/ });
    await user.click(deptBtn);
    await user.click(screen.getByText('外科'));
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ departmentId: 'dept2' }),
    );
  });

  test('「全科」選択で departmentId=all を渡す', async () => {
    const onFilterChange = vi.fn();
    const user = userEvent.setup();
    render(
      <FilterBar
        filters={DEFAULT_FILTERS}
        onFilterChange={onFilterChange}
        doctors={DOCTORS}
        departments={DEPARTMENTS}
        stats={STATS}
      />,
    );
    const deptBtn = screen.getByRole('button', { name: /内科/ });
    await user.click(deptBtn);
    const allBtn = screen.getAllByRole('button').find((b) => b.textContent?.includes('すべて'));
    expect(allBtn).toBeDefined();
    await user.click(allBtn!);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ departmentId: 'all' }),
    );
  });
});

describe('FilterBar – 診察医ドロップダウン', () => {
  test('診察医ボタンをクリックするとドロップダウンが開く', async () => {
    const user = userEvent.setup();
    render(
      <FilterBar
        filters={DEFAULT_FILTERS}
        onFilterChange={vi.fn()}
        doctors={DOCTORS}
        departments={DEPARTMENTS}
        stats={STATS}
      />,
    );
    const doctorBtn = screen.getByRole('button', { name: /田中 太郎/ });
    await user.click(doctorBtn);
    expect(screen.getByText('佐藤 花子')).toBeInTheDocument();
  });

  test('診察医チェックを外すと onFilterChange が呼ばれる（残り1人以上のとき）', async () => {
    const onFilterChange = vi.fn();
    const user = userEvent.setup();
    render(
      <FilterBar
        filters={{ ...DEFAULT_FILTERS, doctorIds: ['doctor1', 'doctor2'] }}
        onFilterChange={onFilterChange}
        doctors={DOCTORS}
        departments={DEPARTMENTS}
        stats={STATS}
      />,
    );
    const doctorBtn = screen.getByRole('button', { name: /田中 太郎/ });
    await user.click(doctorBtn);
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]!);
    expect(onFilterChange).toHaveBeenCalledOnce();
  });

  test('予約含むチェックボックスを変更すると onFilterChange が呼ばれる', async () => {
    const onFilterChange = vi.fn();
    const user = userEvent.setup();
    render(
      <FilterBar
        filters={DEFAULT_FILTERS}
        onFilterChange={onFilterChange}
        doctors={DOCTORS}
        departments={DEPARTMENTS}
        stats={STATS}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]!);
    expect(onFilterChange).toHaveBeenCalledOnce();
  });

  test('最後の診察医チェックを外してもonFilterChangeが呼ばれない（C1: newDoctorIds.length===0分岐）', async () => {
    const onFilterChange = vi.fn();
    const user = userEvent.setup();
    render(
      <FilterBar
        filters={{ ...DEFAULT_FILTERS, doctorIds: ['doctor1'] }}
        onFilterChange={onFilterChange}
        doctors={DOCTORS}
        departments={DEPARTMENTS}
        stats={STATS}
      />,
    );
    const doctorBtn = screen.getByRole('button', { name: /田中 太郎/ });
    await user.click(doctorBtn);
    // 現在チェック済みの doctor1 チェックボックスを探して外す
    const doctorCheckboxes = screen.getAllByRole('checkbox', { checked: true });
    // 最初のcheckedなチェックボックス（doctor1）をクリック
    if (doctorCheckboxes.length > 0) {
      await user.click(doctorCheckboxes[0]!);
    }
    // newDoctorIds が空になるので onFilterChange は呼ばれない
    expect(onFilterChange).not.toHaveBeenCalled();
  });

  test('診察医ラベルクリック: ドロップダウンが閉じない（stopPropagation確認）', async () => {
    const user = userEvent.setup();
    render(
      <FilterBar
        filters={{ ...DEFAULT_FILTERS, doctorIds: ['doctor1', 'doctor2'] }}
        onFilterChange={vi.fn()}
        doctors={DOCTORS}
        departments={DEPARTMENTS}
        stats={STATS}
      />,
    );
    const doctorBtn = screen.getByRole('button', { name: /田中 太郎/ });
    await user.click(doctorBtn);
    const label = screen.getByText('佐藤 花子').closest('label');
    if (label) await user.click(label);
    expect(screen.getByText('佐藤 花子')).toBeInTheDocument();
  });
});
