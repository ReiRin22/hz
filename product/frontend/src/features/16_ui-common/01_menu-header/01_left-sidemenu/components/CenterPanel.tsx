import { useState } from 'react';
import { Plus, Filter, CheckSquare, Square, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Badge } from '@/shared/components/atoms/badge';


interface OrderItem {
  id: string;
  name: string;
  dosage?: string;
  usage?: string;
  type?: 'prescription' | 'injection' | 'lab';
  source?: 'history' | 'set' | 'search' | 'frequent';
  groupItems?: OrderItem[]; // グループの場合の子項目
  groupId?: string; // グループID
  groupName?: string; // グループ名
  groupType?: 'set' | 'history'; // グループの種類
  date?: string; // 履歴の場合の日付
  itemCode?: string; // 元の項目コード（検査項目の場合はlab_ast等）
}

interface CenterPanelProps {
  candidates: OrderItem[];
  onAddToDetail: (item: OrderItem) => void;
  onAddMultipleToDetail: (items: OrderItem[]) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filterOptions = [
  { id: 'all', label: 'すべて' },
  { id: 'prescription', label: '処方' },
  { id: 'injection', label: '注射' },
  { id: 'lab', label: '検体' }
];

const getTypeColor = (type?: string) => {
  switch (type) {
    case 'prescription': return 'bg-blue-100 text-blue-800';
    case 'injection': return 'bg-green-100 text-green-800';
    case 'lab': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeLabel = (type?: string) => {
  switch (type) {
    case 'prescription': return '処方';
    case 'injection': return '注射';
    case 'lab': return '検体';
    default: return '';
  }
};

const getButtonConfig = (source?: string) => {
  return { label: 'Do', icon: Plus, variant: 'default' as const };
};

export function CenterPanel({ candidates, onAddToDetail, onAddMultipleToDetail, activeFilter, onFilterChange }: CenterPanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [groupSelections, setGroupSelections] = useState<Record<string, Set<string>>>({}); // groupId -> Set of selected item ids
  
  const filteredCandidates = candidates.filter(item => 
    activeFilter === 'all' || item.type === activeFilter
  );

  // グループの展開/折りたたみ
  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // グループ内項目の選択状態を初期化（全選択）
  const initializeGroupSelection = (groupId: string, items: OrderItem[]) => {
    if (!groupSelections[groupId]) {
      setGroupSelections(prev => ({
        ...prev,
        [groupId]: new Set(items.map(item => item.id))
      }));
    }
  };

  // グループ内項目の選択/選択解除
  const toggleItemSelection = (groupId: string, itemId: string) => {
    setGroupSelections(prev => {
      const currentSelection = prev[groupId] || new Set();
      const newSelection = new Set(currentSelection);
      
      if (newSelection.has(itemId)) {
        newSelection.delete(itemId);
      } else {
        newSelection.add(itemId);
      }
      
      return {
        ...prev,
        [groupId]: newSelection
      };
    });
  };

  // グループ全体の選択/選択解除
  const toggleGroupSelection = (groupId: string, items: OrderItem[]) => {
    const currentSelection = groupSelections[groupId] || new Set();
    const allSelected = items.every(item => currentSelection.has(item.id));
    
    setGroupSelections(prev => ({
      ...prev,
      [groupId]: allSelected ? new Set() : new Set(items.map(item => item.id))
    }));
  };

  // グループの選択済み項目をオーダーリストに追加
  const handleAddGroupToDetail = (group: OrderItem) => {
    if (!group.groupItems) return;
    
    const selectedItems = group.groupItems.filter(item => 
      groupSelections[group.id]?.has(item.id) ?? true
    );
    
    if (selectedItems.length > 0) {
      // グループ情報を生成（履歴の場合は親グループから、セットの場合も親グループから）
      const groupId = `group-${group.id}-${Date.now()}`;
      const groupName = group.name;
      const groupType = group.source === 'history' ? 'history' as const : 'set' as const;
      
      // 各項目にグループ情報を付与
      const itemsWithGroupInfo = selectedItems.map(item => ({
        ...item,
        groupId: groupId,
        groupName: groupName,
        groupType: groupType
      }));
      
      onAddMultipleToDetail(itemsWithGroupInfo);
    }
  };

  // 個別項目をオーダーリストに追加
  const handleAddSingleItem = (item: OrderItem) => {
    onAddToDetail(item);
  };

  return (
    <div className="w-[450px] bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2>オーダー候補</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">フィルタ</span>
          </div>
        </div>
        
        {/* フィルタボタン */}
        <div className="flex gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              variant={activeFilter === option.id ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredCandidates.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="text-lg mb-2">候補がありません</div>
            <div className="text-sm">左ペインから履歴やセットを選択してください</div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredCandidates.map((item) => {
              // グループの場合
              if (item.groupItems && item.groupItems.length > 0) {
                initializeGroupSelection(item.id, item.groupItems);
                const isExpanded = expandedGroups.has(item.id);
                const selectedCount = groupSelections[item.id]?.size ?? item.groupItems.length;
                const allSelected = selectedCount === item.groupItems.length;
                
                return (
                  <div key={item.id} className="border border-border rounded-lg">
                    {/* グループヘッダー */}
                    <div className="p-3 bg-muted/30">
                      <div className="flex items-center gap-3">
                        {/* 展開/折りたたみボタン */}
                        <button
                          onClick={() => toggleGroupExpansion(item.id)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        
                        {/* グループ全体の選択チェックボックス */}
                        <button
                          onClick={() => toggleGroupSelection(item.id, item.groupItems!)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {allSelected ? (
                            <CheckSquare className="w-4 h-4 text-primary" />
                          ) : selectedCount > 0 ? (
                            <div className="w-4 h-4 border border-primary bg-primary/20 rounded-sm flex items-center justify-center">
                              <div className="w-2 h-2 bg-primary rounded-sm"></div>
                            </div>
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {item.source === 'history' && item.date && (
                              <span className="text-sm text-muted-foreground">{item.date}</span>
                            )}
                            <span>{item.name}</span>
                            {item.type && (
                              <Badge variant="secondary" className={getTypeColor(item.type)}>
                                {getTypeLabel(item.type)}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {selectedCount}/{item.groupItems.length}項目選択
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleAddGroupToDetail(item)}
                          disabled={selectedCount === 0}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          選択項目を追加
                        </Button>
                      </div>
                    </div>
                    
                    {/* グループ内容（展開時） */}
                    {isExpanded && (
                      <div className="border-t border-border">
                        {item.groupItems.map((groupItem) => {
                          const isSelected = groupSelections[item.id]?.has(groupItem.id) ?? true;
                          
                          return (
                            <div
                              key={groupItem.id}
                              className={`p-3 border-b border-border last:border-b-0 transition-colors ${
                                isSelected ? 'bg-primary/5' : 'bg-background hover:bg-accent'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {/* 個別項目の選択チェックボックス */}
                                <button
                                  onClick={() => toggleItemSelection(item.id, groupItem.id)}
                                  className="mt-1 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {isSelected ? (
                                    <CheckSquare className="w-4 h-4 text-primary" />
                                  ) : (
                                    <Square className="w-4 h-4" />
                                  )}
                                </button>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm">{groupItem.name}</span>
                                  </div>
                                  {groupItem.dosage && (
                                    <div className="text-xs text-muted-foreground">
                                      用量: {groupItem.dosage}
                                    </div>
                                  )}
                                  {groupItem.usage && (
                                    <div className="text-xs text-muted-foreground">
                                      用法: {groupItem.usage}
                                    </div>
                                  )}
                                </div>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAddSingleItem(groupItem)}
                                  className="text-xs"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  個別追加
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              // 通常の個別項目の場合
              return (
                <div
                  key={item.id}
                  className="p-3 rounded border border-border hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{item.name}</span>
                        {item.type && (
                          <Badge variant="secondary" className={getTypeColor(item.type)}>
                            {getTypeLabel(item.type)}
                          </Badge>
                        )}
                      </div>
                      {item.dosage && (
                        <div className="text-sm text-muted-foreground">
                          用量: {item.dosage}
                        </div>
                      )}
                      {item.usage && (
                        <div className="text-sm text-muted-foreground">
                          用法: {item.usage}
                        </div>
                      )}
                    </div>
                    
                    {(() => {
                      const config = getButtonConfig(item.source);
                      const ButtonIcon = config.icon;
                      return (
                        <Button
                          size="sm"
                          variant={config.variant}
                          onClick={() => handleAddSingleItem(item)}
                        >
                          <ButtonIcon className="w-4 h-4 mr-1" />
                          {config.label}
                        </Button>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {filteredCandidates.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            {filteredCandidates.length}件の候補
          </div>
        </div>
      )}
    </div>
  );
}