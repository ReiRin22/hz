'use client';
import { useState, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/atoms/dialog";
import { Input } from "@/shared/components/atoms/input";
import { Label } from "@/shared/components/atoms/label";
import { Button } from "@/shared/components/atoms/button";
import { Card } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
import { Search, X, UserCheck, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import type { PatientViewModel } from "../../types/patient-header.type";

interface PatientSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** 患者IDを引数に患者切り替えを実行する */
  onPatientSelect: (patientId: string) => void;
  /** 検索キーワードでBFF検索を実行し結果を返す */
  onSearch: (query: string) => Promise<PatientViewModel[]>;
}

// 保険種別の選択肢
const insuranceTypes = [
  { value: "all", label: "すべて" },
  { value: "社会保険", label: "社会保険" },
  { value: "国民健康保険", label: "国民健康保険" },
  { value: "後期高齢者医療", label: "後期高齢者医療" },
  { value: "生活保護", label: "生活保護" },
  { value: "自費", label: "自費" }
];

// 性別の選択肢
const genderOptions = [
  { value: "all", label: "すべて" },
  { value: "男性", label: "男性" },
  { value: "女性", label: "女性" }
];

// 50音ボタン（画像のレイアウトに準拠）
const kanaButtons = [
  ["ア", "カ", "サ", "タ", "ナ", "ハ", "マ", "ヤ", "ラ", "ワ", "ァ", "ヤ", "ガ", "ザ", "ダ", "バ", "パ"],
  ["イ", "キ", "シ", "チ", "ニ", "ヒ", "ミ", "", "リ", "", "ィ", "ユ", "ギ", "ジ", "ヂ", "ビ", "ピ"],
  ["ウ", "ク", "ス", "ツ", "ヌ", "フ", "ム", "ユ", "ル", "", "ゥ", "ヨ", "グ", "ズ", "ヅ", "ブ", "プ"],
  ["エ", "ケ", "セ", "テ", "ネ", "ヘ", "メ", "", "レ", "ー", "ェ", "ワ", "ゲ", "ゼ", "デ", "ベ", "ペ"],
  ["オ", "コ", "ソ", "ト", "ノ", "ホ", "モ", "ヨ", "ロ", "ッ", "ォ", "ン", "ゴ", "ゾ", "ド", "ボ", "ポ"]
];

export function PatientSearchDialog({
  isOpen,
  onClose,
  onPatientSelect,
  onSearch,
}: PatientSearchDialogProps) {
  // 検索条件
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    kana: "",
    gender: "all",
    birthDate: ""
  });

  // 検索結果・ローディング
  const [searchResults, setSearchResults] = useState<PatientViewModel[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 50音パネルの開閉状態
  const [isKanaPanelOpen, setIsKanaPanelOpen] = useState(false);

  // デバウンスタイマー
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // BFF検索を実行する（デバウンス付き）
  const executeSearch = useCallback(
    (criteria: typeof searchCriteria) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      const query = [criteria.name, criteria.kana].filter(Boolean).join(" ").trim();
      if (!query && criteria.gender === "all" && !criteria.birthDate) {
        setSearchResults([]);
        setHasSearched(false);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setIsSearching(true);
        setHasSearched(true);
        try {
          const results = await onSearch(query || " ");
          // クライアントサイドで性別・生年月日をフィルタ（BFF検索は氏名/カナのみ対応）
          const filtered = results.filter((p) => {
            if (criteria.gender !== "all" && p.gender !== criteria.gender) return false;
            if (criteria.birthDate && p.birthDate !== criteria.birthDate) return false;
            return true;
          });
          setSearchResults(filtered);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    },
    [onSearch]
  );

  // 検索条件更新 + 自動検索トリガー
  const updateCriteria = useCallback(
    (partial: Partial<typeof searchCriteria>) => {
      setSearchCriteria((prev) => {
        const next = { ...prev, ...partial };
        executeSearch(next);
        return next;
      });
    },
    [executeSearch]
  );

  // 患者選択ハンドラー
  const handlePatientSelect = (patient: PatientViewModel) => {
    onPatientSelect(patient.patientId);
    onClose();
  };

  // 検索条件をリセット
  const resetSearchCriteria = () => {
    setSearchCriteria({ name: "", kana: "", gender: "all", birthDate: "" });
    setSearchResults([]);
    setHasSearched(false);
  };

  // 性別による色取得
  const getGenderColor = (gender: string) => {
    return gender === "男性" ? "text-blue-600" : "text-pink-600";
  };

  // 50音ボタンクリックハンドラー
  const handleKanaButtonClick = (kana: string) => {
    updateCriteria({ kana: searchCriteria.kana + kana });
  };

  // 患者カードのレンダリング（1行表示）
  const renderPatientCard = (patient: PatientViewModel) => (
    <div
      key={patient.patientId}
      className="cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-950 border-b border-gray-200 dark:border-gray-700 last:border-b-0 py-3 px-4"
      onClick={() => handlePatientSelect(patient)}
    >
      <div className="flex items-center gap-4 text-sm">
        <div className="w-32 flex-shrink-0">
          <Badge variant="outline" className="text-xs">
            {patient.patientId}
          </Badge>
        </div>
        <div className="w-48 flex-shrink-0 text-muted-foreground">
          {patient.kana}
        </div>
        <div className="w-40 flex-shrink-0 font-medium">
          {patient.name}
        </div>
        <div className="w-32 flex-shrink-0">
          {patient.birthDate}
        </div>
        <div className={`w-20 flex-shrink-0 ${getGenderColor(patient.gender)}`}>
          {patient.gender}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[85vh] flex flex-col transition-all duration-300 !max-w-5xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 medical-text-primary" />
              <span>患者検索</span>
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex items-center space-x-2 hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-300 dark:hover:border-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>キャンセル</span>
            </Button>
          </div>
          <DialogDescription>
            検索条件を入力して患者を検索できます。検索結果をクリックして患者を選択してください。
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 上部：検索条件 */}
          <div className="mb-4">
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">検索条件</h3>
                <Button variant="outline" size="sm" onClick={resetSearchCriteria}>
                  <X className="w-4 h-4 mr-2" />
                  リセット
                </Button>
              </div>
              
              {/* 基本情報 - 横並び4列 */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-name">患者名</Label>
                  <Input
                    id="patient-name"
                    placeholder="患者名を入力"
                    value={searchCriteria.name}
                    onChange={(e) => updateCriteria({ name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient-kana">カナ名</Label>
                  <Input
                    id="patient-kana"
                    placeholder="カナ名を入力"
                    value={searchCriteria.kana}
                    onChange={(e) => updateCriteria({ kana: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient-gender">性別</Label>
                  <Select value={searchCriteria.gender} onValueChange={(value) => updateCriteria({ gender: value })}>
                    <SelectTrigger id="patient-gender">
                      <SelectValue placeholder="性別を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient-birthdate">生年月日</Label>
                  <Input
                    id="patient-birthdate"
                    type="date"
                    value={searchCriteria.birthDate}
                    onChange={(e) => updateCriteria({ birthDate: e.target.value })}
                  />
                </div>
              </div>

              {/* 50音ボタン（折りたたみ可能） */}
              <div className="bg-white dark:bg-gray-900 border rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsKanaPanelOpen(!isKanaPanelOpen)}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Label className="text-xs text-muted-foreground cursor-pointer">50音入力</Label>
                  {isKanaPanelOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                
                {isKanaPanelOpen && (
                  <div className="p-3 border-t">
                    <div className="space-y-1">
                      {kanaButtons.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-1">
                          {row.map((kana, colIndex) => (
                            kana ? (
                              <Button
                                key={`kana-${rowIndex}-${colIndex}`}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleKanaButtonClick(kana)}
                                className="h-7 w-9 p-0 text-xs hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex-shrink-0"
                              >
                                {kana}
                              </Button>
                            ) : (
                              <div key={`kana-${rowIndex}-${colIndex}`} className="h-7 w-9 flex-shrink-0" />
                            )
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground pt-2 border-t flex items-center gap-2">
                {isSearching && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isSearching ? "検索中..." : hasSearched ? `検索結果: ${searchResults.length}件` : "条件を入力して検索"}
              </div>
            </div>
          </div>

          {/* 下部：検索結果 */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="pr-4">
                {!hasSearched ? null : searchResults.length > 0 ? (
                  <div className="bg-white dark:bg-gray-900 border rounded-md overflow-hidden">
                    {/* ヘッダー */}
                    <div className="flex items-center gap-4 text-xs font-medium bg-gray-100 dark:bg-gray-800 py-2 px-4 border-b">
                      <div className="w-32 flex-shrink-0">患者ID</div>
                      <div className="w-48 flex-shrink-0">カナ</div>
                      <div className="w-40 flex-shrink-0">氏名</div>
                      <div className="w-32 flex-shrink-0">生年月日</div>
                      <div className="w-20 flex-shrink-0">性別</div>
                    </div>
                    {/* 患者リスト */}
                    <div>
                      {searchResults.map(renderPatientCard)}
                    </div>
                  </div>
                ) : !isSearching ? (
                  <Card className="p-8">
                    <div className="text-center space-y-4">
                      <UserCheck className="w-12 h-12 mx-auto text-muted-foreground" />
                      <div>
                        <h3 className="font-medium text-lg mb-2">該当する患者が見つかりません</h3>
                        <p className="text-sm text-muted-foreground">
                          検索条件を変更してもう一度お試しください
                        </p>
                      </div>
                    </div>
                  </Card>
                ) : null}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}