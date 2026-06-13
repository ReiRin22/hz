import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';

type RecordDateInputMoleculeProps = {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function RecordDateInputMolecule({ value, disabled, onChange }: RecordDateInputMoleculeProps) {
  return (
    <div className="flex-1">
      <Label htmlFor="record-date" className="text-sm font-medium">
        記載日
      </Label>
      <Input
        id="record-date"
        type="date"
        value={value}
        onChange={(e) => {
          if (e.target.value) onChange(e.target.value);
        }}
        disabled={disabled}
        required
        className="mt-1 [&::-webkit-clear-button]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-calendar-picker-indicator]:cursor-pointer"
      />
    </div>
  );
}
