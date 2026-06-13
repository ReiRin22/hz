import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@shared/components/atoms/dialog';
import { Button } from '@shared/components/atoms/button';
import { Input } from '@shared/components/atoms/input';
import { Label } from '@shared/components/atoms/label';
import { Textarea } from '@shared/components/atoms/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/atoms/select';
import { Trash2, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MedicationUsage {
  id: string;
  name: string;
  dosage: string;
  unit: string;
  reason?: string; // 平均値超過または追加薬剤の理由
  reasonTemplate?: string; // 定型文
  isAdded?: boolean; // 薬剤追加ボタンで追加されたか
}

interface Equipment {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  notes?: string;
}

interface MedicationUsageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderContent: string;
  endoscopyDetails?: string;
  currentUser: string; // 入力しているユーザー名
  attendingDoctor?: string; // 指示医
  onSave: (orderId: string, medications: MedicationUsage[], notes: string, selectedDoctor?: string) => void;
}

// 理由の定型文
const reasonTemplates = [
  '患者の体格が大きいため',
  '前回の検査で通常量では不十分だったため',
  '患者の状態に応じて調整',
  '医師の指示による',
  'その他'
];

// 指示医マスタデータ
const doctorMaster = [
  '田中医師',
  '佐々木医師',
  '山本医師',
  '鈴木医師',
  '高橋医師',
  '伊藤医師',
  '渡辺医師',
  '中村医師',
  '小林医師',
  '加藤医師'
];

// 薬剤マスタデータ（薬剤名、平均使用量、単位）
interface MedicationMaster {
  name: string;
  averageDosage: string;
  unit: string;
}

const medicationMaster: MedicationMaster[] = [
  { name: 'プロポフォール', averageDosage: '150', unit: 'mg' },
  { name: 'ミダゾラム', averageDosage: '5', unit: 'mg' },
  { name: 'リドカイン（キシロカイン）', averageDosage: '8', unit: 'mL' },
  { name: 'ブチルスコポラミン', averageDosage: '20', unit: 'mg' },
  { name: 'ペンタゾシン', averageDosage: '15', unit: 'mg' },
  { name: 'グルカゴン', averageDosage: '1', unit: 'mg' },
  { name: 'フェンタニル', averageDosage: '0.05', unit: 'mg' },
  { name: 'アトロピン', averageDosage: '0.5', unit: 'mg' },
  { name: 'ベンザルコニウム（プンタール）', averageDosage: '10', unit: 'mL' },
  { name: 'プロナーゼMS', averageDosage: '20000', unit: '単位' },
  { name: 'ジメチコン（ガスコン）', averageDosage: '40', unit: 'mg' },
  { name: 'インジゴカルミン', averageDosage: '10', unit: 'mL' },
  { name: 'エピネフリン（ボスミン）', averageDosage: '0.2', unit: 'mg' },
  { name: 'ドルミカム', averageDosage: '5', unit: 'mg' },
  { name: 'セルシン', averageDosage: '5', unit: 'mg' },
  { name: 'ホリゾン', averageDosage: '5', unit: 'mg' },
  { name: 'ソセゴン', averageDosage: '15', unit: 'mg' },
  { name: 'ケタラール', averageDosage: '50', unit: 'mg' },
  { name: 'ヒアルロン酸ナトリウム', averageDosage: '10', unit: 'mL' },
  { name: 'ボノプラザン（タケキャブ）', averageDosage: '20', unit: 'mg' }
];

// 機材マスタデータ
interface EquipmentMaster {
  name: string;
  defaultUnit: string;
}

const equipmentMaster: EquipmentMaster[] = [
  { name: '生検鉗子', defaultUnit: '本' },
  { name: 'スネア', defaultUnit: '本' },
  { name: 'クリップデバイス', defaultUnit: '個' },
  { name: '注射針', defaultUnit: '本' },
  { name: 'バルーン', defaultUnit: '個' },
  { name: 'ガイドワイヤー', defaultUnit: '本' },
  { name: 'ブラシ', defaultUnit: '本' },
  { name: 'バスケット', defaultUnit: '個' },
  { name: '拡張バルーン', defaultUnit: '個' },
  { name: 'ステント', defaultUnit: '本' },
  { name: 'ESDナイフ', defaultUnit: '本' },
  { name: '止血鉗子', defaultUnit: '本' },
  { name: 'アルゴンプラズマ凝固装置プローブ', defaultUnit: '本' },
  { name: '高周波処置具', defaultUnit: '本' },
  { name: '細胞診ブラシ', defaultUnit: '本' }
];

// 内視鏡検査の種類に応じた薬剤候補
const getDefaultMedications = (endoscopyDetails?: string): MedicationUsage[] => {
  const details = endoscopyDetails?.toLowerCase() || '';
  
  if (details.includes('上部消化管') || details.includes('胃')) {
    return [
      { id: '1', name: 'プロポフォール', dosage: '150', unit: 'mg', isAdded: false },
      { id: '2', name: 'ミダゾラム', dosage: '5', unit: 'mg', isAdded: false },
      { id: '3', name: 'リドカイン（キシロカイン）', dosage: '8', unit: 'mL', isAdded: false },
      { id: '4', name: 'ブチルスコポラミン', dosage: '20', unit: 'mg', isAdded: false }
    ];
  } else if (details.includes('大腸') || details.includes('下部消化管')) {
    return [
      { id: '1', name: 'プロポフォール', dosage: '200', unit: 'mg', isAdded: false },
      { id: '2', name: 'ミダゾラム', dosage: '7', unit: 'mg', isAdded: false },
      { id: '3', name: 'ブチルスコポラミン', dosage: '20', unit: 'mg', isAdded: false },
      { id: '4', name: 'ペンタゾシン', dosage: '15', unit: 'mg', isAdded: false }
    ];
  } else if (details.includes('ercp') || details.includes('胆管')) {
    return [
      { id: '1', name: 'プロポフォール', dosage: '180', unit: 'mg', isAdded: false },
      { id: '2', name: 'ミダゾラム', dosage: '6', unit: 'mg', isAdded: false },
      { id: '3', name: 'ペンタゾシン', dosage: '15', unit: 'mg', isAdded: false },
      { id: '4', name: 'ブチルスコポラミン', dosage: '20', unit: 'mg', isAdded: false },
      { id: '5', name: 'グルカゴン', dosage: '1', unit: 'mg', isAdded: false }
    ];
  }
  
  return [
    { id: '1', name: 'プロポフォール', dosage: '150', unit: 'mg', isAdded: false },
    { id: '2', name: 'ミダゾラム', dosage: '5', unit: 'mg', isAdded: false }
  ];
};

// 内視鏡検査の種類に応じた機材候補
const getDefaultEquipment = (endoscopyDetails?: string): Equipment[] => {
  const details = endoscopyDetails?.toLowerCase() || '';
  
  if (details.includes('上部消化管') || details.includes('胃')) {
    return [
      { id: 'eq1', name: '生検鉗子', quantity: '2', unit: '本' },
      { id: 'eq2', name: 'クリップデバイス', quantity: '3', unit: '個' }
    ];
  } else if (details.includes('大腸') || details.includes('下部消化管')) {
    return [
      { id: 'eq1', name: '生検鉗子', quantity: '3', unit: '本' },
      { id: 'eq2', name: 'スネア', quantity: '1', unit: '本' },
      { id: 'eq3', name: 'クリップデバイス', quantity: '4', unit: '個' }
    ];
  } else if (details.includes('ercp') || details.includes('胆管')) {
    return [
      { id: 'eq1', name: 'ガイドワイヤー', quantity: '1', unit: '本' },
      { id: 'eq2', name: 'バルーン', quantity: '1', unit: '個' },
      { id: 'eq3', name: '生検鉗子', quantity: '2', unit: '本' },
      { id: 'eq4', name: 'ステント', quantity: '1', unit: '本' }
    ];
  }
  
  return [
    { id: 'eq1', name: '生検鉗子', quantity: '2', unit: '本' }
  ];
};

export function MedicationUsageDialog({
  open,
  onOpenChange,
  orderId,
  orderContent,
  endoscopyDetails,
  currentUser,
  attendingDoctor,
  onSave
}: MedicationUsageDialogProps) {
  const [medications, setMedications] = useState<MedicationUsage[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [notes, setNotes] = useState('');
  const [suggestions, setSuggestions] = useState<{ [key: string]: MedicationMaster[] }>({});
  const [equipmentSuggestions, setEquipmentSuggestions] = useState<{ [key: string]: EquipmentMaster[] }>({});
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);
  const [activeEquipmentSuggestionId, setActiveEquipmentSuggestionId] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>(attendingDoctor || '');
  const [expandedReasons, setExpandedReasons] = useState<{ [key: string]: boolean }>({});
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [sidePanelTab, setSidePanelTab] = useState<'equipment' | 'medication'>('equipment');

  useEffect(() => {
    if (open) {
      // ダイアログが開かれたときに薬剤候補と機材候補を自動入力
      setMedications(getDefaultMedications(endoscopyDetails));
      setEquipment(getDefaultEquipment(endoscopyDetails));
      setNotes('');
      setSuggestions({});
      setEquipmentSuggestions({});
      setActiveSuggestionId(null);
      setActiveEquipmentSuggestionId(null);
      setSelectedDoctor('');
      setExpandedReasons({});
    }
  }, [open, endoscopyDetails, attendingDoctor]);

  // 理由入力が完了したら自動的に折りたたむ
  useEffect(() => {
    const newExpandedReasons = { ...expandedReasons };
    let hasChanges = false;

    medications.forEach(med => {
      if (expandedReasons[med.id] && isReasonComplete(med)) {
        newExpandedReasons[med.id] = false;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setExpandedReasons(newExpandedReasons);
    }
  }, [medications, selectedDoctor]);

  // 平均値超過チェック
  const isExceedingAverage = (medication: MedicationUsage): boolean => {
    const master = medicationMaster.find(m => m.name === medication.name);
    if (!master || !medication.dosage) return false;
    
    return parseFloat(medication.dosage) > parseFloat(master.averageDosage);
  };

  // 理由入力が必要かチェック
  const needsReason = (medication: MedicationUsage): boolean => {
    return medication.isAdded === true || isExceedingAverage(medication);
  };

  // 理由入力が完了しているかチェック
  const isReasonComplete = (medication: MedicationUsage): boolean => {
    if (!needsReason(medication)) return true;
    return !!selectedDoctor && (!!medication.reasonTemplate || !!medication.reason);
  };

  // 理由エリアの展開/折りたたみを切り替え
  const toggleReasonExpanded = (id: string) => {
    setExpandedReasons({ ...expandedReasons, [id]: !expandedReasons[id] });
  };

  // 理由サマリを生成
  const generateReasonSummary = (medication: MedicationUsage): string => {
    const parts: string[] = [];
    if (selectedDoctor) parts.push(`指示医: ${selectedDoctor}`);
    if (medication.reasonTemplate) parts.push(`理由: ${medication.reasonTemplate}`);
    if (medication.reason) parts.push(`詳細: ${medication.reason}`);
    return parts.join(' / ');
  };

  const handleAddMedication = () => {
    setSidePanelTab('medication');
    setSidePanelOpen(true);
  };

  const handleSelectMedicationFromMenu = (med: MedicationMaster) => {
    const newId = String(Date.now());
    setMedications([...medications, { 
      id: newId, 
      name: med.name, 
      dosage: med.averageDosage, 
      unit: med.unit, 
      isAdded: true 
    }]);
    setSidePanelOpen(false);
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
    const newSuggestions = { ...suggestions };
    delete newSuggestions[id];
    setSuggestions(newSuggestions);
    if (activeSuggestionId === id) {
      setActiveSuggestionId(null);
    }
  };

  const handleMedicationChange = (id: string, field: keyof MedicationUsage, value: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));

    if (field === 'name' && value.length >= 3) {
      const filtered = medicationMaster.filter(med =>
        med.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions({ ...suggestions, [id]: filtered });
      setActiveSuggestionId(id);
    } else if (field === 'name' && value.length < 3) {
      const newSuggestions = { ...suggestions };
      delete newSuggestions[id];
      setSuggestions(newSuggestions);
      if (activeSuggestionId === id) {
        setActiveSuggestionId(null);
      }
    }
  };

  const handleSelectSuggestion = (id: string, med: MedicationMaster) => {
    setMedications(medications.map(m =>
      m.id === id
        ? { ...m, name: med.name, dosage: med.averageDosage, unit: med.unit }
        : m
    ));
    const newSuggestions = { ...suggestions };
    delete newSuggestions[id];
    setSuggestions(newSuggestions);
    setActiveSuggestionId(null);
  };

  const handleAddEquipment = () => {
    setSidePanelTab('equipment');
    setSidePanelOpen(true);
  };

  const handleSelectEquipmentFromMenu = (eq: EquipmentMaster) => {
    const newId = String(Date.now());
    setEquipment([...equipment, { 
      id: newId, 
      name: eq.name, 
      quantity: '1', 
      unit: eq.defaultUnit 
    }]);
    setSidePanelOpen(false);
  };

  const handleRemoveEquipment = (id: string) => {
    setEquipment(equipment.filter(eq => eq.id !== id));
    const newSuggestions = { ...equipmentSuggestions };
    delete newSuggestions[id];
    setEquipmentSuggestions(newSuggestions);
    if (activeEquipmentSuggestionId === id) {
      setActiveEquipmentSuggestionId(null);
    }
  };

  const handleEquipmentChange = (id: string, field: keyof Equipment, value: string) => {
    setEquipment(equipment.map(eq => 
      eq.id === id ? { ...eq, [field]: value } : eq
    ));

    if (field === 'name' && value.length >= 1) {
      const filtered = equipmentMaster.filter(eq =>
        eq.name.toLowerCase().includes(value.toLowerCase())
      );
      setEquipmentSuggestions({ ...equipmentSuggestions, [id]: filtered });
      setActiveEquipmentSuggestionId(id);
    } else if (field === 'name' && value.length === 0) {
      const newSuggestions = { ...equipmentSuggestions };
      delete newSuggestions[id];
      setEquipmentSuggestions(newSuggestions);
      if (activeEquipmentSuggestionId === id) {
        setActiveEquipmentSuggestionId(null);
      }
    }
  };

  const handleSelectEquipmentSuggestion = (id: string, eq: EquipmentMaster) => {
    setEquipment(equipment.map(e =>
      e.id === id
        ? { ...e, name: eq.name, quantity: '1', unit: eq.defaultUnit }
        : e
    ));
    const newSuggestions = { ...equipmentSuggestions };
    delete newSuggestions[id];
    setEquipmentSuggestions(newSuggestions);
    setActiveEquipmentSuggestionId(null);
  };

  const handleSave = () => {
    // バリデーション：理由が必要な薬剤に理由が入力されているかチェック
    // 定型文が選択されているか、自由記入があるかで判断
    const validMedications = medications.filter(med => med.name && med.dosage);
    const missingReasons = validMedications.filter(med => 
      needsReason(med) && !med.reasonTemplate && !med.reason
    );

    if (missingReasons.length > 0) {
      toast.error('平均値を超過した薬剤または追加薬剤には理由の入力が必要です');
      return;
    }

    onSave(orderId, validMedications, notes, selectedDoctor);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[65vw] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>使用機材・薬剤入力</DialogTitle>
          <DialogDescription>内視鏡検査の使用薬剤を入力してください。</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* メインコンテンツエリア */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {/* 検査内容 */}
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm font-medium text-gray-700">検査内容</div>
                <div className="text-sm">{orderContent}</div>
              </div>

              {/* 実施医情報（読み取り専用） */}
              <div className="bg-purple-50 p-3 rounded border border-purple-200">
                <div className="text-xs text-gray-600">
                  実施医: 山田医師 / 消化器内科 / 内視鏡専門医
                </div>
              </div>

              {/* 入力者情報 */}
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <div className="text-xs text-gray-600">
                  入力者: {currentUser} / {new Date().toLocaleString('ja-JP')}
                </div>
              </div>

              {/* 機材リスト */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">使用機材</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddEquipment}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    機材追加
                  </Button>
                </div>

                {equipment.length === 0 ? (
                  <div className="text-center text-gray-500 py-4 border-2 border-dashed rounded">
                    機材を追加してください
                  </div>
                ) : (
                  <div className="space-y-3">
                    {equipment.map((eq) => {
                      return (
                        <div key={eq.id} className="border rounded p-3 bg-white">
                          <div className="flex gap-2 items-start">
                            <div className="flex-1 space-y-3">
                              {/* 機材名・数量 */}
                              <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                  <Label className="text-xs">機材名</Label>
                                  <Input
                                    value={eq.name}
                                    onChange={(e) => handleEquipmentChange(eq.id, 'name', e.target.value)}
                                    placeholder="機材名を入力"
                                  />
                                  {activeEquipmentSuggestionId === eq.id && equipmentSuggestions[eq.id] && equipmentSuggestions[eq.id].length > 0 && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto">
                                      {equipmentSuggestions[eq.id].map(suggestion => (
                                        <div
                                          key={suggestion.name}
                                          className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                                          onClick={() => handleSelectEquipmentSuggestion(eq.id, suggestion)}
                                        >
                                          {suggestion.name} ({suggestion.defaultUnit})
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <Label className="text-xs">数量</Label>
                                  <div className="flex gap-1">
                                    <Input
                                      type="number"
                                      value={eq.quantity}
                                      onChange={(e) => handleEquipmentChange(eq.id, 'quantity', e.target.value)}
                                      placeholder="数量"
                                      className="flex-1"
                                    />
                                    <Input
                                      value={eq.unit}
                                      onChange={(e) => handleEquipmentChange(eq.id, 'unit', e.target.value)}
                                      placeholder="単位"
                                      className="w-20"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* 備考 */}
                              {eq.notes && (
                                <div className="space-y-2 bg-white p-2 rounded border border-gray-200">
                                  <Label className="text-xs">備考</Label>
                                  <Textarea
                                    value={eq.notes}
                                    onChange={(e) => handleEquipmentChange(eq.id, 'notes', e.target.value)}
                                    placeholder="備考"
                                    rows={2}
                                    className="text-sm"
                                  />
                                </div>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveEquipment(eq.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 薬剤リスト */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">使用薬剤</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddMedication}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    薬剤追加
                  </Button>
                </div>

                {medications.length === 0 ? (
                  <div className="text-center text-gray-500 py-4 border-2 border-dashed rounded">
                    薬剤を追加してください
                  </div>
                ) : (
                  <div className="space-y-3">
                    {medications.map((medication) => {
                      const requiresReason = needsReason(medication);
                      
                      return (
                        <div key={medication.id} className={`border rounded p-3 ${requiresReason ? 'border-orange-300 bg-orange-50' : 'bg-white'}`}>
                          <div className="flex gap-2 items-start">
                            <div className="flex-1 space-y-3">
                              {/* 薬剤名・使用量 */}
                              <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                  <Label className="text-xs">薬剤名</Label>
                                  <Input
                                    value={medication.name}
                                    onChange={(e) => handleMedicationChange(medication.id, 'name', e.target.value)}
                                    placeholder="薬剤名を入力"
                                  />
                                  {activeSuggestionId === medication.id && suggestions[medication.id] && suggestions[medication.id].length > 0 && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto">
                                      {suggestions[medication.id].map(suggestion => (
                                        <div
                                          key={suggestion.name}
                                          className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                                          onClick={() => handleSelectSuggestion(medication.id, suggestion)}
                                        >
                                          {suggestion.name} ({suggestion.averageDosage} {suggestion.unit})
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <Label className="text-xs">使用量</Label>
                                  <div className="flex gap-1">
                                    <Input
                                      type="number"
                                      value={medication.dosage}
                                      onChange={(e) => handleMedicationChange(medication.id, 'dosage', e.target.value)}
                                      placeholder="量"
                                      className="flex-1"
                                    />
                                    <Input
                                      value={medication.unit}
                                      onChange={(e) => handleMedicationChange(medication.id, 'unit', e.target.value)}
                                      placeholder="単位"
                                      className="w-20 bg-gray-100"
                                      readOnly
                                      disabled
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* 理由入力欄（平均値超過または追加薬剤の場合のみ表示） */}
                              {requiresReason && (
                                isReasonComplete(medication) && !expandedReasons[medication.id] ? (
                                  // 理由入力完了時：サマリ表示
                                  <div 
                                    className="bg-green-50 p-2 rounded border border-green-300 cursor-pointer hover:bg-green-100"
                                    onClick={() => toggleReasonExpanded(medication.id)}
                                  >
                                    <div className="text-xs text-green-800">
                                      ✓ {generateReasonSummary(medication)}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">クリックして再編集</div>
                                  </div>
                                ) : (
                                  // 理由入力中：フルフォーム表示
                                  <div className="space-y-2 bg-white p-2 rounded border border-orange-200">
                                    <div className="flex items-center gap-1 text-orange-700">
                                      <AlertCircle className="h-4 w-4" />
                                      <span className="text-xs font-medium">
                                        {medication.isAdded ? '追加薬剤のため理由が必要です' : '平均値超過のため理由が必要です'}
                                      </span>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <Label className="text-xs">指示医</Label>
                                          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                                            <SelectTrigger className="text-sm">
                                              <SelectValue placeholder="選択してください" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {doctorMaster.map((doctor) => (
                                                <SelectItem key={doctor} value={doctor}>
                                                  {doctor}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <Label className="text-xs">理由（定型文）</Label>
                                          <Select 
                                            value={medication.reasonTemplate || ''} 
                                            onValueChange={(value) => handleMedicationChange(medication.id, 'reasonTemplate', value)}
                                          >
                                            <SelectTrigger className="text-sm">
                                              <SelectValue placeholder="定型文を選択" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {reasonTemplates.map((template) => (
                                                <SelectItem key={template} value={template}>
                                                  {template}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-xs">自由記入</Label>
                                        <Textarea
                                          value={medication.reason || ''}
                                          onChange={(e) => handleMedicationChange(medication.id, 'reason', e.target.value)}
                                          placeholder="理由を自由に入力してください"
                                          rows={2}
                                          className="text-sm"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMedication(medication.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 備考 */}
              <div className="space-y-2">
                <Label>備考</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="特記事項があれば入力してください"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* サイドパネル */}
          {sidePanelOpen && (
            <div className="w-80 border-l bg-gray-50 flex flex-col">
              <div className="p-4 border-b bg-white flex items-center justify-between">
                <h3 className="font-medium">
                  {sidePanelTab === 'equipment' ? '機材を選択' : '薬剤を選択'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidePanelOpen(false)}
                  className="gap-1"
                >
                  ✕
                  <span>閉じる</span>
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {sidePanelTab === 'equipment' ? (
                  <div className="space-y-2">
                    {equipmentMaster.map((eq) => (
                      <Button
                        key={eq.name}
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-3 hover:bg-blue-50"
                        onClick={() => handleSelectEquipmentFromMenu(eq)}
                      >
                        <div className="text-left">
                          <div className="font-medium text-sm">{eq.name}</div>
                          <div className="text-xs text-gray-500">単位: {eq.defaultUnit}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {medicationMaster.map((med) => (
                      <Button
                        key={med.name}
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-3 hover:bg-blue-50"
                        onClick={() => handleSelectMedicationFromMenu(med)}
                      >
                        <div className="text-left">
                          <div className="font-medium text-sm">{med.name}</div>
                          <div className="text-xs text-gray-500">
                            平均: {med.averageDosage} {med.unit}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}