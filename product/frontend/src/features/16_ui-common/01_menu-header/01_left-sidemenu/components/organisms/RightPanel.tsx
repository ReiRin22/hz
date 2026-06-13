'use client';
import { useState } from 'react';
import { X, Edit3, Edit2, Check, Plus, Save, FolderOpen, Trash2, Calendar, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Badge } from '@/shared/components/atoms/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/atoms/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/components/atoms/alert-dialog';
import { Label } from '@/shared/components/atoms/label';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/atoms/collapsible';
import type { OrderDetail, SavedOrderData } from '../../types/order.types';

interface RightPanelProps {
  confirmedOrders: OrderDetail[];
  onUpdateOrder: (order: OrderDetail) => void;
  onRemoveOrder: (id: string) => void;
  onConfirmAllOrders: () => void;
  isSubmitting?: boolean;
  activeOrderType: string;
  isLabDirectMode?: boolean; // 検体オーダーの直接入力モード
  savedOrderDataList: SavedOrderData[];
  onSaveTemporary: (saveName: string) => void;
  onLoadTemporary: (saveData: SavedOrderData) => void;
  onDeleteSavedData: (saveId: string) => void;
  onNavigateToExamination?: (orderId: string) => void; // 検査予約画面への遷移（オーダーIDを渡す）
  patientAllergies?: string[]; // 患者のアレルギー情報
  onRemoveGroup?: (groupId: string) => void; // グループ単位での削除
  onAddSetOrders?: (setData: { id: string; name: string; items: string[]; type: 'my-set' | 'composite-set' }) => void; // セットからのオーダー追加
}

interface EditingState {
  [key: string]: {
    quantity?: string;
    frequency?: string;
    timing?: string;
    notes?: string; // 個別項目の特記事項
  };
}

export function RightPanel({
  confirmedOrders,
  onUpdateOrder,
  onRemoveOrder,
  onConfirmAllOrders,
  isSubmitting = false,
  activeOrderType,
  isLabDirectMode = false,
  savedOrderDataList,
  onSaveTemporary,
  onLoadTemporary,
  onDeleteSavedData,
  onNavigateToExamination,
  patientAllergies,
  onRemoveGroup,
  onAddSetOrders
}: RightPanelProps) {
  const [editingOrders, setEditingOrders] = useState<EditingState>({});
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);

  const [saveName, setSaveName] = useState('');
  const [allergyWarningOpen, setAllergyWarningOpen] = useState(false);
  const [allergyWarnings, setAllergyWarnings] = useState<Array<{order: OrderDetail, matchedAllergy: string}>>([]);
  const [openGroups, setOpenGroups] = useState<{[key: string]: boolean}>({});
  const [editingGroups, setEditingGroups] = useState<{[key: string]: boolean}>({});
  const [groupNotes, setGroupNotes] = useState<{[key: string]: string}>({});
  const [groupPriority, setGroupPriority] = useState<{[key: string]: string}>({});
  const [orderNotes, setOrderNotes] = useState<{[key: string]: string}>({});

  // アレルギーチェック関数
  const checkAllergies = (): Array<{order: OrderDetail, matchedAllergy: string}> => {
    if (!patientAllergies || patientAllergies.length === 0) {
      return [];
    }

    const warnings: Array<{order: OrderDetail, matchedAllergy: string}> = [];
    
    // 処方・注射オーダーをチェック
    const medicationOrders = confirmedOrders.filter(
      order => order.type === 'prescription' || order.type === 'injection'
    );

    medicationOrders.forEach(order => {
      patientAllergies.forEach(allergy => {
        // 薬剤名にアレルギー成分が含まれているかチェック（部分一致）
        if (order.name.includes(allergy) || allergy.includes(order.name)) {
          warnings.push({ order, matchedAllergy: allergy });
        }
      });
    });

    // 検体検査オーダーをチェック
    const labOrders = confirmedOrders.filter(order => order.type === 'lab');
    
    labOrders.forEach(order => {
      // 1. 造影剤のチェック
      const needsContrast = order.name.includes('造影') || 
                           order.name.includes('CT') || 
                           order.name.includes('MRI') ||
                           order.name.includes('血管造影') ||
                           order.contrastAgent; // 造影剤が明示的に指定されている場合
      
      if (needsContrast) {
        patientAllergies.forEach(allergy => {
          // ヨード造影剤、ガドリニウム造影剤のアレルギーチェック
          if (allergy.includes('ヨード') || allergy.includes('造影剤')) {
            if (order.name.includes('CT') || order.name.includes('造影') || order.contrastAgent?.includes('ヨード')) {
              warnings.push({ order, matchedAllergy: allergy });
            }
          }
          if (allergy.includes('ガドリニウム')) {
            if (order.name.includes('MRI') || order.contrastAgent?.includes('ガドリニウム')) {
              warnings.push({ order, matchedAllergy: allergy });
            }
          }
        });
      }

      // 2. 血液検査時のアレルギーチェック
      const isBloodTest = order.specimenType === '血液' || 
                          // 血球検査項目
                          order.name.includes('Hb') ||
                          order.name.includes('ヘモグロビン') ||
                          order.name.includes('Ht') ||
                          order.name.includes('ヘマトクリット') ||
                          order.name.includes('Plt') ||
                          order.name.includes('血小板') ||
                          order.name.includes('白血球') ||
                          order.name.includes('赤血球') ||
                          order.name.includes('好中球') ||
                          order.name.includes('リンパ球') ||
                          order.name.includes('単球') ||
                          order.name.includes('好酸球') ||
                          order.name.includes('好塩基球');
      
      if (isBloodTest) {
        patientAllergies.forEach(allergy => {
          // ラテックスアレルギー（手袋・駆血帯）
          if (allergy.includes('ラテックス')) {
            warnings.push({ 
              order, 
              matchedAllergy: `${allergy}（採血時の手袋・駆血帯に注意）` 
            });
          }
          // アルコールアレルギー（消毒）
          if (allergy.includes('アルコール') || allergy.includes('エタノール')) {
            warnings.push({ 
              order, 
              matchedAllergy: `${allergy}（アルコール消毒の代わりにポビドンヨード使用を推奨）` 
            });
          }
          // ポビドンヨード（イソジン）アレルギー
          if (allergy.includes('ポビドンヨード') || allergy.includes('イソジン') || allergy.includes('ヨード')) {
            // ヨード造影剤と重複しないようにチェック
            if (!needsContrast) {
              warnings.push({ 
                order, 
                matchedAllergy: `${allergy}（消毒薬に注意、クロルヘキシジンやアルコールの使用を推奨）` 
              });
            }
          }
          // クロルヘキシジンアレルギー
          if (allergy.includes('クロルヘキシジン') || allergy.includes('ヒビテン')) {
            warnings.push({ 
              order, 
              matchedAllergy: `${allergy}（消毒薬に注意）` 
            });
          }
        });
      }
    });

    return warnings;
  };

  // オーダー確定処理（アレルギーチェック付き）
  const handleConfirmWithAllergyCheck = () => {
    const warnings = checkAllergies();
    
    if (warnings.length > 0) {
      setAllergyWarnings(warnings);
      setAllergyWarningOpen(true);
    } else {
      onConfirmAllOrders();
    }
  };

  // アレルギー警告を無視して確定
  const handleConfirmDespiteWarning = () => {
    setAllergyWarningOpen(false);
    setAllergyWarnings([]);
    onConfirmAllOrders();
  };

  const handleEdit = (order: OrderDetail) => {
    // 本日の日付をyyyy-mm-dd形式で取得
    const today = new Date().toISOString().split('T')[0];
    
    setEditingOrders(prev => ({
      ...prev,
      [order.id]: {
        quantity: order.quantity || '',
        frequency: order.frequency || '',
        timing: order.timing || (order.type === 'lab' ? today : ''),
        notes: orderNotes[order.id] || ''
      }
    }));
  };

  const handleSave = (order: OrderDetail) => {
    const editingData = editingOrders[order.id];
    if (editingData) {
      const updatedOrder = {
        ...order,
        quantity: editingData.quantity,
        frequency: editingData.frequency,
        timing: editingData.timing
      };
      onUpdateOrder(updatedOrder);
      
      // 特記事項を保存
      if (editingData.notes !== undefined) {
        setOrderNotes(prev => ({
          ...prev,
          [order.id]: editingData.notes || ''
        }));
      }
    }
    
    setEditingOrders(prev => {
      const newState = { ...prev };
      delete newState[order.id];
      return newState;
    });
  };

  const handleCancel = (orderId: string) => {
    setEditingOrders(prev => {
      const newState = { ...prev };
      delete newState[orderId];
      return newState;
    });
  };

  const updateEditingValue = (orderId: string, field: keyof EditingState[string], value: string) => {
    setEditingOrders(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value
      }
    }));
  };

  const formatOrderDisplay = (order: OrderDetail) => {
    if (order.type === 'prescription') {
      return `${order.name} ${order.dosage || ''} ${order.quantity || ''} ${order.frequency || ''} ${order.timing || ''}`.trim();
    } else if (order.type === 'injection') {
      return `${order.name} ${order.dosage || ''} ${order.quantity || ''} ${order.route || ''}`.trim();
    } else if (order.type === 'lab') {
      // 採取日をフォーマット（YYYY-MM-DD形式を読みやすく変換）
      const collectionDateStr = order.collectionDate 
        ? ` - 採取日: ${new Date(order.collectionDate).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}`
        : '';
      return `${order.name}${collectionDateStr}`;
    }
    return order.name;
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'prescription': return 'bg-blue-100 text-blue-800';
      case 'injection': return 'bg-green-100 text-green-800';
      case 'lab': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'prescription': return '処方';
      case 'injection': return '注射';
      case 'lab': return '検体';
      default: return '';
    }
  };

  const frequencyOptions = ['1日1回', '1日2回', '1日3回', '1日4回', '頓用'];
  const timingOptions = ['朝', '昼', '夕', '朝昼', '朝夕', '昼夕', '朝昼夕', '食前', '食後', '食間', '就寝前'];

  const handleTemporarySave = () => {
    if (saveName.trim()) {
      onSaveTemporary(saveName.trim());
      setSaveName('');
      setSaveDialogOpen(false);
    }
  };

  // オーダーを種別ごとに分類
  const ordersByType = {
    prescription: confirmedOrders.filter(order => order.type === 'prescription'),
    injection: confirmedOrders.filter(order => order.type === 'injection'),
    lab: confirmedOrders.filter(order => order.type === 'lab')
  };

  // 検査項目IDからカテゴリを判定するマッピング
  const getLabCategory = (itemId: string): { id: string; name: string } | null => {
    // 生化学検査
    if (itemId.match(/^lab_(ast|alt|ggt|ldh|alp|tp|alb|tbil|dbil|che|bun|cre|ua|egfr|tc|hdl|ldl|tg|glu|hba1c|ga|na|k|cl|ca|mg|p|amy|cpk|nh3|lactate)/i)) {
      return { id: 'biochemistry', name: '生化学検査' };
    }
    // 血液検査
    if (itemId.match(/^lab_(wbc|rbc|hgb|hct|plt|mcv|mch|mchc|neut|lymph|mono|eos|baso|retic)/i)) {
      return { id: 'hematology', name: '血液検査' };
    }
    // 凝固検査
    if (itemId.match(/^lab_(pt|ptinr|aptt|fib|ddimer|fdp|at3)/i)) {
      return { id: 'coagulation', name: '凝固検査' };
    }
    // 免疫・炎症
    if (itemId.match(/^lab_(crp|esr|rf|ana|aslo|igg|iga|igm|ige|c3|c4|procalcitonin)/i)) {
      return { id: 'immunology', name: '免疫・炎症' };
    }
    // 内分泌検査
    if (itemId.match(/^lab_(tsh|ft3|ft4|t3|t4|cortisol|acth|lh|fsh|prolactin|testosterone|estradiol|insulin|cpeptide)/i)) {
      return { id: 'endocrine', name: '内分泌検査' };
    }
    // 感染症検査
    if (itemId.match(/^lab_(hbsag|hbsab|hcvab|hcvrna|hiv|tpha|rpr|influenza|covid|strep)/i)) {
      return { id: 'infection', name: '感染症検査' };
    }
    // 腫瘍マーカー
    if (itemId.match(/^lab_(cea|afp|ca199|ca125|ca153|psa|cyfra|scc|nse|progastrin)/i)) {
      return { id: 'tumor_marker', name: '腫瘍マーカー' };
    }
    // 心臓マーカー
    if (itemId.match(/^lab_(troponin|troponint|bnp|ntprobnp|ckmb|myoglobin)/i)) {
      return { id: 'cardiac', name: '心臓マーカー' };
    }
    // 尿検査
    if (itemId.match(/^lab_(urine_|sediment)/i)) {
      return { id: 'urine', name: '尿検査' };
    }
    // その他
    if (itemId.match(/^lab_(blood_type|crossmatch|stool_occult|hp|blood_culture|urine_culture)/i)) {
      return { id: 'other', name: 'その他' };
    }
    return null;
  };

  // オーダーをグループごとに分類する関数（検体検査はカテゴリ別、それ以外はセット/履歴別）
  const groupOrdersByType = (orders: OrderDetail[]) => {
    const grouped: { [key: string]: OrderDetail[] } = {};
    const ungrouped: OrderDetail[] = [];

    orders.forEach(order => {
      // 検体検査の場合はカテゴリでグループ化（既存のgroupIdより優先）
      if (order.type === 'lab') {
        // itemCodeまたはidを使ってカテゴリを判定
        const itemCode = order.itemCode || order.id;
        const category = getLabCategory(itemCode);
        if (category) {
          const categoryGroupId = `lab-category-${category.id}`;
          if (!grouped[categoryGroupId]) {
            grouped[categoryGroupId] = [];
          }
          // カテゴリ情報を持つ新しいオーダーオブジェクトを作成
          grouped[categoryGroupId].push({
            ...order,
            groupId: categoryGroupId,
            groupName: category.name,
            groupType: undefined  // カテゴリグループにはタイプを設定しない
          });
        } else {
          ungrouped.push(order);
        }
      } 
      // 検体検査以外は従来通りgroupIdでグループ化
      else if (order.groupId) {
        if (!grouped[order.groupId]) {
          grouped[order.groupId] = [];
        }
        grouped[order.groupId].push(order);
      } else {
        ungrouped.push(order);
      }
    });

    return { grouped, ungrouped };
  };

  // グループタイプのバッジ表示（カテゴリグループの場合は表示しない）
  const getGroupTypeBadge = (groupType?: 'set' | 'history', groupId?: string) => {
    // カテゴリグループの場合はバッジを表示しない
    if (groupId?.startsWith('lab-category-')) {
      return null;
    }
    
    switch (groupType) {
      case 'set':
        return <Badge variant="outline" className="text-xs">セット</Badge>;
      case 'history':
        return <Badge variant="outline" className="text-xs">履歴</Badge>;
      default:
        return null;
    }
  };

  // オーダー種別のバッジカラーを取得
  const getOrderTypeBadgeColor = (orderType: string) => {
    switch (orderType) {
      case 'prescription': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'injection': return 'bg-green-100 text-green-800 border-green-200';
      case 'lab': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // オーダー種別のラベルを取得
  const getOrderTypeLabel = (orderType: string) => {
    switch (orderType) {
      case 'prescription': return '処方';
      case 'injection': return '注射';
      case 'lab': return '検体';
      default: return '';
    }
  };

  // 検体オーダーの直接入力モードの場合は幅を調整
  const panelWidth = isLabDirectMode ? 'flex-1' : 'w-[500px]';

  return (
    <div className={`${panelWidth} bg-card flex flex-col`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2>選択済みオーダーリスト</h2>
            <div className="text-sm text-muted-foreground mt-1">
              全種別統合表示 ({confirmedOrders.length}件)
            </div>
          </div>
          <div className="flex gap-2">
            {/* 一時保存ボタン */}
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={confirmedOrders.length === 0}
                >
                  <Save className="w-4 h-4 mr-1" />
                  一時保存
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]" hideCloseButton>
                <DialogHeader>
                  <DialogTitle>オーダーの一時保存</DialogTitle>
                  <DialogDescription>
                    現在のオーダー内容を一時保存します。保存名を入力してください。
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="save-name" className="text-right">
                      保存名
                    </Label>
                    <Input
                      id="save-name"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      placeholder="例：午前の処方"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSaveDialogOpen(false);
                      setSaveName('');
                    }}
                  >
                    キャンセル
                  </Button>
                  <Button onClick={handleTemporarySave} disabled={!saveName.trim()}>
                    保存
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* 読み込みボタン */}
            <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={savedOrderDataList.length === 0}
                >
                  <FolderOpen className="w-4 h-4 mr-1" />
                  読み込み
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]" hideCloseButton>
                <DialogHeader>
                  <DialogTitle>保存データの読み込み</DialogTitle>
                  <DialogDescription>
                    読み込むデータを選択してください。現在のオーダー内容は上書きされます。
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {savedOrderDataList.map((saveData) => (
                    <div
                      key={saveData.id}
                      className="p-3 border border-border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{saveData.name}</div>
                          <div className="text-sm text-muted-foreground">
                            保存日時: {new Date(saveData.savedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            オーダー数: {saveData.orders.length}件
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => {
                              onLoadTemporary(saveData);
                              setLoadDialogOpen(false);
                            }}
                          >
                            読み込み
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteSavedData(saveData.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setLoadDialogOpen(false)}
                  >
                    キャンセル
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleConfirmWithAllergyCheck}
              size="sm"
              disabled={confirmedOrders.length === 0 || isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? '送信中...' : 'オーダー確定'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {confirmedOrders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="text-lg mb-2">オーダーがありません</div>
            <div className="text-sm">左パネルから薬剤・検査項目を選択してオーダーを追加</div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* オーダー種別ごとに分類して表示 */}
            {Object.entries(ordersByType).map(([orderType, orders]) => {
              if (orders.length === 0) return null;
              
              return (
                <div key={orderType} className="space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <Badge variant="secondary" className={getOrderTypeBadgeColor(orderType)}>
                      {getOrderTypeLabel(orderType)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {orders.length}件
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {/* グループ化されたオーダーとグループ化されていないオーダーを分離 */}
                    {(() => {
                      const { grouped, ungrouped } = groupOrdersByType(orders);
                      
                      return (
                        <>
                          {/* グループ化されたオーダーを表示 */}
                          {Object.entries(grouped).map(([groupId, groupOrders]) => {
                            if (groupOrders.length === 0) return null;
                            
                            const firstOrder = groupOrders[0];
                            const isGroupOpen = openGroups[groupId] ?? false; // デフォルトで閉じる
                            
                            // グループ内の採取日を確認
                            const collectionDates = groupOrders
                              .map(o => o.collectionDate)
                              .filter(d => d !== undefined && d !== '');
                            const uniqueDates = [...new Set(collectionDates)];
                            const groupCollectionDate = uniqueDates.length === 1 ? uniqueDates[0] : 
                                                       collectionDates.length > 0 ? collectionDates[0] : undefined;
                            
                            return (
                              <Collapsible
                                key={groupId}
                                open={isGroupOpen}
                                onOpenChange={(open) => setOpenGroups(prev => ({...prev, [groupId]: open}))}
                                className="border-2 border-blue-300 rounded-lg bg-blue-50/50"
                              >
                                <div className="p-2 bg-blue-100/60 rounded-t-lg border-b-2 border-blue-300">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <CollapsibleTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 hover:bg-blue-200"
                                        >
                                          {isGroupOpen ? (
                                            <ChevronDown className="w-4 h-4" />
                                          ) : (
                                            <ChevronRight className="w-4 h-4" />
                                          )}
                                        </Button>
                                      </CollapsibleTrigger>
                                      <span className="font-medium text-sm">
                                        {firstOrder.groupName || 'グループ'}
                                      </span>
                                      {getGroupTypeBadge(firstOrder.groupType, groupId)}
                                      {groupCollectionDate && (
                                        <span className="text-xs text-blue-700 bg-blue-200 px-2 py-0.5 rounded">
                                          採取日: {new Date(groupCollectionDate).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                        </span>
                                      )}
                                      <span className="text-xs text-muted-foreground">
                                        ({groupOrders.length}件)
                                      </span>
                                      {groupPriority[groupId] && !editingGroups[groupId] && (
                                        <span className={`text-xs px-2 py-0.5 rounded ${
                                          groupPriority[groupId] === '緊急' ? 'bg-red-200 text-red-800 border border-red-400' :
                                          groupPriority[groupId] === '至急' ? 'bg-orange-200 text-orange-800 border border-orange-400' :
                                          'bg-gray-200 text-gray-800 border border-gray-400'
                                        }`}>
                                          {groupPriority[groupId] === '緊急' && '🚨 '}
                                          {groupPriority[groupId] === '至急' && '⚡ '}
                                          {groupPriority[groupId]}
                                        </span>
                                      )}
                                      {groupNotes[groupId] && !editingGroups[groupId] && (
                                        <span className="text-xs text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-300">
                                          📝
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          const isCurrentlyEditing = editingGroups[groupId];
                                          setEditingGroups(prev => ({...prev, [groupId]: !isCurrentlyEditing}));
                                          if (!isCurrentlyEditing) {
                                            // 編集モード開始時にグループを開く
                                            setOpenGroups(prev => ({...prev, [groupId]: true}));
                                          }
                                        }}
                                        className={`h-6 w-6 p-0 ${editingGroups[groupId] ? 'text-amber-700 bg-amber-100' : 'text-amber-600 hover:text-amber-700 hover:bg-amber-100'}`}
                                        title="グループ編集"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </Button>
                                      {onNavigateToExamination && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            // グループ内の最初のオーダーIDで遷移
                                            onNavigateToExamination(firstOrder.id);
                                          }}
                                          className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                          title="検査予約画面へ"
                                        >
                                          <Calendar className="w-3 h-3" />
                                        </Button>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          // グループ内のすべてのオーダーを個別に削除
                                          groupOrders.forEach(order => {
                                            onRemoveOrder(order.id);
                                          });
                                        }}
                                        className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        title="グループを削除"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  {/* 指示コメント・特記事項の全文表示（非編集時） */}
                                  {!editingGroups[groupId] && groupNotes[groupId] && (
                                    <div className="px-3 py-2 bg-blue-50 border-t border-blue-200">
                                      <div className="text-xs text-red-700 whitespace-pre-wrap">
                                        {groupNotes[groupId]}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* グループ編集モード時の指示コメント・特記事項 */}
                                  {editingGroups[groupId] && (
                                    <div className="px-3 pb-2 pt-2 border-t border-blue-300 space-y-3">
                                      <div>
                                        <Label className="text-xs text-muted-foreground mb-1">緊急度</Label>
                                        <Select
                                          value={groupPriority[groupId] || '通常'}
                                          onValueChange={(value) => setGroupPriority(prev => ({...prev, [groupId]: value}))}
                                        >
                                          <SelectTrigger className="h-8 text-sm">
                                            <SelectValue placeholder="緊急度を選択" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="通常">通常</SelectItem>
                                            <SelectItem value="至急">至急</SelectItem>
                                            <SelectItem value="緊急">緊急</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground mb-1">指示コメント・特記事項</Label>
                                        <Textarea
                                          value={groupNotes[groupId] || ''}
                                          onChange={(e) => setGroupNotes(prev => ({...prev, [groupId]: e.target.value}))}
                                          placeholder="グループ全体への指示や特記事項を入力..."
                                          className="h-20 text-sm resize-none"
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="default"
                                          onClick={() => {
                                            // 保存処理（ここでは編集モードを終了）
                                            setEditingGroups(prev => ({...prev, [groupId]: false}));
                                          }}
                                          className="h-7 text-xs"
                                        >
                                          <Check className="w-3 h-3 mr-1" />
                                          保存
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            // キャンセル時は編集モードを終了
                                            setEditingGroups(prev => ({...prev, [groupId]: false}));
                                          }}
                                          className="h-7 text-xs"
                                        >
                                          <X className="w-3 h-3 mr-1" />
                                          キャンセル
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <CollapsibleContent>
                                  <div className="p-2 space-y-2">
                                    {(() => {
                                      // 検体検査のカテゴリグループの場合、サブカテゴリごとに分けて表示
                                      if (groupId.startsWith('lab-category-')) {
                                        const ordersBySubcategory: { [key: string]: OrderDetail[] } = {};
                                        groupOrders.forEach((order) => {
                                          const subcatKey = order.subcategory || 'other';
                                          if (!ordersBySubcategory[subcatKey]) {
                                            ordersBySubcategory[subcatKey] = [];
                                          }
                                          ordersBySubcategory[subcatKey].push(order);
                                        });
                                        
                                        return Object.entries(ordersBySubcategory).map(([subcatId, subOrders]) => (
                                          <div key={subcatId} className="space-y-2">
                                            {subOrders[0].subcategoryName && (
                                              <div className="text-xs text-muted-foreground px-1 mt-2 first:mt-0">
                                                {subOrders[0].subcategoryName}
                                              </div>
                                            )}
                                            {subOrders.map((order) => {
                                              const isEditing = editingOrders[order.id];
                                              return (
                                                <div
                                                  key={order.id}
                                                  className="p-3 rounded border border-border bg-card"
                                                >
                                                  <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                      {order.type === 'prescription' && (
                                                        <span className="text-sm font-medium text-primary">
                                                          RP.{order.rpNumber}
                                                        </span>
                                                      )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                      {!isEditing ? (
                                                        <>
                                                          <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleEdit(order)}
                                                            className="h-6 w-6 p-0"
                                                          >
                                                            <Edit3 className="w-3 h-3" />
                                                          </Button>
                                                          {onNavigateToExamination && (
                                                            <Button
                                                              size="sm"
                                                              variant="ghost"
                                                              onClick={() => onNavigateToExamination(order.id)}
                                                              className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                                                              title="検査予約画面へ"
                                                            >
                                                              <Calendar className="w-3 h-3" />
                                                            </Button>
                                                          )}
                                                          <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => onRemoveOrder(order.id)}
                                                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                          >
                                                            <Trash2 className="w-3 h-3" />
                                                          </Button>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleSave(order)}
                                                            className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                                          >
                                                            <Check className="w-3 h-3" />
                                                          </Button>
                                                          <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleCancel(order.id)}
                                                            className="h-6 w-6 p-0"
                                                          >
                                                            <X className="w-3 h-3" />
                                                          </Button>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>

                                                  <div className="mb-2">
                                                    <div className="text-sm font-medium">{order.name}</div>
                                                    {order.notes && (
                                                      <div className="text-xs text-muted-foreground mt-1">{order.notes}</div>
                                                    )}
                                                    {order.scheduledDates && order.scheduledDates.length > 0 && (
                                                      <div className="text-xs text-muted-foreground mt-1">
                                                        投与予定: {order.scheduledDates.join(', ')}
                                                      </div>
                                                    )}
                                                  </div>

                                                  {!isEditing && orderNotes[order.id] && (
                                                    <div className="mb-2 px-2 py-1.5 bg-blue-50 border border-blue-200 rounded">
                                                      <div className="text-xs text-red-700 whitespace-pre-wrap">
                                                        {orderNotes[order.id]}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {!isEditing ? (
                                                    <div className="text-sm text-muted-foreground">
                                                      {formatOrderDisplay(order)}
                                                    </div>
                                                  ) : (
                                                    <div className="space-y-2">
                                                      {order.type === 'prescription' && (
                                                        <div className="grid grid-cols-3 gap-2">
                                                          <div>
                                                            <label className="text-xs text-muted-foreground">数量</label>
                                                            <Input
                                                              value={isEditing.quantity || ''}
                                                              onChange={(e) => updateEditingValue(order.id, 'quantity', e.target.value)}
                                                              placeholder="1錠"
                                                              className="h-8 text-xs"
                                                            />
                                                          </div>
                                                          <div>
                                                            <label className="text-xs text-muted-foreground">頻度</label>
                                                            <Select
                                                              value={isEditing.frequency || ''}
                                                              onValueChange={(value) => updateEditingValue(order.id, 'frequency', value)}
                                                            >
                                                              <SelectTrigger className="h-8 text-xs">
                                                                <SelectValue placeholder="選択" />
                                                              </SelectTrigger>
                                                              <SelectContent>
                                                                {frequencyOptions.map((option) => (
                                                                  <SelectItem key={option} value={option}>
                                                                    {option}
                                                                  </SelectItem>
                                                                ))}
                                                              </SelectContent>
                                                            </Select>
                                                          </div>
                                                          <div>
                                                            <label className="text-xs text-muted-foreground">タイミング</label>
                                                            <Select
                                                              value={isEditing.timing || ''}
                                                              onValueChange={(value) => updateEditingValue(order.id, 'timing', value)}
                                                            >
                                                              <SelectTrigger className="h-8 text-xs">
                                                                <SelectValue placeholder="選択" />
                                                              </SelectTrigger>
                                                              <SelectContent>
                                                                {timingOptions.map((option) => (
                                                                  <SelectItem key={option} value={option}>
                                                                    {option}
                                                                  </SelectItem>
                                                                ))}
                                                              </SelectContent>
                                                            </Select>
                                                          </div>
                                                        </div>
                                                      )}
                                                      
                                                      {order.type === 'lab' && (
                                                        <div className="grid grid-cols-2 gap-2">
                                                          <div>
                                                            <label className="text-xs text-muted-foreground">採取日</label>
                                                            <Input
                                                              type="date"
                                                              value={isEditing.timing || ''}
                                                              onChange={(e) => updateEditingValue(order.id, 'timing', e.target.value)}
                                                              className="h-8 text-xs"
                                                            />
                                                          </div>
                                                          <div>
                                                            <label className="text-xs text-muted-foreground">緊急度</label>
                                                            <Select
                                                              value={isEditing.frequency || ''}
                                                              onValueChange={(value) => updateEditingValue(order.id, 'frequency', value)}
                                                            >
                                                              <SelectTrigger className="h-8 text-xs">
                                                                <SelectValue placeholder="選択" />
                                                              </SelectTrigger>
                                                              <SelectContent>
                                                                <SelectItem value="通常">通常</SelectItem>
                                                                <SelectItem value="至急">至急</SelectItem>
                                                                <SelectItem value="緊急">緊急</SelectItem>
                                                              </SelectContent>
                                                            </Select>
                                                          </div>
                                                        </div>
                                                      )}

                                                      {order.type === 'injection' && (
                                                        <div className="grid grid-cols-2 gap-2">
                                                          <div>
                                                            <label className="text-xs text-muted-foreground">用量</label>
                                                            <Input
                                                              value={isEditing.quantity || ''}
                                                              onChange={(e) => updateEditingValue(order.id, 'quantity', e.target.value)}
                                                              placeholder="1A"
                                                              className="h-8 text-xs"
                                                            />
                                                          </div>
                                                          <div>
                                                            <label className="text-xs text-muted-foreground">投与経路</label>
                                                            <Select
                                                              value={isEditing.timing || ''}
                                                              onValueChange={(value) => updateEditingValue(order.id, 'timing', value)}
                                                            >
                                                              <SelectTrigger className="h-8 text-xs">
                                                                <SelectValue placeholder="選択" />
                                                              </SelectTrigger>
                                                              <SelectContent>
                                                                <SelectItem value="静脈内投与">静脈内投与</SelectItem>
                                                                <SelectItem value="筋肉内投与">筋肉内投与</SelectItem>
                                                                <SelectItem value="皮下投与">皮下投与</SelectItem>
                                                                <SelectItem value="点滴静注">点滴静注</SelectItem>
                                                              </SelectContent>
                                                            </Select>
                                                          </div>
                                                        </div>
                                                      )}
                                                      
                                                      <div className="mt-3 pt-3 border-t border-border">
                                                        <label className="text-xs text-muted-foreground mb-1 block">特記事項</label>
                                                        <Textarea
                                                          value={isEditing.notes || ''}
                                                          onChange={(e) => updateEditingValue(order.id, 'notes', e.target.value)}
                                                          placeholder="この項目への特記事項を入力..."
                                                          className="h-16 text-xs resize-none"
                                                        />
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        ));
                                      } else {
                                        // 通常のグループ表示
                                        return groupOrders.map((order) => {
                                          const isEditing = editingOrders[order.id];
                                          return (
                                            <div
                                              key={order.id}
                                              className="p-3 rounded border border-border bg-card"
                                            >
                                          <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                              {order.type === 'prescription' && (
                                                <span className="text-sm font-medium text-primary">
                                                  RP.{order.rpNumber}
                                                </span>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                              {!isEditing ? (
                                                <>
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleEdit(order)}
                                                    className="h-6 w-6 p-0"
                                                  >
                                                    <Edit3 className="w-3 h-3" />
                                                  </Button>
                                                  {onNavigateToExamination && (
                                                    <Button
                                                      size="sm"
                                                      variant="ghost"
                                                      onClick={() => onNavigateToExamination(order.id)}
                                                      className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                                                      title="検査予約画面へ"
                                                    >
                                                      <Calendar className="w-3 h-3" />
                                                    </Button>
                                                  )}
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onRemoveOrder(order.id)}
                                                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                  >
                                                    <X className="w-3 h-3" />
                                                  </Button>
                                                </>
                                              ) : (
                                                <>
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleSave(order)}
                                                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                                  >
                                                    <Check className="w-3 h-3" />
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleCancel(order.id)}
                                                    className="h-6 w-6 p-0"
                                                  >
                                                    <X className="w-3 h-3" />
                                                  </Button>
                                                </>
                                              )}
                                            </div>
                                          </div>

                                          <div className="mb-2">
                                            <div className="text-sm font-medium">{order.name}</div>
                                            {order.notes && (
                                              <div className="text-xs text-muted-foreground mt-1">{order.notes}</div>
                                            )}
                                            {order.scheduledDates && order.scheduledDates.length > 0 && (
                                              <div className="text-xs text-muted-foreground mt-1">
                                                投与予定: {order.scheduledDates.join(', ')}
                                              </div>
                                            )}
                                          </div>

                                          {/* 個別項目の特記事項全文表示（非編集時） */}
                                          {!isEditing && orderNotes[order.id] && (
                                            <div className="mb-2 px-2 py-1.5 bg-blue-50 border border-blue-200 rounded">
                                              <div className="text-xs text-red-700 whitespace-pre-wrap">
                                                {orderNotes[order.id]}
                                              </div>
                                            </div>
                                          )}

                                          {!isEditing ? (
                                            <div className="text-sm text-muted-foreground">
                                              {formatOrderDisplay(order)}
                                            </div>
                                          ) : (
                                            <div className="space-y-2">
                                              {order.type === 'prescription' && (
                                                <div className="grid grid-cols-3 gap-2">
                                                  <div>
                                                    <label className="text-xs text-muted-foreground">数量</label>
                                                    <Input
                                                      value={isEditing.quantity || ''}
                                                      onChange={(e) => updateEditingValue(order.id, 'quantity', e.target.value)}
                                                      placeholder="1錠"
                                                      className="h-8 text-xs"
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="text-xs text-muted-foreground">頻度</label>
                                                    <Select
                                                      value={isEditing.frequency || ''}
                                                      onValueChange={(value) => updateEditingValue(order.id, 'frequency', value)}
                                                    >
                                                      <SelectTrigger className="h-8 text-xs">
                                                        <SelectValue placeholder="選択" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        {frequencyOptions.map((option) => (
                                                          <SelectItem key={option} value={option}>
                                                            {option}
                                                          </SelectItem>
                                                        ))}
                                                      </SelectContent>
                                                    </Select>
                                                  </div>
                                                  <div>
                                                    <label className="text-xs text-muted-foreground">タイミング</label>
                                                    <Select
                                                      value={isEditing.timing || ''}
                                                      onValueChange={(value) => updateEditingValue(order.id, 'timing', value)}
                                                    >
                                                      <SelectTrigger className="h-8 text-xs">
                                                        <SelectValue placeholder="選択" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        {timingOptions.map((option) => (
                                                          <SelectItem key={option} value={option}>
                                                            {option}
                                                          </SelectItem>
                                                        ))}
                                                      </SelectContent>
                                                    </Select>
                                                  </div>
                                                </div>
                                              )}
                                              
                                              {order.type === 'lab' && (
                                                <div className="grid grid-cols-2 gap-2">
                                                  <div>
                                                    <label className="text-xs text-muted-foreground">採取日</label>
                                                    <Input
                                                      type="date"
                                                      value={isEditing.timing || ''}
                                                      onChange={(e) => updateEditingValue(order.id, 'timing', e.target.value)}
                                                      className="h-8 text-xs"
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="text-xs text-muted-foreground">緊急度</label>
                                                    <Select
                                                      value={isEditing.frequency || ''}
                                                      onValueChange={(value) => updateEditingValue(order.id, 'frequency', value)}
                                                    >
                                                      <SelectTrigger className="h-8 text-xs">
                                                        <SelectValue placeholder="選択" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        <SelectItem value="通常">通常</SelectItem>
                                                        <SelectItem value="至急">至急</SelectItem>
                                                        <SelectItem value="緊急">緊急</SelectItem>
                                                      </SelectContent>
                                                    </Select>
                                                  </div>
                                                </div>
                                              )}

                                              {order.type === 'injection' && (
                                                <div className="grid grid-cols-2 gap-2">
                                                  <div>
                                                    <label className="text-xs text-muted-foreground">用量</label>
                                                    <Input
                                                      value={isEditing.quantity || ''}
                                                      onChange={(e) => updateEditingValue(order.id, 'quantity', e.target.value)}
                                                      placeholder="1A"
                                                      className="h-8 text-xs"
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="text-xs text-muted-foreground">投与経路</label>
                                                    <Select
                                                      value={isEditing.timing || ''}
                                                      onValueChange={(value) => updateEditingValue(order.id, 'timing', value)}
                                                    >
                                                      <SelectTrigger className="h-8 text-xs">
                                                        <SelectValue placeholder="選択" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        <SelectItem value="静脈内投与">静脈内投与</SelectItem>
                                                        <SelectItem value="筋肉内投与">筋肉内投与</SelectItem>
                                                        <SelectItem value="皮下投与">皮下投与</SelectItem>
                                                        <SelectItem value="点滴静注">点滴静注</SelectItem>
                                                      </SelectContent>
                                                    </Select>
                                                  </div>
                                                </div>
                                              )}
                                              
                                              {/* 特記事項入力欄 */}
                                              <div className="mt-3 pt-3 border-t border-border">
                                                <label className="text-xs text-muted-foreground mb-1 block">特記事項</label>
                                                <Textarea
                                                  value={isEditing.notes || ''}
                                                  onChange={(e) => updateEditingValue(order.id, 'notes', e.target.value)}
                                                  placeholder="この項目への特記事項を入力..."
                                                  className="h-16 text-xs resize-none"
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    });
                                  }
                                })()}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            );
                          })}
                          
                          {/* グループ化されていないオーダーを表示 */}
                          {ungrouped.map((order) => {
                            const isEditing = editingOrders[order.id];
                      
                      return (
                        <div
                          key={order.id}
                          className="p-3 rounded border border-border bg-card"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {order.type === 'prescription' && (
                                <span className="text-sm font-medium text-primary">
                                  RP.{order.rpNumber}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {!isEditing ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEdit(order)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </Button>
                                  {onNavigateToExamination && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => onNavigateToExamination(order.id)}
                                      className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                                      title="検査予約画面へ"
                                    >
                                      <Calendar className="w-3 h-3" />
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onRemoveOrder(order.id)}
                                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleSave(order)}
                                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                  >
                                    <Check className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCancel(order.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="mb-2">
                            <div className="text-sm font-medium">{order.name}</div>
                            {order.notes && (
                              <div className="text-xs text-muted-foreground mt-1">{order.notes}</div>
                            )}
                            {order.scheduledDates && order.scheduledDates.length > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                投与予定: {order.scheduledDates.join(', ')}
                              </div>
                            )}
                          </div>

                          {/* 個別項目の特記事項全文表示（非編集時） */}
                          {!isEditing && orderNotes[order.id] && (
                            <div className="mb-2 px-2 py-1.5 bg-blue-50 border border-blue-200 rounded">
                              <div className="text-xs text-red-700 whitespace-pre-wrap">
                                {orderNotes[order.id]}
                              </div>
                            </div>
                          )}

                          {!isEditing ? (
                            <div className="text-sm text-muted-foreground">
                              {formatOrderDisplay(order)}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {order.type === 'prescription' && (
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="text-xs text-muted-foreground">数量</label>
                                    <Input
                                      value={isEditing.quantity || ''}
                                      onChange={(e) => updateEditingValue(order.id, 'quantity', e.target.value)}
                                      placeholder="1錠"
                                      className="h-8 text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-muted-foreground">頻度</label>
                                    <Select
                                      value={isEditing.frequency || ''}
                                      onValueChange={(value) => updateEditingValue(order.id, 'frequency', value)}
                                    >
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="選択" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {frequencyOptions.map((option) => (
                                          <SelectItem key={option} value={option}>
                                            {option}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-xs text-muted-foreground">タイミング</label>
                                    <Select
                                      value={isEditing.timing || ''}
                                      onValueChange={(value) => updateEditingValue(order.id, 'timing', value)}
                                    >
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="選択" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {timingOptions.map((option) => (
                                          <SelectItem key={option} value={option}>
                                            {option}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                              
                              {order.type === 'lab' && (
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-xs text-muted-foreground">採取日</label>
                                    <Input
                                      type="date"
                                      value={isEditing.timing || ''}
                                      onChange={(e) => updateEditingValue(order.id, 'timing', e.target.value)}
                                      className="h-8 text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-muted-foreground">緊急度</label>
                                    <Select
                                      value={isEditing.frequency || ''}
                                      onValueChange={(value) => updateEditingValue(order.id, 'frequency', value)}
                                    >
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="選択" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="通常">通常</SelectItem>
                                        <SelectItem value="至急">至急</SelectItem>
                                        <SelectItem value="緊急">緊急</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}

                              {order.type === 'injection' && (
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-xs text-muted-foreground">用量</label>
                                    <Input
                                      value={isEditing.quantity || ''}
                                      onChange={(e) => updateEditingValue(order.id, 'quantity', e.target.value)}
                                      placeholder="1A"
                                      className="h-8 text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-muted-foreground">投与経路</label>
                                    <Select
                                      value={isEditing.timing || ''}
                                      onValueChange={(value) => updateEditingValue(order.id, 'timing', value)}
                                    >
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="選択" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="静脈内投与">静脈内投与</SelectItem>
                                        <SelectItem value="筋肉内投与">筋肉内投与</SelectItem>
                                        <SelectItem value="皮下投与">皮下投与</SelectItem>
                                        <SelectItem value="点滴静注">点滴静注</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                              
                              {/* 特記事項入力欄 */}
                              <div className="mt-3 pt-3 border-t border-border">
                                <label className="text-xs text-muted-foreground mb-1 block">特記事項</label>
                                <Textarea
                                  value={isEditing.notes || ''}
                                  onChange={(e) => updateEditingValue(order.id, 'notes', e.target.value)}
                                  placeholder="この項目への特記事項を入力..."
                                  className="h-16 text-xs resize-none"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                            );
                          })}
                        </>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {confirmedOrders.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground text-center">
            {confirmedOrders.length}件のオーダーが選択されています
          </div>
        </div>
      )}

      {/* アレルギー警告ダイアログ */}
      <Dialog open={allergyWarningOpen} onOpenChange={setAllergyWarningOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <DialogTitle className="text-destructive">アレルギー警告</DialogTitle>
            </div>
            <DialogDescription>
              以下のオーダーにアレルギーが該当しています。患者のアレルギー情報を確認の上、確定してください。
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-3 py-4">
            {allergyWarnings.map((warning, index) => (
              <div
                key={`${warning.order.id}-${index}`}
                className="p-3 border-2 border-destructive/50 bg-destructive/5 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-destructive">{warning.order.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {warning.order.dosage && <span>{warning.order.dosage} </span>}
                      {warning.order.quantity && <span>{warning.order.quantity} </span>}
                      {warning.order.frequency && <span>{warning.order.frequency} </span>}
                    </div>
                    <div className="text-sm mt-2 p-2 bg-background rounded border border-border">
                      <span className="font-medium">該当アレルギー: </span>
                      <span className="text-destructive font-medium">{warning.matchedAllergy}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setAllergyWarningOpen(false);
                setAllergyWarnings([]);
              }}
            >
              キャンセル
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDespiteWarning}
            >
              警告を確認して確定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}