'use client';

/**
 * オーダー編集状態管理フック
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/hooks/useOrderEditing.ts
 */

import { useState, useCallback } from 'react';
import type { OrderDetail, EditingOrderData, PreferredTime } from '../types/order-shared.types';

interface UseOrderEditingProps {
  confirmedOrders: OrderDetail[];
  onUpdateOrder: (order: OrderDetail) => void;
  onAddOrder?: (order: OrderDetail) => void;
  onNavigateToExamination?: (orderId: string) => void;
  externalEditingOrders?: Record<string, EditingOrderData>;
  onEditingOrdersChange?: (editingOrders: Record<string, EditingOrderData>) => void;
}

export function useOrderEditing({
  confirmedOrders,
  onUpdateOrder,
  onAddOrder,
  onNavigateToExamination,
  externalEditingOrders,
  onEditingOrdersChange
}: UseOrderEditingProps) {
  // 外部から編集状態が渡される場合はそれを使用、そうでない場合は内部状態を使用
  const [internalEditingOrders, setInternalEditingOrders] = useState<Record<string, EditingOrderData>>({});
  const editingOrders = externalEditingOrders !== undefined ? externalEditingOrders : internalEditingOrders;
  const setEditingOrders = useCallback(
    (updater: Record<string, EditingOrderData> | ((prev: Record<string, EditingOrderData>) => Record<string, EditingOrderData>)) => {
      if (externalEditingOrders !== undefined) {
        // 外部制御モード: 内部 state は更新せず外部 setter のみ呼ぶ
        const newState = typeof updater === 'function' ? updater(externalEditingOrders) : updater;
        onEditingOrdersChange?.(newState);
        return;
      }
      setInternalEditingOrders(prev => {
        const newState = typeof updater === 'function' ? updater(prev) : updater;
        onEditingOrdersChange?.(newState);
        return newState;
      });
    },
    [externalEditingOrders, onEditingOrdersChange]
  );

  const [orderNotes, setOrderNotes] = useState<{[key: string]: string}>({});

  const handleEdit = useCallback((order: OrderDetail) => {
    const today = new Date().toISOString().split('T')[0];

    setEditingOrders(prev => ({
      ...prev,
      [order.id]: {
        quantity: order.quantity || '',
        frequency: order.frequency || '',
        timing: order.timing || (order.type === 'lab' ? today : ''),
        notes: orderNotes[order.id] || '',
        modality: order.modality || '',
        bodyPart: order.bodyPart || '',
        selectedBodyParts: order.bodyPart ? [order.bodyPart] : [],
        bodyPartsList: order.bodyPartsList || [],
        imagingContent: order.imagingContent || '',
        protocols: order.protocols || [],
        position: order.position || '',
        laterality: order.laterality || '',
        functionalConditions: order.functionalConditions || [],
        specialInstructions: order.specialInstructions || '',
        radiationCondition: order.radiationCondition || '',
        measurementConditions: order.measurementConditions || '',
        priority: order.priority || 'normal',
        preferredDate: order.preferredDate || today,
        dateUndecided: order.dateUndecided || false,
        preferredTimeSlots: order.preferredTimeSlots || ['即時'],
        scheduledDate: order.scheduledDate || today,
        scheduledTime: order.scheduledTime || '',
        preferredTime: order.preferredTime || 'now',
        useContrast: order.useContrast || false,
        hasAllergy: order.hasAllergy || false,
        allergySpecialInstructions: order.allergySpecialInstructions || '',
        egfrValue: order.egfrValue || '',
        clinicalPurpose: order.clinicalPurpose || '',
        symptomTags: order.symptomTags || [],
        technicianNotes: order.technicianNotes || ''
      }
    }));
  }, [orderNotes, setEditingOrders]);

  const handleSave = useCallback((order: OrderDetail) => {
    const editingData = editingOrders[order.id];
    if (editingData) {
      if (order.type === 'imaging' && editingData.selectedBodyParts && editingData.selectedBodyParts.length > 1) {
        editingData.selectedBodyParts.forEach((bodyPart, index) => {
          let preferredTime: PreferredTime = 'now';
          if (editingData.dateUndecided) {
            preferredTime = 'unscheduled';
          } else if (editingData.preferredTimeSlots && editingData.preferredTimeSlots.length > 0) {
            const slots = editingData.preferredTimeSlots;
            if (slots.includes('午前') && !slots.includes('午後') && !slots.includes('即時')) {
              preferredTime = 'morning';
            } else if (slots.includes('午後') && !slots.includes('午前') && !slots.includes('即時')) {
              preferredTime = 'afternoon';
            } else if (slots.includes('即時')) {
              preferredTime = 'now';
            } else if (slots.includes('午前') && slots.includes('午後')) {
              preferredTime = 'afternoon';
            }
          }

          const bodyPartsListForThisPart = (editingData.bodyPartsList || []).filter(
            (part) => part.name === bodyPart
          );

          if (index === 0) {
            const updatedOrder = {
              ...order,
              examType: editingData.modality,
              modality: editingData.modality,
              bodyPart: bodyPart,
              bodyPartsList: bodyPartsListForThisPart,
              imagingContent: editingData.imagingContent,
              protocols: editingData.protocols,
              position: editingData.position,
              laterality: editingData.laterality,
              functionalConditions: editingData.functionalConditions,
              specialInstructions: editingData.specialInstructions,
              radiationCondition: editingData.radiationCondition,
              measurementConditions: editingData.measurementConditions,
              priority: editingData.priority,
              preferredDate: editingData.dateUndecided ? undefined : editingData.preferredDate,
              dateUndecided: editingData.dateUndecided,
              preferredTimeSlots: editingData.preferredTimeSlots,
              scheduledDate: editingData.dateUndecided ? undefined : (editingData.scheduledDate || order.scheduledDate),
              scheduledTime: editingData.dateUndecided ? undefined : (editingData.scheduledTime || order.scheduledTime),
              preferredTime: preferredTime,
              useContrast: editingData.useContrast,
              hasAllergy: editingData.hasAllergy,
              allergySpecialInstructions: editingData.allergySpecialInstructions,
              egfrValue: editingData.egfrValue,
              clinicalPurpose: editingData.clinicalPurpose,
              symptomTags: editingData.symptomTags,
              technicianNotes: editingData.technicianNotes
            };
            onUpdateOrder(updatedOrder);
          } else {
            const newOrder: OrderDetail = {
              ...order,
              id: `${order.id}-part-${index}`,
              examType: editingData.modality,
              modality: editingData.modality,
              bodyPart: bodyPart,
              bodyPartsList: bodyPartsListForThisPart,
              imagingContent: editingData.imagingContent,
              protocols: editingData.protocols,
              position: editingData.position,
              laterality: editingData.laterality,
              functionalConditions: editingData.functionalConditions,
              specialInstructions: editingData.specialInstructions,
              radiationCondition: editingData.radiationCondition,
              measurementConditions: editingData.measurementConditions,
              priority: editingData.priority,
              preferredDate: editingData.dateUndecided ? undefined : editingData.preferredDate,
              dateUndecided: editingData.dateUndecided,
              preferredTimeSlots: editingData.preferredTimeSlots,
              scheduledDate: editingData.dateUndecided ? undefined : (editingData.scheduledDate || order.scheduledDate),
              scheduledTime: editingData.dateUndecided ? undefined : (editingData.scheduledTime || order.scheduledTime),
              preferredTime: preferredTime,
              useContrast: editingData.useContrast,
              hasAllergy: editingData.hasAllergy,
              allergySpecialInstructions: editingData.allergySpecialInstructions,
              egfrValue: editingData.egfrValue,
              clinicalPurpose: editingData.clinicalPurpose,
              symptomTags: editingData.symptomTags,
              technicianNotes: editingData.technicianNotes
            };
            if (onAddOrder) { onAddOrder(newOrder); }
          }
        });

        if (editingData.notes !== undefined) {
          setOrderNotes(prev => ({
            ...prev,
            [order.id]: editingData.notes || ''
          }));
        }

        if (editingData.modality && !editingData.dateUndecided) {
          const modality = editingData.modality;
          if (modality === 'CT検査' || modality === 'MRI検査' || modality === '透視検査') {
            if (onNavigateToExamination) {
              onNavigateToExamination(order.id);
            }
          }
        }
      } else {
        let preferredTime: PreferredTime = 'now';
        if (order.type === 'imaging') {
          if (editingData.dateUndecided) {
            preferredTime = 'unscheduled';
          } else if (editingData.preferredTimeSlots && editingData.preferredTimeSlots.length > 0) {
            const slots = editingData.preferredTimeSlots;
            if (slots.includes('午前') && !slots.includes('午後') && !slots.includes('即時')) {
              preferredTime = 'morning';
            } else if (slots.includes('午後') && !slots.includes('午前') && !slots.includes('即時')) {
              preferredTime = 'afternoon';
            } else if (slots.includes('即時')) {
              preferredTime = 'now';
            } else if (slots.includes('午前') && slots.includes('午後')) {
              preferredTime = 'afternoon';
            }
          }
        }

        const updatedOrder = {
          ...order,
          quantity: editingData.quantity,
          frequency: editingData.frequency,
          timing: editingData.timing,
          ...(order.type === 'imaging' && {
            examType: editingData.modality,
            modality: editingData.modality,
            bodyPart: editingData.bodyPart,
            bodyPartsList: editingData.bodyPartsList,
            imagingContent: editingData.imagingContent,
            protocols: editingData.protocols,
            position: editingData.position,
            laterality: editingData.laterality,
            functionalConditions: editingData.functionalConditions,
            specialInstructions: editingData.specialInstructions,
            radiationCondition: editingData.radiationCondition,
            measurementConditions: editingData.measurementConditions,
            priority: editingData.priority,
            preferredDate: editingData.dateUndecided ? undefined : editingData.preferredDate,
            dateUndecided: editingData.dateUndecided,
            preferredTimeSlots: editingData.preferredTimeSlots,
            scheduledDate: editingData.dateUndecided ? undefined : (editingData.scheduledDate || order.scheduledDate),
            scheduledTime: editingData.dateUndecided ? undefined : (editingData.scheduledTime || order.scheduledTime),
            preferredTime: preferredTime,
            useContrast: editingData.useContrast,
            hasAllergy: editingData.hasAllergy,
            allergySpecialInstructions: editingData.allergySpecialInstructions,
            egfrValue: editingData.egfrValue,
            clinicalPurpose: editingData.clinicalPurpose,
            symptomTags: editingData.symptomTags,
            technicianNotes: editingData.technicianNotes
          })
        };
        onUpdateOrder(updatedOrder);

        if (editingData.notes !== undefined) {
          setOrderNotes(prev => ({
            ...prev,
            [order.id]: editingData.notes || ''
          }));
        }

        if (order.type === 'imaging' && editingData.modality && !editingData.dateUndecided) {
          const modality = editingData.modality;
          if (modality === 'CT検査' || modality === 'MRI検査' || modality === '透視検査') {
            if (onNavigateToExamination) {
              onNavigateToExamination(order.id);
            }
          }
        }
      }
    }

    setEditingOrders(prev => {
      const newState = { ...prev };
      delete newState[order.id];
      return newState;
    });
  }, [editingOrders, onUpdateOrder, onAddOrder, onNavigateToExamination, setEditingOrders]);

  const handleCancel = useCallback((orderId: string) => {
    setEditingOrders(prev => {
      const newState = { ...prev };
      delete newState[orderId];
      return newState;
    });
  }, [setEditingOrders]);

  const updateEditingValue = useCallback((orderId: string, field: string, value: any) => {
    setEditingOrders(prev => {
      const currentOrder = confirmedOrders.find(o => o.id === orderId);
      const today = new Date().toISOString().split('T')[0];

      if (!prev[orderId]) {
        return {
          ...prev,
          [orderId]: {
            scheduledDate: currentOrder?.scheduledDate || today,
            preferredTime: currentOrder?.preferredTime || undefined,
            dateUndecided: currentOrder?.dateUndecided || false,
            useContrast: currentOrder?.useContrast || false,
            hasAllergy: currentOrder?.hasAllergy || false,
            allergySpecialInstructions: currentOrder?.allergySpecialInstructions || '',
            [field]: value
          }
        };
      }

      return {
        ...prev,
        [orderId]: {
          ...prev[orderId],
          [field]: value
        }
      };
    });
  }, [confirmedOrders, setEditingOrders]);

  return {
    editingOrders,
    orderNotes,
    handleEdit,
    handleSave,
    handleCancel,
    updateEditingValue,
    setOrderNotes
  };
}
