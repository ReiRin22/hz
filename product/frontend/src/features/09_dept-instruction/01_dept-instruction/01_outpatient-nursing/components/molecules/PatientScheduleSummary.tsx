import { Badge } from '@shared/components/atoms/badge';
import { AlertTriangle, FileCheck, FileX } from 'lucide-react';
import type { Order, ProcedureType } from '../../types';
import { INVASIVE_ORDER_TYPES } from '../../types';

interface PatientScheduleSummaryProps {
  currentOrder: Order;
  allPatientOrders: Order[];
}

export function PatientScheduleSummary({ currentOrder, allPatientOrders }: PatientScheduleSummaryProps) {
  // オーダー種から施術内容タイプへのマッピング
  const getProcedureType = (orderType: Order['orderType']): ProcedureType | null => {
    switch (orderType) {
      case '検体検査':
        return '検体';
      case '細菌検査':
        return '細菌';
      case '病理検査':
        return '病理';
      case '生理検査':
        return '生理';
      case '内視鏡検査':
        return '内視';
      case '画像検査':
        return '画像';
      case 'リハビリ':
        return 'リハ';
      case '注射':
        return '注射';
      case '処置':
        return '処置';
      case '服薬指導':
      case '栄養指導':
        return '指導';
      default:
        return null;
    }
  };

  // 施術内容ごとに完了状況を集計
  const procedureMap = new Map<ProcedureType, { completed: boolean; consentRequired: boolean; consentObtained: boolean }>();
  
  allPatientOrders.forEach(order => {
    const procType = getProcedureType(order.orderType);
    if (procType) {
      const existing = procedureMap.get(procType) || { 
        completed: false, 
        consentRequired: false,
        consentObtained: false 
      };
      
      const isCompleted = order.status === '実施済' || order.status === '出庫済';
      if (isCompleted) {
        existing.completed = true;
      }
      
      if (order.consentRequired) {
        existing.consentRequired = true;
        if (order.consentObtained) {
          existing.consentObtained = true;
        }
      }
      
      procedureMap.set(procType, existing);
    }
  });

  const isInvasive = allPatientOrders.some(o => INVASIVE_ORDER_TYPES.includes(o.orderType));

  return (
    <div className="space-y-1 text-sm">
      {/* 同意書情報 */}
      {currentOrder.consentRequired && (
        <div className="flex items-center gap-1">
          {currentOrder.consentObtained ? (
            <span className="text-green-700">
              同意書：〇
            </span>
          ) : (
            <span className="text-red-700">
              同意書：×
            </span>
          )}
          <span className="text-gray-500 text-xs">
            ({currentOrder.orderType})
          </span>
        </div>
      )}

      {/* 施術内容サマリー */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        {Array.from(procedureMap.entries()).map(([procType, data]) => (
          <span key={procType} className={data.completed ? 'text-gray-700' : 'text-gray-400'}>
            {procType}：{data.completed ? '●' : '○'}
          </span>
        ))}
        {isInvasive && (
          <span className="flex items-center gap-0.5 text-orange-600">
            <AlertTriangle className="h-3 w-3" />
            侵襲処置
          </span>
        )}
      </div>
    </div>
  );
}