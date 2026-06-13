'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/atoms/card';
import { Button } from '@/shared/components/atoms/button';
import {
  Accordion,
} from '@/shared/components/atoms/accordion';
import { X, CheckCircle } from 'lucide-react';
import type { MedicalRecord } from '../../types/recordReference.type';
import { RecordAccordionItem } from '../molecules';
import { recordTypeConfigExtended } from '../../constants/recordTypeConfig';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.recordReference.recordDetailPanel;

interface RecordDetailPanelProps {
  record: MedicalRecord | MedicalRecord[] | null | undefined;
  onApplyRecord?: (record: MedicalRecord) => void;
  onClose: () => void;
}

export function RecordDetailPanel({ record, onApplyRecord, onClose }: RecordDetailPanelProps) {
  // TODO: シェーマ拡大モーダルは後続タスクで実装。現時点では setter のみ使用
  const [, setSchemaModalOpen] = useState<boolean>(false);

  const isMultipleRecords = Array.isArray(record);

  if (!record || (isMultipleRecords && record.length === 0)) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 relative overflow-hidden transition-shadow duration-200 hover:shadow-2xl h-full flex flex-col gap-2 flex-1 min-w-0 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" role="status" aria-label={t.waitingTitle}>
        <div className="text-center space-y-3 px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 mb-1">
            <CheckCircle className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-base font-semibold text-gray-700 dark:text-gray-300">{t.waitingTitle}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t.waitingDesc}</p>
          <p className="text-sm text-blue-500 dark:text-blue-400 leading-relaxed">{t.waitingLink}</p>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse" />
            {t.waitingStatus}
          </div>
        </div>
      </Card>
    );
  }

  // 複数記録の場合
  if (isMultipleRecords) {
    const records = record;
    const recordIds = records.map((r) => r.id);

    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 relative overflow-hidden transition-shadow duration-200 hover:shadow-2xl h-full flex flex-col gap-2 flex-1 min-w-0 glass-effect">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full translate-y-10 -translate-x-10" />

        <CardHeader className="pb-0 pt-3 px-4 relative z-10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold medical-text-primary">{t.title}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">{t.closeBtn}</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 relative z-10 flex-1 overflow-y-auto pt-2">
          <Accordion
            type="multiple"
            defaultValue={recordIds}
            className="space-y-2"
            key={recordIds.join(',')}
          >
            {records.map((singleRecord) => (
              <RecordAccordionItem
                key={singleRecord.id}
                record={singleRecord}
                onApplyRecord={onApplyRecord}
              />
            ))}
          </Accordion>
        </CardContent>
      </Card>
    );
  }

  // 単一記録の場合
  const singleRecord = record;

  if (!singleRecord.type || !recordTypeConfigExtended[singleRecord.type]) {
    return (
      <Card className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-2 border-dashed border-red-300 dark:border-red-600" role="alert">
        <div className="text-center p-6 space-y-3">
          <div className="text-red-600 dark:text-red-400">{t.invalidMessage}</div>
          <Button variant="outline" onClick={onClose}>
            {t.closeBtn}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 relative overflow-hidden transition-shadow duration-200 hover:shadow-2xl h-full flex flex-col gap-2 flex-1 min-w-0 glass-effect">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full -translate-y-12 translate-x-12" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full translate-y-10 -translate-x-10" />

      <CardHeader className="pb-0 pt-3 px-4 relative z-10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold medical-text-primary">{t.title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
            <span className="sr-only">{t.closeBtn}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 relative z-10 flex-1 overflow-y-auto pt-2">
        <Accordion
          type="multiple"
          defaultValue={[singleRecord.id]}
          className="space-y-2"
          key={singleRecord.id}
        >
          <RecordAccordionItem
            record={singleRecord}
            onApplyRecord={onApplyRecord}
            onSchemaOpen={() => setSchemaModalOpen(true)}
          />
        </Accordion>
      </CardContent>
    </Card>
  );
}
