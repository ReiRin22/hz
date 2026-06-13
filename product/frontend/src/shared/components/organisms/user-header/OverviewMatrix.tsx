import { useState, useMemo, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/components/atoms/card";
import { Badge } from "@shared/components/atoms/badge";
import { Button } from "@shared/components/atoms/button";
import { ScrollArea } from "@shared/components/atoms/scroll-area";
import { 
  Calendar, 
  Grid3X3, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  BarChart3
} from "lucide-react";
import { MatrixCell } from "./MatrixCell";
import { MatrixDetailPanel } from "./MatrixDetailPanel";
import { getCurrentPatientRecords } from "@/shared/utils/user-header/patient-utils";
import type { MedicalRecord } from "@/shared/types/user-header/patient-types";
import { toast } from "sonner";

interface OverviewMatrixProps {
  currentPatient: any;
  onItemSelect?: (item: any) => void;
  onReuseRecord?: (item: any) => void;  // 記録再利用のコールバック
  onReuseOrder?: (item: any) => void;   // オーダー再利用のコールバック
}

interface MatrixItem {
  id: string;
  date: string;
  category: string;
  type: string;
  title: string;
  status: "completed" | "pending" | "in-progress" | "overdue" | "cancelled";
  priority: "high" | "medium" | "low";
  author: string;
  timestamp: string;
  details?: any;
}

interface MatrixCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export function OverviewMatrix({ currentPatient, onItemSelect, onReuseRecord, onReuseOrder }: OverviewMatrixProps) {
  const [selectedItem, setSelectedItem] = useState<MatrixItem | undefined>();
  const [dateRange, setDateRange] = useState(8); // 表示する日数
  const [startDateOffset, setStartDateOffset] = useState(0);

  // 日付を正規化する関数
  const normalizeDate = useCallback((dateStr: string): string => {
    try {
      // スラッシュをダッシュに変換
      const cleanedDate = dateStr.replace(/\//g, '-');
      const parts = cleanedDate.split('-');
      
      if (parts.length === 3) {
        let [year, month, day] = parts;
        
        // 年の処理（2桁の場合は20xxに変換）
        if (year.length === 2) {
          year = `20${year}`;
        } else if (year.length !== 4) {
          throw new Error('Invalid year format');
        }
        
        // 月・日の0埋め
        month = month.padStart(2, '0');
        day = day.padStart(2, '0');
        
        const normalized = `${year}-${month}-${day}`;
        
        // 有効な日付かチェック
        const testDate = new Date(normalized);
        if (testDate.toISOString().startsWith(normalized)) {
          return normalized;
        }
      }
      
      // フォールバック：そのまま返す
      return cleanedDate;
    } catch (error) {
      console.warn('Date normalization failed for:', dateStr, error);
      return dateStr.replace(/\//g, '-');
    }
  }, []);

  // カテゴリ定義
  const categories: MatrixCategory[] = [
    {
      id: "orders",
      name: "オーダ",
      icon: "clipboard-list",
      color: "medical-secondary",
      description: "検査・処置オーダ"
    },
    {
      id: "documents",
      name: "文書",
      icon: "file-text",
      color: "medical-primary",
      description: "診断書・証明書等"
    },
    {
      id: "prescriptions",
      name: "処方",
      icon: "pill",
      color: "medical-tests",
      description: "薬剤処方"
    },
    {
      id: "nursing",
      name: "看護記録",
      icon: "heart-pulse",
      color: "medical-accent",
      description: "看護観察・ケア記録"
    },
    {
      id: "tests",
      name: "検査結果",
      icon: "test-tube",
      color: "medical-warning",
      description: "検体検査・生理検査"
    },
    {
      id: "vitals",
      name: "バイタル",
      icon: "activity",
      color: "medical-vitals",
      description: "生体兆候測定"
    },
    {
      id: "consultations",
      name: "診察",
      icon: "stethoscope",
      color: "medical-primary",
      description: "医師診察記録"
    }
  ];

  // 診療記録がある日付を取得して範囲を生成
  const dateRange_dates = useMemo(() => {
    const allRecords = getCurrentPatientRecords(currentPatient.patientId);
    const today = new Date().toISOString().split('T')[0];
    
    // 記録がある日付を抽出して重複を除去（本日を除く）
    const recordDates = [...new Set(
      allRecords.map(record => normalizeDate(record.date))
    )].filter(date => date !== today)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()); // 古い日付順（左が過去）

    // 過去の日付のみをページネーション対象とする
    const pastDateRange = dateRange - 1; // 本日分を除いた日数
    const totalPastDates = recordDates.length;
    const startIndex = Math.max(0, totalPastDates - pastDateRange - startDateOffset);
    const endIndex = Math.max(pastDateRange, totalPastDates - startDateOffset);
    
    const pastDates = recordDates.slice(startIndex, endIndex);
    
    // 本日を最後に追加（常に表示）
    return [...pastDates, today];
  }, [currentPatient.patientId, dateRange, startDateOffset, normalizeDate]);

  const matrixData = useMemo(() => {
    // 患者記録を取得
    const allRecords = getCurrentPatientRecords(currentPatient.patientId);
    const data: { [date: string]: { [category: string]: MatrixItem[] } } = {};
    
    // 日付とカテゴリの初期化
    dateRange_dates.forEach(date => {
      data[date] = {};
      categories.forEach(category => {
        data[date][category.id] = [];
      });
    });

    // 記録をマトリクスアイテムに変換して配置
    allRecords.forEach(record => {
      const recordDate = normalizeDate(record.date);
      
      if (data[recordDate]) {
        let categoryId = "";
        let status: MatrixItem["status"] = "completed";
        let priority: MatrixItem["priority"] = "medium";
        
        // 記録タイプに基づいてカテゴリとステータスを決定
        switch (record.type) {
          case "progress":
            categoryId = "consultations";
            break;
          case "nursing":
            categoryId = "nursing";
            break;
          case "test":
            categoryId = "tests";
            // 検査結果の場合、時間によってステータスを判定
            const recordTime = parseInt(record.time.split(':')[0]);
            if (recordTime < 12) status = "pending";
            break;
          case "prescription":
            categoryId = "prescriptions";
            break;
          case "vital":
            categoryId = "vitals";
            break;
          default:
            categoryId = "documents";
        }

        // 重要度を判定
        if (record.title.includes("緊急") || record.title.includes("急性")) {
          priority = "high";
          status = "pending";
        } else if (record.title.includes("定期") || record.title.includes("フォロー")) {
          priority = "low";
        }

        // 未来の日付は pending
        const today = new Date().toISOString().split('T')[0];
        if (recordDate > today) {
          status = "pending";
        }

        const matrixItem: MatrixItem = {
          id: record.id,
          date: recordDate,
          category: categoryId,
          type: record.type,
          title: record.title,
          status,
          priority,
          author: record.author,
          timestamp: record.time,
          details: record
        };

        if (data[recordDate] && data[recordDate][categoryId]) {
          data[recordDate][categoryId].push(matrixItem);
        }
      }
    });

    // サンプルのオーダーデータを追加
    const sampleOrders = [
      {
        id: "order_001",
        date: dateRange_dates[dateRange_dates.length - 1],
        category: "orders",
        type: "lab-order",
        title: "血液検査オーダー",
        status: "pending" as const,
        priority: "medium" as const,
        author: "田中 医師",
        timestamp: "09:00"
      },
      {
        id: "order_002", 
        date: dateRange_dates[dateRange_dates.length - 2],
        category: "prescriptions",
        type: "prescription",
        title: "降圧薬処方",
        status: "completed" as const,
        priority: "low" as const,
        author: "田中 医師",
        timestamp: "14:30"
      }
    ];

    sampleOrders.forEach(order => {
      if (data[order.date] && data[order.date][order.category]) {
        data[order.date][order.category].push(order);
      }
    });

    return data;
  }, [currentPatient.patientId, dateRange_dates, categories, normalizeDate]);

  // 統計情報
  const stats = useMemo(() => {
    let total = 0;
    let pending = 0;
    let completed = 0;
    let overdue = 0;

    Object.values(matrixData).forEach(dateData => {
      Object.values(dateData).forEach(items => {
        items.forEach(item => {
          total++;
          switch (item.status) {
            case "pending":
            case "in-progress":
              pending++;
              break;
            case "completed":
              completed++;
              break;
            case "overdue":
              overdue++;
              break;
          }
        });
      });
    });

    return { total, pending, completed, overdue };
  }, [matrixData]);

  // アイテム選択処理
  const handleItemSelect = (item: MatrixItem) => {
    setSelectedItem(item);
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  // 記録再利用処理
  const handleReuseRecord = (item: MatrixItem) => {
    if (onReuseRecord) {
      onReuseRecord(item);
      toast.success(`「${item.title}」を診療記録入力画面に転記しました`);
      setSelectedItem(undefined); // 詳細パネルを閉じる
    }
  };

  // オーダー再利用処理
  const handleReuseOrder = (item: MatrixItem) => {
    if (onReuseOrder) {
      onReuseOrder(item);
      toast.success(`「${item.title}」をオーダー入力画面に転記しました`);
      setSelectedItem(undefined); // 詳細パネルを閉じる
    }
  };

  // 利用可能な過去日付の総数を計算（本日は除く）
  const availablePastDatesCount = useMemo(() => {
    const allRecords = getCurrentPatientRecords(currentPatient.patientId);
    const today = new Date().toISOString().split('T')[0];
    
    const recordDates = [...new Set(
      allRecords.map(record => normalizeDate(record.date))
    )].filter(date => date !== today); // 本日を除外
    
    return recordDates.length;
  }, [currentPatient.patientId, normalizeDate]);

  // 日付範囲変更
  const handleDateRangeChange = (direction: "prev" | "next") => {
    const pastDateRange = dateRange - 1; // 本日分を除いた日数
    const maxOffset = Math.max(0, availablePastDatesCount - pastDateRange);
    
    if (direction === "prev") {
      // 過去方向（より古い日付を表示）
      setStartDateOffset(Math.min(startDateOffset + 1, maxOffset));
    } else {
      // 未来方向（より新しい日付を表示）
      setStartDateOffset(Math.max(0, startDateOffset - 1));
    }
  };

  // 日付フォーマット
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${month}/${day}(${dayOfWeek})`;
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Grid3X3 className="w-6 h-6 medical-text-primary" />
          <h2 className="text-xl medical-text-primary">診療オーバービュー</h2>
          <Badge variant="secondary" className="ml-2">
            {stats.total}件
          </Badge>
          {selectedItem && (
            <Badge variant="outline" className="ml-2 text-xs medical-text-primary">
              記録詳細表示中
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* 統計情報 */}
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-medical-warning rounded-full"></div>
              <span>未処理 {stats.pending}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-medical-secondary rounded-full"></div>
              <span>完了 {stats.completed}</span>
            </div>
            {stats.overdue > 0 && (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-medical-danger rounded-full"></div>
                <span>遅延 {stats.overdue}</span>
              </div>
            )}
          </div>

          {/* 日付ナビゲーション */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateRangeChange("prev")}
              disabled={startDateOffset >= Math.max(0, availablePastDatesCount - (dateRange - 1))}
              title="過去の日付を表示"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-3">
              {dateRange_dates.length > 1 ? (
                `${formatDate(dateRange_dates[0])} - 本日`
              ) : (
                "本日のみ"
              )}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateRangeChange("next")}
              disabled={startDateOffset <= 0}
              title="新しい日付を表示"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex space-x-4 min-h-0">
        {/* マトリクステーブル */}
        <div className="flex-1">
          <Card className="h-full medical-bg-primary border-medical-border-primary">
            <CardContent className="p-0">
              <ScrollArea className="h-full">
                <div className="min-w-fit">
                  <table className="w-full">
                    <thead className="sticky top-0 medical-bg-primary border-b border-medical-border-primary">
                      <tr>
                        <th className="w-32 p-3 text-left font-medium medical-text-primary border-r border-medical-border-primary">
                          カテゴリ
                        </th>
                        {dateRange_dates.map((date, index) => {
                          const isToday = date === new Date().toISOString().split('T')[0];
                          const isLastPastDate = index === dateRange_dates.length - 2 && dateRange_dates.length > 1; // 本日の前の日付（過去日付の最後）
                          return (
                            <th key={date} className={`min-w-28 p-3 text-center font-medium medical-text-primary ${
                              isLastPastDate 
                                ? 'border-r-2 border-double border-medical-primary' 
                                : 'border-r border-medical-border-primary'
                            } last:border-r-0 ${isToday ? 'bg-medical-primary-bg' : ''}`}>
                              <div className="space-y-1">
                                <div className="text-sm">{formatDate(date)}</div>
                                <div className="text-xs text-muted-foreground">
                                  {isToday ? (
                                    <Badge variant="outline" className="text-xs bg-medical-primary text-white">本日</Badge>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">
                                      {Object.values(matrixData[date] || {}).flat().length}件
                                    </span>
                                  )}
                                </div>
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category.id} className="border-b border-medical-border-primary hover:bg-gray-50/50">
                          <td className="w-32 p-3 border-r border-medical-border-primary">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full bg-${category.color}`}></div>
                              <div>
                                <div className="font-medium text-sm">{category.name}</div>
                                <div className="text-xs text-muted-foreground">{category.description}</div>
                              </div>
                            </div>
                          </td>
                          {dateRange_dates.map((date, index) => {
                            const isToday = date === new Date().toISOString().split('T')[0];
                            const isLastPastDate = index === dateRange_dates.length - 2 && dateRange_dates.length > 1; // 本日の前の日付
                            return (
                              <td key={`${category.id}-${date}`} className={`min-w-28 p-2 ${
                                isLastPastDate 
                                  ? 'border-r-2 border-double border-medical-primary' 
                                  : 'border-r border-medical-border-primary'
                              } last:border-r-0 ${isToday ? 'bg-medical-primary-bg' : ''}`}>
                                <MatrixCell
                                  items={matrixData[date]?.[category.id] || []}
                                  category={category}
                                  date={date}
                                  onItemSelect={handleItemSelect}
                                  selectedItemId={selectedItem?.id}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 詳細パネル */}
        {selectedItem && (
          <div className="w-80 flex-shrink-0">
            <MatrixDetailPanel
              item={selectedItem}
              onClose={() => setSelectedItem(undefined)}
              onReuseRecord={handleReuseRecord}
              onReuseOrder={handleReuseOrder}
            />
          </div>
        )}
      </div>
    </div>
  );
}