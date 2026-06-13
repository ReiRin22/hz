import { Button } from '@/shared/components/atoms/button';
import { Trash2 } from 'lucide-react';

interface TestResultTableToolbarProps {
  selectedCount: number;
  totalCount: number;
  selectedAddedCount: number;
  onDelete: () => void;
  onAddItem: () => void;
}

export function TestResultTableToolbar({
  selectedCount,
  totalCount,
  selectedAddedCount,
  onDelete,
  onAddItem
}: TestResultTableToolbarProps) {
  return (
    <div className="p-2 border-b bg-muted/30 flex items-center gap-2">
      <Button
        data-ui-id="BTN_ITEM_REFERENCE"
        data-action-id="ACT_ITEM_REFERENCE"
        data-event-id="EVT_UI_01"
        variant="outline"
        size="sm"
        onClick={onAddItem}
      >
        <span className="mr-1">+</span>
        項目追加
      </Button>
      <Button
        data-ui-id="BTN_ITEM_DELETE"
        data-action-id="ACT_ITEM_DELETE"
        data-event-id="EVT_ROW_DELETE"
        variant="outline"
        size="sm"
        onClick={onDelete}
        disabled={selectedAddedCount === 0}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        削除
      </Button>
      <div className="ml-auto text-sm text-muted-foreground">
        選択: {selectedCount}/{totalCount}件
      </div>
    </div>
  );
}
