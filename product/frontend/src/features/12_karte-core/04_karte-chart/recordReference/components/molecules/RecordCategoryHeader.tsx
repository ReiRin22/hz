import { Badge } from '@/shared/components/atoms/badge';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { CategoryKey } from '../../types/recordReference.type';
import { categoryConfig } from '../../constants/recordTypeConfig';

interface RecordCategoryHeaderProps {
  categoryKey: CategoryKey;
  isExpanded: boolean;
  categoryCount: number;
  onToggle: () => void;
}

export function RecordCategoryHeader({
  categoryKey,
  isExpanded,
  categoryCount,
  onToggle,
}: RecordCategoryHeaderProps) {
  const category = categoryConfig[categoryKey];
  const CategoryIcon = category.icon;

  return (
    <div
      role="button"
      tabIndex={0}
      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-accent transition-colors ${category.bgColor}`}
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
      aria-expanded={isExpanded}
    >
      <div className="flex items-center space-x-2">
        {isExpanded ? (
          <ChevronDown className={`w-4 h-4 ${category.color}`} />
        ) : (
          <ChevronRight className={`w-4 h-4 ${category.color}`} />
        )}
        <CategoryIcon className={`w-4 h-4 ${category.color}`} />
        <span className={`text-xs font-medium ${category.color}`}>{category.label}</span>
      </div>
      <Badge variant="secondary" className="text-xs px-2 py-0.5">
        {categoryCount}
      </Badge>
    </div>
  );
}
