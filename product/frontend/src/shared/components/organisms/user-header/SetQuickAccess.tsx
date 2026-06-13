import { useState } from "react";
import { Button } from "@shared/components/atoms/button";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/components/atoms/popover";
import { Badge } from "@shared/components/atoms/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/atoms/card";
import { ScrollArea } from "@shared/components/atoms/scroll-area";
import { Separator } from "@shared/components/atoms/separator";
import { Input } from "@shared/components/atoms/input";
import { 
  Layers, 
  Search, 
  Play, 
  Clock, 
  TrendingUp, 
  Settings,
  FileText,
  ClipboardList,
  Activity,
  Users,
  Star,
  Timer
} from "lucide-react";
import { toast } from "sonner";

import { useSetRegistration } from "@/shared/hooks/user-header/useSetRegistration";
import type { RegisteredSet, SetApplyOptions } from "@/shared/types/user-header/set-registration-types";

interface SetQuickAccessProps {
  onSetApply: (set: RegisteredSet, options: SetApplyOptions) => void;
  onManagementOpen?: () => void;
  filterType?: 'medical_record' | 'order_set' | 'comprehensive' | 'all';
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
  buttonSize?: 'sm' | 'default' | 'lg';
  buttonLabel?: string;
  showQuickStats?: boolean;
}

const SET_TYPE_ICONS = {
  medical_record: FileText,
  order_set: ClipboardList,
  diagnosis_set: Activity,
  template_set: FileText,
  comprehensive: Users
} as const;

const SET_TYPE_COLORS = {
  medical_record: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  order_set: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  diagnosis_set: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  template_set: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
  comprehensive: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
} as const;

export function SetQuickAccess({
  onSetApply,
  onManagementOpen,
  filterType = 'all',
  buttonVariant = 'outline',
  buttonSize = 'sm',
  buttonLabel = 'セット',
  showQuickStats = false
}: SetQuickAccessProps) {
  const { registeredSets, applySet, getUsageStats } = useSetRegistration();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  // フィルタリングとソート
  const filteredSets = registeredSets
    .filter(set => {
      // タイプフィルタ
      if (filterType !== 'all' && set.type !== filterType) {
        return false;
      }
      
      // 検索フィルタ
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        return (
          set.name.toLowerCase().includes(searchLower) ||
          set.description?.toLowerCase().includes(searchLower) ||
          set.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          set.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // 使用頻度で降順ソート
      const usageSort = b.usageCount - a.usageCount;
      if (usageSort !== 0) return usageSort;
      
      // 最終使用日で降順ソート
      const aLastUsed = a.lastUsed?.getTime() || 0;
      const bLastUsed = b.lastUsed?.getTime() || 0;
      return bLastUsed - aLastUsed;
    });

  // よく使用されるセット（上位3つ）
  const frequentSets = filteredSets.slice(0, 3);
  
  // 最近使用されたセット（上位3つ、頻繁セットと重複除外）
  const recentSets = filteredSets
    .filter(set => set.lastUsed && !frequentSets.some(freq => freq.id === set.id))
    .slice(0, 3);

  // 統計情報
  const stats = getUsageStats();

  // セット適用処理
  const handleSetApply = (set: RegisteredSet) => {
    const appliedSet = applySet(set.id, {
      overwrite: false,
      merge: true,
      confirmBeforeApply: false,
      logUsage: true
    });
    
    if (appliedSet) {
      onSetApply(appliedSet, {
        overwrite: false,
        merge: true,
        confirmBeforeApply: false,
        logUsage: true
      });
      
      setIsOpen(false);
      toast.success(`セット「${set.name}」を適用しました`, {
        description: `${set.learningData?.avgTimeSaving || 0}秒の時短効果`
      });
    }
  };

  const handleManagementOpen = () => {
    setIsOpen(false);
    onManagementOpen?.();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className="gap-2 focus-ring"
        >
          <Layers className="w-4 h-4" />
          {buttonLabel}
          {frequentSets.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1 text-xs">
              {frequentSets.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 space-y-4">
          {/* ヘッダー */}
          <div className="flex items-center justify-between">
            <h4 className="font-medium">セット選択</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManagementOpen}
              className="p-1 h-auto"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* 検索 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="セットを検索..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 h-8 focus-ring"
            />
          </div>

          {/* クイック統計 */}
          {showQuickStats && (
            <Card className="p-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-semibold medical-text-primary">
                    {stats.totalSets}
                  </div>
                  <div className="text-xs text-muted-foreground">セット数</div>
                </div>
                <div>
                  <div className="text-lg font-semibold medical-text-secondary">
                    {stats.totalUsage}
                  </div>
                  <div className="text-xs text-muted-foreground">使用回数</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {Math.round(stats.avgTimeSaving)}s
                  </div>
                  <div className="text-xs text-muted-foreground">平均時短</div>
                </div>
              </div>
            </Card>
          )}

          <ScrollArea className="h-96">
            <div className="space-y-3">
              {/* よく使用されるセット */}
              {!searchText && frequentSets.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">よく使用</span>
                  </div>
                  <div className="space-y-2">
                    {frequentSets.map((set) => {
                      const IconComponent = SET_TYPE_ICONS[set.type];
                      return (
                        <Card 
                          key={set.id} 
                          className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleSetApply(set)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <div className={`p-1.5 rounded-lg ${SET_TYPE_COLORS[set.type]}`}>
                                <IconComponent className="w-3 h-3" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm truncate">
                                  {set.name}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center space-x-2">
                                  <span>{set.usageCount}回使用</span>
                                  {set.learningData?.avgTimeSaving && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center space-x-1">
                                        <Timer className="w-3 h-3" />
                                        <span>{set.learningData.avgTimeSaving}s</span>
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetApply(set);
                              }}
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 最近使用されたセット */}
              {!searchText && recentSets.length > 0 && (
                <>
                  {frequentSets.length > 0 && <Separator />}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">最近使用</span>
                    </div>
                    <div className="space-y-2">
                      {recentSets.map((set) => {
                        const IconComponent = SET_TYPE_ICONS[set.type];
                        return (
                          <Card 
                            key={set.id} 
                            className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleSetApply(set)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className={`p-1.5 rounded-lg ${SET_TYPE_COLORS[set.type]}`}>
                                  <IconComponent className="w-3 h-3" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium text-sm truncate">
                                    {set.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {set.lastUsed?.toLocaleDateString('ja-JP')}
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetApply(set);
                                }}
                              >
                                <Play className="w-3 h-3" />
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* 検索結果 */}
              {searchText && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      検索結果 ({filteredSets.length}件)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {filteredSets.map((set) => {
                      const IconComponent = SET_TYPE_ICONS[set.type];
                      return (
                        <Card 
                          key={set.id} 
                          className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleSetApply(set)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <div className={`p-1.5 rounded-lg ${SET_TYPE_COLORS[set.type]}`}>
                                <IconComponent className="w-3 h-3" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm truncate">
                                  {set.name}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {set.description}
                                </div>
                                {set.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {set.tags.slice(0, 2).map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {set.tags.length > 2 && (
                                      <span className="text-xs text-muted-foreground">
                                        +{set.tags.length - 2}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetApply(set);
                              }}
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* セットが見つからない場合 */}
              {filteredSets.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {searchText ? '該当するセットが見つかりません' : 'セットが登録されていません'}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleManagementOpen}
                    className="mt-2"
                  >
                    セット管理を開く
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* フッター */}
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {filteredSets.length}個のセット
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManagementOpen}
              className="text-xs"
            >
              管理画面
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}