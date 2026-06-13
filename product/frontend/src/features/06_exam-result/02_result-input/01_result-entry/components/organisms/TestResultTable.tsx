import { useRef } from 'react';
import { TestResult } from '../../lib/types';
import type { UnitOption } from '@/front_bff_shared/execution/test-results/types/test-results.api.response';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/shared/components/atoms/table';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { TestResultRow } from '../molecules/TestResultRow';
import { TestResultTableToolbar } from '../molecules/TestResultTableToolbar';

interface TestResultTableProps {
  data: TestResult[];
  validationTriggered: boolean;
  availableUnits: UnitOption[];
  onUpdate: (id: string, field: keyof TestResult, value: TestResult[keyof TestResult]) => void;
  onToggleSelection: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onDelete: () => void;
  onAddItem: () => void;
}

export function TestResultTable({
  data,
  validationTriggered,
  availableUnits,
  onUpdate,
  onToggleSelection,
  onSelectAll,
  onDelete,
  onAddItem
}: TestResultTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const selectedCount = data.filter(item => item.selected).length;
  const allSelected = data.length > 0 && data.every(item => item.selected);
  // EVT_UI_01で追加した項目のうち選択されているものの数（削除ボタン活性判定）
  const selectedAddedCount = data.filter(item => item.selected && item.isAddedItem).length;
  const showTestDate = data.some(r => r.hasTestDate);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <TestResultTableToolbar
        selectedCount={selectedCount}
        totalCount={data.length}
        selectedAddedCount={selectedAddedCount}
        onDelete={onDelete}
        onAddItem={onAddItem}
      />

      <div className="flex-1 overflow-auto" ref={tableContainerRef}>
        <Table data-ui-id="TBL_TEST_RESULTS">
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead data-ui-id="COL_TEST_CODE" className="w-20">検査コード</TableHead>
              <TableHead data-ui-id="COL_TEST_ITEM" className="min-w-32">検査項目名</TableHead>
              <TableHead data-ui-id="COL_RESULT" className="w-24">結果値</TableHead>
              <TableHead data-ui-id="COL_UNIT" className="w-16">単位</TableHead>
              <TableHead data-ui-id="COL_REFERENCE_VALUE_DISPLAY" className="w-40">基準値</TableHead>
              <TableHead data-ui-id="COL_JUDGMENT" className="w-16">判定</TableHead>
              <TableHead data-ui-id="COL_PREV_RESULT" className="w-24">前回値</TableHead>
              {showTestDate && (
                <TableHead data-ui-id="COL_TEST_DATE" className="w-32">検体採取日</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TestResultRow
                key={item.id}
                result={item}
                showTestDate={showTestDate}
                validationTriggered={validationTriggered}
                availableUnits={availableUnits}
                onUpdate={onUpdate}
                onToggleSelection={onToggleSelection}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
