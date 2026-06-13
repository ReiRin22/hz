'use client';

/**
 * 検査セクション管理カスタムフック
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/hooks/useExaminationSections.ts
 */

import { useEffect } from 'react';
import type { ImagingOrderItem, ExaminationItem, ImagingContentDetail } from '../types';
import { useExaminationSectionsStore } from '../stores/examinationSections.store';
import { categoryOptions } from '../types/imaging-content-panel.constants';

export interface UseExaminationSectionsParams {
  imagingItem: ImagingOrderItem;
  selectedCategory: string;
  defaultDirection: string;
  onNext: (detail: ImagingContentDetail) => void;
  onNavigateToExamination?: (detail: ImagingContentDetail, modality: string) => void;
}

export function useExaminationSections({
  imagingItem,
  selectedCategory,
  defaultDirection,
  onNext,
  onNavigateToExamination,
}: UseExaminationSectionsParams) {
  const store = useExaminationSectionsStore(
    imagingItem.category || 'xray',
    imagingItem.bodyPart || '',
    defaultDirection
  );

  useEffect(() => {
    store.initializeSections(imagingItem, defaultDirection);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagingItem.bodyPart]);

  useEffect(() => {
    store.resetDirections(defaultDirection);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, defaultDirection]);

  const handleNext = () => {
    const examinationList: ExaminationItem[] = [];

    store.sections.forEach(section => {
      if (section.bodyParts.length > 0 && section.directions.length > 0) {
        section.bodyParts.forEach(bodyPart => {
          section.directions.forEach(direction => {
            examinationList.push({
              bodyPart,
              direction,
              laterality: section.laterality[0],
              radiationCondition: section.radiationCondition,
              position: section.positions.length > 0 ? section.positions.join(', ') : undefined,
              functionalConditions: section.functionalConditions.length > 0 ? section.functionalConditions : undefined,
            });
          });
        });
      }
    });

    if (examinationList.length === 0) return;

    const detail: ImagingContentDetail = { examinationList };
    const requiresReservation = needsReservation(selectedCategory);

    if (requiresReservation && onNavigateToExamination) {
      const modalityLabel =
        categoryOptions.find(opt => opt.value === selectedCategory)?.label ?? selectedCategory;
      onNavigateToExamination(detail, modalityLabel);
    } else {
      onNext(detail);
    }
  };

  const needsReservation = (category: string): boolean =>
    ['ct', 'mri', 'ultrasound'].includes(category);

  const isNextEnabled = store.sections.some(
    s => s.bodyParts.length > 0 && s.directions.length > 0
  );

  return {
    ...store,
    handleNext,
    isNextEnabled,
  };
}
