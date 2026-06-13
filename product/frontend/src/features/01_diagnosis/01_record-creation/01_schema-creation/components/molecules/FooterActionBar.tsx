import { Button } from '@/shared/components/atoms/button';

interface FooterActionBarProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function FooterActionBar({ isSubmitting, onCancel, onConfirm }: FooterActionBarProps) {
  return (
    <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
      <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
        キャンセル
      </Button>
      <Button onClick={onConfirm} disabled={isSubmitting}>
        {isSubmitting ? '保存中...' : '確定'}
      </Button>
    </div>
  );
}
