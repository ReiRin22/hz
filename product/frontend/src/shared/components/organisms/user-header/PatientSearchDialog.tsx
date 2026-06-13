import { useState, useMemo, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shared/components/atoms/dialog";
import { Input } from "@shared/components/atoms/input";
import { Label } from "@shared/components/atoms/label";
import { Button } from "@shared/components/atoms/button";
import { Card, CardContent } from "@shared/components/atoms/card";
import { Badge } from "@shared/components/atoms/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/components/atoms/tabs";
import { ScrollArea } from "@shared/components/atoms/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/atoms/select";
import { Search, User, CreditCard, Calendar, Phone, MapPin, Stethoscope, X, UserCheck } from "lucide-react";

interface Patient {
  name: string;
  kana: string;
  patientId: string;
  birthDate: string;
  gender: string;
  age: number;
  department: string;
  ward: string;
  room: string;
  doctor: string;
  allergies: string[];
  infections: string[];
  insurance: {
    type: string;
    number: string;
    burden: string;
  };
}

interface PatientSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientSelect: (patientId: string) => void;
  allPatients: Patient[];
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

export function PatientSearchDialog({
  isOpen,
  onClose,
  onPatientSelect,
  allPatients,
}: PatientSearchDialogProps) {
  // フリーワード検索
  const [freewordQuery, setFreewordQuery] = useState("");
  
  // 個別検索条件
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    kana: "",
    patientId: "",
    gender: "all",
    ageFrom: "",
    ageTo: "",
    birthDateFrom: "",
    birthDateTo: "",
    insurance: "all",
    department: "",
    doctor: ""
  });

  // アクティブなタブ
  const [activeTab, setActiveTab] = useState("freeword");
  
  // フリーワード検索入力フィールドのref
  const freewordInputRef = useRef<HTMLInputElement>(null);

  // ダイアログが開かれたときにフリーワード検索入力フィールドにフォーカス
  useEffect(() => {
    if (isOpen && activeTab === "freeword") {
      // 少し遅延を入れてフォーカスを設定（ダイアログのアニメーション完了後）
      const timer = setTimeout(() => {
        freewordInputRef.current?.focus();
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeTab]);

  // フリーワード検索結果
  const freewordResults = useMemo(() => {
    if (!freewordQuery.trim()) return [];
    
    const query = freewordQuery.toLowerCase();
    return allPatients.filter(patient => 
      patient.name.toLowerCase().includes(query) ||
      patient.kana.toLowerCase().includes(query) ||
      patient.patientId.toLowerCase().includes(query) ||
      patient.gender.toLowerCase().includes(query) ||
      patient.age.toString().includes(query) ||
      patient.birthDate.includes(query) ||
      patient.department.toLowerCase().includes(query) ||
      patient.doctor.toLowerCase().includes(query) ||
      patient.ward.toLowerCase().includes(query) ||
      patient.room.toLowerCase().includes(query) ||
      patient.insurance.type.toLowerCase().includes(query) ||
      patient.insurance.number.toLowerCase().includes(query)
    );
  }, [freewordQuery, allPatients]);

  // 個別検索結果
  const detailedResults = useMemo(() => {
    return allPatients.filter(patient => {
      // 氏名
      if (searchCriteria.name && !patient.name.toLowerCase().includes(searchCriteria.name.toLowerCase())) {
        return false;
      }
      
      // カナ
      if (searchCriteria.kana && !patient.kana.toLowerCase().includes(searchCriteria.kana.toLowerCase())) {
        return false;
      }
      
      // 患者ID
      if (searchCriteria.patientId && !patient.patientId.toLowerCase().includes(searchCriteria.patientId.toLowerCase())) {
        return false;
      }
      
      // 性別
      if (searchCriteria.gender !== "all" && patient.gender !== searchCriteria.gender) {
        return false;
      }
      
      // 年齢範囲
      if (searchCriteria.ageFrom && patient.age < parseInt(searchCriteria.ageFrom)) {
        return false;
      }
      if (searchCriteria.ageTo && patient.age > parseInt(searchCriteria.ageTo)) {
        return false;
      }
      
      // 生年月日範囲
      if (searchCriteria.birthDateFrom && patient.birthDate < searchCriteria.birthDateFrom) {
        return false;
      }
      if (searchCriteria.birthDateTo && patient.birthDate > searchCriteria.birthDateTo) {
        return false;
      }
      
      // 保険
      if (searchCriteria.insurance !== "all" && patient.insurance.type !== searchCriteria.insurance) {
        return false;
      }
      
      // 診療科
      if (searchCriteria.department && !patient.department.toLowerCase().includes(searchCriteria.department.toLowerCase())) {
        return false;
      }
      
      // 主治医
      if (searchCriteria.doctor && !patient.doctor.toLowerCase().includes(searchCriteria.doctor.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [searchCriteria, allPatients]);

  // 現在の検索結果
  const currentResults = activeTab === "freeword" ? freewordResults : detailedResults;

  // 患者選択ハンドラー
  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect(patient.patientId);
    onClose();
  };

  // 検索条件をリセット
  const resetSearchCriteria = () => {
    setSearchCriteria({
      name: "",
      kana: "",
      patientId: "",
      gender: "all",
      ageFrom: "",
      ageTo: "",
      birthDateFrom: "",
      birthDateTo: "",
      insurance: "all",
      department: "",
      doctor: ""
    });
  };

  // フリーワード検索をリセット
  const resetFreewordSearch = () => {
    setFreewordQuery("");
  };

  // 性別による色取得
  const getGenderColor = (gender: string) => {
    return gender === "男性" ? "text-blue-600" : "text-pink-600";
  };

  // 患者カードのレンダリング
  const renderPatientCard = (patient: Patient) => (
    <Card 
      key={patient.patientId}
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-blue-50 dark:hover:bg-blue-950 border-l-4 border-l-blue-500"
      onClick={() => handlePatientSelect(patient)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <User className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-lg">{patient.name}</h4>
              <span className="text-sm text-muted-foreground">({patient.kana})</span>
              <Badge variant="outline" className="text-xs">
                ID: {patient.patientId}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">生年月日:</span>
                <span className="font-medium">{patient.birthDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className={`w-3 h-3 ${getGenderColor(patient.gender)}`} />
                <span className="text-muted-foreground">性別・年齢:</span>
                <span className="font-medium">{patient.gender} {patient.age}歳</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">保険:</span>
                <span className="font-medium">{patient.insurance.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">診療科:</span>
                <span className="font-medium">{patient.department}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">病室:</span>
                <span className="font-medium">{patient.ward} {patient.room}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">主治医:</span>
                <span className="font-medium">{patient.doctor}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <Badge className="bg-blue-500 text-white text-xs">
              選択
            </Badge>
            {patient.allergies.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                アレルギーあり
              </Badge>
            )}
            {patient.infections.length > 0 && (
              <Badge className="bg-orange-500 text-white text-xs">
                感染症注意
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 medical-text-primary" />
            <span>患者検索</span>
          </DialogTitle>
          <DialogDescription>
            フリーワード検索または詳細条件で患者を検索できます。検索結果をクリックして患者を選択してください。
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="freeword" className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>フリーワード検索</span>
              </TabsTrigger>
              <TabsTrigger value="detailed" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>詳細検索</span>
              </TabsTrigger>
            </TabsList>

            {/* フリーワード検索タブ */}
            <TabsContent value="freeword" className="flex-1 overflow-hidden flex flex-col">
              <div className="space-y-4 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      ref={freewordInputRef}
                      placeholder="患者名、ID、生年月日、性別、年齢、保険等で検索..."
                      value={freewordQuery}
                      onChange={(e) => setFreewordQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {freewordQuery && (
                    <Button variant="outline" size="sm" onClick={resetFreewordSearch}>
                      <X className="w-4 h-4 mr-2" />
                      クリア
                    </Button>
                  )}
                </div>
                
                {freewordQuery && (
                  <div className="text-sm text-muted-foreground">
                    「{freewordQuery}」の検索結果: {freewordResults.length}件
                  </div>
                )}
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-3 pr-4">
                  {freewordQuery ? (
                    freewordResults.length > 0 ? (
                      freewordResults.map(renderPatientCard)
                    ) : (
                      <Card className="p-8">
                        <div className="text-center space-y-4">
                          <Search className="w-12 h-12 mx-auto text-muted-foreground" />
                          <div>
                            <h3 className="font-medium text-lg mb-2">該当する患者が見つかりません</h3>
                            <p className="text-sm text-muted-foreground">
                              検索キーワードを変更してもう一度お試しください
                            </p>
                          </div>
                        </div>
                      </Card>
                    )
                  ) : (
                    <Card className="p-8">
                      <div className="text-center space-y-4">
                        <Search className="w-12 h-12 mx-auto text-blue-600" />
                        <div>
                          <h3 className="font-medium text-lg mb-2">フリーワード検索</h3>
                          <p className="text-sm text-muted-foreground">
                            患者名、ID、生年月日、性別、年齢、保険等で<br />
                            自由に検索できます
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* 詳細検索タブ */}
            <TabsContent value="detailed" className="flex-1 overflow-hidden flex flex-col">
              <div className="space-y-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">検索条件</h3>
                  <Button variant="outline" size="sm" onClick={resetSearchCriteria}>
                    <X className="w-4 h-4 mr-2" />
                    リセット
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* 基本情報 */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">基本情報</Label>
                    <div className="space-y-2">
                      <Input
                        placeholder="患者名"
                        value={searchCriteria.name}
                        onChange={(e) => setSearchCriteria(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        placeholder="カナ名"
                        value={searchCriteria.kana}
                        onChange={(e) => setSearchCriteria(prev => ({ ...prev, kana: e.target.value }))}
                      />
                      <Input
                        placeholder="患者ID"
                        value={searchCriteria.patientId}
                        onChange={(e) => setSearchCriteria(prev => ({ ...prev, patientId: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* 詳細条件 */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">詳細条件</Label>
                    <div className="space-y-2">
                      <Select value={searchCriteria.gender} onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, gender: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="性別" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className="flex space-x-2">
                        <Input
                          placeholder="年齢（下限）"
                          type="number"
                          value={searchCriteria.ageFrom}
                          onChange={(e) => setSearchCriteria(prev => ({ ...prev, ageFrom: e.target.value }))}
                        />
                        <Input
                          placeholder="年齢（上限）"
                          type="number"
                          value={searchCriteria.ageTo}
                          onChange={(e) => setSearchCriteria(prev => ({ ...prev, ageTo: e.target.value }))}
                        />
                      </div>
                      
                      <Select value={searchCriteria.insurance} onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, insurance: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="保険種別" />
                        </SelectTrigger>
                        <SelectContent>
                          {insuranceTypes.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 生年月日範囲 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">生年月日範囲</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="date"
                      placeholder="開始日"
                      value={searchCriteria.birthDateFrom}
                      onChange={(e) => setSearchCriteria(prev => ({ ...prev, birthDateFrom: e.target.value }))}
                    />
                    <Input
                      type="date"
                      placeholder="終了日"
                      value={searchCriteria.birthDateTo}
                      onChange={(e) => setSearchCriteria(prev => ({ ...prev, birthDateTo: e.target.value }))}
                    />
                  </div>
                </div>

                {/* 医療情報 */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="診療科"
                    value={searchCriteria.department}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, department: e.target.value }))}
                  />
                  <Input
                    placeholder="主治医"
                    value={searchCriteria.doctor}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, doctor: e.target.value }))}
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  検索結果: {detailedResults.length}件
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-3 pr-4">
                  {detailedResults.length > 0 ? (
                    detailedResults.map(renderPatientCard)
                  ) : (
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
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}