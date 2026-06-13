'use client';

import { useState, useEffect } from 'react';
import { Button } from '@shared/components/atoms/button';
import { Input } from '@shared/components/atoms/input';
import { Label } from '@shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/atoms/select';
import { Calendar } from '@shared/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/components/atoms/popover';
import { Checkbox } from '@shared/components/atoms/checkbox';
import { RadioGroup, RadioGroupItem } from '@shared/components/atoms/radio-group';
import { CalendarIcon, Search, X, ChevronDown, ChevronUp, User } from 'lucide-react';
import type { OrderStatus, OrderType, PatientLocation, Department } from '../../types/deptInstruction.viewmodel';
import type { DateRange } from 'react-day-picker';
import { i18n } from '@/shared/i18n';

const { deptInstruction: di } = i18n;

interface PatientLookupResult {
  patientName: string;
}

interface SearchCriteriaProps {
  onSearch: (criteria: SearchFilters) => void;
  onClear: () => void;
  availableOrderTypes?: string[];
  onPatientLookup?: (patientId: string) => PatientLookupResult | null;
}

export interface StatusFilter {
  status: string;
  completion: 'incomplete' | 'complete';
}

export interface SearchFilters {
  startDate: Date;
  endDate: Date;
  locationFilter: PatientLocation | 'all';
  department: Department | 'all';
  orderType: OrderType | 'all';
  labTestLocation: string;
  imageTestType: string;
  physiologicalTestType: string;
  selectedStatuses: StatusFilter[];
  statusCompletion: 'all' | 'incomplete' | 'complete';
  patientId: string;
  patientName: string;
  attendingDoctor: string;
  ward: string;
}

export function SearchCriteria({ onSearch, onClear, availableOrderTypes, onPatientLookup }: SearchCriteriaProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  useEffect(() => {
    const today = new Date();
    setDateRange({ from: today, to: today });
  }, []);
  const [locationFilter, setLocationFilter] = useState<PatientLocation | 'all'>('all');
  const [department, setDepartment] = useState<Department | 'all'>('all');
  const [orderType, setOrderType] = useState<OrderType | 'all'>('all');
  const [labTestLocation, setLabTestLocation] = useState<string>('all');
  const [imageTestType, setImageTestType] = useState<string>('all');
  const [physiologicalTestType, setPhysiologicalTestType] = useState<string>('all');
  const [selectedStatuses, setSelectedStatuses] = useState<StatusFilter[]>([]);
  const [statusCompletion, setStatusCompletion] = useState<'all' | 'incomplete' | 'complete'>('all');
  const [patientId, setPatientId] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [patientNotFound, setPatientNotFound] = useState<boolean>(false);
  const [attendingDoctor, setAttendingDoctor] = useState<string>('');
  const [ward, setWard] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(true);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const sc = di.searchCriteria;

  const availableStatuses: OrderStatus[] = ['received', 'accepted', 'started', 'collected', 'specimen_received', 'awaiting_result', 'implemented', 'result_entered'];

  const handleStatusToggle = (status: OrderStatus) => {
    setSelectedStatuses(prev =>
      prev.some(s => s.status === status)
        ? prev.filter(s => s.status !== status)
        : [...prev, { status, completion: 'incomplete' }]
    );
  };

  const handleCompletionChange = (status: OrderStatus, completion: 'incomplete' | 'complete') => {
    setSelectedStatuses(prev =>
      prev.map(s => s.status === status ? { ...s, completion } : s)
    );
  };

  const getDateRangeText = () => {
    if (!dateRange?.from) return sc.placeholders.dateSelect;
    if (!dateRange.to) return dateRange.from.toLocaleDateString('ja-JP');
    if (dateRange.from.getTime() === dateRange.to.getTime()) return dateRange.from.toLocaleDateString('ja-JP');
    return `${dateRange.from.toLocaleDateString('ja-JP')} 〜 ${dateRange.to.toLocaleDateString('ja-JP')}`;
  };

  const getFilterSummary = () => {
    const summary: string[] = [];
    summary.push(sc.filterSummary.period(getDateRangeText()));
    if (locationFilter !== 'all') {
      const label = di.patientLocationLabels[locationFilter as keyof typeof di.patientLocationLabels] ?? locationFilter;
      summary.push(sc.filterSummary.location(label));
    }
    if (department !== 'all') {
      const label = di.departmentLabels[department as keyof typeof di.departmentLabels] ?? department;
      summary.push(sc.filterSummary.dept(label));
    }
    if (orderType !== 'all') {
      const label = di.orderTypeLabels[orderType as keyof typeof di.orderTypeLabels] ?? orderType;
      summary.push(sc.filterSummary.orderType(label));
    }
    if (statusCompletion === 'incomplete') summary.push(sc.filterSummary.reception(sc.options.incomplete));
    else if (statusCompletion === 'complete') summary.push(sc.filterSummary.reception(sc.options.complete));
    if (attendingDoctor.trim()) summary.push(sc.filterSummary.doctor(attendingDoctor));
    if (ward !== 'all') summary.push(sc.filterSummary.ward(ward));
    if (selectedStatuses.length > 0) {
      const labels = selectedStatuses.map(s => di.orderStatusLabels[s.status as keyof typeof di.orderStatusLabels] ?? s.status).join(', ');
      summary.push(sc.filterSummary.status(labels));
    }
    if (patientId.trim()) summary.push(sc.filterSummary.patientId(patientId));
    if (patientName.trim()) summary.push(sc.filterSummary.patientName(patientName));
    return summary.join(' / ');
  };

  const handleSearch = () => {
    onSearch({
      startDate: dateRange?.from || new Date(),
      endDate: dateRange?.to || new Date(),
      locationFilter,
      department,
      orderType,
      labTestLocation,
      imageTestType,
      physiologicalTestType,
      selectedStatuses,
      statusCompletion,
      patientId,
      patientName,
      attendingDoctor,
      ward
    });
  };

  const today = new Date();

  const handleClear = () => {
    setDateRange({ from: today, to: today });
    setLocationFilter('all');
    setDepartment('all');
    setOrderType('all');
    setLabTestLocation('all');
    setImageTestType('all');
    setPhysiologicalTestType('all');
    setSelectedStatuses([]);
    setStatusCompletion('all');
    setPatientId('');
    setPatientName('');
    setPatientNotFound(false);
    setAttendingDoctor('');
    setWard('all');
    onClear();
  };

  const handlePatientIdChange = (value: string) => {
    setPatientId(value);
    setPatientNotFound(false);
    if (value.trim()) {
      const patient = onPatientLookup ? onPatientLookup(value.trim()) : null;
      if (patient) {
        setPatientName(patient.patientName);
        setPatientNotFound(false);
      } else {
        setPatientName('');
        setPatientNotFound(true);
      }
    } else {
      setPatientName('');
      setPatientNotFound(false);
    }
  };

  const defaultOrderTypes: OrderType[] = ['NUTRITION','SPECIMEN_TEST','PHYSIOLOGICAL_TEST','ENDOSCOPY','IMAGING','PROCEDURE','INJECTION','MEDICATION','PRESCRIPTION','MEDICATION_GUIDANCE','REHABILITATION','RADIOLOGY','NURSING','PATHOLOGY','BACTERIA','DIALYSIS','GENERIC'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? sc.collapseAria : sc.expandAria}
        className="flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 -m-2 p-2 rounded transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExpanded(!isExpanded); } }}
      >
        <div className="flex items-center gap-2 shrink-0">
          <h3 className="font-medium text-gray-700">{sc.title}</h3>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
        {!isExpanded && (
          <div className="text-sm text-gray-500 flex-1 truncate">
            {getFilterSummary().split(' / ').map((item, index) => {
              const [label, ...rest] = item.split(': ');
              const value = rest.join(': ');
              return (
                <span key={index}>
                  {index > 0 && ' / '}
                  <strong className="font-semibold">{label}:</strong> {value}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {isExpanded && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mb-4">
            {/* 日付 */}
            <div className="space-y-2">
              <Label>{sc.labels.date}</Label>
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {getDateRangeText()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start" sideOffset={5}>
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    initialFocus
                    onClear={() => {
                      const t = new Date(); t.setHours(0, 0, 0, 0);
                      setDateRange({ from: t, to: t });
                    }}
                    onToday={() => {
                      const t = new Date(); t.setHours(0, 0, 0, 0);
                      setDateRange({ from: t, to: t });
                      setDatePopoverOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 入外区分 */}
            <div className="space-y-2">
              <Label>{sc.labels.location}</Label>
              <Select value={locationFilter} onValueChange={(v) => setLocationFilter(v as PatientLocation | 'all')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{sc.options.all}</SelectItem>
                  <SelectItem value="OUTPATIENT">{di.patientLocationLabels.OUTPATIENT}</SelectItem>
                  <SelectItem value="INPATIENT">{di.patientLocationLabels.INPATIENT}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 診療科 */}
            <div className="space-y-2">
              <Label>{sc.labels.department}</Label>
              <Select value={department} onValueChange={(v) => setDepartment(v as Department | 'all')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{sc.options.all}</SelectItem>
                  {(Object.entries(di.departmentLabels) as [string, string][]).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* オーダー種 */}
            <div className="space-y-2">
              <Label>{sc.labels.orderType}</Label>
              <div className="flex items-center gap-2">
                <Select value={orderType} onValueChange={(v) => setOrderType(v as OrderType | 'all')} className={orderType === 'SPECIMEN_TEST' ? 'flex-1' : ''}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{sc.options.all}</SelectItem>
                    {(availableOrderTypes ?? defaultOrderTypes).map((type) => (
                      <SelectItem key={type} value={type}>
                        {di.orderTypeLabels[type as keyof typeof di.orderTypeLabels] ?? type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {orderType === 'SPECIMEN_TEST' && (
                  <Select value={labTestLocation} onValueChange={setLabTestLocation} className="flex-1">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{sc.options.all}</SelectItem>
                      {sc.labTestLocations.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {orderType === 'IMAGING' && (
                  <Select value={imageTestType} onValueChange={setImageTestType} className="flex-1">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{sc.options.all}</SelectItem>
                      {sc.imageTestTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {orderType === 'PHYSIOLOGICAL_TEST' && (
                  <Select value={physiologicalTestType} onValueChange={setPhysiologicalTestType} className="flex-1">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{sc.options.all}</SelectItem>
                      {sc.physiologicalTestTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* 受付未/済 */}
            <div className="space-y-2">
              <Label>{sc.labels.statusCompletion}</Label>
              <RadioGroup
                value={statusCompletion}
                onValueChange={(value) => setStatusCompletion(value as 'all' | 'incomplete' | 'complete')}
                className="flex gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="completion-all" />
                  <label htmlFor="completion-all" className="cursor-pointer select-none">{sc.options.all}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="incomplete" id="completion-incomplete" />
                  <label htmlFor="completion-incomplete" className="cursor-pointer select-none">{sc.options.incomplete}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="complete" id="completion-complete" />
                  <label htmlFor="completion-complete" className="cursor-pointer select-none">{sc.options.complete}</label>
                </div>
              </RadioGroup>
            </div>

            {/* 指示医 */}
            <div className="space-y-2">
              <Label>{sc.labels.attendingDoctor}</Label>
              <Input
                placeholder={sc.placeholders.doctorInput}
                value={attendingDoctor}
                onChange={(e) => setAttendingDoctor(e.target.value)}
              />
            </div>

            {/* 患者ID */}
            <div className="space-y-2">
              <Label>{sc.labels.patientId}</Label>
              <Input
                placeholder={sc.placeholders.patientIdInput}
                value={patientId}
                onChange={(e) => handlePatientIdChange(e.target.value)}
                className={patientNotFound ? 'border-red-500' : ''}
              />
              {patientNotFound && (
                <p className="text-xs text-red-500">{sc.options.patientNotFound}</p>
              )}
            </div>

            {/* 患者氏名 */}
            <div className="space-y-2">
              <Label>{sc.labels.patientName}</Label>
              <div className="flex gap-2">
                <Input
                  placeholder={sc.placeholders.patientNameAuto}
                  value={patientName}
                  readOnly
                  className="flex-1 bg-gray-50 pointer-events-none"
                />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={sc.patientSearchAria}
                  onClick={handleSearch}
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {/* 病棟 */}
            <div className="space-y-2">
              <Label>{sc.labels.ward}</Label>
              <Select value={ward} onValueChange={setWard}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{sc.options.all}</SelectItem>
                  {sc.wards.map((w) => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ステータス */}
            <div className="space-y-2 md:col-span-2 lg:col-span-2">
              <Label>{sc.labels.status}</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-1.5">
                {availableStatuses.map(status => {
                  const selectedStatus = selectedStatuses.find(s => s.status === status);
                  const isChecked = !!selectedStatus;
                  const statusLabel = di.orderStatusLabels[status as keyof typeof di.orderStatusLabels] ?? status;
                  return (
                    <div key={status} className="flex items-center gap-1.5 min-w-0">
                      <Checkbox
                        id={`status-${status}`}
                        checked={isChecked}
                        onCheckedChange={() => handleStatusToggle(status)}
                        className="shrink-0 h-4 w-4"
                      />
                      <label
                        htmlFor={`status-${status}`}
                        className="cursor-pointer select-none text-sm whitespace-nowrap shrink-0"
                      >
                        {statusLabel}
                      </label>
                      <div className="flex border border-gray-300 rounded overflow-hidden shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCompletionChange(status, 'incomplete')}
                          disabled={!isChecked}
                          className={`px-2 py-1 text-xs font-medium transition-colors ${
                            isChecked && selectedStatus.completion === 'incomplete'
                              ? 'bg-blue-500 text-white'
                              : isChecked
                              ? 'bg-white text-gray-700 hover:bg-gray-50'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {sc.options.incomplete}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCompletionChange(status, 'complete')}
                          disabled={!isChecked}
                          className={`px-2 py-1 text-xs font-medium border-l border-gray-300 transition-colors ${
                            isChecked && selectedStatus.completion === 'complete'
                              ? 'bg-blue-500 text-white'
                              : isChecked
                              ? 'bg-white text-gray-700 hover:bg-gray-50'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {sc.options.complete}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClear} size="sm" className="gap-2">
              <X className="h-4 w-4" />
              {sc.buttons.clear}
            </Button>
            <Button onClick={handleSearch} size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              {sc.buttons.search}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
