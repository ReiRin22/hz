import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { Separator } from "@/shared/components/atoms/separator";
import { Input } from "@/shared/components/atoms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
import { Button } from "@/shared/components/atoms/button";
import { Checkbox } from "@/shared/components/atoms/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/atoms/popover";
import { Label } from "@/shared/components/atoms/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/atoms/radio-group";
import { Calendar } from "@/shared/components/atoms/calendar";
import { 
  FileText, Heart, Pill, FlaskConical, Search, Filter, 
  ChevronRight, ChevronDown, Building2, Stethoscope, Syringe, Scissors, 
  Microscope, Eye, ImageIcon, Activity, Droplets, BookOpen, Cross, File,
  Calendar as CalendarIcon, X, FileCheck, ScanLine
} from "lucide-react";
import { useState, useMemo } from "react";
import type { HospitalizationEpisode } from "../types/patient-types";

interface Record {
  id: string;
  date: string;
  time: string;
  type: 
    | "progress"        // 経過記録
    | "nursing"         // 看護記録
    | "prescription"    // 処方
    | "injection"       // 注射
    | "treatment"       // 処置
    | "test"            // 検体検査
    | "bacteriology"    // 細菌検査
    | "pathology"       // 病理検査
    | "physiology"      // 生理検査
    | "endoscopy"       // 内視鏡
    | "radiology"       // 画像検査
    | "rehabilitation"  // リハビリ
    | "dialysis"        // 透析
    | "guidance"        // 指導
    | "surgery"         // 手術
    | "vital"           // バイタルサイン
    | "observation"     // 観察記録
    | "medicalDocument" // 診療文書（診療情報提供書、紹介状など）
    | "certificate"     // 証明／提出文書（診断書、証明書など）
    | "scannedDocument"; // 取込文書（スキャン）
  visitType?: "inpatient" | "outpatient";  // 入院 / 外来
  hospitalizationId?: string;  // 入院エピソードID
  content: string;
  author: string;
  insurance?: { type: string; burden: string };
  soapRecord?: string;
  schema?: string;  // シェーマ画像のURL
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
  onRecordSelect: (record: Record | Record[]) => void;  // 単一または複数の記録を受け取れるように
  selectedRecordId?: any;  // Record | Record[] | undefined
  onApplyRecord?: (record: Record) => void;
}

const recordTypeConfig = {
  progress: { icon: FileText, label: "経過記録", color: "bg-blue-500", profession: "医師" },
  nursing: { icon: Heart, label: "看護記録", color: "bg-green-500", profession: "看護師" },
  prescription: { icon: Pill, label: "処方", color: "bg-purple-500", profession: "医師" },
  injection: { icon: Syringe, label: "注射", color: "bg-pink-500", profession: "医師" },
  treatment: { icon: Scissors, label: "処置", color: "bg-cyan-500", profession: "医師" },
  test: { icon: FlaskConical, label: "検体検査", color: "bg-orange-500", profession: "検査技師" },
  bacteriology: { icon: Microscope, label: "細菌検査", color: "bg-amber-600", profession: "検査技師" },
  pathology: { icon: Microscope, label: "病理検査", color: "bg-red-600", profession: "検査技師" },
  physiology: { icon: Activity, label: "生理検査", color: "bg-teal-500", profession: "検査技師" },
  endoscopy: { icon: Eye, label: "内視鏡", color: "bg-indigo-500", profession: "医師" },
  radiology: { icon: ImageIcon, label: "画像検査", color: "bg-slate-600", profession: "放射線技師" },
  rehabilitation: { icon: Activity, label: "リハビリ", color: "bg-lime-500", profession: "リハビリ" },
  dialysis: { icon: Droplets, label: "透析", color: "bg-sky-600", profession: "看護師" },
  guidance: { icon: BookOpen, label: "指導", color: "bg-emerald-500", profession: "医師" },
  surgery: { icon: Cross, label: "手術", color: "bg-rose-600", profession: "医師" },
  vital: { icon: Activity, label: "バイタル", color: "bg-red-500", profession: "看護師" },
  observation: { icon: Eye, label: "観察記録", color: "bg-gray-500", profession: "看護師" },
  medicalDocument: { icon: FileText, label: "診療文書", color: "bg-indigo-600", profession: "医師" },
  certificate: { icon: FileCheck, label: "証明・提出文書", color: "bg-yellow-600", profession: "医師" },
  scannedDocument: { icon: ScanLine, label: "スキャン文書", color: "bg-slate-500", profession: "医師" }
};

// 職種の優先順位（数値が小さいほど優先）
const professionPriority: Record<string, number> = {
  "医師": 1,
  "看護師": 2,
  "薬剤師": 3,
  "検査技師": 4,
  "放射線技師": 5,
  "リハビリ": 6,
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
  tests: {
    label: "検査結果",
    icon: FlaskConical,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950"
  }
};

type CategoryKey = keyof typeof categoryConfig;

export function HistoricalRecords({ records, onRecordSelect, selectedRecordId, onApplyRecord }: HistoricalRecordsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"and" | "or">("and");  // AND/OR検索モード
  const [expandedCategories, setExpandedCategories] = useState<Set<CategoryKey>>(new Set(["ownDept"]));
  const [selectedProfession, setSelectedProfession] = useState<string>("all");  // 職種フィルタ
  const [selectedRecordType, setSelectedRecordType] = useState<string>("all");  // 記録種別フィルタ（単一選択）
  const [selectedVisitType, setSelectedVisitType] = useState<string>("all");  // "all" | "inpatient" | "outpatient"
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  
  // 期間指定フィルタ用のstate
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // 複数選択用のstate
  const [selectedRecordIds, setSelectedRecordIds] = useState<Set<string>>(new Set());
  
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

  // 記録タイプトグル
  const toggleRecordType = (type: string) => {
    setSelectedRecordType(type);
  };

  // 日付トグル
  const toggleDate = (date: string) => {
    setExpandedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  // フィルタリングされた記録
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      // 検索クエリの処理
      if (searchQuery.trim() !== "") {
        // スペースで分割してキーワードの配列を作成
        const keywords = searchQuery.trim().split(/\s+/).map(kw => kw.toLowerCase());
        
        // 検索対象フィールドをすべて結合
        const searchableText = [
          record.content,
          record.author,
          record.soapRecord || "",
          recordTypeConfig[record.type]?.label || "",
          record.insurance?.type || "",
          record.insurance?.burden || "",
          // バイタルサインも検索対象に含める
          record.vitalSigns?.bloodPressure || "",
          record.vitalSigns?.pulse || "",
          record.vitalSigns?.temperature || "",
          record.vitalSigns?.respiratoryRate || "",
          record.vitalSigns?.oxygenSaturation || "",
        ].join(" ").toLowerCase();
        
        // AND検索: すべてのキーワードが含まれている必要がある
        if (searchMode === "and") {
          const matchesSearch = keywords.every(keyword => 
            searchableText.includes(keyword)
          );
          if (!matchesSearch) return false;
        } 
        // OR検索: いずれかのキーワードが含まれていればOK
        else {
          const matchesSearch = keywords.some(keyword => 
            searchableText.includes(keyword)
          );
          if (!matchesSearch) return false;
        }
      }
      
      const matchesProfession = selectedProfession === "all" || recordTypeConfig[record.type]?.profession === selectedProfession;
      
      const matchesType = selectedRecordType === "all" || record.type === selectedRecordType;
      
      const matchesVisitType = selectedVisitType === "all" || record.visitType === selectedVisitType;
      
      // 期間指定フィルタ
      const recordDate = new Date(record.date);
      const matchesDateRange = 
        (!startDate || recordDate >= startDate) && 
        (!endDate || recordDate <= endDate);
      
      return matchesProfession && matchesType && matchesVisitType && matchesDateRange;
    });
  }, [records, searchQuery, searchMode, selectedProfession, selectedRecordType, selectedVisitType, startDate, endDate]);
  
  // カテゴリ別に記録を分類
  const categorizeRecord = (record: Record): CategoryKey => {
    // 検査結果は専用カテゴリへ
    if (record.type === "test") {
      return "tests";
    }
    
    // それ以外の診療記録は自科/全科で分類
    // 著者名に「内科」が含まれている場合は自科、それ以外は全科
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
      tests: {}
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
  
  // カテゴリ内の記録総数を計算
  const getCategoryCount = (category: CategoryKey) => {
    return Object.values(groupedRecords[category]).flat().length;
  };
  
  // 記録選択のハンドラー（複数選択対応）
  const handleRecordClick = (recordOrRecords: Record | Record[], event: React.MouseEvent) => {
    // Ctrl/Cmdキーが押されているかチェック
    const isMultiSelectKey = event.ctrlKey || event.metaKey;
    
    if (isMultiSelectKey) {
      // 複数選択モード
      const newSelectedIds = new Set(selectedRecordIds);
      
      if (Array.isArray(recordOrRecords)) {
        // 日付行をクリックした場合（複数記録）
        const recordIds = recordOrRecords.map(r => r.id);
        const allSelected = recordIds.every(id => newSelectedIds.has(id));
        
        if (allSelected) {
          // 全て選択済みの場合は解除
          recordIds.forEach(id => newSelectedIds.delete(id));
        } else {
          // 一部または全て未選択の場合は追加
          recordIds.forEach(id => newSelectedIds.add(id));
        }
      } else {
        // 個別記録をクリックした場合
        if (newSelectedIds.has(recordOrRecords.id)) {
          newSelectedIds.delete(recordOrRecords.id);
        } else {
          newSelectedIds.add(recordOrRecords.id);
        }
      }
      
      setSelectedRecordIds(newSelectedIds);
      
      // 選択されている記録を親コンポーネントに渡す
      if (newSelectedIds.size > 0) {
        const selectedRecords = records.filter(r => newSelectedIds.has(r.id));
        onRecordSelect(selectedRecords.sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date);
          return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
        }));
      }
    } else {
      // 単一選択モード
      setSelectedRecordIds(new Set());
      onRecordSelect(recordOrRecords);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">時系列記録</span>
          </div>
        </CardTitle>
        
        {/* 検索・フィルター */}
        <div className="space-y-2">
          {/* 検索バー */}
          <div className="flex items-center gap-2">
            <Label className="text-xs font-medium min-w-[40px]">キーワード:</Label>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="スペース区切りで複数検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 text-xs"
              />
            </div>
          </div>
          
          {/* AND/OR検索モード（ラジオボタン） */}
          <div className="flex items-center gap-2">
            <Label className="text-xs font-medium min-w-[40px]"></Label> {/* ラベル位置合わせ用の空白 */}
            <RadioGroup 
              value={searchMode} 
              onValueChange={(value) => setSearchMode(value as "and" | "or")}
              className="flex items-center gap-3"
            >
              <div className="flex items-center space-x-1.5">
                <RadioGroupItem value="and" id="search-and" className="w-3.5 h-3.5" />
                <Label htmlFor="search-and" className="text-xs cursor-pointer font-normal">
                  AND検索
                </Label>
              </div>
              <div className="flex items-center space-x-1.5">
                <RadioGroupItem value="or" id="search-or" className="w-3.5 h-3.5" />
                <Label htmlFor="search-or" className="text-xs cursor-pointer font-normal">
                  OR検索
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* 2列グリッドレイアウトのフィルタ */}
          <div className="grid grid-cols-2 gap-2">
            {/* 職種フィルタ */}
            <div className="flex items-center gap-2">
              <Label className="text-xs font-medium min-w-[40px]">職種:</Label>
              <Select value={selectedProfession} onValueChange={setSelectedProfession}>
                <SelectTrigger className="h-9 text-xs flex-1">
                  <SelectValue placeholder="職種" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    <div className="flex items-center space-x-1.5">
                      <Stethoscope className="w-3 h-3" />
                      <span>すべて</span>
                    </div>
                  </SelectItem>
                  <Separator className="my-1" />
                  <SelectItem value="医師" className="text-xs">
                    <div className="flex items-center space-x-1.5">
                      <Stethoscope className="w-3 h-3" />
                      <span>医師</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="看護師" className="text-xs">
                    <div className="flex items-center space-x-1.5">
                      <Heart className="w-3 h-3" />
                      <span>看護師</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="検査技師" className="text-xs">
                    <div className="flex items-center space-x-1.5">
                      <FlaskConical className="w-3 h-3" />
                      <span>検査技師</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="放射線技師" className="text-xs">
                    <div className="flex items-center space-x-1.5">
                      <ImageIcon className="w-3 h-3" />
                      <span>放射線技師</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="リハビリ" className="text-xs">
                    <div className="flex items-center space-x-1.5">
                      <Activity className="w-3 h-3" />
                      <span>リハビリ</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* 訪問種別（入外）フィルタ */}
            <div className="flex items-center gap-2">
              <Label className="text-xs font-medium min-w-[40px]">入外:</Label>
              <Select value={selectedVisitType} onValueChange={setSelectedVisitType}>
                <SelectTrigger className="h-9 text-xs flex-1">
                  <SelectValue placeholder="入外" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    <div className="flex items-center space-x-1.5">
                      <FileText className="w-3 h-3" />
                      <span>すべて</span>
                    </div>
                  </SelectItem>
                  <Separator className="my-1" />
                  <SelectItem value="inpatient" className="text-xs">
                    <div className="flex items-center space-x-1.5">
                      <Building2 className="w-3 h-3" />
                      <span>入院</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="outpatient" className="text-xs">
                    <div className="flex items-center space-x-1.5">
                      <Stethoscope className="w-3 h-3" />
                      <span>外来</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* 記録種別フィルタ（単一選択） */}
            <div className="flex items-center gap-2">
              <Label className="text-xs font-medium min-w-[40px]">種別:</Label>
              <Select value={selectedRecordType} onValueChange={setSelectedRecordType}>
                <SelectTrigger className="h-9 text-xs flex-1">
                  <SelectValue placeholder="種別" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    <div className="flex items-center space-x-1.5">
                      <FileText className="w-3 h-3" />
                      <span>すべて</span>
                    </div>
                  </SelectItem>
                  <Separator className="my-1" />
                  {(Object.keys(recordTypeConfig) as Array<keyof typeof recordTypeConfig>).map((type) => {
                    const config = recordTypeConfig[type];
                    const Icon = config.icon;
                    
                    return (
                      <SelectItem key={type} value={type} className="text-xs">
                        <div className="flex items-center space-x-1.5">
                          <Icon className="w-3 h-3" />
                          <span>{config.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* 期間指定フィルタ（独立した行） */}
          <div className="flex items-center gap-2">
            <Label className="text-xs font-medium min-w-[40px]">期間:</Label>
            <div className="flex items-center gap-1.5 flex-1">
              <div className="relative flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-9 text-xs w-full justify-start font-normal ${startDate ? 'pr-8' : ''}`}
                    >
                      <CalendarIcon className="w-3 h-3 mr-1.5" />
                      {startDate ? startDate.toLocaleDateString('ja-JP') : "開始日"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {startDate && (
                  <X
                    className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setStartDate(undefined);
                    }}
                  />
                )}
              </div>
              
              <span className="text-xs text-muted-foreground">～</span>
              
              <div className="relative flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-9 text-xs w-full justify-start font-normal ${endDate ? 'pr-8' : ''}`}
                    >
                      <CalendarIcon className="w-3 h-3 mr-1.5" />
                      {endDate ? endDate.toLocaleDateString('ja-JP') : "終了日"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {endDate && (
                  <X
                    className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEndDate(undefined);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        {/* ツリー構造の記録一覧 */}
        <div className="p-4 pt-0 h-full overflow-y-auto">
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
                          const dateRecordIds = dateRecords.map(r => r.id);
                          const isAnyRecordSelected = dateRecordIds.some(id => selectedRecordIds.has(id));
                          const areAllRecordsSelected = dateRecordIds.every(id => selectedRecordIds.has(id)) && dateRecordIds.length > 0;
                          const isDateExpanded = expandedDates.has(date);

                          return (
                            <div key={date}>
                              {/* 日付アイテム */}
                              <div
                                className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-sm ${
                                  areAllRecordsSelected 
                                    ? "bg-primary/20 border border-primary shadow-sm" 
                                    : isAnyRecordSelected
                                    ? "bg-primary/10 border border-primary/50 shadow-sm"
                                    : "bg-card hover:bg-accent/50"
                                }`}
                                onClick={(e) => {
                                  // 記録が複数ある場合は配列として、1件の場合は単一として渡す
                                  const recordsToSelect = dateRecords.length > 1 
                                    ? dateRecords.sort((a, b) => {
                                        // まず時刻で比較
                                        const timeCompare = a.time.localeCompare(b.time);
                                        if (timeCompare !== 0) return timeCompare;
                                        
                                        // 同時刻の場合は職種の優先順位で比較
                                        const professionA = recordTypeConfig[a.type].profession;
                                        const professionB = recordTypeConfig[b.type].profession;
                                        const priorityA = professionPriority[professionA] || 999;
                                        const priorityB = professionPriority[professionB] || 999;
                                        
                                        return priorityA - priorityB;
                                      })
                                    : dateRecords[0];
                                  handleRecordClick(recordsToSelect, e);
                                }}
                              >
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="text-xs font-medium">{date}</span>
                                  {/* 入外バッジ */}
                                  {dateRecords.some(r => r.visitType) && (
                                    <div className="flex items-center gap-1">
                                      {dateRecords.some(r => r.visitType === "inpatient") && (
                                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-red-50 border-red-300 text-red-700 dark:bg-red-950 dark:border-red-700 dark:text-red-300">
                                          入
                                        </Badge>
                                      )}
                                      {dateRecords.some(r => r.visitType === "outpatient") && (
                                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-300">
                                          外
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                  {/* 職種表示（テキスト） */}
                                  <div className="flex items-center gap-1.5">
                                    {Array.from(new Set(dateRecords.map(r => recordTypeConfig[r.type]?.profession).filter(Boolean)))
                                      .sort((a, b) => {
                                        const priorityA = professionPriority[a] || 999;
                                        const priorityB = professionPriority[b] || 999;
                                        return priorityA - priorityB;
                                      })
                                      .map((profession, index) => (
                                        <span 
                                          key={profession} 
                                          className="text-xs text-muted-foreground"
                                        >
                                          {profession}
                                        </span>
                                      ))}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {/* 記録タイプのアイコン表示 */}
                                  <div className="flex items-center space-x-0.5">
                                    {Array.from(new Set(dateRecords.map(r => r.type).filter(t => recordTypeConfig[t])))
                                      .sort((a, b) => {
                                        const professionA = recordTypeConfig[a]?.profession;
                                        const professionB = recordTypeConfig[b]?.profession;
                                        const priorityA = professionPriority[professionA || ""] || 999;
                                        const priorityB = professionPriority[professionB || ""] || 999;
                                        return priorityA - priorityB;
                                      })
                                      .map(type => {
                                        const config = recordTypeConfig[type];
                                        if (!config) return null;
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

                              {/* 個別記録リスト（展開時のみ） */}
                              {isDateExpanded && (
                                <div className="ml-8 mt-1 space-y-1">
                                  {dateRecords.sort((a, b) => {
                                    // まず時刻で比較
                                    const timeCompare = a.time.localeCompare(b.time);
                                    if (timeCompare !== 0) return timeCompare;
                                    
                                    // 同時刻の場合は職種の優先順位で比較
                                    const professionA = recordTypeConfig[a.type].profession;
                                    const professionB = recordTypeConfig[b.type].profession;
                                    const priorityA = professionPriority[professionA] || 999;
                                    const priorityB = professionPriority[professionB] || 999;
                                    
                                    return priorityA - priorityB;
                                  }).map((record) => {
                                    const config = recordTypeConfig[record.type];
                                    const Icon = config.icon;
                                    const isSelected = selectedRecordIds.has(record.id);

                                    return (
                                      <div
                                        key={record.id}
                                        className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-sm ${
                                          isSelected ? "bg-primary/20 border border-primary shadow-sm" : "bg-card/50 hover:bg-accent/70"
                                        }`}
                                        onClick={(e) => {
                                          handleRecordClick(record, e);
                                        }}
                                      >
                                        <div className="flex items-center space-x-2 flex-1">
                                          <div className={`p-1 rounded ${config.color} text-white`}>
                                            <Icon className="w-2.5 h-2.5" />
                                          </div>
                                          <div className="flex flex-col flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-xs font-medium truncate">{config.label}</span>
                                              {record.visitType && (
                                                <Badge 
                                                  variant="outline" 
                                                  className={`text-xs px-1.5 py-0 h-4 ${
                                                    record.visitType === "inpatient" 
                                                      ? "bg-red-50 border-red-300 text-red-700 dark:bg-red-950 dark:border-red-700 dark:text-red-300"
                                                      : "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-300"
                                                  }`}
                                                >
                                                  {record.visitType === "inpatient" ? "入" : "外"}
                                                </Badge>
                                              )}
                                            </div>
                                            <span className="text-xs text-muted-foreground">{record.time}</span>
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
                );
              })}
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}