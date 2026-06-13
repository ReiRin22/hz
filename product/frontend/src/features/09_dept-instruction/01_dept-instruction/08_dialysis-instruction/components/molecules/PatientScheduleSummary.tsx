import { Badge } from '@shared/components/atoms/badge';
import { AlertTriangle } from 'lucide-react';
import type { Order } from '../../types';
import { INVASIVE_ORDER_TYPES } from '../types';

interface PatientScheduleSummaryProps {
  currentOrder: Order;
  allPatientOrders: Order[];
}

export function PatientScheduleSummary({ currentOrder, allPatientOrders }: PatientScheduleSummaryProps) {
  // 当日の同一患者のオーダを時系列で並べ替え
  const sortedOrders = [...allPatientOrders].sort((a, b) => {
    const timeA = a.scheduledTime || '99:99';
    const timeB = b.scheduledTime || '99:99';
    return timeA.localeCompare(timeB);
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case '実施済み':
      case '出庫':
        return 'bg-green-100 text-green-800 border-green-300';
      case '受付':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case '指示受け':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const isInvasive = (orderType: Order['orderType']) => {
    return INVASIVE_ORDER_TYPES.includes(orderType);
  };

  return (
    <div className="space-y-1.5 max-w-[300px]">
      {sortedOrders.map((order) => {
        const isCurrent = order.id === currentOrder.id;
        const invasive = isInvasive(order.orderType);
        
        return (
          <div
            key={order.id}
            className={`text-xs p-1.5 rounded border ${
              isCurrent ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start gap-1.5">
              <span className="text-gray-600 shrink-0 min-w-[35px]">
                {order.scheduledTime || '-'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-1 py-0 ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </Badge>
                  <span className="text-gray-700">
                    {order.department}
                  </span>
                  {invasive && (
                    <AlertTriangle className="h-3 w-3 text-orange-500 shrink-0" />
                  )}
                </div>
                <div className="text-gray-800 mt-0.5 truncate" title={order.content}>
                  {order.orderType}：{order.content}
                </div>
                {order.implementedAt && (
                  <div className="text-gray-500 mt-0.5">
                    実施：{order.implementedAt}
                  </div>
                )}
                {order.implementationNotes && (
                  <div className="text-gray-600 mt-0.5 line-clamp-2">
                    {order.implementationNotes}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* 侵襲性処置の注意表示 */}
      {sortedOrders.some(o => isInvasive(o.orderType)) && (
        <div className="text-xs text-orange-600 flex items-center gap-1 mt-2 pt-2 border-t border-orange-200">
          <AlertTriangle className="h-3 w-3" />
          侵襲性処置が含まれます
        </div>
      )}
    </div>
  );
}
