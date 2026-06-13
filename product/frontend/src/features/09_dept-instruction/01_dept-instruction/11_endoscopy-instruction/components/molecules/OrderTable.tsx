import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/components/atoms/table';
import { Badge } from '@shared/components/atoms/badge';
import { Button } from '@shared/components/atoms/button';
import { Checkbox } from '@shared/components/atoms/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/components/atoms/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/components/atoms/popover';
import { ScrollArea } from '@shared/components/atoms/scroll-area';
import { Pill, FileText, ExternalLink, AlertTriangle, History, Monitor, FlaskConical, Upload } from 'lucide-react';
import type { Order, OrderStatus, ProcedureType } from '../../types/index';
import { INVASIVE_ORDER_TYPES } from '../../types/index';
import { VisualIndicator } from './VisualIndicator';
import { EndoscopyIcon, getEndoscopyType } from './EndoscopyIcon';
import { Image } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
  allOrders: Order[]; // 全オーダー（フィルタ前）を患者スケジュール表示用に渡す
  onAccept: (orderId: string) => void;
  onStart: (orderId: string) => void;
  onCollect: (orderId: string) => void;
  onImplement: (orderId: string) => void;
  onReport: (orderId: string) => void;
  onAllergyClick: (order: Order) => void;
  onResultInput: (orderId: string) => void;
  onTestRequest: (orderId: string) => void; // 検査依頼（受付→結果待ち）
  onNutritionRecord: (orderId: string) => void; // 栄養指導記録入力
  onPharmacistGuidance: (orderId: string) => void; // 薬剤師管理指導記録入力
  onMedicationHistory: (orderId: string) => void; // 薬歴表示
  onMedicationUsage: (orderId: string) => void; // 使用薬剤入力
  onEndoscopyReport: (orderId: string) => void; // 内視鏡レポート作成
  onPacsReference: (orderId: string) => void; // PACS参照
  selectedOrders: string[];
  onToggleOrder: (orderId: string) => void;
  onToggleAll: (checked: boolean) => void;
}

export function OrderTable({ orders, allOrders, onAccept, onStart, onCollect, onImplement, onReport, onAllergyClick, onResultInput, onTestRequest, onNutritionRecord, onPharmacistGuidance, onMedicationHistory, onMedicationUsage, onEndoscopyReport, onPacsReference, selectedOrders, onToggleOrder, onToggleAll }: OrderTableProps) {
  // 患者IDごとにオーダーをグループ化
  const patientOrdersMap = useMemo(() => {
    const map = new Map<string, Order[]>();
    allOrders.forEach(order => {
      const existing = map.get(order.patientId) || [];
      map.set(order.patientId, [...existing, order]);
    });
    return map;
  }, [allOrders]);

  const getStatusVariant = (status: OrderStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case '指示受済':
        return 'destructive';
      case '受付済':
        return 'secondary';
      case '開始済':
        return 'outline';
      case '採取済':
        return 'outline';
      case '実施済':
        return 'default';
      case 'レポート作成済':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getOrderTypeColor = (orderType: string): string => {
    const colors: Record<string, string> = {
      '栄養': 'bg-green-100 text-green-800 border-green-300',
      '検体検査': 'bg-blue-100 text-blue-800 border-blue-300',
      '生理検査': 'bg-cyan-100 text-cyan-800 border-cyan-300',
      '内視鏡検査': 'bg-teal-100 text-teal-800 border-teal-300',
      '画像検査': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      '処置オーダー': 'bg-amber-100 text-amber-800 border-amber-300',
      '注射オーダー': 'bg-rose-100 text-rose-800 border-rose-300',
      '薬剤': 'bg-purple-100 text-purple-800 border-purple-300',
      '処方': 'bg-violet-100 text-violet-800 border-violet-300',
      '服薬指導': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
      'リハビリ': 'bg-orange-100 text-orange-800 border-orange-300',
      '放射線': 'bg-red-100 text-red-800 border-red-300',
      '看護指示': 'bg-pink-100 text-pink-800 border-pink-300',
      '病理': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      '細菌': 'bg-lime-100 text-lime-800 border-lime-300',
      '透析': 'bg-sky-100 text-sky-800 border-sky-300',
      '汎用オーダー': 'bg-slate-100 text-slate-800 border-slate-300'
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
      const isCompleted = order.status === '実施済み' || order.status === '出庫';
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
        case '細菌':
          addToProcedure('細菌', order);
          break;
        case '病理':
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
        case '注射オーダー':
          addToProcedure('注射', order);
          break;
        case '処置オーダー':
          addToProcedure('処置', order);
          break;
        case '服薬指導':
        case '栄養':
          addToProcedure('指導', order);
          break;
      }
    });

    return procedureMap;
  };

  // 部門固有ボタンの表示
  const renderDepartmentButtons = (order: Order) => {
    const buttons = [];

    if (order.orderType === '栄養') {
      buttons.push(
        <Button 
          key="nutrition-record" 
          variant="default" 
          size="sm" 
          className="gap-1"
          onClick={() => onNutritionRecord(order.id)}
        >
          <FileText className="h-3 w-3" />
          栄養指導記録
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
          <Pill className="h-3 w-3" />
          管理指導記録
        </Button>
      );
    }

    return buttons;
  };

  const allSelected = orders.length > 0 && orders.every(order => selectedOrders.includes(order.id));
  const someSelected = orders.some(order => selectedOrders.includes(order.id)) && !allSelected;

  // 施術内容の順序を定義
  const procedureOrder: ProcedureType[] = ['診察', '処方', '注射', '処置', '検体', '細菌', '病理', '生理', '内視', '画像', 'リハ', '透析', '手術', '指導', '入院'];

  return (
    <div className="rounded-md border bg-white">
      <div className="overflow-auto max-h-[calc(100vh-300px)]">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onToggleAll}
                aria-label="全て選択"
                className={someSelected ? 'data-[state=checked]:bg-gray-400' : ''}
              />
            </TableHead>
            <TableHead className="w-[100px]">ステータス</TableHead>
            <TableHead className="w-[180px]">基本情報</TableHead>
            <TableHead className="w-[140px]">オーダー日時</TableHead>
            <TableHead className="w-[100px]">オーダー種</TableHead>
            <TableHead className="w-[80px]">分類</TableHead>
            <TableHead className="w-[90px]">病棟/部屋</TableHead>
            <TableHead className="w-[60px]">入/外</TableHead>
            <TableHead className="w-[180px]">オーダー内容</TableHead>
            <TableHead className="w-[200px]">当日のオーダー概要</TableHead>
            <TableHead className="w-[180px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
              
              return (
              <TableRow key={order.id} className={hasInvasiveOrders ? 'bg-orange-50/30' : ''}>
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
                                  担当: {history.updatedBy}
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
                      <div className="text-base font-medium">{order.patientName}</div>
                      <div className="text-sm text-gray-500">{order.patientKana}</div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span>{order.gender}</span>
                      <span className="text-gray-400">|</span>
                      <span>{order.birthDate}</span>
                      <span className="text-gray-600">({order.age}歳)</span>
                    </div>
                    {order.hasAllergies && order.allergies.length > 0 && (
                      <div className="mt-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 px-1 text-xs text-orange-600 hover:text-orange-700 gap-1"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              アレルギー {order.allergies.length}件
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px]" align="start">
                            <div className="space-y-2">
                              <h4 className="font-medium">アレルギー情報</h4>
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
                                  <div className="text-xs text-gray-600">{allergy.symptoms}</div>
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
                    )}
                    {/* 薬歴ボタン - 服薬指導、注射、処方のみ */}
                    {['服薬指導', '注射オーダー', '処方'].includes(order.orderType) && (
                      <div className="mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-1 text-xs text-blue-600 hover:text-blue-700 gap-1"
                          onClick={() => onMedicationHistory(order.id)}
                        >
                          <History className="h-3 w-3" />
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
                          className="h-5 px-1 text-xs text-blue-600 hover:text-blue-700 gap-1"
                          onClick={() => onPacsReference(order.id)}
                        >
                          <Monitor className="h-3 w-3" />
                          PACS参照
                        </Button>
                      </div>
                    )}
                    {/* 画像・メニューボタン */}
                    <div className="mt-1 flex gap-1">
                      <button className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                        <Image className="h-3 w-3" />
                        画像
                      </button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-blue-600 hover:border-b hover:border-blue-600 text-sm flex items-center">
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px]" align="start">
                          <div className="space-y-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-sm"
                              onClick={() => {
                                // 内視鏡ビューワーを開く処理
                                console.log('内視鏡ビューワーを開く');
                              }}
                            >
                              内視鏡ビューワー
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-sm"
                              onClick={() => {
                                // 両方を開く処理
                                console.log('両方を開く');
                              }}
                            >
                              両方
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
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
                  <Badge className={`${getOrderTypeColor(order.orderType)} text-sm px-2 py-1`} variant="outline">
                    {order.orderType}
                  </Badge>
                </TableCell>
                
                {/* 分類 */}
                <TableCell className="text-center">
                  {order.orderType === '内視鏡検査' && order.endoscopyDetails ? (
                    <div className="flex flex-col items-center gap-1">
                      <EndoscopyIcon 
                        type={getEndoscopyType(order.endoscopyDetails) || 'stomach'} 
                        className="w-12 h-12 text-teal-700"
                      />
                      <span className="text-sm text-gray-600">
                        内視鏡
                      </span>
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-sm">{order.category}</Badge>
                  )}
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
                  <Badge variant="outline" className="text-sm px-2">{order.location}</Badge>
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
                          <DialogContent className="max-w-2xl">
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
                </TableCell>
                
                {/* 操作 */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {/* 受付ボタン - 指示受済ステータス時 */}
                    {order.status === '指示受済' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAccept(order.id)}
                      >
                        受付
                      </Button>
                    )}

                    {/* 開始ボタン - 受付済ステータス時 */}
                    {order.status === '受付済' && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onStart(order.id)}
                      >
                        開始
                      </Button>
                    )}

                    {/* 採取ボタン - 開始済ステータス時かつ薬剤記録未 */}
                    {order.status === '開始済' && !order.medicationRecorded && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onCollect(order.id)}
                      >
                        採取
                      </Button>
                    )}

                    {/* 薬剤記録ボタン - 開始済ステータス時かつ薬剤記録未（採取と同時表示） */}
                    {order.status === '開始済' && !order.medicationRecorded && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onMedicationUsage(order.id)}
                        className="gap-1"
                      >
                        <Pill className="h-3 w-3" />
                        薬剤記録
                      </Button>
                    )}

                    {/* 部門固有ボタン */}
                    {renderDepartmentButtons(order)}

                    {/* 実施ボタン - 開始済または採取済、かつ薬剤記録済の場合 */}
                    {(order.status === '開始済' || order.status === '採取済') && order.medicationRecorded && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onImplement(order.id)}
                      >
                        実施
                      </Button>
                    )}

                    {/* 結果入力/アップロードボタン - 検体検査・病理・細菌、実施済の場合のみ */}
                    {['検体検査', '病理', '細菌'].includes(order.orderType) && order.status === '実施済' && (
                      <Button
                        size="sm"
                        variant={order.labResults ? "outline" : "default"}
                        onClick={() => onResultInput(order.id)}
                        className="gap-1"
                      >
                        {['病理', '細菌'].includes(order.orderType) ? (
                          <>
                            <Upload className="h-3 w-3" />
                            {order.labResults ? '結果再アップロード' : '結果アップロード'}
                          </>
                        ) : (
                          <>
                            <FlaskConical className="h-3 w-3" />
                            {order.labResults ? '結果修正' : '結果入力'}
                          </>
                        )}
                      </Button>
                    )}

                    {/* レポート作成ボタン - 内視鏡検査のみ、実施済ステータス時 */}
                    {order.orderType === '内視鏡検査' && order.status === '実施済' && (
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
        </TableBody>
      </Table>
      </div>
    </div>
  );
}