import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/atoms/dialog";
import { Button } from "@/shared/components/atoms/button";
import { Input } from "@/shared/components/atoms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import { Switch } from "@/shared/components/atoms/switch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { 
  Activity, 
  Search, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Heart,
  Weight,
  Ruler,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Minus,
  BarChart3
} from "lucide-react";

interface HealthCheckupRecord {
  id: string;
  year: number;
  date: string;
  organization: string;
  type: "一般健診" | "人間ドック" | "特定健診" | "企業健診";
  results: {
    height: number;
    weight: number;
    bmi: number;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    pulse: number;
    bodyFat?: number;
    waistCircumference?: number;
    visionLeft: number;
    visionRight: number;
    // hearing: "正常" | "異常" | "要再検";
    hearing: "正常" | "異常" | "要再検" | "要精査"
    bloodSugar: number;
    hba1c: number;
    totalCholesterol: number;
    hdlCholesterol: number;
    ldlCholesterol: number;
    triglycerides: number;
    uricAcid: number;
    creatinine: number;
    ast: number;
    alt: number;
    gammaGtp: number;
    hemoglobin: number;
    whiteBloodCells: number;
    redBloodCells: number;
    platelets: number;
    urineProtein: "陰性" | "陽性" | "±";
    urineGlucose: "陰性" | "陽性" | "±";
    urineBlood: "陰性" | "陽性" | "±";
    chestXray: "正常" | "異常" | "要精査";
    ecg: "正常" | "異常" | "要精査";
    upperGi?: "正常" | "異常" | "要精査";
    colonoscopy?: "正常" | "異常" | "要精査";
  };
  abnormalFindings: string[];
  recommendations: string[];
  followUpRequired: boolean;
  isVisible: boolean;
}

interface HealthCheckupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  healthCheckupRecords: HealthCheckupRecord[];
  onToggleVisibility: (id: string, visible: boolean) => void;
}

const healthCheckupTypes = [
  { value: "all", label: "すべて", icon: "🏥" },
  { value: "一般健診", label: "一般健診", icon: "📋" },
  { value: "人間ドック", label: "人間ドック", icon: "🔬" },
  { value: "特定健診", label: "特定健診", icon: "❤️" },
  { value: "企業健診", label: "企業健診", icon: "🏢" },
];

const vitalItems = [
  { key: "height", label: "身長", unit: "cm", icon: Ruler, color: "#8884d8" },
  { key: "weight", label: "体重", unit: "kg", icon: Weight, color: "#82ca9d" },
  { key: "bmi", label: "BMI", unit: "", icon: Activity, color: "#ffc658" },
  { key: "bloodPressureSystolic", label: "収縮期血圧", unit: "mmHg", icon: Heart, color: "#ff7300" },
  { key: "bloodPressureDiastolic", label: "拡張期血圧", unit: "mmHg", icon: Heart, color: "#ff4444" },
];

const labItems = [
  { key: "bloodSugar", label: "血糖", unit: "mg/dl", normal: "70-109", color: "#8884d8" },
  { key: "hba1c", label: "HbA1c", unit: "%", normal: "4.6-6.2", color: "#82ca9d" },
  { key: "totalCholesterol", label: "総コレステロール", unit: "mg/dl", normal: "<220", color: "#ffc658" },
  { key: "hdlCholesterol", label: "HDL-C", unit: "mg/dl", normal: ">40", color: "#ff7300" },
  { key: "ldlCholesterol", label: "LDL-C", unit: "mg/dl", normal: "<120", color: "#ff4444" },
  { key: "triglycerides", label: "中性脂肪", unit: "mg/dl", normal: "<150", color: "#8dd1e1" },
];

export function HealthCheckupDialog({
  isOpen,
  onClose,
  patientName,
  patientId,
  healthCheckupRecords,
  onToggleVisibility,
}: HealthCheckupDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [showHiddenRecords, setShowHiddenRecords] = useState(false);

  // 表示する記録をフィルタリング
  const displayedRecords = useMemo(() => {
    return healthCheckupRecords.filter(record => {
      if (!showHiddenRecords && !record.isVisible) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!record.organization.toLowerCase().includes(query) &&
            !record.type.toLowerCase().includes(query)) {
          return false;
        }
      }

      if (typeFilter !== "all" && record.type !== typeFilter) {
        return false;
      }

      return true;
    });
  }, [healthCheckupRecords, searchQuery, typeFilter, showHiddenRecords]);

  // ソート済み記録（年度降順）
  const sortedRecords = useMemo(() => {
    return [...displayedRecords].sort((a, b) => b.year - a.year);
  }, [displayedRecords]);

  // 年度リスト
  const availableYears = useMemo(() => {
    const years = [...new Set(healthCheckupRecords.map(r => r.year))].sort((a, b) => b - a);
    return years;
  }, [healthCheckupRecords]);

  // トレンドデータの準備
  const trendData = useMemo(() => {
    return sortedRecords
      .filter(r => r.isVisible)
      .map(record => ({
        year: record.year,
        date: record.date,
        ...record.results
      }))
      .reverse(); // 古い順にソート
  }, [sortedRecords]);

  // 統計情報
  const statistics = useMemo(() => {
    const visible = healthCheckupRecords.filter(r => r.isVisible);
    const hidden = healthCheckupRecords.filter(r => !r.isVisible);
    const abnormal = visible.filter(r => r.abnormalFindings.length > 0);
    const followUp = visible.filter(r => r.followUpRequired);
    const recent = visible.filter(r => new Date().getFullYear() - r.year <= 1);

    return {
      total: healthCheckupRecords.length,
      visible: visible.length,
      hidden: hidden.length,
      abnormal: abnormal.length,
      followUp: followUp.length,
      recent: recent.length,
    };
  }, [healthCheckupRecords]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "一般健診": return "bg-blue-100 text-blue-800 border-blue-200";
      case "人間ドック": return "bg-purple-100 text-purple-800 border-purple-200";
      case "特定健診": return "bg-red-100 text-red-800 border-red-200";
      case "企業健診": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (record: HealthCheckupRecord) => {
    if (record.followUpRequired) {
      return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    } else if (record.abnormalFindings.length > 0) {
      return <TrendingUp className="w-4 h-4 text-yellow-600" />;
    } else {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const renderRecordCard = (record: HealthCheckupRecord) => (
    <Card 
      key={record.id}
      className={`transition-all duration-200 hover:shadow-md border-l-4 ${
        record.followUpRequired 
          ? "border-l-orange-500 bg-orange-50/50" 
          : record.abnormalFindings.length > 0
          ? "border-l-yellow-500 bg-yellow-50/50"
          : "border-l-green-500 bg-green-50/50"
      } ${!record.isVisible ? "opacity-50" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-lg">{record.year}年度 健康診断</h4>
                {getStatusIcon(record)}
                {!record.isVisible && (
                  <Badge variant="secondary" className="text-xs">非表示</Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">実施日:</span>
                <div className="font-medium">{formatDate(record.date)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">機関:</span>
                <div className="font-medium">{record.organization}</div>
              </div>
              <div>
                <span className="text-muted-foreground">タイプ:</span>
                <Badge variant="outline" className={getTypeColor(record.type)}>
                  {record.type}
                </Badge>
              </div>
            </div>

            {/* 主要指標 */}
            <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-muted-foreground">BMI</div>
                <div className="font-medium">{record.results.bmi}</div>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-muted-foreground">血圧</div>
                <div className="font-medium">
                  {record.results.bloodPressureSystolic}/{record.results.bloodPressureDiastolic}
                </div>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-muted-foreground">血糖</div>
                <div className="font-medium">{record.results.bloodSugar}</div>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-muted-foreground">HbA1c</div>
                <div className="font-medium">{record.results.hba1c}%</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={record.isVisible}
                onCheckedChange={(checked) => onToggleVisibility(record.id, checked)}
                size="sm"
              />
              {record.isVisible ? 
                <Eye className="w-4 h-4 text-green-600" /> : 
                <EyeOff className="w-4 h-4 text-gray-400" />
              }
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedYear(record.year)}
              className="h-6 text-xs"
            >
              詳細
            </Button>
          </div>
        </div>

        {record.abnormalFindings.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-muted-foreground mb-1">異常所見:</div>
            <div className="flex flex-wrap gap-1">
              {record.abnormalFindings.slice(0, 3).map((finding, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {finding}
                </Badge>
              ))}
              {record.abnormalFindings.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  他{record.abnormalFindings.length - 3}件
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <span>健診情報参照システム</span>
                <div className="text-sm font-normal text-muted-foreground">
                  {patientName} ({patientId}) - {statistics.total}件の健診記録
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted-foreground">非表示記録も表示:</span>
                <Switch
                  checked={showHiddenRecords}
                  onCheckedChange={setShowHiddenRecords}
                  size="sm"
                />
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                更新
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                エクスポート
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            患者の健康診断結果を年度別に参照できます。個別の表示/非表示設定も可能です。
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="list">検診記録</TabsTrigger>
              <TabsTrigger value="trends">経年変化</TabsTrigger>
              <TabsTrigger value="compare">年度比較</TabsTrigger>
              <TabsTrigger value="stats">統計情報</TabsTrigger>
            </TabsList>

            {/* 検索・フィルターエリア */}
            <div className="flex items-center space-x-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="実施機関、健診タイプで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="健診タイプ" />
                </SelectTrigger>
                <SelectContent>
                  {healthCheckupTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground">
                表示中: {displayedRecords.length}件 / 総数: {statistics.total}件
              </div>
            </div>

            <TabsContent value="list" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-3 pr-4">
                  {sortedRecords.map(renderRecordCard)}
                  
                  {sortedRecords.length === 0 && (
                    <Card className="p-8">
                      <div className="text-center space-y-4">
                        <Activity className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div>
                          <h3 className="font-medium text-lg mb-2">該当する健診記録がありません</h3>
                          <p className="text-sm text-muted-foreground">
                            検索条件を変更するか、非表示記録の表示を有効にしてください
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="trends" className="flex-1 overflow-hidden">
              <div className="h-full space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* バイタル指標のトレンド */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">バイタル指標の推移</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            {vitalItems.map(item => (
                              <Line
                                key={item.key}
                                type="monotone"
                                dataKey={`results.${item.key}`}
                                stroke={item.color}
                                strokeWidth={2}
                                name={`${item.label} (${item.unit})`}
                              />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 血液検査値のトレンド */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">血液検査値の推移</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            {labItems.map(item => (
                              <Line
                                key={item.key}
                                type="monotone"
                                dataKey={`results.${item.key}`}
                                stroke={item.color}
                                strokeWidth={2}
                                name={`${item.label} (${item.unit})`}
                              />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compare" className="flex-1 overflow-hidden">
              <div className="grid grid-cols-2 gap-4 h-full">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">年度別BMI比較</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="bmi" fill="#8884d8" name="BMI" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">年度別血圧比較</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="bloodPressureSystolic" fill="#82ca9d" name="収縮期血圧" />
                          <Bar dataKey="bloodPressureDiastolic" fill="#ffc658" name="拡張期血圧" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="flex-1 overflow-hidden">
              <div className="grid grid-cols-2 gap-6 h-full">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">統計情報</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
                          <div className="text-sm text-muted-foreground">総健診数</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{statistics.visible}</div>
                          <div className="text-sm text-muted-foreground">表示中</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{statistics.abnormal}</div>
                          <div className="text-sm text-muted-foreground">異常所見あり</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">{statistics.followUp}</div>
                          <div className="text-sm text-muted-foreground">要精査</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">健診タイプ別分布</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {healthCheckupTypes.slice(1).map(type => {
                          const count = healthCheckupRecords.filter(r => r.type === type.value).length;
                          const percentage = count > 0 ? Math.round((count / statistics.total) * 100) : 0;
                          
                          return (
                            <div key={type.value} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span>{type.icon}</span>
                                <span className="text-sm">{type.label}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm w-8 text-right">{count}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">最新値サマリー</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {trendData.length > 0 && (
                        <div className="space-y-3">
                          {[
                            { key: "bmi", label: "BMI", unit: "", normal: "18.5-24.9" },
                            { key: "bloodPressureSystolic", label: "収縮期血圧", unit: "mmHg", normal: "<130" },
                            { key: "bloodSugar", label: "血糖", unit: "mg/dl", normal: "70-109" },
                            { key: "hba1c", label: "HbA1c", unit: "%", normal: "4.6-6.2" },
                            { key: "totalCholesterol", label: "総コレステロール", unit: "mg/dl", normal: "<220" },
                          ].map(item => {
                            const latestRecord = trendData[trendData.length - 1];
                            const value = latestRecord[item.key];
                            
                            return (
                              <div key={item.key} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <span className="text-sm">{item.label}</span>
                                <div className="text-right">
                                  <div className="font-medium">{value} {item.unit}</div>
                                  <div className="text-xs text-muted-foreground">基準: {item.normal}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">実施機関一覧</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[...new Set(healthCheckupRecords.map(r => r.organization))].map(org => {
                          const count = healthCheckupRecords.filter(r => r.organization === org).length;
                          return (
                            <div key={org} className="flex justify-between items-center text-sm">
                              <span>{org}</span>
                              <Badge variant="outline">{count}回</Badge>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}