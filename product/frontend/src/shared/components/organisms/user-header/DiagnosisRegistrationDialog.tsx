import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shared/components/atoms/dialog";
import { Button } from "@shared/components/atoms/button";
import { Input } from "@shared/components/atoms/input";
import { Label } from "@shared/components/atoms/label";
import { Textarea } from "@shared/components/atoms/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/atoms/card";
import { Badge } from "@shared/components/atoms/badge";
import { Separator } from "@shared/components/atoms/separator";
import { Alert, AlertDescription } from "@shared/components/atoms/alert";
import { Progress } from "@shared/components/atoms/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/atoms/select";
import { Checkbox } from "@shared/components/atoms/checkbox";
import { 
  FileText, 
  Search, 
  Check, 
  X, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle,
  Calendar,
  Star,
  Activity,
  Shield,
  Clock,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface DiagnosisRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  patientName: string;
  patientId: string;
}

// サンプル病名データベース（実際はAPIから取得）
const diagnosisDatabase = [
  { code: "I10", name: "本態性高血圧症", kana: "ホンタイセイコウケツアツショウ", category: "循環器疾患" },
  { code: "E11", name: "2型糖尿病", kana: "ニガタトウニョウビョウ", category: "内分泌疾患" },
  { code: "E78", name: "脂質異常症", kana: "シシツイジョウショウ", category: "内分泌疾患" },
  { code: "K21", name: "胃食道逆流症", kana: "イショクドウギャクリュウショウ", category: "消化器疾患" },
  { code: "M79", name: "変形性膝関節症", kana: "ヘンケイセイヒザカンセツショウ", category: "運動器疾患" },
  { code: "F32", name: "うつ病エピソード", kana: "ウツビョウエピソード", category: "精神疾患" },
  { code: "J44", name: "慢性閉塞性肺疾患", kana: "マンセイヘイソクセイハイシッカン", category: "呼吸器疾患" },
  { code: "N18", name: "慢性腎臓病", kana: "マンセイジンゾウビョウ", category: "腎疾患" },
  { code: "Z51", name: "医療管理のための医療", kana: "イリョウカンリノタメノイリョウ", category: "管理" },
  { code: "I25", name: "慢性虚血性心疾患", kana: "マンセイキョケツセイシンシッカン", category: "循環器疾患" },
];

const severityLevels = [
  { value: "軽度", label: "軽度", description: "日常生活に支障なし" },
  { value: "中等度", label: "中等度", description: "軽度の制限あり" },
  { value: "重度", label: "重度", description: "著明な制限あり" },
  { value: "最重度", label: "最重度", description: "生命に関わる" },
];

const statusOptions = [
  { value: "急性期", label: "急性期", icon: Activity, color: "text-red-600" },
  { value: "慢性期", label: "慢性期", icon: Clock, color: "text-orange-600" },
  { value: "寛解期", label: "寛解期", icon: CheckCircle2, color: "text-green-600" },
  { value: "増悪期", label: "増悪期", icon: AlertCircle, color: "text-red-600" },
];

export function DiagnosisRegistrationDialog({
  isOpen,
  onClose,
  onSave,
  patientName,
  patientId,
}: DiagnosisRegistrationDialogProps) {
  // ステップ管理
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // 病名検索関連
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof diagnosisDatabase>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<typeof diagnosisDatabase[0] | null>(null);
  
  // フォームデータ
  const [formData, setFormData] = useState({
    diagnosisName: "",
    diagnosisCode: "",
    confirmedDate: new Date().toISOString().slice(0, 10),
    isPrimary: false,
    severity: "",
    status: "",
    notes: "",
    isConfirmed: false,
  });
  
  // UI状態
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasSearched, setHasSearched] = useState(false);
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const formRefs = {
    confirmedDate: useRef<HTMLInputElement>(null),
    severity: useRef<HTMLButtonElement>(null),
    status: useRef<HTMLButtonElement>(null),
    notes: useRef<HTMLTextAreaElement>(null),
  };

  // 病名検索機能
  const searchDiagnoses = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = diagnosisDatabase.filter(diagnosis => 
      diagnosis.name.includes(query) ||
      diagnosis.kana.includes(query) ||
      diagnosis.code.toLowerCase().includes(query.toLowerCase()) ||
      diagnosis.category.includes(query)
    ).slice(0, 8);

    setSearchResults(results);
    setShowSearchResults(true);
    setHasSearched(true);
  }, []);

  // 検索クエリの変更ハンドラー
  useEffect(() => {
    const timer = setTimeout(() => {
      searchDiagnoses(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchDiagnoses]);

  // 病名選択ハンドラー
  const handleDiagnosisSelect = (diagnosis: typeof diagnosisDatabase[0]) => {
    setSelectedDiagnosis(diagnosis);
    setFormData(prev => ({
      ...prev,
      diagnosisName: diagnosis.name,
      diagnosisCode: diagnosis.code,
    }));
    setSearchQuery(diagnosis.name);
    setShowSearchResults(false);
    setErrors(prev => ({ ...prev, diagnosisName: "", diagnosisCode: "" }));
    
    // 次のステップに自動進行
    setTimeout(() => {
      if (currentStep === 1) {
        setCurrentStep(2);
        formRefs.confirmedDate.current?.focus();
      }
    }, 500);
    
    toast.success(`病名「${diagnosis.name}」を選択しました`);
  };

  // カスタム病名入力ハンドラー
  const handleCustomDiagnosisName = (value: string) => {
    setFormData(prev => ({ ...prev, diagnosisName: value }));
    setSelectedDiagnosis(null);
    setErrors(prev => ({ ...prev, diagnosisName: "" }));
  };

  // フォーム項目変更ハンドラー
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  // バリデーション
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.diagnosisName.trim()) {
        newErrors.diagnosisName = "病名は必須です";
      }
    }

    if (step === 2) {
      if (!formData.confirmedDate) {
        newErrors.confirmedDate = "確定日は必須です";
      } else {
        const selectedDate = new Date(formData.confirmedDate);
        const today = new Date();
        if (selectedDate > today) {
          newErrors.confirmedDate = "未来の日付は選択できません";
        }
      }
      
      if (!formData.severity) {
        newErrors.severity = "重症度は必須です";
      }
      
      if (!formData.status) {
        newErrors.status = "病状は必須です";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ステップ進行
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
        
        // 次のステップの最初のフィールドにフォーカス
        setTimeout(() => {
          if (currentStep === 1) {
            formRefs.confirmedDate.current?.focus();
          } else if (currentStep === 2) {
            formRefs.notes.current?.focus();
          }
        }, 100);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      
      // 前のステップの適切なフィールドにフォーカス
      setTimeout(() => {
        if (currentStep === 2) {
          searchInputRef.current?.focus();
        } else if (currentStep === 3) {
          formRefs.severity.current?.focus();
        }
      }, 100);
    }
  };

  // 保存処理
  const handleSave = async () => {
    if (!validateStep(totalSteps)) return;

    setIsLoading(true);
    try {
      // 必須フィールドの最終チェック
      if (!formData.diagnosisName.trim()) {
        throw new Error("病名が入力されていません");
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // API呼び出しのシミュレート
      
      const diagnosisData = {
        ...formData,
        selectedDiagnosis,
        registeredAt: new Date().toISOString(),
        patientId,
        patientName,
      };

      onSave(diagnosisData);
      
      // リセット
      setFormData({
        diagnosisName: "",
        diagnosisCode: "",
        confirmedDate: new Date().toISOString().slice(0, 10),
        isPrimary: false,
        severity: "",
        status: "",
        notes: "",
        isConfirmed: false,
      });
      setCurrentStep(1);
      setSearchQuery("");
      setSelectedDiagnosis(null);
      setErrors({});
      setHasSearched(false);
      
      onClose();
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // キーボードナビゲーション
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && e.ctrlKey) {
        if (currentStep < totalSteps) {
          handleNextStep();
        } else {
          handleSave();
        }
      } else if (e.key === "ArrowRight" && e.altKey && currentStep < totalSteps) {
        handleNextStep();
      } else if (e.key === "ArrowLeft" && e.altKey && currentStep > 1) {
        handlePrevStep();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep, totalSteps]);

  // 初期フォーカス
  useEffect(() => {
    if (isOpen && currentStep === 1) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, currentStep]);

  // プログレス計算
  const progress = (currentStep / totalSteps) * 100;

  // ステップコンテンツのレンダリング
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold">病名を検索・選択</h3>
              <p className="text-sm text-muted-foreground">
                病名を検索するか、直接入力してください
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="diagnosis-search" className="text-sm font-medium">
                  病名検索 <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    id="diagnosis-search"
                    type="text"
                    placeholder="病名、コード、カテゴリで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 ${errors.diagnosisName ? "border-red-500" : ""}`}
                    autoComplete="off"
                  />
                </div>
                {errors.diagnosisName && (
                  <p className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.diagnosisName}
                  </p>
                )}
              </div>

              {/* 検索結果 */}
              {showSearchResults && searchResults.length > 0 && (
                <Card className="border border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-blue-700 dark:text-blue-300">
                      検索結果 ({searchResults.length}件)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                    {searchResults.map((diagnosis, index) => (
                      <div
                        key={`${diagnosis.code}-${index}`}
                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer transition-colors"
                        onClick={() => handleDiagnosisSelect(diagnosis)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{diagnosis.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {diagnosis.code}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-foreground">{diagnosis.kana}</span>
                              <Separator orientation="vertical" className="h-3" />
                              <span className="text-xs text-blue-600 dark:text-blue-400">
                                {diagnosis.category}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* 検索結果がない場合 */}
              {hasSearched && searchQuery && searchResults.length === 0 && (
                <Card className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      <AlertCircle className="w-8 h-8 mx-auto text-yellow-600 dark:text-yellow-400" />
                      <div>
                        <p className="font-medium text-sm text-yellow-800 dark:text-yellow-200">
                          該当する病名が見つかりません
                        </p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                          病名を直接入力することもできます
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* カスタム病名入力 */}
              <div className="space-y-2">
                <Label htmlFor="custom-diagnosis" className="text-sm font-medium">
                  または病名を直接入力
                </Label>
                <Input
                  id="custom-diagnosis"
                  type="text"
                  placeholder="病名を直接入力..."
                  value={selectedDiagnosis ? "" : formData.diagnosisName}
                  onChange={(e) => handleCustomDiagnosisName(e.target.value)}
                  disabled={!!selectedDiagnosis}
                  className={errors.diagnosisName ? "border-red-500" : ""}
                />
                {selectedDiagnosis && (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        {selectedDiagnosis.name}
                      </span>
                      <Badge variant="secondary">{selectedDiagnosis.code}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDiagnosis(null);
                        setFormData(prev => ({ ...prev, diagnosisName: "", diagnosisCode: "" }));
                        setSearchQuery("");
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold">詳細情報を入力</h3>
              <p className="text-sm text-muted-foreground">
                確定日、重症度、病状を設定してください
              </p>
            </div>

            <div className="space-y-6">
              {/* 確定日 */}
              <div className="space-y-2">
                <Label htmlFor="confirmed-date" className="text-sm font-medium">
                  確定日 <span className="text-red-500">*</span>
                </Label>
                <Input
                  ref={formRefs.confirmedDate}
                  id="confirmed-date"
                  type="date"
                  value={formData.confirmedDate}
                  onChange={(e) => handleFormChange("confirmedDate", e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                  className={errors.confirmedDate ? "border-red-500" : ""}
                />
                {errors.confirmedDate && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.confirmedDate}
                  </p>
                )}
              </div>

              {/* 主病名フラグ */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-primary"
                  checked={formData.isPrimary}
                  onCheckedChange={(checked) => handleFormChange("isPrimary", checked)}
                />
                <Label htmlFor="is-primary" className="text-sm font-medium flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  主病名として設定
                </Label>
              </div>

              {/* 重症度 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  重症度 <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {severityLevels.map((level) => (
                    <Button
                      key={level.value}
                      ref={level.value === "軽度" ? formRefs.severity : undefined}
                      variant={formData.severity === level.value ? "default" : "outline"}
                      className={`h-auto p-3 text-left justify-start ${
                        formData.severity === level.value 
                          ? "medical-primary" 
                          : errors.severity 
                          ? "border-red-500" 
                          : ""
                      }`}
                      onClick={() => handleFormChange("severity", level.value)}
                    >
                      <div>
                        <div className="font-medium text-sm">{level.label}</div>
                        <div className="text-xs opacity-80">{level.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
                {errors.severity && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.severity}
                  </p>
                )}
              </div>

              {/* 病状 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  病状 <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <Button
                        key={option.value}
                        ref={option.value === "急性期" ? formRefs.status : undefined}
                        variant={formData.status === option.value ? "default" : "outline"}
                        className={`h-auto p-3 text-left justify-start ${
                          formData.status === option.value 
                            ? "medical-primary" 
                            : errors.status 
                            ? "border-red-500" 
                            : ""
                        }`}
                        onClick={() => handleFormChange("status", option.value)}
                      >
                        <div className="flex items-center space-x-2">
                          <IconComponent className={`w-4 h-4 ${
                            formData.status === option.value ? "text-white" : option.color
                          }`} />
                          <span className="font-medium text-sm">{option.label}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
                {errors.status && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.status}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold">備考と確認</h3>
              <p className="text-sm text-muted-foreground">
                最終確認を行い、必要に応じて備考を追加してください
              </p>
            </div>

            <div className="space-y-6">
              {/* 入力内容の確認 */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
                    入力内容の確認
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">病名:</span>
                      <p className="font-medium">{formData.diagnosisName}</p>
                    </div>
                    {formData.diagnosisCode && (
                      <div>
                        <span className="text-muted-foreground">コード:</span>
                        <p className="font-medium">{formData.diagnosisCode}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">確定日:</span>
                      <p className="font-medium">{formData.confirmedDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">病名種別:</span>
                      <p className="font-medium">
                        {formData.isPrimary ? (
                          <span className="text-yellow-600 dark:text-yellow-400 flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            主病名
                          </span>
                        ) : (
                          "副病名"
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">重症度:</span>
                      <p className="font-medium">{formData.severity}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">病状:</span>
                      <p className="font-medium">{formData.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 備考 */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  備考（任意）
                </Label>
                <Textarea
                  ref={formRefs.notes}
                  id="notes"
                  placeholder="診断の詳細、特記事項などを入力..."
                  value={formData.notes}
                  onChange={(e) => handleFormChange("notes", e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* 最終確認 */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-confirmed"
                  checked={formData.isConfirmed}
                  onCheckedChange={(checked) => handleFormChange("isConfirmed", checked)}
                />
                <Label htmlFor="is-confirmed" className="text-sm font-medium flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
                  上記の内容で病名を登録することを確認しました
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <DialogTitle className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <span>病名登録</span>
              <div className="text-sm font-normal text-muted-foreground">
                {patientName} ({patientId})
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            患者の病名を登録します。病名、確定日、重症度、病状などの詳細情報を入力してください。
          </DialogDescription>
        </DialogHeader>

        {/* プログレスバー */}
        <div className="flex-shrink-0 space-y-2 py-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>ステップ {currentStep} / {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs">
            <span className={currentStep >= 1 ? "text-blue-600 dark:text-blue-400 font-medium" : "text-muted-foreground"}>
              病名選択
            </span>
            <span className={currentStep >= 2 ? "text-blue-600 dark:text-blue-400 font-medium" : "text-muted-foreground"}>
              詳細情報
            </span>
            <span className={currentStep >= 3 ? "text-blue-600 dark:text-blue-400 font-medium" : "text-muted-foreground"}>
              確認・登録
            </span>
          </div>
        </div>

        {/* ステップコンテンツ */}
        <div className="flex-1 overflow-y-auto px-1">
          {renderStepContent()}
        </div>

        {/* フッター */}
        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Ctrl + Enter: 次へ</span>
              <span>Alt + ←→: ステップ移動</span>
              <span>Esc: キャンセル</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={isLoading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                戻る
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNextStep}
                disabled={!formData.diagnosisName.trim() || isLoading}
                className="medical-primary"
              >
                次へ
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={!formData.isConfirmed || isLoading}
                className="medical-primary"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    登録中...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    病名を登録
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}