'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/components/atoms/dialog';
import { useMemo } from 'react';
import { TableCell, TableRow } from '@shared/components/atoms/table';
import { Button } from '@shared/components/atoms/button';
import { Badge } from '@shared/components/atoms/badge';
import { Checkbox } from '@shared/components/atoms/checkbox';
import { AlertTriangle, FileText, FlaskConical, History, Monitor, Pill } from 'lucide-react';
import { VisualIndicator } from './VisualIndicator';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/components/atoms/popover';
import { ScrollArea } from '@shared/components/atoms/scroll-area';
import type { Order, OrderStatus } from '../../types/deptInstruction.viewmodel';
import { INVASIVE_ORDER_TYPES } from '../../types/deptInstruction.viewmodel';
import { i18n } from '@/shared/i18n';

interface OrderTableProps {
  orders: Order[];
  allOrders: Order[]; // 全オーダー（フィルタ前）を患者スケジュール表示用に渡す
  onRowDoubleClick?: (patientId: string) => void;
  onAccept: (orderId: string) => void;
  onStart: (orderId: string) => void; // 開始（3点チェック）
  onImplement: (orderId: string) => void;
  onDispense: (orderId: string) => void; // 出庫（注射・薬剤）
  onCollect: (orderId: string) => void; // 採取（検体検査）
  onReceive: (orderId: string) => void; // 検体受領（検体検査）
  onAllergyClick: (order: Order) => void;
  onResultInput: (orderId: string) => void;
  onTestRequest: (orderId: string) => void; // 検査依頼（受付→結果待ち）
  onNutritionRecord: (orderId: string) => void; // 栄養指導記録入力
  onPharmacistGuidance: (orderId: string) => void; // 薬剤師管理指導記録入力
  onMedicationHistory: (orderId: string) => void; // 薬歴表示
  onEndoscopyReport: (orderId: string) => void; // 内視鏡レポート作成
  onPacsReference: (orderId: string) => void; // PACS参照
  onMaterialRecord: (orderId: string) => void; // 薬剤記録入力
  selectedOrders: string[];
  onToggleOrder: (orderId: string) => void;
  onToggleAll: (checked: boolean) => void;
}

const { deptInstruction: di } = i18n;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function OrderTable({ orders, allOrders, onRowDoubleClick, onAccept, onStart, onImplement, onDispense, onCollect, onReceive, onAllergyClick, onResultInput, onTestRequest, onNutritionRecord, onPharmacistGuidance, onMedicationHistory, onEndoscopyReport, onPacsReference, onMaterialRecord, selectedOrders, onToggleOrder, onToggleAll }: OrderTableProps) {
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
      case 'received':
        return 'destructive';
      case 'accepted':
      case 'started':
      case 'collected':
      case 'specimen_received':
        return 'secondary';
      case 'awaiting_result':
        return 'outline';
      case 'implemented':
      case 'result_entered':
        return 'default';
      default:
        return 'default';
    }
  };

  const getOrderTypeColor = (orderType: string): string => {
    const colors: Record<string, string> = {
      NUTRITION:          'bg-green-100 text-green-800 border-green-300',
      SPECIMEN_TEST:      'bg-blue-100 text-blue-800 border-blue-300',
      PHYSIOLOGICAL_TEST: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      ENDOSCOPY:          'bg-teal-100 text-teal-800 border-teal-300',
      IMAGING:            'bg-indigo-100 text-indigo-800 border-indigo-300',
      PROCEDURE:          'bg-amber-100 text-amber-800 border-amber-300',
      INJECTION:          'bg-rose-100 text-rose-800 border-rose-300',
      MEDICATION:         'bg-purple-100 text-purple-800 border-purple-300',
      PRESCRIPTION:       'bg-violet-100 text-violet-800 border-violet-300',
      MEDICATION_GUIDANCE:'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
      REHABILITATION:     'bg-orange-100 text-orange-800 border-orange-300',
      RADIOLOGY:          'bg-red-100 text-red-800 border-red-300',
      NURSING:            'bg-pink-100 text-pink-800 border-pink-300',
      PATHOLOGY:          'bg-yellow-100 text-yellow-800 border-yellow-300',
      BACTERIA:           'bg-lime-100 text-lime-800 border-lime-300',
      DIALYSIS:           'bg-sky-100 text-sky-800 border-sky-300',
      GENERIC:            'bg-slate-100 text-slate-800 border-slate-300',
    };
    return colors[orderType] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const isInvasiveOrder = (orderType: Order['orderType']) => {
    return INVASIVE_ORDER_TYPES.includes(orderType);
  };

  // オーダー種から施術内容タイプへのマッピング
  const getProcedureTypes = (patientOrders: Order[]): Map<string, { completed: boolean; orders: Order[] }> => {
    const procedureMap = new Map<string, { completed: boolean; orders: Order[] }>();

    const addToProcedure = (type: string, order: Order) => {
      const existing = procedureMap.get(type) || { completed: false, orders: [] };
      const isCompleted = order.status === 'implemented';
      existing.orders.push(order);
      if (isCompleted) {
        existing.completed = true;
      }
      procedureMap.set(type, existing);
    };

    patientOrders.forEach(order => {
      const procLabel = di.orderTable.procedureTypeLabels[order.orderType as keyof typeof di.orderTable.procedureTypeLabels];
      if (procLabel) addToProcedure(procLabel, order);
    });

    return procedureMap;
  };

  const allSelected = orders.length > 0 && orders.every(order => selectedOrders.includes(order.id));
  const someSelected = orders.some(order => selectedOrders.includes(order.id)) && !allSelected;

  const procedureOrder = di.orderTable.procedureOrder;

  const sortedOrders = useMemo(() => [...orders], [orders]);

  return (
    <div className="rounded-md border bg-white">
      <div className="overflow-auto">
        <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b-2 hover:bg-transparent">
            <th className="w-[40px] text-sm sticky top-0 bg-white z-10 text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap border-b-2">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onToggleAll}
                aria-label={di.orderTable.selectAllAria}
                className={someSelected ? 'data-[state=checked]:bg-gray-400' : ''}
              />
            </th>
            <th className="w-[85px] text-sm sticky top-0 bg-white z-10 text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap border-b-2">{di.orderTable.columns.status}</th>
            <th className="w-[180px] text-sm sticky top-0 bg-white z-10 text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap border-b-2">{di.orderTable.columns.basicInfo}</th>
            <th className="w-[140px] text-sm sticky top-0 bg-white z-10 text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap border-b-2">{di.orderTable.columns.orderDateTime}</th>
            <th className="w-[100px] text-sm sticky top-0 bg-white z-10 text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap border-b-2">{di.orderTable.columns.orderType}</th>
            <th className="w-[135px] text-sm sticky top-0 bg-white z-10 text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap border-b-2">{di.orderTable.columns.classification}</th>
            <th className="w-[90px] text-sm sticky top-0 bg-white z-10 text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap border-b-2">{di.orderTable.columns.wardRoom}</th>
            <th className="w-[60px] text-sm sticky top-0 bg-white z-10 text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap border-b-2">{di.orderTable.columns.location}</th>
            <th className="w-[180px] text-sm sticky top-0 bg-white z-10 text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap border-b-2">{di.orderTable.columns.orderContent}</th>
            <th className="w-[200px] text-sm sticky top-0 bg-white z-10 text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap border-b-2">{di.orderTable.columns.daySummary}</th>
            <th className="w-[140px] text-sm sticky top-0 bg-white z-10 text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap border-b-2">{di.orderTable.columns.actions}</th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {sortedOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-8 text-gray-500 text-base">
                {di.orderTable.noOrders}
              </TableCell>
            </TableRow>
          ) : (
            sortedOrders.map((order) => {
              const patientOrders = patientOrdersMap.get(order.patientId) || [order];
              const hasInvasiveOrders = patientOrders.some(o => isInvasiveOrder(o.orderType));
              const procedureMap = getProcedureTypes(patientOrders);
              const isSelected = selectedOrders.includes(order.id);
              const statusLabel = di.orderStatusLabels[order.status as keyof typeof di.orderStatusLabels] ?? order.status;
              const orderTypeLabel = di.orderTypeLabels[order.orderType as keyof typeof di.orderTypeLabels] ?? order.orderType;
              const genderLabel = di.genderLabels[order.gender as keyof typeof di.genderLabels] ?? order.gender;
              const locationLabel = di.patientLocationLabels[order.location as keyof typeof di.patientLocationLabels] ?? order.location;

              return (
              <TableRow
                key={order.id}
                className={`${hasInvasiveOrders ? 'bg-orange-50/30' : ''} ${onRowDoubleClick ? 'cursor-pointer' : ''}`}
                onDoubleClick={() => onRowDoubleClick?.(order.patientId)}
              >
                <TableCell className="py-1.5">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleOrder(order.id)}
                    aria-label={di.orderTable.selectOrderAria(order.id)}
                  />
                </TableCell>

                {/* ステータス（クリック可能） */}
                <TableCell className="py-1.5">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="h-auto p-0 hover:bg-transparent w-full">
                        <div className="space-y-1 text-left">
                          <div>
                            <Badge variant={getStatusVariant(order.status)} className="cursor-pointer hover:opacity-80 text-sm">
                              {statusLabel}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.statusHistory && order.statusHistory.length > 0
                              ? order.statusHistory[order.statusHistory.length - 1].timestamp
                              : order.receivedAt}
                          </div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{di.orderTable.statusHistoryTitle(order.patientName)}</DialogTitle>
                        <DialogDescription>
                          {di.orderTable.statusHistoryDesc}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        {order.statusHistory && order.statusHistory.length > 0 ? (
                          order.statusHistory.map((history, index) => {
                            const historyStatusLabel = di.orderStatusLabels[history.status as keyof typeof di.orderStatusLabels] ?? history.status;
                            return (
                            <div key={index} className="flex items-start gap-3 border-l-2 border-blue-500 pl-3 pb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant={getStatusVariant(history.status)}>
                                    {historyStatusLabel}
                                  </Badge>
                                  <span className="text-sm text-gray-600">{history.timestamp}</span>
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {di.orderTable.assignedTo(history.updatedBy)}
                                </div>
                              </div>
                            </div>
                          );
                          })
                        ) : (
                          <div className="text-center text-gray-500 py-4">
                            {di.orderTable.statusHistoryNone}
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>

                {/* 基本情報（統合列） */}
                <TableCell className="py-1.5">
                  <div className="space-y-1">
                    <div>
                      <button className="text-blue-600 hover:underline text-sm font-medium">
                        {order.patientId}
                      </button>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{order.patientName}</div>
                      <div className="text-sm text-gray-500">{order.patientKana}</div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span>{genderLabel}</span>
                      <span className="text-gray-400">|</span>
                      <span>{order.birthDate}</span>
                      <span className="text-gray-600">({di.orderTable.age(order.age)})</span>
                    </div>
                    {order.hasAllergies && order.allergies.length > 0 && (
                      <div className="mt-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-orange-600 hover:text-orange-700 gap-1"
                            >
                              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className={order.allergies.length > 0 ?
                                (order.allergies[0].component.length > 10 ? 'text-xs' : 'text-sm') : 'text-sm'}>
                                {(() => {
                                  if (order.allergies.length === 0) return 'アレルギー 0件';

                                  const categoryGroups = order.allergies.reduce((acc, allergy) => {
                                    if (!acc[allergy.category]) {
                                      acc[allergy.category] = [];
                                    }
                                    acc[allergy.category].push(allergy);
                                    return acc;
                                  }, {} as Record<string, typeof order.allergies>);

                                  const categories = Object.keys(categoryGroups);
                                  const firstCategory = di.allergyCategoryLabels[categories[0] as keyof typeof di.allergyCategoryLabels] ?? categories[0];
                                  const totalCount = order.allergies.length;

                                  if (categories.length === 1) {
                                    return `${firstCategory}アレルギー${totalCount > 1 ? `${totalCount}件` : ''}`;
                                  }

                                  return `${firstCategory}アレルギー等${totalCount}件`;
                                })()}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[350px]" align="start">
                            <div className="space-y-3">
                              <h4 className="font-medium text-base">{di.orderTable.allergyInfoTitle}</h4>
                              {(() => {
                                const categoryGroups = order.allergies.reduce((acc, allergy) => {
                                  if (!acc[allergy.category]) {
                                    acc[allergy.category] = [];
                                  }
                                  acc[allergy.category].push(allergy);
                                  return acc;
                                }, {} as Record<string, typeof order.allergies>);

                                return Object.entries(categoryGroups).map(([category, allergies]) => {
                                  const catLabel = di.allergyCategoryLabels[category as keyof typeof di.allergyCategoryLabels] ?? category;
                                  return (
                                  <div key={category} className="space-y-2">
                                    <div className="font-medium text-sm text-gray-700 border-b pb-1">
                                      【{catLabel}アレルギー】
                                    </div>
                                    {allergies.map((allergy) => {
                                      const severityLabel = di.allergySeverityLabels[allergy.severity as keyof typeof di.allergySeverityLabels] ?? allergy.severity;
                                      return (
                                      <div key={allergy.id} className="border-l-2 border-orange-500 pl-2">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm">{allergy.component}</span>
                                          {allergy.severity === 'SEVERE' && (
                                            <Badge variant="destructive" className="text-xs px-1 py-0">
                                              {severityLabel}
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="text-sm text-gray-600">{allergy.symptoms}</div>
                                      </div>
                                    );
                                    })}
                                  </div>
                                );
                                });
                              })()}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onAllergyClick(order)}
                                className="w-full mt-2"
                              >
                                {di.orderTable.allergyDetail}
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                    {/* 薬歴ボタン - 服薬指導、注射、処方のみ */}
                    {(['MEDICATION_GUIDANCE', 'INJECTION', 'PRESCRIPTION'] as const).includes(order.orderType as 'MEDICATION_GUIDANCE' | 'INJECTION' | 'PRESCRIPTION') && (
                      <div className="mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-sm text-blue-600 hover:text-blue-700 gap-1"
                          onClick={() => onMedicationHistory(order.id)}
                        >
                          <History className="h-3 w-3" />
                          {di.orderTable.medicationHistory}
                        </Button>
                      </div>
                    )}
                    {/* PACS参照ボタン - 画像検査のみ */}
                    {order.orderType === 'IMAGING' && (
                      <div className="mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-sm text-blue-600 hover:text-blue-700 gap-1"
                          onClick={() => onPacsReference(order.id)}
                        >
                          <Monitor className="h-3 w-3" />
                          {di.orderTable.pacsReference}
                        </Button>
                      </div>
                    )}
                    {/* 薬剤記録入力ボタン - 注射、薬剤のみ */}
                    {(['INJECTION', 'MEDICATION'] as const).includes(order.orderType as 'INJECTION' | 'MEDICATION') && (
                      <div className="mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-sm text-blue-600 hover:text-blue-700 gap-1"
                          onClick={() => onMaterialRecord(order.id)}
                        >
                          <Pill className="h-3 w-3" />
                          {di.orderTable.buttons.materialRecord}
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* オーダー日時（統合列） */}
                <TableCell className="py-1.5">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-700">
                      {order.receivedAt}
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.department in di.departmentLabels
                        ? di.departmentLabels[order.department as keyof typeof di.departmentLabels]
                        : order.department}
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.attendingDoctor || '-'}
                    </div>
                  </div>
                </TableCell>

                {/* オーダー種 */}
                <TableCell className="py-1.5">
                  <Badge className={`${getOrderTypeColor(order.orderType)} text-sm px-2 py-0.5`} variant="outline">
                    {orderTypeLabel}
                  </Badge>
                </TableCell>

                {/* 分類 */}
                <TableCell className="py-1.5">
                  {order.visualIndicator && (
                    <div className="flex justify-center py-1">
                      {Array.isArray(order.visualIndicator) ? (
                        <div className="grid grid-cols-2 gap-1">
                          {order.visualIndicator.map((indicator, index) => (
                            <VisualIndicator key={index} indicator={indicator} size="xs" />
                          ))}
                        </div>
                      ) : (
                        <VisualIndicator indicator={order.visualIndicator} />
                      )}
                    </div>
                  )}
                </TableCell>

                {/* 病棟/部屋 */}
                <TableCell className="py-1.5">
                  <div className="text-sm">
                    <div>{order.ward || '-'}</div>
                    {order.roomNumber && (
                      <div className="text-gray-600">{order.roomNumber}</div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="py-1.5">
                  <Badge variant="outline" className="text-sm">{locationLabel}</Badge>
                </TableCell>

                {/* オーダー内容 */}
                <TableCell className="py-1.5">
                  <div className="text-sm text-gray-700">
                    {order.content}
                  </div>
                  {order.implementationNotes && (
                    <div className="text-sm text-gray-500 mt-1">
                      {order.implementationNotes}
                    </div>
                  )}
                </TableCell>

                {/* 当日の施術内容 */}
                <TableCell className="py-1.5">
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
                              className={`h-6 px-2 text-sm hover:bg-gray-100 ${color}`}
                              title={di.orderTable.procDetailTitle2(procType)}
                            >
                              {procType}:{icon}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{di.orderTable.procDetailTitle(procType)}</DialogTitle>
                              <DialogDescription>
                                {di.orderTable.procDetailDesc(procType)}
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[60vh]">
                              <div className="space-y-3">
                                {procData.orders.map((procOrder) => {
                                  const procStatusLabel = di.orderStatusLabels[procOrder.status as keyof typeof di.orderStatusLabels] ?? procOrder.status;
                                  const procOrderTypeLabel = di.orderTypeLabels[procOrder.orderType as keyof typeof di.orderTypeLabels] ?? procOrder.orderType;
                                  return (
                                  <div key={procOrder.id} className="border rounded-lg p-3">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <Badge className={getOrderTypeColor(procOrder.orderType)} variant="outline">
                                            {procOrderTypeLabel}
                                          </Badge>
                                          <Badge variant={getStatusVariant(procOrder.status)}>
                                            {procStatusLabel}
                                          </Badge>
                                        </div>
                                        <div className="text-sm mt-2">{procOrder.content}</div>
                                      </div>
                                    </div>
                                    {procOrder.implementedAt && (
                                      <div className="text-sm text-gray-500 mt-2">
                                        {di.orderTable.implementedBy(procOrder.implementedAt, procOrder.implementedBy ?? '')}
                                      </div>
                                    )}
                                    {procOrder.implementationNotes && (
                                      <div className="text-sm text-gray-600 mt-1">
                                        {di.orderTable.notesPrefix(procOrder.implementationNotes)}
                                      </div>
                                    )}
                                  </div>
                                );
                                })}
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      );
                    })}
                    {hasInvasiveOrders && (
                      <div className="flex items-center gap-1 text-orange-600 text-sm ml-2">
                        <AlertTriangle className="h-3 w-3" />
                        {di.orderTable.invasiveWarning}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* 操作 */}
                <TableCell className="py-1.5">
                  <div className="flex gap-1 flex-wrap">

                    {order.status === 'received' && order.orderType === 'SPECIMEN_TEST' && (
                      <Button size="sm" variant="outline" onClick={() => onAccept(order.id)} className="text-sm w-full">
                        {di.orderTable.buttons.accept}
                      </Button>
                    )}
                    {((order.status === 'accepted' && order.orderType === 'SPECIMEN_TEST') ||
                      (order.status === 'accepted' && order.orderType === 'PHYSIOLOGICAL_TEST')) && (
                      <Button size="sm" variant="default" onClick={() => onStart(order.id)} className="text-sm w-full">
                        {di.orderTable.buttons.start}
                      </Button>
                    )}
                    {order.status === 'started' && order.orderType === 'PHYSIOLOGICAL_TEST' && !order.materialRecorded && (
                      <Button size="sm" variant="outline" onClick={() => onMaterialRecord(order.id)} className="gap-1 text-sm w-full">
                        <Pill className="h-3 w-3" />
                        {di.orderTable.buttons.materialRecord}
                      </Button>
                    )}
                    {order.status === 'started' && order.orderType === 'SPECIMEN_TEST' && (
                      <Button size="sm" variant="default" onClick={() => onCollect(order.id)} className="text-sm w-full">
                        {di.orderTable.buttons.collect}
                      </Button>
                    )}
                    {order.status === 'collected' && order.orderType === 'SPECIMEN_TEST' && (
                      <Button size="sm" variant="default" onClick={() => onReceive(order.id)} className="text-sm w-full">
                        {di.orderTable.buttons.receive}
                      </Button>
                    )}
                    {order.status === 'specimen_received' && order.orderType === 'SPECIMEN_TEST' && !order.materialRecorded && (
                      <Button size="sm" variant="outline" onClick={() => onMaterialRecord(order.id)} className="gap-1 text-sm w-full">
                        <Pill className="h-3 w-3" />
                        {di.orderTable.buttons.materialRecord}
                      </Button>
                    )}
                    {((order.status === 'specimen_received' && order.orderType === 'SPECIMEN_TEST' && order.materialRecorded) ||
                      (order.status === 'started' && order.orderType === 'PHYSIOLOGICAL_TEST' && order.materialRecorded)) && (
                      <Button size="sm" variant="default" onClick={() => onImplement(order.id)} className="text-sm w-full">
                        {di.orderTable.buttons.implement}
                      </Button>
                    )}
                    {order.status === 'implemented' && (['SPECIMEN_TEST', 'PHYSIOLOGICAL_TEST'] as const).includes(order.orderType as 'SPECIMEN_TEST' | 'PHYSIOLOGICAL_TEST') && (
                      <Button size="sm" variant={order.labResults ? "outline" : "default"} onClick={() => onResultInput(order.id)} className="gap-1 text-sm w-full">
                        <FileText className="h-3 w-3" />
                        {order.labResults ? di.orderTable.buttons.resultEdit : di.orderTable.buttons.resultInput}
                      </Button>
                    )}
                    {order.status === 'collected' && (['PATHOLOGY', 'BACTERIA'] as const).includes(order.orderType as 'PATHOLOGY' | 'BACTERIA') && (
                      <Button size="sm" variant="default" onClick={() => onTestRequest(order.id)} className="gap-1 text-sm w-full">
                        <FlaskConical className="h-3 w-3" />
                        {di.orderTable.buttons.testRequest}
                      </Button>
                    )}
                    {order.status === 'awaiting_result' && (['PATHOLOGY', 'BACTERIA'] as const).includes(order.orderType as 'PATHOLOGY' | 'BACTERIA') && !order.materialRecorded && (
                      <Button size="sm" variant="outline" onClick={() => onMaterialRecord(order.id)} className="gap-1 text-sm w-full">
                        <Pill className="h-3 w-3" />
                        {di.orderTable.buttons.materialRecord}
                      </Button>
                    )}
                    {order.status === 'awaiting_result' && (['PATHOLOGY', 'BACTERIA'] as const).includes(order.orderType as 'PATHOLOGY' | 'BACTERIA') && order.materialRecorded && (
                      <Button size="sm" variant="default" onClick={() => onImplement(order.id)} className="text-sm w-full">
                        {di.orderTable.buttons.implement}
                      </Button>
                    )}
                    {order.status === 'implemented' && (['PATHOLOGY', 'BACTERIA'] as const).includes(order.orderType as 'PATHOLOGY' | 'BACTERIA') && (
                      <Button size="sm" variant={order.labResults ? "outline" : "default"} onClick={() => onResultInput(order.id)} className="gap-1 text-sm w-full">
                        <FileText className="h-3 w-3" />
                        {order.labResults ? di.orderTable.buttons.resultEdit : di.orderTable.buttons.resultInput}
                      </Button>
                    )}
                    {order.status === 'received' &&
                     (['ENDOSCOPY', 'IMAGING', 'PROCEDURE', 'RADIOLOGY', 'DIALYSIS', 'GENERIC'] as const).includes(order.orderType as 'ENDOSCOPY' | 'IMAGING' | 'PROCEDURE' | 'RADIOLOGY' | 'DIALYSIS' | 'GENERIC') && (
                      <Button size="sm" variant="outline" onClick={() => onAccept(order.id)} className="text-sm w-full">
                        {di.orderTable.buttons.accept}
                      </Button>
                    )}
                    {order.status === 'accepted' &&
                     (['ENDOSCOPY', 'IMAGING', 'PROCEDURE', 'RADIOLOGY', 'DIALYSIS', 'GENERIC'] as const).includes(order.orderType as 'ENDOSCOPY' | 'IMAGING' | 'PROCEDURE' | 'RADIOLOGY' | 'DIALYSIS' | 'GENERIC') && (
                      <Button size="sm" onClick={() => onImplement(order.id)} className="text-sm w-full">
                        {di.orderTable.buttons.implement}
                      </Button>
                    )}
                    {order.status === 'received' && (['INJECTION', 'MEDICATION'] as const).includes(order.orderType as 'INJECTION' | 'MEDICATION') && (
                      <Button size="sm" variant="default" onClick={() => onDispense(order.id)} className="text-sm w-full">
                        {di.orderTable.buttons.dispense}
                      </Button>
                    )}
                    {order.status === 'started' && (['INJECTION', 'MEDICATION'] as const).includes(order.orderType as 'INJECTION' | 'MEDICATION') && (
                      <Button size="sm" variant="outline" onClick={() => onMaterialRecord(order.id)} className="gap-1 text-sm flex-1">
                        <Pill className="h-3 w-3" />
                        {di.orderTable.buttons.materialRecord}
                      </Button>
                    )}
                    {order.status === 'started' && (['INJECTION', 'MEDICATION'] as const).includes(order.orderType as 'INJECTION' | 'MEDICATION') && (
                      <Button size="sm" variant="default" onClick={() => onImplement(order.id)} className="text-sm flex-1">
                        {di.orderTable.buttons.implement}
                      </Button>
                    )}
                    {order.status === 'received' && (['PRESCRIPTION', 'MEDICATION_GUIDANCE'] as const).includes(order.orderType as 'PRESCRIPTION' | 'MEDICATION_GUIDANCE') && (
                      <Button size="sm" variant="default" onClick={() => onImplement(order.id)} className="text-sm w-full">
                        {di.orderTable.buttons.implement}
                      </Button>
                    )}
                    {order.orderType === 'ENDOSCOPY' && (
                      <Button size="sm" variant="outline" onClick={() => onEndoscopyReport(order.id)} className="gap-1 text-sm w-full">
                        <FileText className="h-3 w-3" />
                        {di.orderTable.buttons.reportCreate}
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
