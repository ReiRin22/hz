import { Button } from '@/shared/components/atoms/button';
import { Lock } from 'lucide-react';

interface BottomControlsProps {
  disabled: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function BottomControls({ disabled, onCancel, onConfirm }: BottomControlsProps) {
  return (
    <div className="border-t bg-card p-4">
      <div className="flex items-center justify-center gap-3">
        <Button
          data-ui-id="BTN_CANCEL"
          data-action-id="ACT_CANCEL"
          data-event-id="EVT_CANCEL_INPUT"
          variant="outline"
          size="lg"
          onClick={onCancel}
        >
          キャンセル
        </Button>
        <Button
          data-ui-id="BTN_CONFIRM"
          data-action-id="ACT_CONFIRM_RESULT"
          data-event-id="EVT_TEST_RESULT_CONFIRM"
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={onConfirm}
          disabled={disabled}
        >
          <Lock className="h-5 w-5 mr-2" />
          確定
        </Button>
      </div>
    </div>
  );
}
