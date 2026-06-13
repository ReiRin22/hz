'use client';
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/atoms/dialog";
import { Button } from "@/shared/components/atoms/button";
import { Input } from "@/shared/components/atoms/input";
import { Label } from "@/shared/components/atoms/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
import { Separator } from "@/shared/components/atoms/separator";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import { Alert, AlertDescription } from "@/shared/components/atoms/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/atoms/tooltip";
import { Switch } from "@/shared/components/atoms/switch";
import { 
  FlaskConical,
  Activity,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Download,
  Printer,
  Share,
  Clock,
  User,
  Building2,
  FileText,
  Image as ImageIcon,
  FileImage,
  Heart,
  Brain,
  Droplets,
  Zap,
  BarChart3,
  LineChart,
  PieChart,
  RefreshCw,
  Info,
  Settings,
  Star,
  Bookmark,
  Filter as FilterIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileX,
  CheckSquare,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart as RechartsBarChart, Bar } from "recharts";

interface TestResult {
  id: string;
  testDate: string;
  testTime: string;
  category: "血液検査" | "尿検査" | "生化学" | "血液学" | "免疫学" | "微生物学" | "病理学" | "心電図" | "脳波" | "超音波" | "X線" | "内視鏡" | "機能検査";
  testName: string;
  testCode?: string;
  value?: number | string;
  unit?: string;
  normalRange: string;
  isAbnormal: boolean;
  severity?: "軽度" | "中等度" | "重度";
  comment?: string;
  referenceValue?: number;
  trend?: "上昇" | "下降" | "安定" | "変動";
  labName: string;
  technician?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  isImageResult?: boolean;
  imageUrl?: string;
  pdfUrl?: string;
  isUrgent?: boolean;
  isCritical?: boolean;
  department: string;
  orderingPhysician: string;
}

interface TestCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  count: number;
}

interface TestResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  testResults?: TestResult[];
}

// 検査カテゴリー設定
const testCategories: TestCategory[] = [
  {
    id: "all",
    name: "すべて",
    icon: FlaskConical,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    description: "全ての検査結果",
    count: 0
  },
  {
    id: "血液検査",
    name: "血液検査",
    icon: Droplets,
    color: "bg-red-100 text-red-800 border-red-200",
    description: "血液成分・血球数等",
    count: 0
  },
  {
    id: "尿検査",
    name: "尿検査",
    icon: FlaskConical,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    description: "尿成分・尿沈渣等",
    count: 0
  },
  {
    id: "生化学",
    name: "生化学",
    icon: Zap,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    description: "肝機能・腎機能・血糖等",
    count: 0
  },
  {
    id: "心電図",
    name: "心電図",
    icon: Heart,
    color: "bg-pink-100 text-pink-800 border-pink-200",
    description: "心電図・ホルター等",
    count: 0
  },
  {
    id: "脳波",
    name: "脳波",
    icon: Brain,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    description: "脳波・誘発電位等",
    count: 0
  },
  {
    id: "超音波",
    name: "超音波",
    icon: Activity,
    color: "bg-teal-100 text-teal-800 border-teal-200",
    description: "エコー検査",
    count: 0
  },
  {
    id: "機能検査",
    name: "機能検査",
    icon: Activity,
    color: "bg-green-100 text-green-800 border-green-200",
    description: "肺機能・聴力等",
    count: 0
  }
];

// サンプル検査結果データ
const sampleTestResults: TestResult[] = [
  // 血液検査
  {
    id: "test001",
    testDate: "2024-12-27",
    testTime: "09:30",
    category: "血液検査",
    testName: "白血球数",
    testCode: "WBC",
    value: 8500,
    unit: "/μL",
    normalRange: "4000-9000",
    isAbnormal: false,
    labName: "中央検査室",
    technician: "検査技師A",
    verifiedBy: "検査科医師",
    verifiedAt: "2024-12-27 11:30",
    trend: "安定",
    department: "内科",
    orderingPhysician: "田中医師"
  },
  {
    id: "test002",
    testDate: "2024-12-27",
    testTime: "09:30",
    category: "血液検査",
    testName: "赤血球数",
    testCode: "RBC",
    value: 380,
    unit: "万/μL",
    normalRange: "400-500",
    isAbnormal: true,
    severity: "軽度",
    comment: "軽度の貧血傾向",
    labName: "中央検査室",
    technician: "検査技師A",
    verifiedBy: "検査科医師",
    verifiedAt: "2024-12-27 11:30",
    trend: "下降",
    department: "内科",
    orderingPhysician: "田中医師"
  },
  {
    id: "test003",
    testDate: "2024-12-27",
    testTime: "09:30",
    category: "血液検査",
    testName: "ヘモグロビン",
    testCode: "Hb",
    value: 10.8,
    unit: "g/dL",
    normalRange: "12.0-15.0",
    isAbnormal: true,
    severity: "中等度",
    comment: "貧血あり。鉄欠乏性貧血疑い",
    labName: "中央検査室",
    technician: "検査技師A",
    verifiedBy: "検査科医師",
    verifiedAt: "2024-12-27 11:30",
    trend: "下降",
    department: "内科",
    orderingPhysician: "田中医師",
    isCritical: false
  },
  
  // 生化学検査
  {
    id: "test004",
    testDate: "2024-12-27",
    testTime: "09:30",
    category: "生化学",
    testName: "血糖",
    testCode: "GLU",
    value: 145,
    unit: "mg/dL",
    normalRange: "70-109",
    isAbnormal: true,
    severity: "軽度",
    comment: "軽度高血糖",
    labName: "中央検査室",
    technician: "検査技師B",
    verifiedBy: "検査科医師",
    verifiedAt: "2024-12-27 11:45",
    trend: "上昇",
    department: "内科",
    orderingPhysician: "田中医師"
  },
  {
    id: "test005",
    testDate: "2024-12-27",
    testTime: "09:30",
    category: "生化学",
    testName: "HbA1c",
    testCode: "HbA1c",
    value: 7.2,
    unit: "%",
    normalRange: "4.6-6.2",
    isAbnormal: true,
    severity: "中等度",
    comment: "糖尿病コントロール不良",
    labName: "中央検査室",
    technician: "検査技師B",
    verifiedBy: "検査科医師",
    verifiedAt: "2024-12-27 11:45",
    trend: "上昇",
    department: "内科",
    orderingPhysician: "田中医師"
  },
  {
    id: "test006",
    testDate: "2024-12-27",
    testTime: "09:30",
    category: "生化学",
    testName: "AST(GOT)",
    testCode: "AST",
    value: 85,
    unit: "U/L",
    normalRange: "10-40",
    isAbnormal: true,
    severity: "中等度",
    comment: "肝機能異常あり",
    labName: "中央検査室",
    technician: "検査技師B",
    verifiedBy: "検査科医師",
    verifiedAt: "2024-12-27 11:45",
    trend: "上昇",
    department: "内科",
    orderingPhysician: "田中医師"
  },
  
  // 尿検査
  {
    id: "test007",
    testDate: "2024-12-26",
    testTime: "14:00",
    category: "尿検査",
    testName: "尿蛋白",
    testCode: "PRO",
    value: "2+",
    unit: "",
    normalRange: "陰性(-)",
    isAbnormal: true,
    severity: "中等度",
    comment: "蛋白尿あり。腎機能精査要",
    labName: "中央検査室",
    technician: "検査技師C",
    verifiedBy: "検査科医師",
    verifiedAt: "2024-12-26 16:00",
    trend: "上昇",
    department: "内科",
    orderingPhysician: "田中医師"
  },
  
  // 心電図検査
  {
    id: "test008",
    testDate: "2024-12-25",
    testTime: "10:30",
    category: "心電図",
    testName: "安静時心電図",
    testCode: "ECG",
    value: "軽度ST低下",
    unit: "",
    normalRange: "正常",
    isAbnormal: true,
    severity: "軽度",
    comment: "V4-V6誘導で軽度ST低下。虚血性変化疑い",
    labName: "生理検査室",
    technician: "検査技師D",
    verifiedBy: "循環器科医師",
    verifiedAt: "2024-12-25 12:30",
    trend: "安定",
    department: "循環器内科",
    orderingPhysician: "田中医師",
    isImageResult: true,
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&auto=format&fm=jpg&q=80&crop=center&bg=000000&blend=000000&blend-mode=multiply&blend-alpha=30"
  },
  
  // 超音波検査
  {
    id: "test009",
    testDate: "2024-12-24",
    testTime: "15:30",
    category: "超音波",
    testName: "腹部超音波",
    testCode: "US-ABD",
    value: "脂肪肝",
    unit: "",
    normalRange: "正常",
    isAbnormal: true,
    severity: "軽度",
    comment: "軽度脂肪肝あり。肝実質エコー上昇",
    labName: "放射線科",
    technician: "検査技師E",
    verifiedBy: "放射線科医師",
    verifiedAt: "2024-12-24 17:30",
    trend: "安定",
    department: "内科",
    orderingPhysician: "田中医師",
    isImageResult: true,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&auto=format&fm=jpg&q=80&crop=center&bg=1a1a1a&blend=1a1a1a&blend-mode=multiply&blend-alpha=40"
  },
  
  // 過去のデータ（トレンド分析用）
  {
    id: "test010",
    testDate: "2024-12-20",
    testTime: "09:00",
    category: "生化学",
    testName: "血糖",
    testCode: "GLU",
    value: 140,
    unit: "mg/dL",
    normalRange: "70-109",
    isAbnormal: true,
    severity: "軽度",
    labName: "中央検査室",
    department: "内科",
    orderingPhysician: "田中医師"
  },
  {
    id: "test011",
    testDate: "2024-12-15",
    testTime: "09:30",
    category: "生化学",
    testName: "血糖",
    testCode: "GLU",
    value: 135,
    unit: "mg/dL",
    normalRange: "70-109",
    isAbnormal: true,
    severity: "軽度",
    labName: "中央検査室",
    department: "内科",
    orderingPhysician: "田中医師"
  }
];

export function TestResultsDialog({
  isOpen,
  onClose,
  patientId,
  patientName,
  testResults = [],
}: TestResultsDialogProps) {
  // フィルター・表示状態
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // "all", "today", "week", "month"
  const [showOnlyAbnormal, setShowOnlyAbnormal] = useState(false);
  const [showOnlyCritical, setShowOnlyCritical] = useState(false);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [sortBy, setSortBy] = useState<"date" | "category" | "name">("date");
  
  // 表示モード
  const [viewMode, setViewMode] = useState<"list" | "timeline" | "category" | "trends">("list");
  const [selectedTestForTrend, setSelectedTestForTrend] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedTestsForCompare, setSelectedTestsForCompare] = useState<string[]>([]);
  
  // 画像表示
  const [selectedImage, setSelectedImage] = useState<TestResult | null>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  // 実際の検査結果とサンプルデータを統合
  const allTestResults = useMemo(() => {
    // 実際のtestResultsがある場合はそれを使用、なければサンプルデータを使用
    if (testResults && testResults.length > 0) {
      // testResultsのフォーマットを TestResult 型に変換
      const convertedResults: TestResult[] = testResults.map((result, index) => ({
        id: `real_${index}`,
        testDate: new Date().toISOString().split('T')[0], // 今日の日付
        testTime: "09:30",
        category: "生化学" as const, // デフォルトカテゴリ
        testName: result.testName,
        testCode: result.testName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5),
        value: result.value,
        unit: result.unit,
        normalRange: result.normalRange,
        isAbnormal: result.isAbnormal,
        severity: result.isAbnormal ? "軽度" as const : undefined,
        comment: result.isAbnormal ? "要注意値です" : "正常範囲内です",
        labName: "中央検査室",
        technician: "検査技師",
        verifiedBy: "検査科医師",
        verifiedAt: new Date().toISOString(),
        trend: "安定" as const,
        department: "内科",
        orderingPhysician: "主治医",
        isImageResult: false,
        isUrgent: result.isAbnormal,
        isCritical: false,
      }));
      
      // 実際のデータとサンプルデータを組み合わせ（実際のデータを優先）
      return [...convertedResults, ...sampleTestResults];
    } else {
      // 実際のデータがない場合はサンプルデータのみ
      return sampleTestResults;
    }
  }, [testResults]);

  // フィルタリングされた結果
  const filteredResults = useMemo(() => {
    return allTestResults.filter(result => {
      // カテゴリフィルター
      if (selectedCategory !== "all" && result.category !== selectedCategory) {
        return false;
      }
      
      // 検索クエリフィルター
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!result.testName.toLowerCase().includes(query) &&
            !result.testCode?.toLowerCase().includes(query) &&
            !result.comment?.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      // 日付フィルター
      const resultDate = new Date(result.testDate);
      const now = new Date();
      
      switch (dateFilter) {
        case "today":
          if (resultDate.toDateString() !== now.toDateString()) return false;
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (resultDate < weekAgo) return false;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (resultDate < monthAgo) return false;
          break;
      }
      
      // 異常値のみ表示
      if (showOnlyAbnormal && !result.isAbnormal) {
        return false;
      }
      
      // 重要のみ表示
      if (showOnlyCritical && !result.isCritical) {
        return false;
      }
      
      return true;
    });
  }, [allTestResults, selectedCategory, searchQuery, dateFilter, showOnlyAbnormal, showOnlyCritical]);

  // ソート済み結果
  const sortedResults = useMemo(() => {
    return [...filteredResults].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "date":
          const dateA = new Date(`${a.testDate} ${a.testTime}`);
          const dateB = new Date(`${b.testDate} ${b.testTime}`);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "name":
          comparison = a.testName.localeCompare(b.testName);
          break;
      }
      
      return sortOrder === "desc" ? -comparison : comparison;
    });
  }, [filteredResults, sortBy, sortOrder]);

  // カテゴリ別カウント更新
  const categoriesWithCounts = useMemo(() => {
    return testCategories.map(category => ({
      ...category,
      count: category.id === "all" 
        ? allTestResults.length 
        : allTestResults.filter(result => result.category === category.id).length
    }));
  }, [allTestResults]);

  // トレンド分析用データ
  const trendData = useMemo(() => {
    if (!selectedTestForTrend) return [];
    
    const trendResults = allTestResults
      .filter(result => result.testName === selectedTestForTrend && typeof result.value === 'number')
      .sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime())
      .map(result => ({
        date: result.testDate,
        value: result.value as number,
        isAbnormal: result.isAbnormal,
        normalMin: parseFloat(result.normalRange.split('-')[0]) || 0,
        normalMax: parseFloat(result.normalRange.split('-')[1]) || 100,
      }));
    
    return trendResults;
  }, [selectedTestForTrend, allTestResults]);

  // 異常値の取得
  const getAbnormalResults = useCallback(() => {
    return allTestResults.filter(result => result.isAbnormal);
  }, [allTestResults]);

  // 重要な異常値の取得
  const getCriticalResults = useCallback(() => {
    return allTestResults.filter(result => result.isCritical || result.severity === "重度");
  }, [allTestResults]);

  // 統計情報の計算
  const statistics = useMemo(() => {
    const total = allTestResults.length;
    const abnormal = getAbnormalResults().length;
    const critical = getCriticalResults().length;
    const today = allTestResults.filter(result => 
      new Date(result.testDate).toDateString() === new Date().toDateString()
    ).length;
    
    return {
      total,
      abnormal,
      critical,
      today,
      normalRate: total > 0 ? ((total - abnormal) / total * 100).toFixed(1) : "0",
    };
  }, [allTestResults, getAbnormalResults, getCriticalResults]);

  // 検査結果の詳細表示
  const showTestDetail = (result: TestResult) => {
    if (result.isImageResult && result.imageUrl) {
      setSelectedImage(result);
      setImageViewerOpen(true);
    } else {
      // 通常の検査結果詳細表示
      toast.info(`${result.testName}の詳細`, {
        description: `値: ${result.value}${result.unit || ""} | 基準値: ${result.normalRange}`,
        duration: 3000,
      });
    }
  };

  // エクスポート機能
  const handleExport = useCallback(() => {
    const exportData = sortedResults.map(result => ({
      検査日: result.testDate,
      検査名: result.testName,
      値: `${result.value}${result.unit || ""}`,
      基準値: result.normalRange,
      異常: result.isAbnormal ? "異常" : "正常",
      コメント: result.comment || "",
    }));

    // 実際の実装ではCSVやPDFとしてエクスポート
    toast.success("検査結果をエクスポートしました");
  }, [sortedResults]);

  // 値の状態を取得（正常、軽度異常、中等度異常、重度異常）
  const getValueStatus = (result: TestResult) => {
    if (!result.isAbnormal) {
      return { color: "text-green-600", bgColor: "bg-green-50", label: "正常" };
    }
    
    switch (result.severity) {
      case "軽度":
        return { color: "text-yellow-600", bgColor: "bg-yellow-50", label: "軽度異常" };
      case "中等度":
        return { color: "text-orange-600", bgColor: "bg-orange-50", label: "中等度異常" };
      case "重度":
        return { color: "text-red-600", bgColor: "bg-red-50", label: "重度異常" };
      default:
        return { color: "text-yellow-600", bgColor: "bg-yellow-50", label: "異常" };
    }
  };

  // トレンド矢印の取得
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "上昇":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "下降":
        return <TrendingDown className="w-4 h-4 text-blue-500" />;
      case "安定":
        return <Minus className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // リスト表示
  const renderListView = () => (
    <div className="space-y-3">
      {sortedResults.map((result) => {
        const status = getValueStatus(result);
        
        return (
          <Card 
            key={result.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 ${
              result.isCritical 
                ? "border-l-red-500 bg-red-50/50" 
                : result.isAbnormal
                ? "border-l-orange-500 bg-orange-50/50"
                : "border-l-green-500 bg-green-50/50"
            }`}
            onClick={() => showTestDetail(result)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {testCategories.find(cat => cat.id === result.category)?.icon && 
                        React.createElement(testCategories.find(cat => cat.id === result.category)!.icon, { className: "w-4 h-4 text-blue-600" })
                      }
                      <h4 className="font-semibold text-lg">{result.testName}</h4>
                      {result.testCode && (
                        <Badge variant="outline" className="text-xs">
                          {result.testCode}
                        </Badge>
                      )}
                    </div>
                    {getTrendIcon(result.trend)}
                    {result.isCritical && (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    {result.isImageResult && (
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">測定値:</span>
                      <span className={`ml-2 font-semibold ${status.color}`}>
                        {result.value}{result.unit || ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">基準値:</span>
                      <span className="ml-2">{result.normalRange}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span>{formatDate(result.testDate)} {result.testTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-3 h-3 text-muted-foreground" />
                      <span>{result.labName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span>{result.orderingPhysician}</span>
                    </div>
                    {result.verifiedBy && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-xs">確認済み: {result.verifiedBy}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant="outline" className={status.color}>
                    {status.label}
                  </Badge>
                  
                  <Badge variant="secondary" className="text-xs">
                    {testCategories.find(cat => cat.id === result.category)?.name}
                  </Badge>

                  {result.isUrgent && (
                    <Badge variant="destructive" className="text-xs">
                      緊急
                    </Badge>
                  )}
                </div>
              </div>
              
              {result.comment && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-start space-x-2 text-sm">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-muted-foreground">コメント:</span>
                      <p className="text-gray-700 mt-1">{result.comment}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
      
      {sortedResults.length === 0 && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-medium text-lg mb-2">該当する検査結果がありません</h3>
              <p className="text-sm text-muted-foreground">
                フィルター条件を変更してください
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  // トレンド表示
  const renderTrendView = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Label>検査項目選択:</Label>
        <Select value={selectedTestForTrend || ""} onValueChange={setSelectedTestForTrend}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="検査項目を選択" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(new Set(allTestResults.map(r => r.testName)))
              .filter(name => allTestResults.some(r => r.testName === name && typeof r.value === 'number'))
              .map(name => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedTestForTrend && trendData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LineChart className="w-5 h-5" />
              <span>{selectedTestForTrend} のトレンド</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="normalMin" 
                    stroke="#10b981" 
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="normalMax" 
                    stroke="#10b981" 
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // カテゴリ別表示
  const renderCategoryView = () => {
    const groupedResults = sortedResults.reduce((groups, result) => {
      const category = result.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(result);
      return groups;
    }, {} as { [key: string]: TestResult[] });

    return (
      <div className="space-y-6">
        {Object.entries(groupedResults).map(([category, results]) => {
          const categoryInfo = testCategories.find(cat => cat.id === category);
          
          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  {categoryInfo?.icon && React.createElement(categoryInfo.icon, { className: "w-5 h-5" })}
                  <span>{categoryInfo?.name || category}</span>
                  <Badge variant="secondary">{results.length}件</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {results.map(result => {
                    const status = getValueStatus(result);
                    
                    return (
                      <div 
                        key={result.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => showTestDetail(result)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{result.testName}</span>
                            <span className={`font-semibold ${status.color}`}>
                              {result.value}{result.unit || ""}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({result.normalRange})
                            </span>
                            {result.isImageResult && (
                              <ImageIcon className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDate(result.testDate)} {result.testTime}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(result.trend)}
                          <Badge variant="outline" className={`text-xs ${status.color}`}>
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg">
                <FlaskConical className="w-4 h-4 text-white" />
              </div>
              <div>
                <span>検査結果参照システム</span>
                <div className="text-sm font-normal text-muted-foreground">
                  {patientName} ({patientId}) - {statistics.total}件の検査結果
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>検査結果出力</TooltipContent>
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
            検体検査・生理検査の結果を統合表示。異常値の確認、トレンド分析、画像結果の参照が可能です。
          </DialogDescription>
        </DialogHeader>

        {/* 統計サマリー */}
        <div className="flex-shrink-0 grid grid-cols-5 gap-4 py-4 border-b">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
            <div className="text-xs text-muted-foreground">総検査数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statistics.total - statistics.abnormal}</div>
            <div className="text-xs text-muted-foreground">正常値</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{statistics.abnormal}</div>
            <div className="text-xs text-muted-foreground">異常値</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{statistics.critical}</div>
            <div className="text-xs text-muted-foreground">要注意</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{statistics.today}</div>
            <div className="text-xs text-muted-foreground">本日実施</div>
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
                  placeholder="検査名・コードで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {/* 実際のデータ表示バッジ */}
              {testResults && testResults.length > 0 && (
                <Badge className="bg-blue-500 text-white">
                  実際のデータ {testResults.length}件含む
                </Badge>
              )}
              
              {/* カテゴリフィルター */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoriesWithCounts.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center space-x-2">
                        {React.createElement(category.icon, { className: "w-4 h-4" })}
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* 日付フィルター */}
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全期間</SelectItem>
                  <SelectItem value="today">今日</SelectItem>
                  <SelectItem value="week">1週間</SelectItem>
                  <SelectItem value="month">1ヶ月</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* 異常値のみ表示 */}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showOnlyAbnormal}
                  onCheckedChange={setShowOnlyAbnormal}
                />
                <Label className="text-sm">異常値のみ</Label>
              </div>
              
              {/* 重要のみ表示 */}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showOnlyCritical}
                  onCheckedChange={setShowOnlyCritical}
                />
                <Label className="text-sm">要注意のみ</Label>
              </div>
              
              {/* ソート */}
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [by, order] = value.split('-');
                setSortBy(by as any);
                setSortOrder(order as any);
              }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">新しい順</SelectItem>
                  <SelectItem value="date-asc">古い順</SelectItem>
                  <SelectItem value="name-asc">名前順</SelectItem>
                  <SelectItem value="category-asc">カテゴリ順</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* フィルター状況表示 */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{sortedResults.length}件表示 (全{testResults.length}件中)</span>
            
            {/* 異常値アラート */}
            {statistics.critical > 0 && (
              <Alert className="max-w-md py-2 border-red-200 bg-red-50">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription className="text-sm text-red-700">
                  要注意項目が{statistics.critical}件あります
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* 表示切り替えタブ */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <FlaskConical className="w-4 h-4" />
              <span>一覧表示</span>
            </TabsTrigger>
            <TabsTrigger value="category" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>カテゴリ別</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center space-x-2">
              <LineChart className="w-4 h-4" />
              <span>トレンド分析</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>タイムライン</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                {renderListView()}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="category" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                {renderCategoryView()}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="trends" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                {renderTrendView()}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="timeline" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">タイムライン表示</p>
                  <p className="text-sm text-muted-foreground">準備中</p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* 画像ビューワーダイアログ */}
        {selectedImage && (
          <Dialog open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>{selectedImage.testName}</span>
                  <Badge variant="outline">{selectedImage.category}</Badge>
                </DialogTitle>
                <DialogDescription>
                  検査日: {formatDate(selectedImage.testDate)} {selectedImage.testTime} | 
                  検査室: {selectedImage.labName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {selectedImage.imageUrl && (
                  <div className="bg-black rounded-lg p-4">
                    <img
                      src={selectedImage.imageUrl}
                      alt={selectedImage.testName}
                      className="w-full h-auto max-h-96 object-contain mx-auto"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>所見:</Label>
                    <p className="mt-1 p-2 bg-gray-50 rounded">{selectedImage.comment || "特記事項なし"}</p>
                  </div>
                  <div>
                    <Label>検査者:</Label>
                    <p className="mt-1">{selectedImage.technician}</p>
                    <Label className="mt-2 block">確認者:</Label>
                    <p className="mt-1">{selectedImage.verifiedBy}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}