import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/atoms/radio-group';
import { Search } from 'lucide-react';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.recordReference.recordSearchBar;

interface RecordSearchBarProps {
  searchQuery: string;
  searchMode: 'and' | 'or';
  onSearchChange: (query: string) => void;
  onSearchModeChange: (mode: 'and' | 'or') => void;
}

export function RecordSearchBar({
  searchQuery,
  searchMode,
  onSearchChange,
  onSearchModeChange,
}: RecordSearchBarProps) {
  return (
    <div className="space-y-2">
      {/* 検索入力行 */}
      <div className="flex items-center gap-2">
        <Label className="text-xs font-medium min-w-[40px]">{t.keyword}</Label>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t.placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-9 text-xs"
          />
        </div>
      </div>

      {/* AND/OR 検索モード */}
      <div className="flex items-center gap-2">
        <div className="text-xs font-medium min-w-[40px]" aria-hidden="true" />
        <RadioGroup
          value={searchMode}
          onValueChange={(value) => onSearchModeChange(value as 'and' | 'or')}
          className="flex items-center gap-3"
        >
          <div className="flex items-center space-x-1.5">
            <RadioGroupItem value="and" id="search-and" className="w-3.5 h-3.5" />
            <Label htmlFor="search-and" className="text-xs cursor-pointer font-normal">
              {t.andMode}
            </Label>
          </div>
          <div className="flex items-center space-x-1.5">
            <RadioGroupItem value="or" id="search-or" className="w-3.5 h-3.5" />
            <Label htmlFor="search-or" className="text-xs cursor-pointer font-normal">
              {t.orMode}
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
