import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shared/components/atoms/dialog";
import { Button } from "@shared/components/atoms/button";
import { Input } from "@shared/components/atoms/input";
import { Label } from "@shared/components/atoms/label";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/atoms/card";
import { Badge } from "@shared/components/atoms/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/components/atoms/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/atoms/select";
import { Separator } from "@shared/components/atoms/separator";
import { ScrollArea } from "@shared/components/atoms/scroll-area";
import { Alert, AlertDescription } from "@shared/components/atoms/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@shared/components/atoms/tooltip";
import { 
  Pill, 
  Search, 
  Filter, 
  Calendar,
  AlertTriangle,
  Building2,
  Clock,
  Activity,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  Eye,
  EyeOff,
  Download,
  Printer,
  Copy,
  RefreshCw,
  Star,
  History,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  FilterX,
  ArrowUpDown,
  Calendar as CalendarIcon,
  MapPin,
  User
} from "lucide-react";
import { toast } from "sonner";

interface MedicationRecord {
  id: string;
  medicationName: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  route: string;
  prescribedDate: string;
  startDate: string;
  endDate?: string;
  duration: number; // 処方日数
  prescribedBy: string;
  department: string;
  institution: "自院" | "他院";
  institutionName: string;
  status: "継続中" | "完了" | "中止" | "変更";
  discontinueReason?: string;
  sideEffects?: string[];
  effectiveness?: "有効" | "やや有効" | "無効" | "不明";
  adherence?: "良好" | "不良" | "不明"; // 服薬遵守
  notes?: string;
  category: "循環器薬" | "糖尿病薬" | "消化器薬" | "抗生物質" | "鎮痛薬" | "精神薬" | "その他";
  warningLevel?: "注意" | "警告" | "禁忌";
  interactions?: string[];
  allergicReaction?: boolean;
}

interface MedicationHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  patientAllergies?: string[];
  medicationHistory: MedicationRecord[];
}

const drugCategories = [
  { value: "all", label: "すべて", icon: "💊" },
  { value: "循環器薬", label: "循環器薬", icon: "❤️" },
  { value: "糖尿病薬", label: "糖尿病薬", icon: "🩸" },
  { value: "消化器薬", label: "消化器薬", icon: "🫃" },
  { value: "抗生物質", label: "抗生物質", icon: "🦠" },
  { value: "鎮痛薬", label: "鎮痛薬", icon: "💊" },
  { value: "精神薬", label: "精神薬", icon: "🧠" },
  { value: "その他", label: "その他", icon: "📦" },
];

const institutionOptions = [
  { value: "all", label: "すべて", icon: "🏥" },
  { value: "自院", label: "自院のみ", icon: "🏠" },
  { value: "他院", label: "他院のみ", icon: "🏢" },
];

const statusOptions = [
  { value: "all", label: "すべて", icon: "📋" },
  { value: "継続中", label: "継続中", icon: "🟢" },
  { value: "完了", label: "完了", icon: "🔵" },
  { value: "中止", label: "中止", icon: "🔴" },
  { value: "変更", label: "変更", icon: "🟡" },
];

// クイックフィルタープリセット
const quickFilters = [
  { 
    id: "current", 
    label: "継続中の薬", 
    icon: Activity, 
    filters: { status: "継続中" },
    color: "bg-green-100 text-green-800 border-green-200"
  },
  { 
    id: "warnings", 
    label: "要注意薬剤", 
    icon: AlertTriangle, 
    filters: { showOnlyAlerts: true },
    color: "bg-red-100 text-red-800 border-red-200"
  },
  { 
    id: "own-hospital", 
    label: "自院処方", 
    icon: Building2, 
    filters: { institution: "自院" },
    color: "bg-blue-100 text-blue-800 border-blue-200"
  },
  { 
    id: "recent", 
    label: "最近30日", 
    icon: Clock, 
    filters: { recentDays: 30 },
    color: "bg-purple-100 text-purple-800 border-purple-200"
  },
];

// 薬剤名の候補リスト（よく使用される薬剤）
const commonMedications = [
  "アムロジピン", "メトホルミン", "ランソプラゾール", "アスピリン",
  "シタグリプチン", "ロキソプロフェン", "ウルソデオキシコール酸",
  "アトルバスタチン", "テルミサルタン", "ボグリボース"
];

export function MedicationHistoryDialog({
  isOpen,
  onClose,
  patientName,
  patientId,
  patientAllergies = [],
  medicationHistory,
}: MedicationHistoryDialogProps) {
  // フィルター状態
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);
  const [recentDays, setRecentDays] = useState<number | null>(null);
  
  // 表示・操作状態
  const [viewMode, setViewMode] = useState<"timeline" | "medication">("timeline");
  const [showSideEffects, setShowSideEffects] = useState(true);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [selectedMedication, setSelectedMedication] = useState<MedicationRecord | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 検索履歴の管理
  useEffect(() => {
    const saved = localStorage.getItem('medicationSearchHistory');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (error) {
        console.error('検索履歴の読み込みエラー:', error);
      }
    }
  }, []);

  const updateSearchHistory = useCallback((query: string) => {
    if (!query.trim() || searchHistory.includes(query)) return;
    
    const newHistory = [query, ...searchHistory.slice(0, 9)]; // 最新10件
    setSearchHistory(newHistory);
    localStorage.setItem('medicationSearchHistory', JSON.stringify(newHistory));
  }, [searchHistory]);

  // フィルタリングされた薬歴
  const filteredHistory = useMemo(() => {
    return medicationHistory.filter(record => {
      // 検索クエリフィルター
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!record.medicationName.toLowerCase().includes(query) &&
            !record.genericName?.toLowerCase().includes(query) &&
            !record.prescribedBy.toLowerCase().includes(query) &&
            !record.institutionName.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      // カテゴリフィルター
      if (categoryFilter !== "all" && record.category !== categoryFilter) {
        return false;
      }
      
      // 処方元フィルター
      if (institutionFilter !== "all" && record.institution !== institutionFilter) {
        return false;
      }
      
      // ステータスフィルター
      if (statusFilter !== "all" && record.status !== statusFilter) {
        return false;
      }
      
      // アラートのみ表示フィルター
      if (showOnlyAlerts) {
        if (!record.warningLevel && !record.allergicReaction && (!record.sideEffects || record.sideEffects.length === 0)) {
          return false;
        }
      }

      // 期間フィルター（最近n日）
      if (recentDays) {
        const prescribedDate = new Date(record.prescribedDate);
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - recentDays);
        if (prescribedDate < daysAgo) {
          return false;
        }
      }
      
      return true;
    });
  }, [medicationHistory, searchQuery, categoryFilter, institutionFilter, statusFilter, showOnlyAlerts, recentDays]);

  // ソート済み薬歴
  const sortedHistory = useMemo(() => {
    return [...filteredHistory].sort((a, b) => {
      const dateA = new Date(a.prescribedDate).getTime();
      const dateB = new Date(b.prescribedDate).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [filteredHistory, sortOrder]);

  // 薬剤別グループ化
  const medicationGroups = useMemo(() => {
    const groups: { [key: string]: MedicationRecord[] } = {};
    sortedHistory.forEach(record => {
      const key = record.medicationName;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(record);
    });
    
    // 各グループを処方日でソート
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        const dateA = new Date(a.prescribedDate).getTime();
        const dateB = new Date(b.prescribedDate).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
    });
    
    return groups;
  }, [sortedHistory, sortOrder]);

  // 統計情報の計算
  const statistics = useMemo(() => {
    const total = medicationHistory.length;
    const ongoing = medicationHistory.filter(r => r.status === "継続中").length;
    const ownHospital = medicationHistory.filter(r => r.institution === "自院").length;
    const otherHospital = medicationHistory.filter(r => r.institution === "他院").length;
    const withSideEffects = medicationHistory.filter(r => r.sideEffects && r.sideEffects.length > 0).length;
    const warnings = medicationHistory.filter(r => r.warningLevel || r.allergicReaction).length;

    return {
      total,
      ongoing,
      ownHospital,
      otherHospital,
      withSideEffects,
      warnings,
      filtered: filteredHistory.length,
    };
  }, [medicationHistory, filteredHistory]);

  // 検索候補の取得
  const getSearchSuggestions = useCallback(() => {
    if (!searchQuery) return searchHistory.slice(0, 5);
    
    const query = searchQuery.toLowerCase();
    const suggestions = [
      ...commonMedications.filter(med => med.toLowerCase().includes(query)),
      ...medicationHistory
        .map(r => r.medicationName)
        .filter((name, index, arr) => arr.indexOf(name) === index)
        .filter(name => name.toLowerCase().includes(query))
        .slice(0, 5)
    ];
    
    return [...new Set(suggestions)].slice(0, 8);
  }, [searchQuery, searchHistory, medicationHistory]);

  // キーボードナビゲーション
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Ctrl/Cmd + K で検索フォーカス
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Escape で検索クリア
      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery("");
        setShowSearchSuggestions(false);
      }

      // 矢印キーでタブ切り替え
      if (e.altKey) {
        if (e.key === 'ArrowLeft') {
          setViewMode("timeline");
        } else if (e.key === 'ArrowRight') {
          setViewMode("medication");
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchQuery]);

  // クイックフィルターの適用
  const applyQuickFilter = useCallback((filterId: string) => {
    const filter = quickFilters.find(f => f.id === filterId);
    if (!filter) return;

    // フィルターをリセット
    setCategoryFilter("all");
    setInstitutionFilter("all");
    setStatusFilter("all");
    setShowOnlyAlerts(false);
    setRecentDays(null);

    // 新しいフィルターを適用
    if (filter.filters.status) setStatusFilter(filter.filters.status);
    if (filter.filters.institution) setInstitutionFilter(filter.filters.institution);
    if (filter.filters.showOnlyAlerts) setShowOnlyAlerts(true);
    if (filter.filters.recentDays) setRecentDays(filter.filters.recentDays);

    toast.success(`${filter.label}フィルターを適用しました`);
  }, []);

  // フィルターのリセット
  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setCategoryFilter("all");
    setInstitutionFilter("all");
    setStatusFilter("all");
    setShowOnlyAlerts(false);
    setRecentDays(null);
    setShowSearchSuggestions(false);
    toast.success("フィルターをリセットしました");
  }, []);

  // 検索実行
  const handleSearch = useCallback((query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm.trim()) {
      updateSearchHistory(searchTerm.trim());
      setShowSearchSuggestions(false);
    }
  }, [searchQuery, updateSearchHistory]);

  // ステータスアイコンの取得
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "継続中":
        return <Activity className="w-4 h-4 text-green-600" />;
      case "完了":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "中止":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "変更":
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  // 警告レベルの色取得
  const getWarningColor = (level?: string) => {
    switch (level) {
      case "注意":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "警告":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "禁忌":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // 薬剤詳細の表示
  const showMedicationDetail = (medication: MedicationRecord) => {
    setSelectedMedication(medication);
  };

  // アレルギー・相互作用チェック
  const checkInteractions = (medication: MedicationRecord) => {
    const warnings = [];
    
    // アレルギーチェック（安全ガード）
    if (patientAllergies && Array.isArray(patientAllergies) && patientAllergies.length > 0) {
      if (patientAllergies.some(allergy => 
        medication.medicationName.toLowerCase().includes(allergy.toLowerCase()) ||
        medication.genericName?.toLowerCase().includes(allergy.toLowerCase())
      )) {
        warnings.push("アレルギー反応の可能性");
      }
    }
    
    // 相互作用チェック（安全ガード）
    if (medication.interactions && Array.isArray(medication.interactions) && medication.interactions.length > 0) {
      warnings.push("薬剤相互作用あり");
    }
    
    return warnings;
  };

  // エクスポート機能
  const handleExport = useCallback(() => {
    const csvData = sortedHistory.map(record => ({
      薬剤名: record.medicationName,
      一般名: record.genericName || "",
      用法用量: `${record.dosage} ${record.frequency}`,
      処方日: record.prescribedDate,
      処方医: record.prescribedBy,
      処方元: record.institutionName,
      ステータス: record.status,
      分類: record.category,
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `薬歴_${patientName}_${patientId}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    toast.success("薬歴をCSVファイルでエクスポートしました");
  }, [sortedHistory, patientName, patientId]);

  // タイムライン表示
  const renderTimelineView = () => (
    <div className="space-y-3">
      {sortedHistory.map((record, index) => {
        const warnings = checkInteractions(record);
        
        return (
          <Card 
            key={record.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 ${
              record.allergicReaction || record.warningLevel === "禁忌" 
                ? "border-l-red-500 bg-red-50/50 hover:bg-red-50" 
                : record.warningLevel 
                ? "border-l-orange-500 bg-orange-50/50 hover:bg-orange-50"
                : record.status === "継続中"
                ? "border-l-green-500 hover:bg-green-50/50"
                : "border-l-blue-500 hover:bg-blue-50/50"
            }`}
            onClick={() => showMedicationDetail(record)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <Pill className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-lg">{record.medicationName}</h4>
                      {record.genericName && (
                        <span className="text-sm text-muted-foreground">({record.genericName})</span>
                      )}
                    </div>
                    {getStatusIcon(record.status)}
                    {warnings.length > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{warnings.join(", ")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">用法用量:</span>
                      <span className="font-medium">{record.dosage} {record.frequency}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-3 h-3 text-muted-foreground" />
                      <span>{formatDate(record.prescribedDate)}</span>
                      {record.duration && <span className="text-muted-foreground">({record.duration}日分)</span>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-3 h-3 text-muted-foreground" />
                      <span>{record.institutionName}</span>
                      <Badge variant={record.institution === "自院" ? "default" : "secondary"} className="text-xs">
                        {record.institution}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span>{record.prescribedBy}</span>
                      <span className="text-muted-foreground text-xs">({record.department})</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant="outline" className={getWarningColor(record.warningLevel)}>
                    {record.status}
                  </Badge>
                  
                  {record.category && (
                    <Badge variant="secondary" className="text-xs">
                      {drugCategories.find(cat => cat.value === record.category)?.icon} {record.category}
                    </Badge>
                  )}

                  {record.effectiveness && (
                    <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                      効果: {record.effectiveness}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* 警告・副作用表示 */}
              {(warnings.length > 0 || (showSideEffects && record.sideEffects && record.sideEffects.length > 0)) && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  {warnings.length > 0 && (
                    <Alert className="py-2 border-red-200 bg-red-50">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="text-sm text-red-700">
                        {warnings.join(", ")}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {showSideEffects && record.sideEffects && record.sideEffects.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Info className="w-4 h-4 text-blue-600" />
                      <span className="text-muted-foreground">副作用:</span>
                      <div className="flex flex-wrap gap-1">
                        {record.sideEffects.map((effect, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ノート表示 */}
              {record.notes && (
                <div className="mt-2 pt-2 border-t">
                  <div className="flex items-start space-x-2 text-sm">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">備考:</span>
                      <p className="text-gray-700 mt-1">{record.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
      
      {sortedHistory.length === 0 && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <Pill className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-medium text-lg mb-2">該当する薬歴がありません</h3>
              <p className="text-sm text-muted-foreground">
                フィルター条件を変更してください
              </p>
            </div>
            <Button variant="outline" onClick={resetFilters}>
              <FilterX className="w-4 h-4 mr-2" />
              フィルターをリセット
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  // 薬剤別表示
  const renderMedicationView = () => (
    <div className="space-y-4">
      {Object.entries(medicationGroups).map(([medicationName, records]) => (
        <Card key={medicationName}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pill className="w-5 h-5 text-blue-600" />
                <span>{medicationName}</span>
                {records[0].genericName && (
                  <span className="text-sm text-muted-foreground">({records[0].genericName})</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {records.length}回処方
                </Badge>
                {records.some(r => r.status === "継続中") && (
                  <Badge className="text-xs bg-green-500">継続中</Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {records.map((record, index) => (
                <div 
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => showMedicationDetail(record)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(record.prescribedDate)}
                      </span>
                      <span className="text-sm font-medium">{record.dosage} {record.frequency}</span>
                      <Badge variant={record.institution === "自院" ? "default" : "secondary"} className="text-xs">
                        {record.institution}
                      </Badge>
                      {record.warningLevel && (
                        <Badge variant="destructive" className="text-xs">
                          {record.warningLevel}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {record.prescribedBy} - {record.institutionName} ({record.department})
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(record.status)}
                    <span className="text-sm">{record.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {Object.keys(medicationGroups).length === 0 && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <Pill className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-medium text-lg mb-2">該当する薬剤がありません</h3>
              <p className="text-sm text-muted-foreground">
                フィルター条件を変更してください
              </p>
            </div>
            <Button variant="outline" onClick={resetFilters}>
              <FilterX className="w-4 h-4 mr-2" />
              フィルターをリセット
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg">
                <Pill className="w-4 h-4 text-white" />
              </div>
              <div>
                <span>薬歴参照システム</span>
                <div className="text-sm font-normal text-muted-foreground">
                  {patientName} ({patientId}) - {statistics.total}件の薬歴
                </div>
              </div>
            </div>
            
            {/* ヘッダーアクション */}
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>CSV出力</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                      <Printer className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>印刷</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DialogTitle>
          <DialogDescription>
            患者の服薬歴・薬剤情報を包括的に管理・参照できます。アレルギー・相互作用の確認も行えます。
            <kbd className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded">Ctrl+K</kbd> で検索、
            <kbd className="ml-1 px-2 py-1 text-xs bg-gray-100 rounded">Alt+←→</kbd> でタブ切り替え
          </DialogDescription>
        </DialogHeader>

        {/* 統計サマリー */}
        <div className="flex-shrink-0 grid grid-cols-6 gap-4 py-4 border-b">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
            <div className="text-xs text-muted-foreground">総処方数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statistics.ongoing}</div>
            <div className="text-xs text-muted-foreground">継続中</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{statistics.ownHospital}</div>
            <div className="text-xs text-muted-foreground">自院処方</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{statistics.otherHospital}</div>
            <div className="text-xs text-muted-foreground">他院処方</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{statistics.withSideEffects}</div>
            <div className="text-xs text-muted-foreground">副作用報告</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{statistics.warnings}</div>
            <div className="text-xs text-muted-foreground">要注意薬剤</div>
          </div>
        </div>

        {/* クイックフィルター */}
        <div className="flex-shrink-0 py-3 border-b">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">クイックフィルター</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickFilters.map(filter => (
              <Button
                key={filter.id}
                variant="outline"
                size="sm"
                onClick={() => applyQuickFilter(filter.id)}
                className={`flex items-center space-x-2 hover:${filter.color}`}
              >
                <filter.icon className="w-4 h-4" />
                <span>{filter.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* フィルター・検索 */}
        <div className="flex-shrink-0 space-y-4 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* 検索ボックス */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="薬剤名・処方医で検索... (Ctrl+K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                  className="pl-10 w-80"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchSuggestions(false);
                    }}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
                
                {/* 検索候補 */}
                {showSearchSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {getSearchSuggestions().map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          setSearchQuery(suggestion);
                          handleSearch(suggestion);
                        }}
                      >
                        {searchHistory.includes(suggestion) ? (
                          <History className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Search className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* フィルター */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {drugCategories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      <span className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {institutionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center space-x-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center space-x-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* ソート順切り替え */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                    >
                      <ArrowUpDown className="w-4 h-4" />
                      {sortOrder === "desc" ? <ChevronLeft className="w-3 h-3 ml-1" /> : <ChevronRight className="w-3 h-3 ml-1" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {sortOrder === "desc" ? "新しい順" : "古い順"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* アラートのみ表示 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOnlyAlerts(!showOnlyAlerts)}
                className={showOnlyAlerts ? "bg-red-50 border-red-200 text-red-700" : ""}
              >
                <Shield className="w-4 h-4 mr-1" />
                {showOnlyAlerts ? "アラートのみ" : "すべて表示"}
              </Button>
              
              {/* 副作用表示切り替え */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSideEffects(!showSideEffects)}
              >
                {showSideEffects ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              
              {/* フィルターリセット */}
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RefreshCw className="w-4 h-4 mr-1" />
                リセット
              </Button>
            </div>
          </div>
          
          {/* フィルター状況表示 */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              {statistics.filtered !== statistics.total ? (
                <span className="text-blue-600 font-medium">
                  {statistics.filtered}件表示 (全{statistics.total}件中)
                </span>
              ) : (
                <span>{statistics.total}件の薬歴</span>
              )}
            </div>
            
            {/* アクティブフィルター表示 */}
            <div className="flex items-center space-x-2">
              {(searchQuery || categoryFilter !== "all" || institutionFilter !== "all" || statusFilter !== "all" || showOnlyAlerts || recentDays) && (
                <div className="flex items-center space-x-1">
                  <span className="text-xs">フィルター:</span>
                  {searchQuery && <Badge variant="secondary" className="text-xs">検索: {searchQuery}</Badge>}
                  {categoryFilter !== "all" && <Badge variant="secondary" className="text-xs">{categoryFilter}</Badge>}
                  {institutionFilter !== "all" && <Badge variant="secondary" className="text-xs">{institutionFilter}</Badge>}
                  {statusFilter !== "all" && <Badge variant="secondary" className="text-xs">{statusFilter}</Badge>}
                  {showOnlyAlerts && <Badge variant="destructive" className="text-xs">アラートのみ</Badge>}
                  {recentDays && <Badge variant="secondary" className="text-xs">最近{recentDays}日</Badge>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 表示切り替えタブ */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "timeline" | "medication")} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>時系列表示</span>
              <Badge variant="secondary" className="text-xs ml-2">{sortedHistory.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="medication" className="flex items-center space-x-2">
              <Pill className="w-4 h-4" />
              <span>薬剤別表示</span>
              <Badge variant="secondary" className="text-xs ml-2">{Object.keys(medicationGroups).length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="flex-1 overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="h-full">
              <div className="p-4">
                {renderTimelineView()}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="medication" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                {renderMedicationView()}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* 薬剤詳細ダイアログ */}
        {selectedMedication && (
          <Dialog open={!!selectedMedication} onOpenChange={() => setSelectedMedication(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Pill className="w-5 h-5 text-blue-600" />
                  <span>{selectedMedication.medicationName}</span>
                  {selectedMedication.warningLevel && (
                    <Badge variant="destructive" className="text-xs">
                      {selectedMedication.warningLevel}
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                  薬剤の詳細情報と処方履歴 - {formatDate(selectedMedication.prescribedDate)}処方
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* 基本情報 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">薬剤名</Label>
                    <div className="font-medium">{selectedMedication.medicationName}</div>
                    {selectedMedication.genericName && (
                      <div className="text-sm text-muted-foreground">({selectedMedication.genericName})</div>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">用法用量</Label>
                    <div className="font-medium">{selectedMedication.dosage}</div>
                    <div className="text-sm text-muted-foreground">{selectedMedication.frequency}</div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">処方期間</Label>
                    <div className="font-medium">
                      {formatDate(selectedMedication.startDate)}
                      {selectedMedication.endDate && ` - ${formatDate(selectedMedication.endDate)}`}
                    </div>
                    <div className="text-sm text-muted-foreground">{selectedMedication.duration}日分</div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">ステータス</Label>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedMedication.status)}
                      <span className="font-medium">{selectedMedication.status}</span>
                    </div>
                  </div>
                </div>
                
                {/* 処方元情報 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">処方元</Label>
                    <div className="font-medium">{selectedMedication.institutionName}</div>
                    <Badge variant={selectedMedication.institution === "自院" ? "default" : "secondary"} className="text-xs mt-1">
                      {selectedMedication.institution}
                    </Badge>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">処方医</Label>
                    <div className="font-medium">{selectedMedication.prescribedBy}</div>
                    <div className="text-sm text-muted-foreground">{selectedMedication.department}</div>
                  </div>
                </div>
                
                {/* 効果・服薬状況 */}
                {(selectedMedication.effectiveness || selectedMedication.adherence) && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedMedication.effectiveness && (
                      <div>
                        <Label className="text-sm text-muted-foreground">治療効果</Label>
                        <div className="font-medium">{selectedMedication.effectiveness}</div>
                      </div>
                    )}
                    
                    {selectedMedication.adherence && (
                      <div>
                        <Label className="text-sm text-muted-foreground">服薬遵守</Label>
                        <div className="font-medium">{selectedMedication.adherence}</div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* 副作用・警告 */}
                {(selectedMedication.sideEffects?.length || selectedMedication.interactions?.length || selectedMedication.warningLevel) && (
                  <div className="space-y-3">
                    {selectedMedication.warningLevel && (
                      <Alert className={getWarningColor(selectedMedication.warningLevel)}>
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription>
                          警告レベル: {selectedMedication.warningLevel}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {selectedMedication.sideEffects && selectedMedication.sideEffects.length > 0 && (
                      <div>
                        <Label className="text-sm text-muted-foreground">副作用</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedMedication.sideEffects.map((effect, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {effect}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedMedication.interactions && selectedMedication.interactions.length > 0 && (
                      <div>
                        <Label className="text-sm text-muted-foreground">相互作用</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedMedication.interactions.map((interaction, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {interaction}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* 備考 */}
                {selectedMedication.notes && (
                  <div>
                    <Label className="text-sm text-muted-foreground">備考</Label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                      {selectedMedication.notes}
                    </div>
                  </div>
                )}
                
                {/* 中止理由 */}
                {selectedMedication.discontinueReason && (
                  <div>
                    <Label className="text-sm text-muted-foreground">中止理由</Label>
                    <div className="mt-1 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm">
                      {selectedMedication.discontinueReason}
                    </div>
                  </div>
                )}

                {/* アクション */}
                <div className="flex items-center space-x-2 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => {
                    navigator.clipboard.writeText(
                      `${selectedMedication.medicationName} ${selectedMedication.dosage} ${selectedMedication.frequency}`
                    );
                    toast.success("処方内容をコピーしました");
                  }}>
                    <Copy className="w-4 h-4 mr-2" />
                    処方内容をコピー
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={() => {
                    toast.info("処方箋への反映機能（開発中）");
                  }}>
                    <FileText className="w-4 h-4 mr-2" />
                    処方箋に反映
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}