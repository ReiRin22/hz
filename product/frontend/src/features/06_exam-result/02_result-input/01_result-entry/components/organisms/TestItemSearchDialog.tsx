import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/atoms/dialog';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { Search } from 'lucide-react';
import { TestItem } from '../../lib/types';
import { useTestItemsSearch } from '../../features/test-items/hooks/use-test-items-search';

interface TestItemSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: TestItem) => void;
  correlationId: string;
  tenantId: string;
}

export function TestItemSearchDialog({ open, onOpenChange, onSelect, correlationId, tenantId }: TestItemSearchDialogProps) {
  const [searchCodeQuery, setSearchCodeQuery] = useState("");
  const [searchNameQuery, setSearchNameQuery] = useState("");
  const { filteredItems, searchItems, resetSearch } = useTestItemsSearch();

  const handleSearch = () => {
    searchItems(correlationId, tenantId, searchCodeQuery, searchNameQuery);
  };

  const handleSelectItem = (item: TestItem) => {
    onSelect(item);
    onOpenChange(false);
    setSearchCodeQuery("");
    setSearchNameQuery("");
    resetSearch();
  };

  const handleClose = () => {
    onOpenChange(false);
    setSearchCodeQuery("");
    setSearchNameQuery("");
    resetSearch();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>検査項目検索</DialogTitle>
          <DialogDescription>検査コードまたは検査項目で検索できます。</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Search by name */}
          <div>
            <Label htmlFor="searchNameQuery">検査項目で検索</Label>
            <div className="flex gap-2 mt-2">
              <Input
                data-ui-id="SRCH_TEST_ITEM"
                id="searchNameQuery"
                placeholder="検索キーワードを入力"
                value={searchNameQuery}
                onChange={(e) => setSearchNameQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
          </div>

          {/* Search by code */}
          <div>
            <Label htmlFor="searchCodeQuery">検査コードで検索</Label>
            <div className="flex gap-2 mt-2">
              <Input
                data-ui-id="SRCH_TEST_CODE"
                id="searchCodeQuery"
                placeholder="検索キーワードを入力"
                value={searchCodeQuery}
                onChange={(e) => setSearchCodeQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Button
                data-ui-id="BTN_SEARCH"
                data-action-id="ACT_SEARCH"
                variant="outline"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-1" />
                検索
              </Button>
            </div>
          </div>

          {/* Search results */}
          <div className="border rounded-md overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              <div className="divide-y">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <button
                      data-ui-id="BTN_ITEM"
                      data-action-id="ACT_ITEM_ADD"
                      key={item.code}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center justify-between"
                      onClick={() => handleSelectItem(item)}
                    >
                      <div>
                        <div className="font-medium">{item.code}:{item.name}</div>
                        <div className="text-sm text-muted-foreground">コード: {item.code}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    検索結果がありません
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            data-ui-id="BTN_CANCEL"
            variant="outline"
            onClick={handleClose}
            className="px-8"
          >
            キャンセル
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
