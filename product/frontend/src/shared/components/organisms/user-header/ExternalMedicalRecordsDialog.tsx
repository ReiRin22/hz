import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shared/components/atoms/dialog";
import { Button } from "@shared/components/atoms/button";
import { Input } from "@shared/components/atoms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/atoms/select";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/atoms/card";
import { Badge } from "@shared/components/atoms/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/components/atoms/tabs";
import { ScrollArea } from "@shared/components/atoms/scroll-area";
import { Separator } from "@shared/components/atoms/separator";
import { 
  Hospital, 
  Search, 
  Filter, 
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  Building2,
  Stethoscope,
  User,
  Download,
  RefreshCw,
  X,
  Clock,
  ExternalLink
} from "lucide-react";

interface ExternalMedicalRecord {
  id: string;
  hospitalName: string;
  hospitalType: "大学病院" | "総合病院" | "専門病院" | "クリニック";
  department: string;
  date: string;
  type: "診察" | "処方" | "検査" | "手術" | "入院";
  doctor: string;
  title: string;
  content: string;
  diagnosis?: string;
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: number;
  }>;
  testResults?: Array<{
    name: string;
    value: string;
    unit: string;
    normalRange: string;
    isAbnormal: boolean;
  }>;
  isImportant: boolean;
  referralSource?: boolean; // 紹介元かどうか
}

interface ExternalMedicalRecordsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  externalRecords: ExternalMedicalRecord[];
}

const hospitalTypes = [
  { value: "all", label: "すべて", icon: "🏥" },
  { value: "大学病院", label: "大学病院", icon: "🎓" },
  { value: "総合病院", label: "総合病院", icon: "🏢" },
  { value: "専門病院", label: "専門病院", icon: "🔬" },
  { value: "クリニック", label: "クリニック", icon: "🏪" },
];

const recordTypes = [
  { value: "all", label: "すべて", icon: "📋" },
  { value: "診察", label: "診察", icon: "👨‍⚕️" },
  { value: "処方", label: "処方", icon: "💊" },
  { value: "検査", label: "検査", icon: "🔬" },
  { value: "手術", label: "手術", icon: "⚕️" },
  { value: "入院", label: "入院", icon: "🏥" },
];

export function ExternalMedicalRecordsDialog({
  isOpen,
  onClose,
  patientName,
  patientId,
  externalRecords,
}: ExternalMedicalRecordsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitalTypeFilter, setHospitalTypeFilter] = useState("all");
  const [recordTypeFilter, setRecordTypeFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<ExternalMedicalRecord | null>(null);
  const [activeTab, setActiveTab] = useState("list");

  // フィルタリングされた記録
  const filteredRecords = useMemo(() => {
    return externalRecords.filter(record => {
      // 検索クエリフィルター
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!record.hospitalName.toLowerCase().includes(query) &&
            !record.department.toLowerCase().includes(query) &&
            !record.doctor.toLowerCase().includes(query) &&
            !record.title.toLowerCase().includes(query) &&
            !record.content.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 病院タイプフィルター
      if (hospitalTypeFilter !== "all" && record.hospitalType !== hospitalTypeFilter) {
        return false;
      }

      // 記録タイプフィルター
      if (recordTypeFilter !== "all" && record.type !== recordTypeFilter) {
        return false;
      }

      return true;
    });
  }, [externalRecords, searchQuery, hospitalTypeFilter, recordTypeFilter]);

  // 病院別グループ化
  const hospitalGroups = useMemo(() => {
    const groups: { [key: string]: ExternalMedicalRecord[] } = {};
    filteredRecords.forEach(record => {
      const key = record.hospitalName;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(record);
    });

    // 各グループを日付でソート
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    return groups;
  }, [filteredRecords]);

  // 統計情報
  const statistics = useMemo(() => {
    const total = externalRecords.length;
    const hospitals = new Set(externalRecords.map(r => r.hospitalName)).size;
    const departments = new Set(externalRecords.map(r => r.department)).size;
    const referralSources = externalRecords.filter(r => r.referralSource).length;
    const recent30Days = externalRecords.filter(r => {
      const recordDate = new Date(r.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return recordDate >= thirtyDaysAgo;
    }).length;

    return {
      total,
      hospitals,
      departments,
      referralSources,
      recent30Days,
      filtered: filteredRecords.length,
    };
  }, [externalRecords, filteredRecords]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case "診察": return <Stethoscope className="w-4 h-4" />;
      case "処方": return <Pill className="w-4 h-4" />;
      case "検査": return <FlaskConical className="w-4 h-4" />;
      case "手術": return <FileText className="w-4 h-4" />;
      case "入院": return <Hospital className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getHospitalTypeColor = (type: string) => {
    switch (type) {
      case "大学病院": return "bg-purple-100 text-purple-800 border-purple-200";
      case "総合病院": return "bg-blue-100 text-blue-800 border-blue-200";
      case "専門病院": return "bg-green-100 text-green-800 border-green-200";
      case "クリニック": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setHospitalTypeFilter("all");
    setRecordTypeFilter("all");
  };

  const renderRecordCard = (record: ExternalMedicalRecord) => (
    <Card 
      key={record.id}
      className={`cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 ${
        record.isImportant 
          ? "border-l-red-500 bg-red-50/50 hover:bg-red-50" 
          : record.referralSource
          ? "border-l-blue-500 bg-blue-50/50 hover:bg-blue-50"
          : "border-l-gray-300 hover:bg-gray-50/50"
      }`}
      onClick={() => setSelectedRecord(record)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center space-x-2">
                {getRecordTypeIcon(record.type)}
                <h4 className="font-semibold text-lg">{record.title}</h4>
                {record.referralSource && (
                  <Badge className="bg-blue-500 text-white text-xs">紹介元</Badge>
                )}
                {record.isImportant && (
                  <Badge variant="destructive" className="text-xs">重要</Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Building2 className="w-3 h-3 text-muted-foreground" />
                <span className="font-medium">{record.hospitalName}</span>
                <Badge variant="outline" className={getHospitalTypeColor(record.hospitalType)}>
                  {record.hospitalType}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-3 h-3 text-muted-foreground" />
                <span>{record.department}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span>{formatDate(record.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3 text-muted-foreground" />
                <span>{record.doctor}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <Badge variant="outline" className="text-xs">
              {record.type}
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-600 line-clamp-2">
          {record.content}
        </div>

        {record.diagnosis && (
          <div className="mt-2 pt-2 border-t">
            <span className="text-xs text-muted-foreground">診断: </span>
            <span className="text-sm font-medium">{record.diagnosis}</span>
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
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                <Hospital className="w-4 h-4 text-white" />
              </div>
              <div>
                <span>他院診療情報参照システム</span>
                <div className="text-sm font-normal text-muted-foreground">
                  {patientName} ({patientId}) - {statistics.total}件の他院記録
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
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
            他医療機関での診療記録・処方・検査結果を統合的に参照できます。
            紹介元病院の情報も含まれています。
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="list">記録一覧</TabsTrigger>
              <TabsTrigger value="hospitals">病院別表示</TabsTrigger>
              <TabsTrigger value="stats">統計情報</TabsTrigger>
            </TabsList>

            {/* 検索・フィルターエリア */}
            <div className="flex items-center space-x-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="病院名、診療科、医師名、記録内容で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={hospitalTypeFilter} onValueChange={setHospitalTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="病院タイプ" />
                </SelectTrigger>
                <SelectContent>
                  {hospitalTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={recordTypeFilter} onValueChange={setRecordTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="記録タイプ" />
                </SelectTrigger>
                <SelectContent>
                  {recordTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchQuery || hospitalTypeFilter !== "all" || recordTypeFilter !== "all") && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  クリア
                </Button>
              )}
            </div>

            <TabsContent value="list" className="flex-1 overflow-hidden">
              <div className="grid grid-cols-3 gap-4 h-full">
                {/* 記録リスト */}
                <div className="col-span-2">
                  <ScrollArea className="h-full">
                    <div className="space-y-3 pr-4">
                      {filteredRecords.map(renderRecordCard)}
                      
                      {filteredRecords.length === 0 && (
                        <Card className="p-8">
                          <div className="text-center space-y-4">
                            <Hospital className="w-12 h-12 mx-auto text-muted-foreground" />
                            <div>
                              <h3 className="font-medium text-lg mb-2">該当する記録がありません</h3>
                              <p className="text-sm text-muted-foreground">
                                検索条件またはフィルターを変更してください
                              </p>
                            </div>
                            <Button variant="outline" onClick={clearFilters}>
                              <Filter className="w-4 h-4 mr-2" />
                              フィルターをリセット
                            </Button>
                          </div>
                        </Card>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* 詳細パネル */}
                <div className="border-l pl-4">
                  {selectedRecord ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">記録詳細</h3>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center space-x-2 text-lg">
                            {getRecordTypeIcon(selectedRecord.type)}
                            <span>{selectedRecord.title}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">病院:</span>
                              <div className="font-medium">{selectedRecord.hospitalName}</div>
                              <Badge variant="outline" className={getHospitalTypeColor(selectedRecord.hospitalType)}>
                                {selectedRecord.hospitalType}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-muted-foreground">診療科:</span>
                              <div className="font-medium">{selectedRecord.department}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">担当医:</span>
                              <div className="font-medium">{selectedRecord.doctor}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">日付:</span>
                              <div className="font-medium">{formatDate(selectedRecord.date)}</div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <span className="text-muted-foreground text-sm">記録内容:</span>
                            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                              {selectedRecord.content}
                            </div>
                          </div>

                          {selectedRecord.diagnosis && (
                            <>
                              <Separator />
                              <div>
                                <span className="text-muted-foreground text-sm">診断:</span>
                                <div className="mt-1 font-medium">{selectedRecord.diagnosis}</div>
                              </div>
                            </>
                          )}

                          {selectedRecord.medications && selectedRecord.medications.length > 0 && (
                            <>
                              <Separator />
                              <div>
                                <span className="text-muted-foreground text-sm">処方薬:</span>
                                <div className="mt-2 space-y-2">
                                  {selectedRecord.medications.map((med, index) => (
                                    <div key={index} className="p-2 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                                      <div className="font-medium">{med.name}</div>
                                      <div className="text-muted-foreground">
                                        {med.dosage} {med.frequency} ({med.duration}日分)
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          {selectedRecord.testResults && selectedRecord.testResults.length > 0 && (
                            <>
                              <Separator />
                              <div>
                                <span className="text-muted-foreground text-sm">検査結果:</span>
                                <div className="mt-2 space-y-2">
                                  {selectedRecord.testResults.map((test, index) => (
                                    <div key={index} className="p-2 bg-green-50 dark:bg-green-950 rounded text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">{test.name}</span>
                                        <span className={test.isAbnormal ? "text-red-600" : "text-green-600"}>
                                          {test.value} {test.unit}
                                        </span>
                                      </div>
                                      <div className="text-muted-foreground text-xs">
                                        正常範囲: {test.normalRange}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center space-y-3">
                        <Hospital className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div>
                          <h3 className="font-medium mb-2">記録詳細</h3>
                          <p className="text-sm text-muted-foreground">
                            左側の記録を選択すると<br />
                            詳細情報が表示されます
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hospitals" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-4 pr-4">
                  {Object.entries(hospitalGroups).map(([hospitalName, records]) => (
                    <Card key={hospitalName}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            <span>{hospitalName}</span>
                            <Badge variant="outline" className={getHospitalTypeColor(records[0].hospitalType)}>
                              {records[0].hospitalType}
                            </Badge>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {records.length}件
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {records.slice(0, 3).map(renderRecordCard)}
                          {records.length > 3 && (
                            <div className="text-center">
                              <Button variant="outline" size="sm">
                                他 {records.length - 3}件を表示
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
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
                          <div className="text-sm text-muted-foreground">総記録数</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{statistics.hospitals}</div>
                          <div className="text-sm text-muted-foreground">連携病院数</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{statistics.departments}</div>
                          <div className="text-sm text-muted-foreground">診療科数</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{statistics.referralSources}</div>
                          <div className="text-sm text-muted-foreground">紹介元病院</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">最近の動向</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">最近30日の記録</span>
                          <Badge className="bg-blue-500">{statistics.recent30Days}件</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">現在のフィルター結果</span>
                          <Badge variant="outline">{statistics.filtered}件</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">病院タイプ別分布</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {hospitalTypes.slice(1).map(type => {
                          const count = externalRecords.filter(r => r.hospitalType === type.value).length;
                          const percentage = total => total > 0 ? Math.round((count / statistics.total) * 100) : 0;
                          
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
                                    style={{ width: `${percentage(statistics.total)}%` }}
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

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">記録タイプ別分布</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recordTypes.slice(1).map(type => {
                          const count = externalRecords.filter(r => r.type === type.value).length;
                          const percentage = total => total > 0 ? Math.round((count / statistics.total) * 100) : 0;
                          
                          return (
                            <div key={type.value} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span>{type.icon}</span>
                                <span className="text-sm">{type.label}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${percentage(statistics.total)}%` }}
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
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}