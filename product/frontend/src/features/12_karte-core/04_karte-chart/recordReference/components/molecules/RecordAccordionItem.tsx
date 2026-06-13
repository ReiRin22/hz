import { Badge } from '@/shared/components/atoms/badge';
import { Separator } from '@/shared/components/atoms/separator';
import {
  AccordionContent, AccordionItem, AccordionTrigger,
} from '@/shared/components/atoms/accordion';
import { Copy } from 'lucide-react';
import type { MedicalRecord } from '../../types/recordReference.type';
import { RecordMetadata } from './RecordMetadata';
import { SOAPRecordDisplay } from './SOAPRecordDisplay';
import { VitalSignsDisplay } from './VitalSignsDisplay';
import { recordTypeConfigExtended } from '../../constants/recordTypeConfig';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.recordReference.recordDetailPanel;

interface RecordAccordionItemProps {
  record: MedicalRecord;
  onApplyRecord?: (record: MedicalRecord) => void;
  onSchemaOpen?: () => void;
}

export function RecordAccordionItem({ record, onApplyRecord, onSchemaOpen }: RecordAccordionItemProps) {
  const config = recordTypeConfigExtended[record.type];
  const Icon = config.icon;

  return (
    <AccordionItem value={record.id} className="border rounded-lg shadow-sm">
      <AccordionTrigger className="px-4 py-2.5 hover:no-underline hover:bg-accent/50 rounded-t-lg">
        <div className="flex items-center space-x-3 flex-1">
          <div className={`p-2 rounded-lg text-white shadow-md ${config.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex flex-col items-start flex-1">
            <Badge variant="outline" className="text-sm">
              {config.label}
            </Badge>
            <span className="text-sm text-muted-foreground mt-1">
              {record.date} {record.time}
            </span>
          </div>
          {onApplyRecord && config.isOrder && (
            <div
              role="button"
              tabIndex={0}
              className="hover:bg-blue-700 text-white shadow-sm h-7 text-xs px-3 rounded-md flex items-center cursor-pointer transition-colors medical-primary"
              onClick={(e) => { e.stopPropagation(); onApplyRecord(record); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onApplyRecord(record); } }}
            >
              <Copy className="w-3 h-3 mr-1" />
              {t.applyBtn}
            </div>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 pt-3">
        <div className="space-y-3">
          <RecordMetadata record={record} />
          <Separator />
          {record.vitalSigns && (
            <>
              <VitalSignsDisplay vitalSigns={record.vitalSigns} />
              <Separator />
            </>
          )}
          {record.soapRecord && (
            <>
              <SOAPRecordDisplay soapRecord={record.soapRecord} />
              <Separator />
            </>
          )}
          <div>
            <span className="font-medium text-sm text-muted-foreground block mb-2">{config.detailLabel}:</span>
            <div className="bg-muted/30 p-3 rounded text-sm whitespace-pre-wrap">{record.content}</div>
          </div>
          {record.schema && onSchemaOpen && (
            <>
              <Separator />
              <div>
                <span className="font-medium text-sm text-muted-foreground block mb-2">{t.schemaLabel}:</span>
                <div
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={onSchemaOpen}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSchemaOpen(); }}
                >
                  <img
                    src={record.schema}
                    alt={t.schemaAlt}
                    className="max-w-full rounded-lg border hover:opacity-90 transition-opacity"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
