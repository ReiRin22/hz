import { Label } from '@/shared/components/atoms/label';

type RecordRecorderSelectMoleculeProps = {
  authorName: string;
};

export function RecordRecorderSelectMolecule({ authorName }: RecordRecorderSelectMoleculeProps) {
  return (
    <div className="flex-1">
      <Label className="text-sm font-medium">記載者</Label>
      <div className="mt-1 h-9 px-3 flex items-center rounded-md border border-input bg-background text-sm">
        {authorName || '—'}
      </div>
    </div>
  );
}
