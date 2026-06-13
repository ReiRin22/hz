import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Button } from "@/shared/components/atoms/button";
import { Input } from "@/shared/components/atoms/input";
import { Badge } from "@/shared/components/atoms/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/atoms/dialog";
import { Alert, AlertDescription } from "@/shared/components/atoms/alert";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import { Separator } from "@/shared/components/atoms/separator";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Copy, 
  Play, 
  BarChart3, 
  Clock, 
  Users, 
  Tag, 
  TrendingUp,
  FileText,
  ClipboardList,
  Activity,
  Lightbulb,
  Star,
  Calendar,
  Timer,
  Target,
  Share2,
  Settings,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { toast } from 'sonner';

import { SetRegistrationDialog } from "./SetRegistrationDialog";
import { useSetRegistration } from "../hooks/useSetRegistration";

import type { 
  RegisteredSet, 
  SetType, 
  SetCategory,
  SetApplyOptions
} from "../types/set-registration-types";

interface SetManagementDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySet: (set: RegisteredSet, options: SetApplyOptions) => void;
}

const SET_TYPE_ICONS = {
  medical_record: FileText,
  order_set: ClipboardList,
  diagnosis_set: Activity,
  template_set: FileText,
  comprehensive: Users
} as const;

const SET_TYPE_COLORS = {
  medical_record: 'bg-blue-500',
  order_set: 'bg-green-500',
  diagnosis_set: 'bg-purple-500',
  template_set: 'bg-orange-500',
  comprehensive: 'bg-indigo-500'
} as const;

const CATEGORY_COLORS = {
  routine: 'bg-gray-500',
  emergency: 'bg-red-500',
  outpatient: 'bg-blue-500',
  inpatient: 'bg-green-500',
  specialty: 'bg-purple-500',
  custom: 'bg-orange-500'
} as const;

export function SetManagementDashboard({
  isOpen,
  onClose,
  onApplySet
}: SetManagementDashboardProps) {
  const {
    registeredSets,
    isLoading,
    searchFilters,
    setSearchFilters,
    createSet,
    updateSet,
    deleteSet,
    applySet,
    getUsageStats,
    validateSet
  } = useSetRegistration();

  const [activeTab, setActiveTab] = useState("overview");
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<SetType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<SetCategory | "all">("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSet, setEditingSet] = useState<RegisteredSet | null>(null);
  const [selectedSets, setSelectedSets] = useState<Set<string>>(new Set());

  // 使用統計の取得
  const usageStats = useMemo(() => getUsageStats(), [getUsageStats]);

  // フィルタの適用
  const filteredSets = useMemo(() => {
    let filtered = registeredSets;

    if (searchText) {
      setSearchFilters({ keywords: searchText });
      filtered = registeredSets;
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(set => set.type === selectedType);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(set => set.category === selectedCategory);
    }

    return filtered;
  }, [registeredSets, searchText, selectedType, selectedCategory, setSearchFilters]);

  // セットの適用処理
  const handleApplySet = (set: RegisteredSet) => {
    const appliedSet = applySet(set.id, {
      overwrite: false,
      merge: true,
      confirmBeforeApply: true,
      logUsage: true
    });
    
    if (appliedSet) {
      onApplySet(appliedSet, {
        overwrite: false,
        merge: true,
        confirmBeforeApply: true,
        logUsage: true
      });
      onClose();
    }
  };

  // セットの複製
  const handleDuplicateSet = (set: RegisteredSet) => {
    const duplicatedSet = {
      ...set,
      name: `${set.name} (コピー)`,
      createdBy: 'Current User',
      isShared: false,
      shareLevel: 'private' as const
    };
    
    // id, createdAt, usageCount, learningDataを除外
    const { id, createdAt, usageCount, learningData, ...setData } = duplicatedSet;
    
    createSet(setData);
    toast.success(`セット「${set.name}」を複製しました`);
  };

  // セットの削除確認
  const handleDeleteSet = (set: RegisteredSet) => {
    if (window.confirm(`セット「${set.name}」を削除しますか？\nこの操作は元に戻せません。`)) {
      deleteSet(set.id);
    }
  };

  // 一括選択
  const handleSelectAll = () => {
    if (selectedSets.size === filteredSets.length) {
      setSelectedSets(new Set());
    } else {
      setSelectedSets(new Set(filteredSets.map(set => set.id)));
    }
  };

  // セット選択切替
  const handleToggleSelect = (setId: string) => {
    const newSelected = new Set(selectedSets);
    if (newSelected.has(setId)) {
      newSelected.delete(setId);
    } else {
      newSelected.add(setId);
    }
    setSelectedSets(newSelected);
  };

  // 一括削除
  const handleBulkDelete = () => {
    if (selectedSets.size === 0) return;
    
    if (window.confirm(`選択した${selectedSets.size}個のセットを削除しますか？\nこの操作は元に戻せません。`)) {
      selectedSets.forEach(setId => deleteSet(setId));
      setSelectedSets(new Set());
      toast.success(`${selectedSets.size}個のセットを削除しました`);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh]" aria-describedby="loading-description">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p id="loading-description" className="text-muted-foreground">セットデータを読み込んでいます...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className="p-2 medical-primary rounded-xl text-white">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl">セット登録管理</span>
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  診療セットの作成・編集・適用を管理します
                </p>
              </div>
            </DialogTitle>
            <DialogDescription>
              診療記録、オーダー、病名などの診療セットを一元管理。セットの新規作成、編集、削除、統計情報の確認が可能です。
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">概要</TabsTrigger>
                <TabsTrigger value="sets">セット一覧</TabsTrigger>
                <TabsTrigger value="statistics">統計</TabsTrigger>
                <TabsTrigger value="settings">設定</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden mt-4">
                <ScrollArea className="h-[70vh]">
                  <TabsContent value="overview" className="space-y-6 px-1">
                    {/* クイック統計 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-semibold">{usageStats.totalSets}</p>
                              <p className="text-sm text-muted-foreground">登録セット数</p>
                            </div>
                            <div className="p-3 medical-bg-primary rounded-lg">
                              <FileText className="w-6 h-6 medical-text-primary" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-semibold">{usageStats.totalUsage}</p>
                              <p className="text-sm text-muted-foreground">総使用回数</p>
                            </div>
                            <div className="p-3 medical-bg-secondary rounded-lg">
                              <Play className="w-6 h-6 medical-text-secondary" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-semibold">
                                {Math.round(usageStats.avgTimeSaving)}秒
                              </p>
                              <p className="text-sm text-muted-foreground">平均時短効果</p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                              <Timer className="w-6 h-6 text-green-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-semibold">
                                {Math.round((usageStats.totalUsage * usageStats.avgTimeSaving) / 60)}分
                              </p>
                              <p className="text-sm text-muted-foreground">累計時短時間</p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                              <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* よく使用されるセット */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span>よく使用されるセット</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {usageStats.mostUsedSets.slice(0, 5).map((set, index) => {
                            const IconComponent = SET_TYPE_ICONS[set.type];
                            return (
                              <div key={set.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                      #{index + 1}
                                    </span>
                                    <div className={`p-2 rounded-lg ${SET_TYPE_COLORS[set.type]} text-white`}>
                                      <IconComponent className="w-4 h-4" />
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{set.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {set.description || 'セットの説明なし'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    <p className="font-medium">{set.usageCount}回使用</p>
                                    <p className="text-sm text-muted-foreground">
                                      {set.learningData?.avgTimeSaving || 0}秒短縮
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApplySet(set)}
                                    className="medical-primary hover:bg-blue-700"
                                  >
                                    <Play className="w-4 h-4 mr-1" />
                                    適用
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 最近のセット */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-blue-500" />
                          <span>最近使用したセット</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {usageStats.recentSets.slice(0, 3).map((set) => {
                            const IconComponent = SET_TYPE_ICONS[set.type];
                            return (
                              <div key={set.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-lg ${SET_TYPE_COLORS[set.type]} text-white`}>
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{set.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      最終使用: {set.lastUsed?.toLocaleDateString('ja-JP') || '未使用'}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApplySet(set)}
                                >
                                  <Play className="w-4 h-4 mr-1" />
                                  適用
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="sets" className="space-y-6 px-1">
                    {/* 検索・フィルタ */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                              <Input
                                placeholder="セット名、説明、タグで検索..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="pl-10 focus-ring"
                              />
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="すべてのタイプ" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">すべてのタイプ</SelectItem>
                                <SelectItem value="medical_record">SOAP記録</SelectItem>
                                <SelectItem value="order_set">オーダーセット</SelectItem>
                                <SelectItem value="diagnosis_set">病名セット</SelectItem>
                                <SelectItem value="template_set">テンプレート</SelectItem>
                                <SelectItem value="comprehensive">包括的セット</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Select value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="カテゴリ" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">すべて</SelectItem>
                                <SelectItem value="routine">日常的</SelectItem>
                                <SelectItem value="emergency">救急</SelectItem>
                                <SelectItem value="outpatient">外来</SelectItem>
                                <SelectItem value="inpatient">入院</SelectItem>
                                <SelectItem value="specialty">専門</SelectItem>
                                <SelectItem value="custom">カスタム</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleSelectAll}
                            >
                              {selectedSets.size === filteredSets.length ? '選択を解除' : 'すべて選択'}
                            </Button>
                            
                            {selectedSets.size > 0 && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleBulkDelete}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                選択削除 ({selectedSets.size})
                              </Button>
                            )}
                          </div>
                          
                          <Button
                            onClick={() => setShowCreateDialog(true)}
                            className="medical-primary hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            新規セット作成
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* セット一覧 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredSets.map((set) => {
                        const IconComponent = SET_TYPE_ICONS[set.type];
                        const isSelected = selectedSets.has(set.id);
                        
                        return (
                          <Card 
                            key={set.id} 
                            className={`card-hover cursor-pointer transition-all duration-200 ${
                              isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''
                            }`}
                            onClick={() => handleToggleSelect(set.id)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className={`p-2 rounded-lg ${SET_TYPE_COLORS[set.type]} text-white`}>
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium truncate">{set.name}</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge 
                                        variant="secondary" 
                                        className={`text-xs ${CATEGORY_COLORS[set.category]} text-white`}
                                      >
                                        {set.category === 'routine' && '日常'}
                                        {set.category === 'emergency' && '救急'}
                                        {set.category === 'outpatient' && '外来'}
                                        {set.category === 'inpatient' && '入院'}
                                        {set.category === 'specialty' && '専門'}
                                        {set.category === 'custom' && 'カスタム'}
                                      </Badge>
                                      {set.isShared && (
                                        <Badge variant="outline" className="text-xs">
                                          <Share2 className="w-3 h-3 mr-1" />
                                          共有
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleSelect(set.id)}
                                    className="rounded border-gray-300"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-3">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {set.description || 'セットの説明なし'}
                              </p>
                              
                              {set.tags && set.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {set.tags.slice(0, 3).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {set.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{set.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{set.usageCount}回使用</span>
                                <span>
                                  {set.lastUsed ? 
                                    set.lastUsed.toLocaleDateString('ja-JP') : 
                                    '未使用'
                                  }
                                </span>
                              </div>
                              
                              <Separator />
                              
                              <div className="flex items-center justify-between">
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingSet(set);
                                    }}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDuplicateSet(set);
                                    }}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteSet(set);
                                    }}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApplySet(set);
                                  }}
                                  className="medical-primary hover:bg-blue-700"
                                >
                                  <Play className="w-4 h-4 mr-1" />
                                  適用
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    
                    {filteredSets.length === 0 && (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <h3 className="font-medium mb-2">セットが見つかりません</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {searchText || selectedType !== "all" || selectedCategory !== "all" 
                              ? "検索条件を変更するか、新しいセットを作成してください" 
                              : "最初のセットを作成して診療効率を向上させましょう"
                            }
                          </p>
                          <Button
                            onClick={() => setShowCreateDialog(true)}
                            className="medical-primary hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            新規セット作成
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="statistics" className="space-y-6 px-1">
                    {/* 統計情報の詳細表示 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* カテゴリ別統計 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            <span>カテゴリ別使用状況</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {usageStats.categoryStats.map((stat) => (
                              <div key={stat.category} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">
                                    {stat.category === 'routine' && '日常的'}
                                    {stat.category === 'emergency' && '救急'}
                                    {stat.category === 'outpatient' && '外来'}
                                    {stat.category === 'inpatient' && '入院'}
                                    {stat.category === 'specialty' && '専���'}
                                    {stat.category === 'custom' && 'カスタム'}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {stat.count}セット / {stat.usage}回使用
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${CATEGORY_COLORS[stat.category]}`}
                                    style={{
                                      width: `${Math.max((stat.usage / usageStats.totalUsage) * 100, 5)}%`
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* 効率改善指標 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Target className="w-5 h-5 text-green-600" />
                            <span>効率改善指標</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <p className="text-2xl font-semibold text-green-600">
                                {Math.round((usageStats.totalUsage * usageStats.avgTimeSaving) / 3600)}h
                              </p>
                              <p className="text-sm text-green-600">累計節約時間</p>
                            </div>
                            
                            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="text-2xl font-semibold text-blue-600">
                                {usageStats.totalUsage > 0 ? 
                                  Math.round((usageStats.totalUsage / usageStats.totalSets) * 100) / 100 : 
                                  0
                                }
                              </p>
                              <p className="text-sm text-blue-600">セット使用率</p>
                            </div>
                          </div>
                          
                          <Alert>
                            <Lightbulb className="h-4 w-4" />
                            <AlertDescription>
                              セット登録により、診療記録の入力時間を平均
                              <strong className="text-green-600"> {Math.round(usageStats.avgTimeSaving)}秒</strong>
                              短縮できています。
                            </AlertDescription>
                          </Alert>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6 px-1">
                    <Alert>
                      <Settings className="h-4 w-4" />
                      <AlertDescription>
                        セット登録システムの設定は今後のアップデートで追加予定です。
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </ScrollArea>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* セット作成・編集ダイアログ */}
      <SetRegistrationDialog
        isOpen={showCreateDialog || !!editingSet}
        onClose={() => {
          setShowCreateDialog(false);
          setEditingSet(null);
        }}
        editingSet={editingSet}
        onSaveSet={(setData) => {
          if (editingSet) {
            updateSet(editingSet.id, setData);
          } else {
            createSet(setData);
          }
          setShowCreateDialog(false);
          setEditingSet(null);
        }}
        onValidateSet={validateSet}
      />
    </>
  );
}