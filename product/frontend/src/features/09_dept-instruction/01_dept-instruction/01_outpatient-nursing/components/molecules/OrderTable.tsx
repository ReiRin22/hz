import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/components/atoms/table';
import { Button } from '@shared/components/atoms/button';
import { Badge } from '@shared/components/atoms/badge';
import { Checkbox } from '@shared/components/atoms/checkbox';
import { AlertTriangle, FileText, ClipboardList, FlaskConical, History, Upload, Monitor, Syringe, Scissors, Pill, Utensils, Camera, Activity, Zap, Heart, Brain, Radio, ScanLine, UserPlus, Waves, PillBottle, Radiation, X } from 'lucide-react';
import { PatientScheduleSummary } from './PatientScheduleSummary';
import { VisualIndicator } from './VisualIndicator';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/components/atoms/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from '@shared/components/atoms/dialog';
import { ScrollArea } from '@shared/components/atoms/scroll-area';
import { toast } from 'sonner';
import type { Order, OrderStatus, ProcedureType } from '../../types';
import { INVASIVE_ORDER_TYPES } from '../../types';

interface OrderTableProps {
  orders: Order[];
  allOrders: Order[]; // 全オーダー（フィルタ前）を患者スケジュール表示用に渡す
  onAccept: (orderId: string) => void;
  onImplement: (orderId: string) => void;
  onAllergyClick: (order: Order) => void;
  onResultInput: (orderId: string) => void;
  onTestRequest: (orderId: string) => void; // 検査依頼（受付→結果待ち）
  onNutritionRecord: (orderId: string) => void; // 栄養指導記録入力
  onPharmacistGuidance: (orderId: string) => void; // 薬剤師管理指導記録入力
  onMedicationHistory: (orderId: string) => void; // 薬歴表示
  onEndoscopyReport: (orderId: string) => void; // 内視鏡レポート作成
  onPacsReference: (orderId: string) => void; // PACS参照
  selectedOrders: string[];
  onToggleOrder: (orderId: string) => void;
  onToggleAll: (checked: boolean) => void;
}

export function OrderTable({ orders, allOrders, onAccept, onImplement, onAllergyClick, onResultInput, onTestRequest, onNutritionRecord, onPharmacistGuidance, onMedicationHistory, onEndoscopyReport, onPacsReference, selectedOrders, onToggleOrder, onToggleAll }: OrderTableProps) {
  // 患者IDごとにオーダーをグループ化
  const patientOrdersMap = useMemo(() => {
    const map = new Map<string, Order[]>();
    allOrders.forEach(order => {
      const existing = map.get(order.patientId) || [];
      map.set(order.patientId, [...existing, order]);
    });
    return map;
  }, [allOrders]);

  const getStatusVariant = (status: OrderStatus): 'default' | 'secondary' | 'destructive' | 'outline'| 'start'| 'collection'   => {
    switch (status) {
      case '指示受済':
        return 'destructive';
      case '受付済':
        return 'secondary';
      case '開始済':
        return 'start';
      case '実施済':
        return 'default';
      case '採取済':
        return 'collection';  
      case '出庫済':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getOrderTypeColor = (orderType: string): string => {
    const colors: Record<string, string> = {
      '栄養指導': 'bg-green-100 text-green-800 border-green-300',
      '検体検査': 'bg-blue-100 text-blue-800 border-blue-300',
      '生理検査': 'bg-cyan-100 text-cyan-800 border-cyan-300',
      '内視鏡検査': 'bg-teal-100 text-teal-800 border-teal-300',
      '画像検査': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      '処置': 'bg-amber-100 text-amber-800 border-amber-300',
      '注射': 'bg-rose-100 text-rose-800 border-rose-300',
      '服薬指導': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
      'リハビリ': 'bg-orange-100 text-orange-800 border-orange-300',
      '病理検査': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      '細菌検査': 'bg-lime-100 text-lime-800 border-lime-300',
      '汎用': 'bg-slate-100 text-slate-800 border-slate-300'
    };
    return colors[orderType] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const isInvasiveOrder = (orderType: Order['orderType']) => {
    return INVASIVE_ORDER_TYPES.includes(orderType);
  };

  // オーダー種から施術内容タイプへのマッピング
  const getProcedureTypes = (patientOrders: Order[]): Map<ProcedureType, { completed: boolean; orders: Order[] }> => {
    const procedureMap = new Map<ProcedureType, { completed: boolean; orders: Order[] }>();
    
    const addToProcedure = (type: ProcedureType, order: Order) => {
      const existing = procedureMap.get(type) || { completed: false, orders: [] };
      const isCompleted = order.status === '実施済' || order.status === '出庫済';
      existing.orders.push(order);
      if (isCompleted) {
        existing.completed = true;
      }
      procedureMap.set(type, existing);
    };

    patientOrders.forEach(order => {
      switch (order.orderType) {
        case '検体検査':
          addToProcedure('検体', order);
          break;
        case '細菌検査':
          addToProcedure('細菌', order);
          break;
        case '病理検査':
          addToProcedure('病理', order);
          break;
        case '生理検査':
          addToProcedure('生理', order);
          break;
        case '内視鏡検査':
          addToProcedure('内視', order);
          break;
        case '画像検査':
        case '放射線':
          addToProcedure('画像', order);
          break;
        case 'リハビリ':
          addToProcedure('リハ', order);
          break;
        case '透析':
          addToProcedure('透析', order);
          break;
        case '処方':
        case '薬剤':
          addToProcedure('処方', order);
          break;
        case '注射':
          addToProcedure('注射', order);
          break;
        case '処置':
          addToProcedure('処置', order);
          break;
        case '服薬指導':
        case '栄養指導':
          addToProcedure('指導', order);
          break;
      }
    });

    return procedureMap;
  };

  // 部門固有ボタンの表示
  const renderDepartmentButtons = (order: Order) => {
    const buttons = [];

    if (order.orderType === '栄養指導') {
      buttons.push(
        <Button 
          key="nutrition-record" 
          variant="default" 
          size="sm" 
          className="gap-1"
          onClick={() => onNutritionRecord(order.id)}
        >
          <FileText className="h-3 w-3" />
          記録
        </Button>
      );
    }

    // 服薬指導オーダーの場合は薬剤師管理指導記録ボタンを追加
    if (order.orderType === '服薬指導') {
      buttons.push(
        <Button
          key="pharmacist-guidance"
          variant="default"
          size="sm"
          onClick={() => onPharmacistGuidance(order.id)}
          className="gap-1"
        >
          <ClipboardList className="h-3 w-3" />
          記録
        </Button>
      );
    }

    return buttons;
  };

  // 画像検査の検査種別を判定してバッジを生成
  const renderImageExamBadges = (content: string) => {
    const badges = [];
    let icon = <ScanLine className="h-8 w-8 text-indigo-600" />;
    
    if (content.includes('X線') || content.includes('レントゲン') || content.includes('単純撮影')) {
      badges.push(
        <Badge key="xray" variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300 text-xs px-2 py-0.5">
          一般
        </Badge>
      );
      icon = <Radiation className="h-8 w-8 text-indigo-600" />;
    }
    if (content.includes('CT') || content.includes('コンピュータ断層撮影')) {
      badges.push(
        <Badge key="ct" variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 text-xs px-2 py-0.5">
          CT
        </Badge>
      );
      icon = <Brain className="h-8 w-8 text-purple-600" />;
    }
    if (content.includes('MRI') || content.includes('磁気共鳴')) {
      badges.push(
        <Badge key="mri" variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs px-2 py-0.5">
          MRI
        </Badge>
      );
      icon = <Brain className="h-8 w-8 text-blue-600" />;
    }
    if (content.includes('マンモ') || content.includes('乳房撮影')) {
      badges.push(
        <Badge key="mammo" variant="outline" className="bg-pink-50 text-pink-700 border-pink-300 text-xs px-2 py-0.5">
          マンモ
        </Badge>
      );
      icon = <ScanLine className="h-8 w-8 text-pink-600" />;
    }
    if (content.includes('血管造影') || content.includes('アンギオ')) {
      badges.push(
        <Badge key="angio" variant="outline" className="bg-red-50 text-red-700 border-red-300 text-xs px-2 py-0.5">
          血管造影
        </Badge>
      );
      icon = <Heart className="h-8 w-8 text-red-600" />;
    }
    
    if (badges.length === 0) {
      badges.push(
        <Badge key="other" variant="outline" className="bg-gray-50 text-gray-700 border-gray-300 text-xs px-2 py-0.5">
          画像
        </Badge>
      );
    }

    return (
      <div className="flex flex-col items-center gap-1">
        {icon}
        <div className="flex flex-wrap gap-1 justify-center">
          {badges}
        </div>
      </div>
    );
  };

  // 生理検査のアイコンを判定して表示
  const renderPhysiologyExamIcon = (content: string) => {
    if (content.includes('心電図') || content.includes('ECG') || content.includes('EKG')) {
      return (
        <div className="flex flex-col items-center gap-1">
          <Activity className="h-8 w-8 text-cyan-600" />
          <span className="text-xs text-gray-600">心電図</span>
        </div>
      );
    }
    if (content.includes('エコー') || content.includes('超音波') || content.includes('Echo')) {
      return (
        <div className="flex flex-col items-center gap-1">
          <Waves className="h-8 w-8 text-cyan-600" />
          <span className="text-xs text-gray-600">エコー</span>
        </div>
      );
    }
    if (content.includes('脳波') || content.includes('EEG')) {
      return (
        <div className="flex flex-col items-center gap-1">
          <Brain className="h-8 w-8 text-cyan-600" />
          <span className="text-xs text-gray-600">脳波</span>
        </div>
      );
    }
    if (content.includes('肺機能') || content.includes('スパイロ')) {
      return (
        <div className="flex flex-col items-center gap-1">
          <Zap className="h-8 w-8 text-cyan-600" />
          <span className="text-xs text-gray-600">肺機能</span>
        </div>
      );
    }
    if (content.includes('ホルター') || content.includes('24時間心電図')) {
      return (
        <div className="flex flex-col items-center gap-1">
          <Heart className="h-8 w-8 text-cyan-600" />
          <span className="text-xs text-gray-600">ホルター</span>
        </div>
      );
    }
    
    // デフォルト
    return (
      <div className="flex flex-col items-center gap-1">
        <Activity className="h-8 w-8 text-cyan-600" />
        <span className="text-xs text-gray-600">生理検査</span>
      </div>
    );
  };

  // オーダー種別のアイコンを表示
  const renderOrderTypeIcon = (orderType: string) => {
    switch (orderType) {
      case '注射':
        return (
          <div className="flex flex-col items-center gap-1">
            <Syringe className="h-8 w-8 text-rose-600" />
            <span className="text-xs text-gray-600">注射</span>
          </div>
        );
      case '処置':
        return (
          <div className="flex flex-col items-center gap-1">
            <Scissors className="h-8 w-8 text-amber-600" />
            <span className="text-xs text-gray-600">処置</span>
          </div>
        );
      case '服薬指導':
        return (
          <div className="flex flex-col items-center gap-1">
            <PillBottle className="h-8 w-8 text-fuchsia-600" />
            <span className="text-xs text-gray-600">服薬指導</span>
          </div>
        );
      case '栄養指導':
        return (
          <div className="flex flex-col items-center gap-1">
            <Utensils className="h-8 w-8 text-green-600" />
            <span className="text-xs text-gray-600">栄養指導</span>
          </div>
        );
      case '内視鏡検査':
        return (
          <div className="flex flex-col items-center gap-1">
            <Camera className="h-8 w-8 text-teal-600" />
            <span className="text-xs text-gray-600">内視鏡</span>
          </div>
        );
      case 'リハビリ':
        return (
          <div className="flex flex-col items-center gap-1">
            <UserPlus className="h-8 w-8 text-orange-600" />
            <span className="text-xs text-gray-600">リハビリ</span>
          </div>
        );
      case '汎用':
        return (
          <div className="flex flex-col items-center gap-1">
            <FileText className="h-8 w-8 text-slate-600" />
            <span className="text-xs text-gray-600">汎用</span>
          </div>
        );
      default:
        return null;
    }
  };

  const allSelected = orders.length > 0 && orders.every(order => selectedOrders.includes(order.id));
  const someSelected = orders.some(order => selectedOrders.includes(order.id)) && !allSelected;

  // 施術内容の順序を定義
  const procedureOrder: ProcedureType[] = ['診察', '処方', '注射', '処置', '検体', '細菌', '病理', '生理', '内視', '画像', 'リハ', '透析', '手術', '指導', '入院'];

  return (
    <div className="rounded-md border bg-white">
      <div className="relative overflow-auto max-h-[calc(100vh-300px)]">
        <table className="w-full caption-bottom text-sm">
        <thead className="sticky top-0 z-10 bg-white border-b">
          <tr className="border-b">
            <th className="w-[40px] h-10 px-2 text-left align-middle font-medium bg-white">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onToggleAll}
                aria-label="全て選択"
                className={someSelected ? 'data-[state=checked]:bg-gray-400' : ''}
              />
            </th>
            <th className="w-[100px] text-sm h-10 px-2 text-left align-middle font-medium bg-white">ステータス</th>
            <th className="w-[180px] text-sm h-10 px-2 text-left align-middle font-medium bg-white">基本情報</th>
            <th className="w-[140px] text-sm h-10 px-2 text-left align-middle font-medium bg-white">オーダー日時</th>
            <th className="w-[100px] text-sm h-10 px-2 text-left align-middle font-medium bg-white">オーダー種</th>
            <th className="w-[120px] text-sm h-10 px-2 text-left align-middle font-medium bg-white">分類</th>
            <th className="w-[90px] text-sm h-10 px-2 text-left align-middle font-medium bg-white">病棟/部屋</th>
            <th className="w-[60px] text-sm h-10 px-2 text-left align-middle font-medium bg-white">入/外</th>
            <th className="w-[180px] text-sm h-10 px-2 text-left align-middle font-medium bg-white">オーダー内容</th>
            <th className="w-[200px] text-sm h-10 px-2 text-left align-middle font-medium bg-white">当日のオーダー概要</th>
            <th className="w-[180px] text-sm h-10 px-2 text-left align-middle font-medium bg-white">操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                該当するオーダーがありません
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              const patientOrders = patientOrdersMap.get(order.patientId) || [order];
              const hasInvasiveOrders = patientOrders.some(o => isInvasiveOrder(o.orderType));
              const procedureMap = getProcedureTypes(patientOrders);
              const isSelected = selectedOrders.includes(order.id);
              const isEmergency = order.urgency === '緊急';
              const isUrgent = order.urgency === '至急';
              
              return (
              <TableRow key={order.id} className={isEmergency ? 'bg-red-50/80' : isUrgent ? 'bg-yellow-50/80' : (hasInvasiveOrders ? 'bg-orange-50/30' : '')}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleOrder(order.id)}
                    aria-label={`オーダー ${order.id} を選択`}
                  />
                </TableCell>
                
                {/* ステータス（クリック可能） */}
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="h-auto p-0 hover:bg-transparent w-full">
                        <div className="space-y-0.5 text-left">
                          {isEmergency && (
                            <div>
                              <Badge variant="destructive" className="text-sm px-3 py-1 bg-red-600 hover:bg-red-600 text-white font-bold border-2 border-red-800">
                                緊急
                              </Badge>
                            </div>
                          )}
                          {isUrgent && (
                            <div>
                              <Badge variant="destructive" className="text-sm px-3 py-1 bg-yellow-600 hover:bg-yellow-600 text-white font-bold border-2 border-yellow-800">
                                至急
                              </Badge>
                            </div>
                          )}
                          <div>
                            <Badge variant={getStatusVariant(order.status)} className="cursor-pointer hover:opacity-80">
                              {order.status}
                            </Badge>
                          </div>
                          {order.statusHistory && order.statusHistory.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {order.statusHistory[order.statusHistory.length - 1].timestamp}
                            </div>
                          )}
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>ステータス履歴 - {order.patientName}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        {order.statusHistory && order.statusHistory.length > 0 ? (
                          order.statusHistory.map((history, index) => (
                            <div key={index} className="flex items-start gap-3 border-l-2 border-blue-500 pl-3 pb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant={getStatusVariant(history.status)}>
                                    {history.status}
                                  </Badge>
                                  <span className="text-sm text-gray-600">{history.timestamp}</span>
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  更新者: {history.updatedBy}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 py-4">
                            ステータス履歴がありません
                          </div>
                        )}
                      </div>
                      <DialogClose className="absolute top-4 right-4">
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                
                {/* 基本情報（統合列） */}
                <TableCell>
                  <div className="space-y-0.5">
                    <div>
                      <button className="text-blue-600 hover:underline text-base">
                        {order.patientId}
                      </button>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{order.patientKana}</div>
                      <div className="text-base font-medium">{order.patientName}</div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span>{order.gender}</span>
                      <span className="text-gray-400">|</span>
                      <span>{order.birthDate}</span>
                      <span className="text-gray-600">({order.age}歳)</span>
                    </div>
                    {order.hasContraindications && order.contraindications && order.contraindications.length > 0 && (
                      <div className="mt-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto px-2 py-1 text-sm text-red-600 hover:text-red-700 gap-1"
                            >
                              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                              <div className="text-left">
                                禁忌/特記事項あり
                              </div>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>禁忌/特記事項詳細</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="max-h-[60vh]">
                              <div className="space-y-4 p-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <div className="text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-medium">患者:</span>
                                      <span>{order.patientName}（{order.patientId}）</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">生年月日:</span>
                                      <span>{order.birthDate} ({order.age}歳 {order.gender})</span>
                                    </div>
                                  </div>
                                </div>
                                {order.contraindications.map((contraindication, index) => (
                                  <div
                                    key={contraindication.id}
                                    className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded-r-lg"
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge
                                        variant={contraindication.type === '禁忌' ? 'destructive' : 'outline'}
                                        className={contraindication.type === '特記事項' ? 'bg-amber-50 text-amber-700 border-amber-300' : ''}
                                      >
                                        {contraindication.type}
                                      </Badge>
                                      <span className="font-medium text-base">{contraindication.content}</span>
                                    </div>
                                    <div className="text-sm text-gray-700 mb-2">
                                      <span className="font-medium">理由:</span> {contraindication.reason}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">
                                      <span>登録日: {contraindication.registeredDate}</span>
                                      <span className="mx-2">|</span>
                                      <span>登録元: {contraindication.source}</span>
                                    </div>
                                    {contraindication.type === '禁忌' && (
                                      <div className="flex justify-end">
                                        <Button
                                          size="sm"
                                          variant="default"
                                          className="h-7 text-xs bg-black text-white hover:bg-gray-800"
                                          onClick={() => {
                                            // 確認処理
                                            alert(`${contraindication.content}を確認しました`);
                                          }}
                                        >
                                          確認
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                                <div className="flex justify-end pt-2">
                                  <DialogClose asChild>
                                    <Button variant="outline">
                                      閉じる
                                    </Button>
                                  </DialogClose>
                                </div>
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                    {order.hasAllergies && order.allergies.length > 0 && (() => {
                      // アレルギーをカテゴリ別に集計
                      const categoryCount = order.allergies.reduce((acc, allergy) => {
                        acc[allergy.category] = (acc[allergy.category] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);

                      // カテゴリ表示用配列を生成
                      const categoryItems = Object.entries(categoryCount)
                        .map(([category, count]) => ({
                          category,
                          text: `${category}アレルギー`
                        }));

                      return (
                        <div className="mt-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto px-2 py-1 text-sm text-orange-600 hover:text-orange-700"
                              >
                                <div className="flex items-start gap-1">
                                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                  <div className="grid grid-cols-1 gap-y-0.5">
                                    {categoryItems.map((item, index) => (
                                      <div key={index} className="whitespace-nowrap">
                                        {item.text}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px]" align="start">
                              <div className="space-y-2">
                                <h4 className="font-medium text-base">アレルギー情報</h4>
                                {order.allergies.map((allergy) => (
                                  <div key={allergy.id} className="border-l-2 border-orange-500 pl-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm">{allergy.component}</span>
                                      {allergy.severity === '重度' && (
                                        <Badge variant="destructive" className="text-xs px-1 py-0">
                                          重度
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-600">{allergy.symptoms}</div>
                                  </div>
                                ))}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onAllergyClick(order)}
                                  className="w-full mt-2"
                                >
                                  詳細を表示
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      );
                    })()}
                    {/* 薬歴ボタン - 服薬指導、注射、処方のみ */}
                    {['服薬指導', '注射', '処方'].includes(order.orderType) && (
                      <div className="mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-sm text-blue-600 hover:text-blue-700 gap-1"
                          onClick={() => onMedicationHistory(order.id)}
                        >
                          <History className="h-4 w-4" />
                          薬歴
                        </Button>
                      </div>
                    )}
                    {/* PACS参照ボタン - 画像検査のみ */}
                    {order.orderType === '画像検査' && (
                      <div className="mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-sm text-blue-600 hover:text-blue-700 gap-1"
                          onClick={() => onPacsReference(order.id)}
                        >
                          <Monitor className="h-4 w-4" />
                          PACS参照
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>
                
                {/* オーダー日時（統合列） */}
                <TableCell>
                  <div className="space-y-0.5">
                    <div className="text-sm text-gray-700">
                      {order.receivedAt}
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.department}
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.attendingDoctor || '-'}
                    </div>
                  </div>
                </TableCell>
                
                {/* オーダー種 */}
                <TableCell>
                  <Badge className={`${getOrderTypeColor(order.orderType)} text-sm px-2`} variant="outline">
                    {order.orderType}
                  </Badge>
                </TableCell>
                
                {/* 分類 */}
                <TableCell>
                  <div className="flex justify-center py-1">
                    {order.orderType === '画像検査' && (order.content.includes('エコー') || order.content.includes('超音波') || order.content.includes('Echo')) ? (
                      renderPhysiologyExamIcon(order.content)
                    ) : order.orderType === '画像検査' ? (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {renderImageExamBadges(order.content)}
                      </div>
                    ) : order.orderType === '生理検査' ? (
                      renderPhysiologyExamIcon(order.content)
                    ) : ['検体検査', '病理検査', '細菌検査'].includes(order.orderType) && order.visualIndicator ? (
                      Array.isArray(order.visualIndicator) ? (
                        <div className="grid grid-cols-2 gap-1 max-w-[100px]">
                          {order.visualIndicator.map((indicator, index) => (
                            <VisualIndicator key={index} indicator={indicator} size="small" />
                          ))}
                        </div>
                      ) : (
                        <VisualIndicator indicator={order.visualIndicator} size="normal" />
                      )
                    ) : (
                      renderOrderTypeIcon(order.orderType)
                    )}
                  </div>
                </TableCell>
                
                {/* 病棟/部屋 */}
                <TableCell>
                  <div className="text-sm">
                    <div>{order.ward || '-'}</div>
                    {order.roomNumber && (
                      <div className="text-gray-600">{order.roomNumber}</div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant="outline" className="text-sm">{order.location}</Badge>
                </TableCell>
                
                {/* オーダー内容 */}
                <TableCell>
                  <div className="text-base text-gray-700">
                    {order.content}
                  </div>
                  {order.implementationNotes && (
                    <div className="text-sm text-gray-500 mt-1">
                      {order.implementationNotes}
                    </div>
                  )}
                </TableCell>
                
                {/* 当日の施術内容 */}
                <TableCell>
                  <div className="space-y-1">
                    {/* 同意書情報 */}
                    {order.consentRequired && (
                      <div className="text-xs">
                        {order.consentObtained ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 hover:bg-transparent text-green-700 text-xs"
                            onClick={() => {
                              toast('文書管理画面を表示', {
                                position: 'top-right',
                              });
                            }}
                          >
                            同意書：〇（{order.orderType}）
                          </Button>
                        ) : (
                          <span className="text-red-700">
                            同意書：×（{order.orderType}）
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* 施術内容ボタン */}
                    <div className="flex flex-wrap gap-1">
                      {procedureOrder.map((procType) => {
                        const procData = procedureMap.get(procType);
                        if (!procData) return null;
                        
                        const icon = procData.completed ? '●' : '○';
                        const color = procData.completed ? 'text-green-600' : 'text-gray-400';
                        
                        return (
                          <Dialog key={procType}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-5 px-1 text-xs hover:bg-gray-100 ${color}`}
                                title={`${procType}の詳細を表示`}
                              >
                                {procType}:{icon}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl" aria-describedby={undefined}>
                              <DialogHeader>
                                <DialogTitle>{procType}の実施内容</DialogTitle>
                              </DialogHeader>
                              <ScrollArea className="max-h-[60vh]">
                                <div className="space-y-3">
                                  {procData.orders.map((procOrder) => (
                                    <div key={procOrder.id} className="border rounded-lg p-3">
                                      <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <Badge className={getOrderTypeColor(procOrder.orderType)} variant="outline">
                                              {procOrder.orderType}
                                            </Badge>
                                            <Badge variant={getStatusVariant(procOrder.status)}>
                                              {procOrder.status}
                                            </Badge>
                                          </div>
                                          <div className="text-sm mt-2">{procOrder.content}</div>
                                        </div>
                                      </div>
                                      {procOrder.implementedAt && (
                                        <div className="text-xs text-gray-500 mt-2">
                                          実施: {procOrder.implementedAt} by {procOrder.implementedBy}
                                        </div>
                                      )}
                                      {procOrder.implementationNotes && (
                                        <div className="text-xs text-gray-600 mt-1">
                                          備考: {procOrder.implementationNotes}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                        );
                      })}
                      {hasInvasiveOrders && (
                        <div className="flex items-center gap-1 text-orange-600 text-xs ml-2">
                          <AlertTriangle className="h-3 w-3" />
                          侵襲処置
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                
                {/* 操作 */}
                <TableCell>
                  <div className="grid grid-cols-1 gap-1">
                    {/* 受付ボタン - 検査系・処置・放射線・透析・汎用オーダーのみ */}
                    {order.status === '指示受済' && 
                     ['検体検査', '生理検査', '内視鏡検査', '画像検査', '処置', '放射線', '病理検査', '細菌検査', '透析', '汎用'].includes(order.orderType) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAccept(order.id)}
                      >
                        受付
                      </Button>
                    )}

                    {/* 検査依頼ボタン - 病理・細菌のみ、受付後 */}
                    {order.status === '受付済' && ['病理検査', '細菌検査'].includes(order.orderType) && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onTestRequest(order.id)}
                        className="gap-1"
                      >
                        <FlaskConical className="h-3 w-3" />
                        検査依頼
                      </Button>
                    )}

                    {/* 開始ボタン - 受付済の場合（病理検査・細菌検査以外） */}
                    {order.status === '受付済' && !['病理検査', '細菌検査'].includes(order.orderType) && (
                      <Button
                        size="sm"
                        onClick={() => onImplement(order.id)}
                      >
                        開始
                      </Button>
                    )}

                    {/* 採取ボタン - 検体検査・細菌検査で開始済の場合 */}
                    {order.status === '開始済' && ['検体検査', '細菌検査'].includes(order.orderType) && (
                      <Button
                        size="sm"
                        onClick={() => onImplement(order.id)}
                      >
                        採取
                      </Button>
                    )}

                    {/* 実施ボタン - 開始済（検体検査・細菌検査以外）または採取済の場合 */}
                    {((order.status === '開始済' && !['検体検査', '細菌検査'].includes(order.orderType)) ||
                      order.status === '採取済' ||
                      (order.status === '出庫済' && order.orderType === '注射')) && (
                      <Button
                        size="sm"
                        onClick={() => onImplement(order.id)}
                      >
                        実施
                      </Button>
                    )}
                    
                    {/* 出庫ボタン - 注射・薬剤のみ */}
                    {order.status === '指示受済' && ['注射', '薬剤'].includes(order.orderType) && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onImplement(order.id)}
                      >
                        出庫
                      </Button>
                    )}

                    {/* 実施ボタン - 処方・服薬指導 */}
                    {order.status === '指示受済' && ['処方', '服薬指導'].includes(order.orderType) && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onImplement(order.id)}
                      >
                        実施
                      </Button>
                    )}

                    {/* 部門固有ボタン */}
                    {renderDepartmentButtons(order)}

                    {/* レポート作成ボタン - 内視鏡検査のみ */}
                    {order.orderType === '内視鏡検査' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEndoscopyReport(order.id)}
                        className="gap-1"
                      >
                        <FileText className="h-3 w-3" />
                        レポート
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
            })
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}