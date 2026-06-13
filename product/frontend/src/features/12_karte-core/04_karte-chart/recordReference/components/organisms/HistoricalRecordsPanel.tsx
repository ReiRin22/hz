'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/atoms/card';
import { FileText, Search } from 'lucide-react';
import type { MedicalRecord, CategoryKey } from '../../types/recordReference.type';
import { RecordSearchBar } from '../molecules/RecordSearchBar';
import { RecordFilterSection } from '../molecules/RecordFilterSection';
import { RecordCategoryHeader } from '../molecules/RecordCategoryHeader';
import { RecordTreeItem } from '../molecules/RecordTreeItem';
import { useRecordFilters } from '../../hooks/useRecordFilters';
import { useRecordCategorization } from '../../hooks/useRecordCategorization';
import { useRecordSelection } from '../../hooks/useRecordSelection';
import { categoryConfig } from '../../constants/recordTypeConfig';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.recordReference.historicalRecordsPanel;

interface HistoricalRecordsPanelProps {
  records: MedicalRecord[];
  onRecordSelect: (record: MedicalRecord | MedicalRecord[]) => void;
}

export function HistoricalRecordsPanel({ records, onRecordSelect }: HistoricalRecordsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'and' | 'or'>('and');
  const [selectedProfession, setSelectedProfession] = useState<string>('all');
  const [selectedRecordType, setSelectedRecordType] = useState<string>('all');
  const [selectedVisitType, setSelectedVisitType] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const filteredRecords = useRecordFilters(records, {
    searchQuery,
    searchMode,
    profession: selectedProfession,
    recordType: selectedRecordType,
    visitType: selectedVisitType,
    startDate,
    endDate,
  });

  const { groupedRecords, getCategoryCount } = useRecordCategorization(filteredRecords);
  const { selectedRecordIds, expandedCategories, toggleCategory, handleRecordClick, sortRecordsByPriority } =
    useRecordSelection(records);

  return (
    <Card className="h-full flex flex-col min-w-0" style={{ flex: '0 0 390px' }}>
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>{t.title}</span>
          </div>
        </CardTitle>

        <div className="space-y-2">
          <RecordSearchBar
            searchQuery={searchQuery}
            searchMode={searchMode}
            onSearchChange={setSearchQuery}
            onSearchModeChange={setSearchMode}
          />
          <RecordFilterSection
            selectedProfession={selectedProfession}
            selectedRecordType={selectedRecordType}
            selectedVisitType={selectedVisitType}
            startDate={startDate}
            endDate={endDate}
            onProfessionChange={setSelectedProfession}
            onRecordTypeChange={setSelectedRecordType}
            onVisitTypeChange={setSelectedVisitType}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="p-4 pt-0 h-full overflow-y-auto">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-xs">{t.emptyMessage}</p>
              <p className="text-xs mt-1 opacity-75">{t.emptySubMessage}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {(Object.keys(categoryConfig) as CategoryKey[]).map((categoryKey) => {
                const categoryRecords = groupedRecords[categoryKey];
                const categoryCount = getCategoryCount(categoryKey);
                const dates = Object.keys(categoryRecords);
                const isCategoryExpanded = expandedCategories.has(categoryKey);

                if (categoryCount === 0) return null;

                return (
                  <div key={categoryKey}>
                    <RecordCategoryHeader
                      categoryKey={categoryKey}
                      isExpanded={isCategoryExpanded}
                      categoryCount={categoryCount}
                      onToggle={() => toggleCategory(categoryKey)}
                    />

                    {isCategoryExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {dates.map((date) => {
                          const dateRecords = categoryRecords[date];
                          const dateRecordIds = dateRecords.map((r) => r.id);
                          const isAnyRecordSelected = dateRecordIds.some((id) => selectedRecordIds.has(id));
                          const areAllRecordsSelected =
                            dateRecordIds.length > 0 && dateRecordIds.every((id) => selectedRecordIds.has(id));

                          return (
                            <RecordTreeItem
                              key={date}
                              date={date}
                              dateRecords={dateRecords}
                              isAnyRecordSelected={isAnyRecordSelected}
                              areAllRecordsSelected={areAllRecordsSelected}
                              onRecordClick={(recordOrRecords, event) =>
                                handleRecordClick(recordOrRecords, event, onRecordSelect)
                              }
                              sortRecordsByPriority={sortRecordsByPriority}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
