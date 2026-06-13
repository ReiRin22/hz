import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { Button } from "@/shared/components/atoms/button";
import { Separator } from "@/shared/components/atoms/separator";
import { Input } from "@/shared/components/atoms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
import { FileText, Heart, Pill, FlaskConical, Copy, Search, Filter, CreditCard, ChevronRight, ChevronDown, Building2, Stethoscope, ClipboardList, FileCheck } from "lucide-react";
import { useState, useMemo } from "react";

interface Record {
  id: string;
  date: string;
  time: string;
  type: "progress" | "nursing" | "prescription" | "test";
  title: string;
  content: string;
  author: string;
  insurance?: { type: string; burden: string };
  soapRecord?: string;
  vitalSigns?: {
    bloodPressure?: string;
    pulse?: string;
    temperature?: string;
    respiratoryRate?: string;
    oxygenSaturation?: string;
  };
}

interface HistoricalRecordsProps {
  records: Record[];
  onRecordSelect: (record: Record) => void;
  selectedRecordId?: string;
  onApplyRecord?: (record: Record) => void;
}

const recordTypeConfig = {
  progress: { icon: FileText, label: "経過記録", color: "bg-blue-500" },
  nursing: { icon: Heart, label: "看護記録", color: "bg-green-500" },
  prescription: { icon: Pill, label: "処方履歴", color: "bg-purple-500" },
  test: { icon: FlaskConical, label: "検査結果", color: "bg-orange-500" }
};

// カテゴリ定義
const categoryConfig = {
  ownDept: { 
    label: "自科", 
    icon: Stethoscope, 
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950"
  },
  allDepts: { 
    label: "全科", 
    icon: Building2, 
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950"
  },
  orders: { 
    label: "オーダ", 
    icon: ClipboardList, 
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950"
  },
  results: { 
    label: "結果・報告", 
    icon: FileCheck, 
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950"
  }
};

type CategoryKey = keyof typeof categoryConfig;

export function HistoricalRecords({ records, onRecordSelect, selectedRecordId, onApplyRecord }: HistoricalRecordsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [insuranceFilter, setInsuranceFilter] = useState<string>("all");
  const [expandedCategories, setExpandedCategories] = useState<Set<CategoryKey>>(new Set(["ownDept"]));
  
  const selectedRecord = records.find(record => record.id === selectedRecordId);
  
  // カテゴリトグル
  const toggleCategory = (category: CategoryKey) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // フィルタリングされた記録
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = searchQuery === "" || 
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (record.soapRecord && record.soapRecord.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = typeFilter === "all" || record.type === typeFilter;
      const matchesAuthor = authorFilter === "all" || record.author === authorFilter;
      const matchesInsurance = insuranceFilter === "all" || 
        (record.insurance && record.insurance.type === insuranceFilter);
      
      return matchesSearch && matchesType && matchesAuthor && matchesInsurance;
    });
  }, [records, searchQuery, typeFilter, authorFilter, insuranceFilter]);
  
  // カテゴリ別に記録を分類（簡易版 - 実際の業務ロジックに応じて調整）
  const categorizeRecord = (record: Record): CategoryKey => {
    // 仮の分類ロジック - 実際のシステムでは適切な判定ロジックを実装
    if (record.type === "prescription" || record.type === "test") {
      return "orders";
    }
    if (record.type === "test") {
      return "results";
    }
    if (record.author.includes("内科")) {
      return "ownDept";
    }
    return "allDepts";
  };

  // カテゴリごとに日付でグループ化
  const groupedRecords = useMemo(() => {
    const groups: Record<CategoryKey, Record<string, Record[]>> = {
      ownDept: {},
      allDepts: {},
      orders: {},
      results: {}
    };

    filteredRecords.forEach(record => {
      const category = categorizeRecord(record);
      const date = record.date;
      
      if (!groups[category][date]) {
        groups[category][date] = [];
      }
      groups[category][date].push(record);
    });

    // 日付を降順にソート
    Object.keys(groups).forEach(cat => {
      const category = cat as CategoryKey;
      groups[category] = Object.fromEntries(
        Object.entries(groups[category]).sort((a, b) => b[0].localeCompare(a[0]))
      );
    });

    return groups;
  }, [filteredRecords]);
  
  // ユニークな記録者リスト
  const uniqueAuthors = useMemo(() => {
    return Array.from(new Set(records.map(record => record.author)));
  }, [records]);

  // ユニークな保険種別リスト
  const uniqueInsuranceTypes = useMemo(() => {
    return Array.from(new Set(records
      .filter(record => record.insurance)
      .map(record => record.insurance!.type)
    ));
  }, [records]);

  // カテゴリ内の記録総数を計算
  const getCategoryCount = (category: CategoryKey) => {
    return Object.values(groupedRecords[category]).flat().length;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">時系列記録</span>
            <Badge variant="secondary" className="text-xs">
              {filteredRecords.length}/{records.length}
            </Badge>
          </div>
        </CardTitle>
        
        {/* 検索・フィルター */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="記録を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 text-xs"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="記録種別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">全ての種別</SelectItem>
                <SelectItem value="progress" className="text-xs">経過記録</SelectItem>
                <SelectItem value="nursing" className="text-xs">看護記録</SelectItem>
                <SelectItem value="prescription" className="text-xs">処方履歴</SelectItem>
                <SelectItem value="test" className="text-xs">検査結果</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="記録者" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">全ての記録者</SelectItem>
                {uniqueAuthors.map(author => (
                  <SelectItem key={author} value={author} className="text-xs">{author}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={insuranceFilter} onValueChange={setInsuranceFilter}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="保険種別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">全ての保険</SelectItem>
                {uniqueInsuranceTypes.map(insuranceType => (
                  <SelectItem key={insuranceType} value={insuranceType} className="text-xs">
                    <div className="flex items-center space-x-1">
                      <CreditCard className="w-3 h-3" />
                      <span>{insuranceType}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* ツリー構造の記録一覧 */}
        <div className="p-4 pt-0 max-h-[400px] overflow-y-auto">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-xs">該当する記録が見つかりません</p>
              <p className="text-xs mt-1 opacity-75">検索条件を変更してください</p>
            </div>
          ) : (
            <div className="space-y-1">
              {(Object.keys(categoryConfig) as CategoryKey[]).map(categoryKey => {
                const category = categoryConfig[categoryKey];
                const CategoryIcon = category.icon;
                const isExpanded = expandedCategories.has(categoryKey);
                const categoryRecords = groupedRecords[categoryKey];
                const categoryCount = getCategoryCount(categoryKey);
                const dates = Object.keys(categoryRecords);

                // 記録がないカテゴリはスキップ
                if (categoryCount === 0) return null;

                return (
                  <div key={categoryKey}>
                    {/* カテゴリヘッダー */}
                    <div
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-accent transition-colors ${category.bgColor}`}
                      onClick={() => toggleCategory(categoryKey)}
                    >
                      <div className="flex items-center space-x-2">
                        {isExpanded ? (
                          <ChevronDown className={`w-4 h-4 ${category.color}`} />
                        ) : (
                          <ChevronRight className={`w-4 h-4 ${category.color}`} />
                        )}
                        <CategoryIcon className={`w-4 h-4 ${category.color}`} />
                        <span className={`text-xs font-medium ${category.color}`}>
                          {category.label}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        {categoryCount}
                      </Badge>
                    </div>

                    {/* 日付リスト */}
                    {isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {dates.map(date => {
                          const dateRecords = categoryRecords[date];
                          const recordCount = dateRecords.length;
                          const hasSelectedRecord = dateRecords.some(r => r.id === selectedRecordId);

                          return (
                            <div key={date}>
                              {/* 日付アイテム */}
                              <div
                                className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-sm ${
                                  hasSelectedRecord ? "bg-accent border border-primary shadow-sm" : "bg-card hover:bg-accent/50"
                                }`}
                                onClick={() => {
                                  // 日付をクリックしたら、その日の最初の記録を選択
                                  if (dateRecords.length > 0) {
                                    onRecordSelect(dateRecords[0]);
                                  }
                                }}
                              >
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="text-xs font-medium">{date}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                                    {recordCount}件
                                  </Badge>
                                  {/* 記録タイプのアイコン表示 */}
                                  <div className="flex items-center space-x-0.5">
                                    {Array.from(new Set(dateRecords.map(r => r.type))).map(type => {
                                      const config = recordTypeConfig[type];
                                      const Icon = config.icon;
                                      return (
                                        <div
                                          key={type}
                                          className={`p-0.5 rounded ${config.color} text-white`}
                                          title={config.label}
                                        >
                                          <Icon className="w-2.5 h-2.5" />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
