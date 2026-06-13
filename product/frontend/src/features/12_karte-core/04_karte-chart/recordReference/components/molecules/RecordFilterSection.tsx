import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/shared/components/atoms/select';
import { Label } from '@/shared/components/atoms/label';
import { Button } from '@/shared/components/atoms/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { Calendar } from '@/shared/components/atoms/calendar';
import { Separator } from '@/shared/components/atoms/separator';
import {
  Stethoscope, Heart, FlaskConical, ImageIcon, Activity, FileText,
  Building2, Calendar as CalendarIcon, X,
} from 'lucide-react';
import { recordTypeConfig } from '../../constants/recordTypeConfig';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.recordReference.recordFilterSection;

const PROFESSION_ICONS: Record<string, React.ReactNode> = {
  '医師':       <Stethoscope className="w-3 h-3" />,
  '看護師':     <Heart       className="w-3 h-3" />,
  '検査技師':   <FlaskConical className="w-3 h-3" />,
  '放射線技師': <ImageIcon   className="w-3 h-3" />,
  'リハビリ':   <Activity    className="w-3 h-3" />,
};

interface RecordFilterSectionProps {
  selectedProfession: string;
  selectedRecordType: string;
  selectedVisitType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onProfessionChange: (value: string) => void;
  onRecordTypeChange: (value: string) => void;
  onVisitTypeChange: (value: string) => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

export function RecordFilterSection({
  selectedProfession,
  selectedRecordType,
  selectedVisitType,
  startDate,
  endDate,
  onProfessionChange,
  onRecordTypeChange,
  onVisitTypeChange,
  onStartDateChange,
  onEndDateChange,
}: RecordFilterSectionProps) {
  return (
    <div className="space-y-2">
      {/* 2列グリッドレイアウトのフィルタ */}
      <div className="grid grid-cols-2 gap-2">
        {/* 職種フィルタ */}
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium min-w-[40px]">{t.professionLabel}</Label>
          <Select value={selectedProfession} onValueChange={onProfessionChange}>
            <SelectTrigger className="h-9 text-xs flex-1">
              <SelectValue placeholder={t.professionLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                <div className="flex items-center space-x-1.5">
                  <Stethoscope className="w-3 h-3" />
                  <span>{t.allOption}</span>
                </div>
              </SelectItem>
              <Separator className="my-1" />
              {Object.entries(PROFESSION_ICONS).map(([profession, icon]) => (
                <SelectItem key={profession} value={profession} className="text-xs">
                  <div className="flex items-center space-x-1.5">
                    {icon}
                    <span>{profession}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 入外フィルタ */}
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium min-w-[40px]">{t.visitTypeLabel}</Label>
          <Select value={selectedVisitType} onValueChange={onVisitTypeChange}>
            <SelectTrigger className="h-9 text-xs flex-1">
              <SelectValue placeholder={t.visitTypeLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                <div className="flex items-center space-x-1.5">
                  <FileText className="w-3 h-3" />
                  <span>{t.allOption}</span>
                </div>
              </SelectItem>
              <Separator className="my-1" />
              <SelectItem value="inpatient" className="text-xs">
                <div className="flex items-center space-x-1.5">
                  <Building2 className="w-3 h-3" />
                  <span>{t.inpatient}</span>
                </div>
              </SelectItem>
              <SelectItem value="outpatient" className="text-xs">
                <div className="flex items-center space-x-1.5">
                  <Stethoscope className="w-3 h-3" />
                  <span>{t.outpatient}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 記録種別フィルタ */}
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium min-w-[40px]">{t.recordTypeLabel}</Label>
          <Select value={selectedRecordType} onValueChange={onRecordTypeChange}>
            <SelectTrigger className="h-9 text-xs flex-1">
              <SelectValue placeholder={t.recordTypeLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                <div className="flex items-center space-x-1.5">
                  <FileText className="w-3 h-3" />
                  <span>{t.allOption}</span>
                </div>
              </SelectItem>
              <Separator className="my-1" />
              {(Object.keys(recordTypeConfig) as Array<keyof typeof recordTypeConfig>).map((type) => {
                const config = recordTypeConfig[type];
                const Icon = config.icon;
                return (
                  <SelectItem key={type} value={type} className="text-xs">
                    <div className="flex items-center space-x-1.5">
                      <Icon className="w-3 h-3" />
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 期間フィルタ */}
      <div className="flex items-center gap-2">
        <Label className="text-xs font-medium min-w-[40px]">{t.periodLabel}</Label>
        <div className="flex items-center gap-1.5 flex-1">
          {/* 開始日 */}
          <div className="relative flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`h-9 text-xs w-full justify-start font-normal ${startDate ? 'pr-8' : ''}`}>
                  <CalendarIcon className="w-3 h-3 mr-1.5" />
                  {startDate ? startDate.toLocaleDateString('ja-JP') : t.startDatePlaceholder}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={onStartDateChange} />
              </PopoverContent>
            </Popover>
            {startDate && (
              <X
                role="button"
                tabIndex={0}
                aria-label={t.clearStartDate}
                className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer z-10"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onStartDateChange(undefined); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onStartDateChange(undefined); } }}
              />
            )}
          </div>

          <span className="text-xs text-muted-foreground">{t.dateSeparator}</span>

          {/* 終了日 */}
          <div className="relative flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`h-9 text-xs w-full justify-start font-normal ${endDate ? 'pr-8' : ''}`}>
                  <CalendarIcon className="w-3 h-3 mr-1.5" />
                  {endDate ? endDate.toLocaleDateString('ja-JP') : t.endDatePlaceholder}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={onEndDateChange} />
              </PopoverContent>
            </Popover>
            {endDate && (
              <X
                role="button"
                tabIndex={0}
                aria-label={t.clearEndDate}
                className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer z-10"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEndDateChange(undefined); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEndDateChange(undefined); } }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
