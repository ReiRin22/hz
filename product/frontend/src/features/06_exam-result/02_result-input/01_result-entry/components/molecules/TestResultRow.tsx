import { useState, useMemo } from 'react';
import { TestResult } from '../../lib/types';
import type { UnitOption } from '@/front_bff_shared/execution/test-results/types/test-results.api.response';
import { validateResultValue, validateRequiredResultValue, validateLimits, ValidationError } from '../../lib/validators';
import { TableCell, TableRow } from '@/shared/components/atoms/table';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Input } from '@/shared/components/atoms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Badge } from '@/shared/components/atoms/badge';
import { Button } from '@/shared/components/atoms/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { DatePickerCalendar } from '@/shared/components/atoms/date-picker-calendar';
import { Calendar as CalendarIcon } from 'lucide-react';

interface TestResultRowProps {
  result: TestResult;
  showTestDate: boolean;
  validationTriggered: boolean;
  availableUnits: UnitOption[];
  onUpdate: (id: string, field: keyof TestResult, value: TestResult[keyof TestResult]) => void;
  onToggleSelection: (id: string, selected: boolean) => void;
}

// 判定ロジック - 詳細設計書セクション2 ※4に基づく
const calculateJudgment = (result: TestResult): 'H' | 'L' | 'N' | '' => {
  const value = parseFloat(result.resultValue);
  if (isNaN(value) || !result.resultValue) return '';

  const criticalLower = result.criticalLower ?? result.lowerLimit;
  const criticalUpper = result.criticalUpper ?? result.upperLimit;

  if (criticalLower != null && value < criticalLower) return 'L';
  if (criticalUpper != null && value > criticalUpper) return 'H';
  return 'N';
};

const getJudgmentBadgeClassName = (judgment: string) => {
  if (judgment === 'H') return 'bg-yellow-100 text-yellow-700';
  if (judgment === 'L') return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-600';
};

export function TestResultRow({ result, showTestDate, validationTriggered, availableUnits, onUpdate, onToggleSelection }: TestResultRowProps) {
  const [resultValueError, setResultValueError] = useState<ValidationError | null>(null);
  const [limitsError, setLimitsError] = useState<ValidationError | null>(null);

  const judgment = useMemo(() => calculateJudgment(result), [result]);

  // COL_JUDGMENT != 'N' の場合は行全体を強調表示
  const isAbnormal = judgment === 'H' || judgment === 'L';

  const handleResultValueChange = (value: string) => {
    const error = validateResultValue(value);
    setResultValueError(error);
    onUpdate(result.id, 'resultValue', value);
  };

  const handleLowerLimitChange = (value: string) => {
    const error = validateLimits(value, String(result.upperLimit ?? ''));
    setLimitsError(error);
    onUpdate(result.id, 'lowerLimit', value === '' ? null : parseFloat(value));
  };

  const handleUpperLimitChange = (value: string) => {
    const error = validateLimits(String(result.lowerLimit ?? ''), value);
    setLimitsError(error);
    onUpdate(result.id, 'upperLimit', value === '' ? null : parseFloat(value));
  };

  // 確定ボタン押下時（validationTriggered）はE001を再評価して表示
  const activeResultValueError = validationTriggered
    ? (resultValueError ?? validateRequiredResultValue(result.resultValue))
    : resultValueError;

  // 確定ボタン押下時（validationTriggered）はE002を再評価して表示
  const activeLimitsError = validationTriggered && result.referenceValueDisplay === null
    ? (limitsError ?? validateLimits(String(result.lowerLimit ?? ''), String(result.upperLimit ?? '')))
    : limitsError;

  return (
    <TableRow className={isAbnormal ? 'bg-yellow-50 font-semibold' : undefined}>
      <TableCell>
        <Checkbox
          checked={result.selected}
          onCheckedChange={(checked) => onToggleSelection(result.id, checked as boolean)}
        />
      </TableCell>
      <TableCell data-ui-id="COL_TEST_CODE">{result.itemCode}</TableCell>
      <TableCell data-ui-id="COL_TEST_ITEM">{result.itemName}</TableCell>
      <TableCell data-ui-id="COL_RESULT">
        <Input
          value={result.resultValue}
          onChange={(e) => handleResultValueChange(e.target.value)}
          className={`w-full ${activeResultValueError ? 'border-red-500' : ''}`}
          placeholder="結果値"
          disabled={!result.isEditable}
          aria-invalid={activeResultValueError !== null}
          aria-describedby={activeResultValueError ? `${result.id}-result-error` : undefined}
        />
        {activeResultValueError && (
          <div id={`${result.id}-result-error`} className="text-xs text-red-600 mt-1">
            {activeResultValueError.message}
          </div>
        )}
      </TableCell>
      <TableCell data-ui-id="COL_UNIT">
        <Select
          value={result.unit}
          onValueChange={(value) => onUpdate(result.id, 'unit', value)}
          disabled={!result.isEditable}
        >
          <SelectTrigger className={validationTriggered && !result.unit ? 'border-red-500' : ''}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableUnits.map((u) => (
              <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {validationTriggered && !result.unit && (
          <div className="text-xs text-red-600 mt-1">単位を選択してください</div>
        )}
      </TableCell>
      <TableCell data-ui-id="COL_REFERENCE_VALUE_DISPLAY" className="text-sm">
        {result.referenceValueDisplay !== null ? (
          result.referenceValueDisplay
        ) : (
          <div>
            <div className="flex gap-1 items-center">
              <Input
                value={result.lowerLimit ?? ''}
                onChange={(e) => handleLowerLimitChange(e.target.value)}
                className={`w-full ${activeLimitsError ? 'border-red-500' : ''}`}
                placeholder="下限"
                disabled={!result.isEditable}
                aria-invalid={activeLimitsError !== null}
                aria-describedby={activeLimitsError ? `${result.id}-limits-error` : undefined}
              />
              <span className="text-muted-foreground">-</span>
              <Input
                value={result.upperLimit ?? ''}
                onChange={(e) => handleUpperLimitChange(e.target.value)}
                className={`w-full ${activeLimitsError ? 'border-red-500' : ''}`}
                placeholder="上限"
                disabled={!result.isEditable}
                aria-invalid={activeLimitsError !== null}
                aria-describedby={activeLimitsError ? `${result.id}-limits-error` : undefined}
              />
            </div>
            {activeLimitsError && (
              <div id={`${result.id}-limits-error`} className="text-xs text-red-600 mt-1">
                {activeLimitsError.message}
              </div>
            )}
          </div>
        )}
      </TableCell>
      <TableCell data-ui-id="COL_JUDGMENT">
        {result.resultValue !== '' && judgment && (
          <Badge className={getJudgmentBadgeClassName(judgment)}>
            {judgment}
          </Badge>
        )}
      </TableCell>
      <TableCell data-ui-id="COL_PREV_RESULT" className="text-sm">
        {result.hasPreviousResult ? result.previousResultValue : ''}
      </TableCell>
      {showTestDate && (
        <TableCell data-ui-id="COL_TEST_DATE" className="text-sm">
          {result.hasTestDate && (result.testDate ? (
            <div className="flex items-center gap-2">
              <span>{result.testDate}</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    data-ui-id="ICON_CALENDAR_TEST_DATE"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePickerCalendar
                    selected={new Date(result.testDate.replace(/\//g, '-'))}
                    onSelect={(date) => {
                      if (date) {
                        const y = date.getFullYear();
                        const m = String(date.getMonth() + 1).padStart(2, '0');
                        const d = String(date.getDate()).padStart(2, '0');
                        onUpdate(result.id, 'testDate', `${y}/${m}/${d}`);
                      }
                    }}
                    onClear={() => onUpdate(result.id, 'testDate', '')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  data-ui-id="ICON_CALENDAR_TEST_DATE"
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="text-muted-foreground">日付を選択</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DatePickerCalendar
                  selected={undefined}
                  onSelect={(date) => {
                    if (date) {
                      const y = date.getFullYear();
                      const m = String(date.getMonth() + 1).padStart(2, '0');
                      const d = String(date.getDate()).padStart(2, '0');
                      onUpdate(result.id, 'testDate', `${y}/${m}/${d}`);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ))}
        </TableCell>
      )}
    </TableRow>
  );
}
