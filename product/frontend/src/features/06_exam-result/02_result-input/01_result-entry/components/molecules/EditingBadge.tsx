import { Badge } from '@/shared/components/atoms/badge';
import { Edit } from 'lucide-react';

interface EditingBadgeProps {
  lockStatus?: 'SELF' | 'OTHER' | null;  // lockInfo[].lockBy に対応
}

export function EditingBadge({ lockStatus = 'SELF' }: EditingBadgeProps) {
  if (lockStatus === 'SELF') {
    return (
      <Badge
        data-ui-id="BDG_EDIT"
        className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 flex items-center gap-1.5 mb-[-1px]"
      >
        <Edit className="w-4 h-4" />
        <span className="font-semibold">編集中</span>
      </Badge>
    );
  }

  if (lockStatus === 'OTHER') {
    return (
      <Badge
        data-ui-id="BDG_REF"
        className="bg-blue-200 hover:bg-blue-300 text-black px-4 py-2 flex items-center gap-1.5 mb-[-1px]"
      >
        <span className="font-semibold">参照中</span>
      </Badge>
    );
  }

  return null;
}
