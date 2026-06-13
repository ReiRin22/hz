import { useState } from 'react';
import { Plus, Filter, Clock, Bookmark, History, TrendingUp } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Badge } from '@/shared/components/atoms/badge';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import type { OrderItem } from '../../../types/order.types';

interface OutpatientInjectionCenterPanelProps {
  candidates: OrderItem[];
  onAddToDetail: (item: OrderItem) => void;
  onAddMultipleToDetail: (items: OrderItem[]) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function OutpatientInjectionCenterPanel({
  candidates,
  onAddToDetail,
  onAddMultipleToDetail,
  activeFilter,
  onFilterChange
}: OutpatientInjectionCenterPanelProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filterButtons = [
    { id: 'all', label: 'すべて', icon: null },
    { id: 'history', label: '履歴', icon: History },
    { id: 'set', label: 'セット', icon: Bookmark },
    { id: 'frequent', label: '頻用', icon: TrendingUp },
    { id: 'search', label: '薬剤', icon: Filter },
    { id: 'category', label: '薬効', icon: Filter }
  ];

  const filteredCandidates = candidates.filter(item => 
    activeFilter === 'all' || item.source === activeFilter
  );

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'history': return <History className="w-3 h-3" />;
      case 'set': return <Bookmark className="w-3 h-3" />;
      case 'frequent': return <TrendingUp className="w-3 h-3" />;
      case 'search': return <Filter className="w-3 h-3" />;
      case 'category': return <Filter className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getSourceLabel = (source?: string) => {
    switch (source) {
      case 'history': return '履歴';
      case 'set': return 'セット';
      case 'frequent': return '頻用';
      case 'search': return '薬剤';
      case 'category': return '薬効';
      default: return '候補';
    }
  };

  const handleToggleSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAddSelected = () => {
    const itemsToAdd = filteredCandidates.filter(item => 
      selectedItems.includes(item.id)
    );
    if (itemsToAdd.length > 0) {
      onAddMultipleToDetail(itemsToAdd);
      setSelectedItems([]);
    }
  };

  const selectedCount = selectedItems.length;

  return (
    <div className="w-[450px] bg-card border-r border-border flex flex-col h-screen">
      <div className="border-b border-border p-3">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-sm text-muted-foreground font-medium">候補一覧</div>
            <h2 className="font-normal">外来注射候補 ({filteredCandidates.length}件)</h2>
          </div>
          {selectedCount > 0 && (
            <Button 
              size="sm"
              onClick={handleAddSelected}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-1" />
              選択項目追加 ({selectedCount})
            </Button>
          )}
        </div>
        
        {/* フィルタボタン */}
        <div className="flex gap-1 flex-wrap">
          {filterButtons.map((filter) => {
            const IconComponent = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <Button
                key={filter.id}
                size="sm"
                variant={isActive ? "default" : "outline"}
                onClick={() => onFilterChange(filter.id)}
                className="h-7 text-xs"
              >
                {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          {filteredCandidates.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <div className="text-center">
                <div className="text-lg mb-2">候補がありません</div>
                <div className="text-sm">左側のパネルから注射薬を選択してください</div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCandidates.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-border hover:bg-accent group transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleToggleSelection(item.id)}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getSourceIcon(item.source)}
                          {getSourceLabel(item.source)}
                        </Badge>
                      </div>
                      
                      {item.dosage && (
                        <div className="text-xs text-muted-foreground mb-1">
                          用量: {item.dosage}
                        </div>
                      )}
                      
                      {item.usage && (
                        <div className="text-xs text-muted-foreground">
                          用法: {item.usage}
                        </div>
                      )}

                      {/* グループ項目がある場合（セットなど） */}
                      {item.groupItems && item.groupItems.length > 0 && (
                        <div className="mt-2 pl-3 border-l-2 border-muted">
                          <div className="text-xs text-muted-foreground mb-1">
                            セット内容:
                          </div>
                          {item.groupItems.map((groupItem, index) => (
                            <div key={index} className="text-xs text-muted-foreground">
                              • {groupItem.name} ({groupItem.dosage})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onAddToDetail(item)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* フッターの一括操作 */}
      {filteredCandidates.length > 0 && (
        <div className="border-t border-border p-3 bg-muted/50">
          <div className="flex justify-between items-center text-sm">
            <div className="text-muted-foreground">
              {selectedCount > 0 ? `${selectedCount}件選択中` : '候補を選択'}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedItems(filteredCandidates.map(item => item.id))}
                disabled={filteredCandidates.length === 0}
              >
                全選択
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedItems([])}
                disabled={selectedCount === 0}
              >
                選択解除
              </Button>
              <Button
                size="sm"
                onClick={() => onAddMultipleToDetail(filteredCandidates)}
                disabled={filteredCandidates.length === 0}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-1" />
                全て追加
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}