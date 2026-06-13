'use client';

/**
 * ImagingContentPanel 検査セクション状態管理ストア
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/stores/examinationSections.store.ts
 */

import { useState } from 'react';
import type { ExaminationSection, ImagingOrderItem } from '../types';
import { radiationConditionDefaults } from '../types/imaging-content-panel.constants';

export interface ExaminationSectionsStore {
  sections: ExaminationSection[];
  selectedSectionId: string | null;
  setSections: (sections: ExaminationSection[] | ((prev: ExaminationSection[]) => ExaminationSection[])) => void;
  setSelectedSectionId: (id: string | null) => void;
  getDefaultRadiationCondition: (selectedCategory: string, bodyPart: string) => string;
  toggleBodyPart: (part: string, selectedCategory: string, defaultDirection: string) => void;
  updateSection: (id: string, field: keyof ExaminationSection, value: any, selectedCategory: string) => void;
  toggleDirection: (sectionId: string, direction: string) => void;
  togglePosition: (sectionId: string, position: string) => void;
  toggleLaterality: (sectionId: string, laterality: string) => void;
  addSection: (defaultDirection: string) => void;
  removeSection: (id: string) => void;
  openSlidePanel: (sectionId: string) => void;
  closeSlidePanel: () => void;
  initializeSections: (imagingItem: ImagingOrderItem, defaultDirection: string) => void;
  resetDirections: (defaultDirection: string) => void;
}

export function useExaminationSectionsStore(
  initialCategory: string,
  initialBodyPart: string,
  defaultDirection: string
): ExaminationSectionsStore {
  const [sections, setSections] = useState<ExaminationSection[]>([
    {
      id: '1',
      bodyParts: initialBodyPart ? [initialBodyPart] : [],
      directions: [defaultDirection],
      laterality: ['Not specified'],
      radiationCondition: '',
      positions: [],
      functionalConditions: [],
      specialInstructions: [],
      urgency: '通常',
    },
  ]);

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const getDefaultRadiationCondition = (selectedCategory: string, bodyPart: string): string => {
    if (!selectedCategory || !bodyPart) return '';
    const categoryDefaults = radiationConditionDefaults[selectedCategory];
    if (!categoryDefaults) return '';
    return categoryDefaults[bodyPart] || '';
  };

  const toggleBodyPart = (part: string, selectedCategory: string, defaultDirection: string) => {
    setSections(prevSections => {
      const firstSection = prevSections[0];
      const currentBodyParts = firstSection.bodyParts;
      if (currentBodyParts.includes(part)) {
        return [{ ...firstSection, bodyParts: currentBodyParts.filter(p => p !== part) }];
      }
      return [{ ...firstSection, bodyParts: [...currentBodyParts, part] }];
    });
  };

  const updateSection = (id: string, field: keyof ExaminationSection, value: any, selectedCategory: string) => {
    setSections(prev =>
      prev.map(section => {
        if (section.id !== id) return section;
        if (field === 'bodyParts') {
          const currentBodyParts = section.bodyParts;
          const newBodyParts = currentBodyParts.includes(value)
            ? currentBodyParts.filter(p => p !== value)
            : [...currentBodyParts, value];
          return { ...section, bodyParts: newBodyParts };
        }
        return { ...section, [field]: value };
      })
    );
  };

  const toggleDirection = (sectionId: string, direction: string) => {
    setSections(prev =>
      prev.map(section => {
        if (section.id !== sectionId) return section;
        const currentDirections = section.directions;
        if (currentDirections.includes(direction)) {
          if (currentDirections.length > 1) {
            return { ...section, directions: currentDirections.filter(d => d !== direction) };
          }
          return section;
        }
        return { ...section, directions: [...currentDirections, direction] };
      })
    );
  };

  const togglePosition = (sectionId: string, position: string) => {
    setSections(prev =>
      prev.map(section => {
        if (section.id !== sectionId) return section;
        const currentPositions = section.positions;
        if (currentPositions.includes(position)) {
          return { ...section, positions: currentPositions.filter(p => p !== position) };
        }
        return { ...section, positions: [...currentPositions, position] };
      })
    );
  };

  const toggleLaterality = (sectionId: string, laterality: string) => {
    setSections(prev =>
      prev.map(section => {
        if (section.id !== sectionId) return section;
        const currentLaterality = section.laterality;
        if (currentLaterality.includes(laterality)) {
          return { ...section, laterality: currentLaterality.filter(l => l !== laterality) };
        }
        return { ...section, laterality: [...currentLaterality, laterality] };
      })
    );
  };

  const addSection = (defaultDirection: string) => {
    const newId = String(Date.now());
    setSections(prev => [
      ...prev,
      {
        id: newId,
        bodyParts: [],
        directions: [defaultDirection],
        laterality: ['Not specified'],
        radiationCondition: '',
        positions: [],
        functionalConditions: [],
        specialInstructions: [],
        urgency: '通常',
      },
    ]);
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
    if (selectedSectionId === id) {
      setSelectedSectionId(null);
    }
  };

  const openSlidePanel = (sectionId: string) => setSelectedSectionId(sectionId);
  const closeSlidePanel = () => setSelectedSectionId(null);

  const initializeSections = (imagingItem: ImagingOrderItem, defaultDirection: string) => {
    if (imagingItem.bodyPart) {
      setSections(prev => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          bodyParts: imagingItem.bodyPart ? [imagingItem.bodyPart] : [],
          radiationCondition: getDefaultRadiationCondition(
            imagingItem.category || '',
            imagingItem.bodyPart || ''
          ),
        };
        return updated;
      });
    }
  };

  const resetDirections = (defaultDirection: string) => {
    setSections(prev =>
      prev.map(section => ({ ...section, directions: [defaultDirection] }))
    );
  };

  return {
    sections,
    selectedSectionId,
    setSections,
    setSelectedSectionId,
    getDefaultRadiationCondition,
    toggleBodyPart,
    updateSection,
    toggleDirection,
    togglePosition,
    toggleLaterality,
    addSection,
    removeSection,
    openSlidePanel,
    closeSlidePanel,
    initializeSections,
    resetDirections,
  };
}
