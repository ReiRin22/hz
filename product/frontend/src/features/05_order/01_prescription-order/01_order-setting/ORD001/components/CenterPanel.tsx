import { useState, useEffect } from 'react';
import { Calendar, CalendarDays, Pill, Clock, FileText, Plus, RefreshCw, Edit3, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Switch } from '@/shared/components/atoms/switch';
import { Badge } from '@/shared/components/atoms/badge';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/atoms/tabs';
import { RadioGroup, RadioGroupItem } from '@/shared/components/atoms/radio-group';

interface OrderItem {
  id: string;
  name: string;
  dosage?: string;
  usage?: string;
  type?: 'prescription' | 'injection' | 'lab';
  source?: 'history' | 'set' | 'search' | 'frequent';
  groupItems?: OrderItem[]; // グループの場合の子項目
  units?: string[]; // 利用可能な単位のリスト
  routeType?: '内服' | '外用' | '注射' | '注入'; // 用法種類
  route?: string; // 投与経路（薬剤マスタから取得）
}

interface OrderDetail extends OrderItem {
  route?: string;
  applicationSite?: string; // 点眼・点耳・点鼻の場合の部位（左・右・両）
  period?: string;
  startDate?: string;
  isAsNeeded?: boolean;
  priority?: string;
  notes?: string;
  quantity?: string;
  frequency?: string;
  timing?: string;
  // リフィル関連
  isRefillEligible?: boolean;
  refillCount?: number;
  isRefillProhibited?: boolean;
  refillProhibitionReason?: string;
  // 調剤指示
  isOnePackage?: boolean;
  isCrushed?: boolean;
  isMixed?: boolean;
  // 単位情報
  selectedUnit?: string;
  // 後発医薬品変更不可
  noGenericSubstitution?: boolean;
  // 処方区分
  prescriptionType?: '院外' | '院内';
  // 用法詳細情報（編集時の復元用）
  usageDetails?: {
    usageType?: 'meal' | 'interval' | 'time' | 'breastfeeding' | 'asneeded' | 'uneven';
    // 標準用法（食事タイミング型）
    mealFrequency?: string;
    mealTiming?: string;
    // 不均等用法
    unevenFrequency?: string;
    unevenTiming?: string;
    unevenDoses?: {
      wakeup: string;
      breakfast: string;
      lunch: string;
      dinner: string;
      bedtime: string;
    };
    // 時間間隔型
    intervalType?: string;
    // 時刻指定型
    timesPerDay?: string;
    timeSlots?: string[];
    // 哺乳時型
    breastfeedingFrequency?: string;
    // 頓用
    asNeededCondition?: string;
    maxTimesPerDay?: string;
    // 外用薬用法
    topicalUsageType?: 'lifestyle' | 'frequency' | 'interval' | 'asneeded';
    topicalLifestyleFrequency?: string;
    topicalLifestyleTiming?: string;
    topicalFrequency?: string;
    topicalIntervalType?: string;
    topicalAsNeededCondition?: string;
    topicalMaxTimesPerDay?: string;
    // 投与スケジュール
    scheduleType?: 'none' | 'dayinterval' | 'weekday' | 'datespecific' | 'periodcount';
    scheduleWeekdays?: string[];
    intervalDays?: string;
    restDays?: string;
    dateSpecificType?: 'monthly' | 'absolute';
    monthlyDates?: string[];
    absoluteDates?: string[];
    periodType?: 'week' | 'month' | 'year';
    timesInPeriod?: string;
  };
}

interface HistoryRecord {
  date: string;
  department: string;
  orders: OrderItem[];
}

interface CenterPanelProps {
  selectedDrug: OrderItem | null;
  onConfirmDrug: (orderDetail: OrderDetail) => void;
  onClearSelection: () => void;
  selectedHistory?: HistoryRecord | null;
  onSelectHistory?: (history: HistoryRecord) => void;
  onClearHistorySelection?: () => void;
  onAddMultipleHistoryToConfirmed?: (items: OrderItem[]) => void;
  prescriptionType?: '院外' | '院内' | '定期' | '臨時'; // 処方区分
}

export function CenterPanel({ 
  selectedDrug, 
  onConfirmDrug, 
  onClearSelection,
  selectedHistory,
  onSelectHistory,
  onClearHistorySelection,
  onAddMultipleHistoryToConfirmed,
  prescriptionType
}: CenterPanelProps) {
  const [quantityValue, setQuantityValue] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('');
  
  // 用法タイプ（標準用法）
  const [usageType, setUsageType] = useState<'meal' | 'interval' | 'time' | 'breastfeeding' | 'asneeded' | 'uneven'>('meal');
  
  // スケジュール用法（オプション：標準用法に追加）
  const [scheduleType, setScheduleType] = useState<'none' | 'dayinterval' | 'weekday' | 'datespecific' | 'periodcount'>('none');
  
  // 食事タイミング型（統合版）
  const [mealTiming, setMealTiming] = useState('');
  const [mealFrequency, setMealFrequency] = useState('1日1回');
  
  // 時間間隔型
  const [intervalType, setIntervalType] = useState('');
  
  // 時刻指定型
  const [timesPerDay, setTimesPerDay] = useState('3');
  const [timeSlots, setTimeSlots] = useState<string[]>(['08:00', '12:00', '18:00']);
  
  // 哺乳時型
  const [breastfeedingFrequency, setBreastfeedingFrequency] = useState('');
  
  // 頓用
  const [isAsNeeded, setIsAsNeeded] = useState(false);
  const [asNeededCondition, setAsNeededCondition] = useState('');
  const [maxTimesPerDay, setMaxTimesPerDay] = useState('');
  const [customPeriod, setCustomPeriod] = useState('');
  
  // 不均等用法型
  const [unevenFrequency, setUnevenFrequency] = useState('');
  const [unevenTiming, setUnevenTiming] = useState('');
  const [unevenDoses, setUnevenDoses] = useState({
    wakeup: '',
    breakfast: '',
    lunch: '',
    dinner: '',
    bedtime: ''
  });
  
  // 曜日指定型
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [weekdayTiming, setWeekdayTiming] = useState('');
  
  // スケジュール用法：日数間隔指定
  const [intervalDays, setIntervalDays] = useState('1'); // 連続服用日数
  const [restDays, setRestDays] = useState('1'); // 連続休薬日数
  
  // スケジュール用法：曜日指定
  const [scheduleWeekdays, setScheduleWeekdays] = useState<string[]>([]);
  
  // スケジュール用法：日付指定
  const [dateSpecificType, setDateSpecificType] = useState<'monthly' | 'absolute'>('monthly');
  const [monthlyDates, setMonthlyDates] = useState<number[]>([]); // 例：[10, 20, 30]
  const [absoluteDates, setAbsoluteDates] = useState<string[]>([]); // 例：['12/10', '12/20', '1/15']
  
  // スケジュール用法：指定期間内回数指定
  const [periodType, setPeriodType] = useState<'year' | 'month' | 'week'>('week');
  const [timesInPeriod, setTimesInPeriod] = useState('2'); // 回数
  
  // 日間隔型
  const [dayInterval, setDayInterval] = useState('');
  const [dayIntervalTiming, setDayIntervalTiming] = useState('');
  
  // 日付指定型
  const [specificDates, setSpecificDates] = useState<string[]>([]);
  
  // 期間内回数指定型
  const [periodDays, setPeriodDays] = useState('');
  const [periodCount, setPeriodCount] = useState('');
  
  // 外用薬用法
  type TopicalSiteWithSide = { site: string; side: 'なし' | '左' | '右' | '両' };
  const [topicalUsageType, setTopicalUsageType] = useState<'lifestyle' | 'frequency' | 'interval' | 'asneeded'>('frequency');
  const [topicalSite, setTopicalSite] = useState<TopicalSiteWithSide[]>([]);
  const [topicalLifestyleFrequency, setTopicalLifestyleFrequency] = useState('１日１回');
  const [topicalLifestyleTiming, setTopicalLifestyleTiming] = useState('');
  const [topicalFrequency, setTopicalFrequency] = useState('');
  const [topicalTiming, setTopicalTiming] = useState('');
  const [topicalIntervalType, setTopicalIntervalType] = useState('');
  
  // 外用薬頓用
  const [topicalAsNeededCondition, setTopicalAsNeededCondition] = useState('');
  const [topicalMaxTimesPerDay, setTopicalMaxTimesPerDay] = useState('');
  
  // 外用薬部位選択の折り畳み状態
  const [isSiteSelectionExpanded, setIsSiteSelectionExpanded] = useState(true);
  
  // その他
  const [period, setPeriod] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  
  // リフィル処方関連
  const [isRefillEligible, setIsRefillEligible] = useState(false);
  const [refillCount, setRefillCount] = useState('2');
  
  // 調剤指示
  const [isPackaged, setIsPackaged] = useState(false);
  const [isPowdered, setIsPowdered] = useState(false);
  const [isMixed, setIsMixed] = useState(false);
  
  // 後発医薬品変更不可
  const [noGenericSubstitution, setNoGenericSubstitution] = useState(false);
  
  // 履歴オーダー編集用の状態
  const [editingHistoryOrder, setEditingHistoryOrder] = useState<OrderItem | null>(null); // 編集中の履歴オーダー
  
  // 現在編集中の薬剤（薬剤タブまたは履歴タブ）
  const currentEditingDrug = editingHistoryOrder || selectedDrug;

  const weekdayOptions = [
    { value: '月', label: '月' },
    { value: '火', label: '火' },
    { value: '水', label: '水' },
    { value: '木', label: '木' },
    { value: '金', label: '金' },
    { value: '土', label: '土' },
    { value: '日', label: '日' },
  ];

  // 外用薬の部位オプション
  const topicalSiteOptions = [
    '全身', '頭皮', '頭部', '頭頂部', '後頭部', 'ひたい', '顔', 'まゆ', 'まゆのまわり', 'まぶた', 
    '眼', '目のまわり', '頬', '鼻', '鼻のまわり', '鼻の下', '鼻腔内', '耳', '耳たぶ', '耳のうしろ', 
    '耳のまわり', '耳の中', '口', '口のまわり', '口唇', '口腔内', '口腔内ほほの内側', '口腔内上あご部', 
    '上歯茎部', '下歯茎部', '舌', '舌の裏側', '喉の奥', '扁桃腺部', '下あご', '首', 'うなじ', '肩', 
    '上肢', '腕', '上腕', '前腕', 'ひじ', '手', '手の甲', '手のひら', '手の指', '手の指の間', 
    '手の爪', '手足', '体幹部', '背中', '上背部', '脇の下', '全胸部', '乳房', '乳房まわり', '乳首', 
    '上腹部', '下腹部', 'へそ', 'へそのまわり', '腰', '臀部', '陰のう', '陰部', '股間部', '肛門部', 
    '肛門周囲', '下肢', 'ふともも', 'ふともも後ろ', 'ふとももとすね', '膝', '膝のうら', 'すね', 
    'ふくらはぎ', 'くるぶし', 'かかと', '足', '足の裏', '足の甲', '足のゆび', '足のゆびの間', 
    '足の爪', 'かゆい所', 'カサカサした所', 'じくじくした所', 'ひどい所', '褥瘡部', '発赤部', 
    '発疹部', 'ストマ部', 'カテ挿入部', '患部',
  ];

  // 外用薬のタイミングオプション（頻度に応じて絞り込み）
  const getTopicalTimingOptions = () => {
    switch (topicalFrequency) {
      case '1日1回':
        return [
          '朝', '夕', '就寝前', '起床時',
          '入浴後', '洗顔後', '洗髪後', '清拭後',
          '朝食後', '昼食後', '夕食後',
        ];
      case '1日2回':
        return [
          '朝夕', '起床時・就寝前',
          '入浴後', '洗顔後',
          '朝食後・夕食後',
        ];
      case '1日3回':
        return [
          '朝昼夕', '朝昼夕食後', '朝昼夕食前',
          '起床時・昼・就寝前',
        ];
      case '1日4回':
        return [
          '朝昼夕・就寝前', '起床時・朝昼夕',
          '朝食後・昼食後・夕食後・就寝前',
        ];
      case '1日5回':
        return [
          '起床時・朝昼夕・就寝前',
          '朝食前後・昼食前後・夕食後',
        ];
      case '1日6回':
        return [
          '起床時・朝食後・昼食前後・夕食後・就寝前',
          '4時間ごと',
        ];
      default:
        return [
          '朝', '夕', '朝夕', '朝昼夕', '就寝前', '起床時',
          '入浴後', '洗顔後', '洗髪後', '清拭後',
          '食前', '食後', '朝食後', '昼食後', '夕食後',
        ];
    }
  };

  // 外用薬のタイミング指定型タイミングオプション（頻度に応じて絞り込み）
  const getTopicalLifestyleTimingOptions = () => {
    switch (topicalLifestyleFrequency) {
      case '１日１回':
        return [
          '起床時', '朝', '昼', '夕', '就寝時',
        ];
      case '１日２回':
        return [
          '朝夕', '午前と午後', '朝と就寝前',
        ];
      case '１日３回':
        return [
          '朝昼夕',
        ];
      case '１日４回':
        return [
          '朝昼夕と就寝前',
        ];
      default:
        return ['起床時', '朝', '昼', '夕', '就寝時'];
    }
  };

  // 食事ベース型のタイミングオプションを頻度に応じて取得
  const getMealTimingOptions = () => {
    switch (mealFrequency) {
      case '1日1回':
        return [
          '起床時', '朝食前', '朝食直前', '朝食直後', '朝食後', '朝食２時間後', '朝食事中',
          '昼食前', '昼食直前', '昼食直後', '昼食後', '昼食２時間後', '昼食事中',
          '夕食前', '夕食直前', '夕食直後', '夕食後', '夕食２時間後', '夕食事中',
          '就寝前', '空腹時',
        ];
      case '1日2回':
        return [
          '12時間ごと',
          '朝昼食前', '朝昼食直前', '朝昼食後', '朝昼食事中',
          '朝夕食前', '朝夕食直前', '朝夕食直後', '朝夕食後', '朝夕食２時間後', '朝夕食事中',
          '朝食前と就寝前', '朝食後と就寝前',
          '昼夕食前', '昼夕食直前', '昼夕食後', '昼夕食事中',
          '昼食前と就寝前', '昼食後と就寝前',
          '夕食前と就寝前', '夕食後と就寝前',
        ];
      case '1日3回':
        return [
          '8時間ごと',
          '朝昼夕食前', '朝昼夕食直前', '朝昼夕食直後', '朝昼夕食後', '朝昼夕食２時間後', '朝昼夕食事中',
          '朝昼食前と就寝前', '朝昼食後と就寝前',
          '朝夕食前と就寝前', '朝夕食後と就寝前',
          '昼夕食前と就寝前', '昼夕食後と就寝前',
        ];
      case '1日4回':
        return [
          '6時間ごと',
          '朝昼夕食前と就寝前',
          '朝昼夕食後と就寝前',
        ];
      case '1日5回':
        return [
          '朝昼夕食後、１５時、就寝前',
        ];
      case '1日6回':
        return [
          '4時間ごと',
        ];
      default:
        return ['朝食後', '昼食後', '夕食後'];
    }
  };
  
  // 頓用の症状・条件オプション
  const getAsNeededConditionOptions = () => {
    return [
      '疼痛時', '頭痛時', '歯痛時', '胸痛時', '腹痛時', '腰痛時', '関節痛時',
      '喘鳴時', '喘息発作時', '喉がゴロゴロする時', 'しゃっくり時', '咳込時',
      '血圧上昇時', '血糖上昇時', '便秘時', 'お腹がゴロゴロする時', '下痢時',
      '嘔吐時', '吐き気時', '空腹時', '出血時', '乏尿時', '多尿時', 'むくみ時',
      '不眠時', '不安時', '不穏時', 'いらいら時', 'けいれん時', 'めまい時',
      '疲労時', '発熱時', '悪寒時', 'かゆい時', '発疹時', '発作時', '症状ある時',
      '検査前', '検査時', '検査後', '起床時', '入浴前', '食事前', '食事後',
      '就寝前', '外出時', '哺乳時', '必要時', '適宜',
    ];
  };

  // 外用薬の頓用症状・条件オプション
  const getTopicalAsNeededConditionOptions = () => {
    return [
      '疼痛時', '頭痛時', '歯痛時', '胸痛時', '腹痛時', '腰痛時', '関節痛時',
      '喘鳴時', '喘息発作時', '喉がゴロゴロする時', 'しゃっくり時', '咳込時',
      '血圧上昇時', '血糖上昇時', '便秘時', 'お腹がゴロゴロする時', '下痢時',
      '嘔吐時', '吐き気時', '空腹時', '出血時', '乏尿時', '多尿時', 'むくみ時',
      '不眠時', '不安時', '不穏時', 'いらいら時', 'けいれん時', 'めまい時',
      '疲労時', '発熱時', '悪寒時', 'かゆい時', '発疹時', '発作時', '症状ある時',
      '検査前', '検査時', '検査後', '起床時', '入浴前', '食事前', '食事後',
      '就寝前', '外出時', '哺乳時', '必要時', '適宜',
    ];
  };

  const toggleWeekday = (day: string) => {
    setSelectedWeekdays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };
  
  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, '12:00']);
  };
  
  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };
  
  const updateTimeSlot = (index: number, value: string) => {
    const newSlots = [...timeSlots];
    newSlots[index] = value;
    setTimeSlots(newSlots);
  };

  // 時刻の選択肢を生成（15分刻み）
  const generateTimeOptions = () => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of ['00', '15', '30', '45']) {
        const h = hour.toString().padStart(2, '0');
        options.push(`${h}:${minute}`);
      }
    }
    return options;
  };

  // 薬剤が選択されたときにデフォルト値を設定
  useEffect(() => {
    if (currentEditingDrug) {
      // 編集モードの場合は既存値を設定、新規の場合はデフォルト値を設定
      const isEditMode = currentEditingDrug.quantity && currentEditingDrug.frequency; // 編集モードの判定
      
      if (isEditMode) {
        // 編集モード：既存値をセット
        const [qtyValue, qtyUnit] = (currentEditingDrug.quantity || '1 錠').split(' ');
        setQuantityValue(qtyValue || '1');
        setQuantityUnit(qtyUnit || '錠');
        
        setPeriod(currentEditingDrug.period || '7日分');
        setStartDate(currentEditingDrug.startDate || new Date().toISOString().split('T')[0]);
        setNotes(currentEditingDrug.notes || '');
        
        // リフィル処方
        setIsRefillEligible(currentEditingDrug.isRefillEligible || false);
        setRefillCount(currentEditingDrug.refillCount?.toString() || '2');
        
        // 調剤指��
        setIsPackaged(currentEditingDrug.isOnePackage || false);
        setIsPowdered(currentEditingDrug.isCrushed || false);
        setIsMixed(currentEditingDrug.isMixed || false);
        
        // 後発医薬品変更不可
        setNoGenericSubstitution(currentEditingDrug.noGenericSubstitution || false);
        
        // 頓用フラグの復元
        const isAsNeededMode = currentEditingDrug.isAsNeeded || false;
        setIsAsNeeded(isAsNeededMode);
        
        if (isAsNeededMode) {
          // 頓用の場合
          setAsNeededCondition(currentEditingDrug.asNeededCondition || '症状があるとき');
          setMaxTimesPerDay(currentEditingDrug.maxTimesPerDay || '1日3回まで');
        }
        
        // 用法詳細情報が保存されている場合は復元
        if (currentEditingDrug.usageDetails) {
          const details = currentEditingDrug.usageDetails;
          
          // 用法タイプを復元
          if (details.usageType) {
            setUsageType(details.usageType);
          }
          
          // 標準用法（食事タイミング型）
          if (details.mealFrequency) setMealFrequency(details.mealFrequency);
          if (details.mealTiming) setMealTiming(details.mealTiming);
          
          // 不均等用法
          if (details.unevenFrequency) setUnevenFrequency(details.unevenFrequency);
          if (details.unevenTiming) setUnevenTiming(details.unevenTiming);
          if (details.unevenDoses) {
            setUnevenDoses(details.unevenDoses);
          }
          
          // 時間間隔型
          if (details.intervalType) setIntervalType(details.intervalType);
          
          // 時刻指定型
          if (details.timesPerDay) setTimesPerDay(details.timesPerDay);
          if (details.timeSlots && details.timeSlots.length > 0) {
            setTimeSlots(details.timeSlots);
          }
          
          // 哺乳時型
          if (details.breastfeedingFrequency) setBreastfeedingFrequency(details.breastfeedingFrequency);
          
          // 頓用
          if (details.asNeededCondition) setAsNeededCondition(details.asNeededCondition);
          if (details.maxTimesPerDay) setMaxTimesPerDay(details.maxTimesPerDay);
          
          // 外用薬用法
          if (details.topicalUsageType) setTopicalUsageType(details.topicalUsageType);
          if (details.topicalLifestyleFrequency) setTopicalLifestyleFrequency(details.topicalLifestyleFrequency);
          if (details.topicalLifestyleTiming) setTopicalLifestyleTiming(details.topicalLifestyleTiming);
          if (details.topicalFrequency) setTopicalFrequency(details.topicalFrequency);
          if (details.topicalIntervalType) setTopicalIntervalType(details.topicalIntervalType);
          if (details.topicalAsNeededCondition) setTopicalAsNeededCondition(details.topicalAsNeededCondition);
          if (details.topicalMaxTimesPerDay) setTopicalMaxTimesPerDay(details.topicalMaxTimesPerDay);
          
          // 投与スケジュール
          if (details.scheduleType) {
            setScheduleType(details.scheduleType);
          }
          if (details.scheduleWeekdays) setScheduleWeekdays(details.scheduleWeekdays);
          if (details.intervalDays) setIntervalDays(details.intervalDays);
          if (details.restDays) setRestDays(details.restDays);
          if (details.dateSpecificType) setDateSpecificType(details.dateSpecificType);
          if (details.monthlyDates) setMonthlyDates(details.monthlyDates);
          if (details.absoluteDates) setAbsoluteDates(details.absoluteDates);
          if (details.periodType) setPeriodType(details.periodType);
          if (details.timesInPeriod) setTimesInPeriod(details.timesInPeriod);
        } else {
          // 用法詳細情報がない場合は従来の方法で復元
          const frequency = currentEditingDrug.frequency || '';
          const timing = currentEditingDrug.timing || '';
          
          // デバッグ用ログ
          console.log('編集モード - isAsNeeded:', isAsNeededMode);
          console.log('編集モード - frequency:', frequency);
          console.log('編集モード - timing:', timing);
          
          // 頻度とタイミングから用法タイプを推測して設定
          if (isAsNeededMode) {
            // 頓用モードの場合
            setUsageType('asneeded');
            // asNeededConditionとmaxTimesPerDayは上で既に設定済み
          } else if (frequency.includes('週') && frequency.includes('曜日')) {
          // 曜日指定型: "週月・水・金曜日 朝食後"
          setUsageType('weekday');
          const weekdayMatch = frequency.match(/週(.+)曜日/);
          if (weekdayMatch) {
            const weekdaysStr = weekdayMatch[1];
            const weekdays = weekdaysStr.split('・');
            setSelectedWeekdays(weekdays);
          }
          const timingPart = frequency.split('曜日 ')[1] || '';
          setWeekdayTiming(timingPart);
        } else if (frequency.includes('おきに') || frequency.includes('ごとに')) {
          // 日数間隔型: "2日おきに 朝食後"
          setUsageType('dayinterval');
          const parts = frequency.split(' ');
          setDayInterval(parts[0] || '');
          setDayIntervalTiming(timing || parts.slice(1).join(' ') || '');
        } else if (frequency.includes('時間ごと')) {
          // 時間間隔型: "1日2回（12時間ごと）"
          setUsageType('interval');
          setIntervalType(frequency);
        } else if (frequency.includes('時・') || (frequency.includes('時') && timing.includes('・'))) {
          // 時刻指定型: "1日3回 8時・12時・18時"
          setUsageType('time');
          const timeMatch = timing.match(/(\d{1,2}):/g);
          if (timeMatch) {
            const times = timeMatch.map(t => t.replace(':', ':00').padStart(5, '0'));
            setTimeSlots(times.length > 0 ? times : ['08:00']);
          }
        } else if (frequency.includes('症状') || frequency === '頓用' || timing.includes('症状')) {
          // 頓用: "症状があるとき"
          setUsageType('asneeded');
          setAsNeededCondition(frequency || timing || '症状があるとき');
        } else if (frequency.includes('哺乳')) {
          // 哺乳時: "哺乳時（1日6回程度）"
          setUsageType('breastfeeding');
          setBreastfeedingFrequency(frequency);
        } else if (frequency.includes('不均等')) {
          // 不均等: "1日3回 不均等"、timing: "不均等 1・2・1錠"
          setUsageType('uneven');
          setUnevenFrequency(frequency.split(' ')[0] || '1日3回');
          setUnevenTiming(frequency.split(' ')[1] || '不均等');
          
          // timingから用量を抽出（"不均等 1・2・1錠" から "1・2・1" を取り出す）
          if (timing) {
            const timingPart = timing.replace('不均等', '').trim();
            const doses = timingPart.replace(/[錠カプセル包mg]/g, '').split('・');
            
            setUnevenDoses({
              wakeup: doses[0] || '',
              breakfast: doses[1] || '',
              lunch: doses[2] || '',
              dinner: doses[3] || '',
              bedtime: doses[4] || ''
            });
          }
        } else if (frequency.includes('1日') && (frequency.includes('食後') || frequency.includes('食前') || frequency.includes('食間'))) {
          // 食事基準型: "1日3回 朝昼夕食後"
          setUsageType('meal');
          const parts = frequency.split(' ');
          setMealFrequency(parts[0] || '1日1回');
          setMealTiming(parts[1] || '');
        } else {
          // デフォルト：食事基準型として設定
          setUsageType('meal');
          setMealFrequency('1日1回');
          setMealTiming(frequency || '朝食後');
          }
        }
      } else {
        // 新規モード：デフォルト値を設定
        setQuantityValue('1');
        if (currentEditingDrug.units && currentEditingDrug.units.length > 0) {
          setQuantityUnit(currentEditingDrug.units[0]);
        } else {
          setQuantityUnit('錠');
        }
        
        // 用法タイプはリセットしない（デフォルト値を保持）
        // その他の項目は空にリセット
        setMealTiming('');
        setIntervalType('');
        setSelectedWeekdays([]);
        setTimeSlots(['08:00']);
        setBreastfeedingFrequency('');
        setUnevenFrequency('');
        setUnevenTiming('');
        setAsNeededCondition('');
        setWeekdayTiming('');
        setDayInterval('');
        setDayIntervalTiming('');
        
        // 外用薬用法のリセット
        setTopicalLifestyleFrequency('１日１回');
        setTopicalLifestyleTiming('');
        setTopicalFrequency('');
        setTopicalTiming('');
        setTopicalIntervalType('');
        setTopicalAsNeededCondition('');
        setTopicalMaxTimesPerDay('');
        setTopicalSite([]);
        
        setPeriod('');
        
        // リフィル処方のリセット
        setIsRefillEligible(false);
        setNoGenericSubstitution(false);
        
        // リフィル禁止フラグをチェック（新規モードでも対象外薬剤の場合は無効化）
        if (currentEditingDrug.isRefillProhibited) {
          setIsRefillEligible(false); // リフィル禁止の場合はチェックを外す
        }
      }
    }
  }, [selectedDrug, editingHistoryOrder]);

  // 頓用処方が選択された場合、リフィルチェックを自動的に外す
  useEffect(() => {
    if (isAsNeeded || usageType === 'asneeded' || topicalUsageType === 'asneeded') {
      setIsRefillEligible(false);
    }
  }, [isAsNeeded, usageType, topicalUsageType]);

  // 外用薬の頻度が変更されたときにタイミングをリセット
  useEffect(() => {
    if (currentEditingDrug?.routeType === '外用') {
      const timingOptions = getTopicalTimingOptions();
      if (timingOptions.length > 0 && !timingOptions.includes(topicalTiming)) {
        setTopicalTiming(timingOptions[0]);
      }
    }
  }, [topicalFrequency]);

  // 外用薬のタイミング指定型の頻度が変更されたときにタイミングをリセット
  useEffect(() => {
    if (currentEditingDrug?.routeType === '外用' && topicalUsageType === 'lifestyle') {
      const timingOptions = getTopicalLifestyleTimingOptions();
      if (timingOptions.length > 0 && !timingOptions.includes(topicalLifestyleTiming)) {
        setTopicalLifestyleTiming('');
      }
    }
  }, [topicalLifestyleFrequency]);

  // 不均等用法の投与量入力に基づいて頻度を自動設定
  useEffect(() => {
    if (usageType === 'uneven') {
      const doses = [
        unevenDoses.wakeup,
        unevenDoses.breakfast,
        unevenDoses.lunch,
        unevenDoses.dinner,
        unevenDoses.bedtime
      ];
      
      // 入力されている欄（空でない、かつ0でない）の数をカウント
      const filledCount = doses.filter(dose => dose && dose.trim() !== '' && dose.trim() !== '0').length;
      
      // カウント結果に基づいて頻度を自動設定
      if (filledCount > 0 && filledCount <= 5) {
        setUnevenFrequency(`1日${filledCount}回`);
      } else if (filledCount === 0) {
        // すべての入力欄が空の場合は頻度をクリア
        setUnevenFrequency('');
      }
    }
  }, [usageType, unevenDoses.wakeup, unevenDoses.breakfast, unevenDoses.lunch, unevenDoses.dinner, unevenDoses.bedtime]);

  const handleConfirm = () => {
    if (!currentEditingDrug) return;

    // 外用薬のリフィル処方で投与日数が未入力の場合はエラー
    if (currentEditingDrug.routeType === '外用' && isRefillEligible && !period) {
      alert('外用薬のリフィル処方では投与日数の入力が必須です。');
      return;
    }

    // 用法の文字列を生成
    let finalUsage = '';
    let finalFrequency = ''; // 頻度（例：1日3回）
    let finalTiming = ''; // タイミング（例：朝昼夕食後）
    
    // 外用薬の場合
    if (currentEditingDrug.routeType === '外用') {
      const siteText = topicalSite.length > 0 
        ? topicalSite.map(s => s.side === 'なし' ? s.site : `${s.site}(${s.side})`).join('・') 
        : '';
      switch (topicalUsageType) {
        case 'lifestyle':
          // タイミング指定型: 部位 + 頻度 + タイミング
          finalUsage = `${siteText} ${topicalLifestyleFrequency} ${topicalLifestyleTiming}`;
          finalFrequency = topicalLifestyleFrequency;
          finalTiming = `${siteText} ${topicalLifestyleTiming}`;
          break;
        case 'frequency':
          // 1日回数指定型: 部位 + 頻度のみ
          finalUsage = `${siteText} ${topicalFrequency}`;
          finalFrequency = topicalFrequency;
          finalTiming = siteText;
          break;
        case 'interval':
          // 時間間隔型: 部位 + 時間間隔
          finalUsage = `${siteText} ${topicalIntervalType}`;
          finalFrequency = topicalIntervalType;
          finalTiming = siteText;
          break;
        case 'asneeded':
          // 頓用型: 部位 + 症状時 + 1日回数
          const topicalMaxTimesText = topicalMaxTimesPerDay ? ` ${topicalMaxTimesPerDay}` : '';
          finalUsage = `${siteText} ${topicalAsNeededCondition}${topicalMaxTimesText}`;
          finalFrequency = '';
          finalTiming = `${siteText} ${topicalAsNeededCondition}${topicalMaxTimesText}`;
          break;
      }
    } else {
      // 内服薬の場合：標準用法を設定
      switch (usageType) {
        case 'meal':
          finalUsage = `${mealFrequency} ${mealTiming}`;
          finalFrequency = mealFrequency;
          finalTiming = mealTiming;
          break;
        case 'uneven':
          // 不均等用法：入力された投与���のみを表示
          const doseEntries = [
            { label: '起床時', value: unevenDoses.wakeup },
            { label: '朝', value: unevenDoses.breakfast },
            { label: '昼', value: unevenDoses.lunch },
            { label: '夕', value: unevenDoses.dinner },
            { label: '就寝前', value: unevenDoses.bedtime }
          ].filter(entry => entry.value && entry.value.trim() !== '' && entry.value.trim() !== '0');
          
          const dosageText = doseEntries.map(entry => `${entry.label}${entry.value}${quantityUnit}`).join('・');
          finalUsage = `${unevenFrequency} ${unevenTiming} ${dosageText}`;
          finalFrequency = unevenFrequency;
          finalTiming = `${unevenTiming} ${dosageText}`;
          break;
        case 'interval':
          finalUsage = intervalType;
          finalFrequency = intervalType;
          finalTiming = '';
          break;
        case 'time':
          finalUsage = `1日${timeSlots.length}回 ${timeSlots.join('・')}`;
          finalFrequency = `1日${timeSlots.length}回`;
          finalTiming = timeSlots.join('・');
          break;
        case 'breastfeeding':
          finalUsage = breastfeedingFrequency;
          finalFrequency = breastfeedingFrequency;
          finalTiming = '哺乳時';
          break;
        case 'asneeded':
          const maxTimesText = maxTimesPerDay ? ` ${maxTimesPerDay}` : '';
          finalUsage = `${asNeededCondition}${maxTimesText}`;
          finalFrequency = '';
          finalTiming = `${asNeededCondition}${maxTimesText}`;
          break;
      }
      
      // 投与スケジュールが設定されている場合は用法に追加（不均等用法・時間指定にも適用可能）
      if (scheduleType !== 'none' && !isAsNeeded) {
        let scheduleText = '';
        switch (scheduleType) {
          case 'weekday':
            if (scheduleWeekdays.length > 0) {
              scheduleText = `${scheduleWeekdays.join('・')}曜日`;
            }
            break;
          case 'dayinterval':
            if (intervalDays) {
              scheduleText = `${intervalDays}日間隔投与`;
            }
            break;
          case 'datespecific':
            if (dateSpecificType === 'monthly' && monthlyDates.length > 0) {
              scheduleText = `毎月${monthlyDates.join('・')}日`;
            } else if (dateSpecificType === 'absolute' && absoluteDates.length > 0) {
              scheduleText = `日付指定(${absoluteDates.length}日)`;
            }
            break;
          case 'periodcount':
            if (periodType && timesInPeriod) {
              const periodLabel = periodType === 'week' ? '週' : periodType === 'month' ? '月' : '年';
              scheduleText = `${periodLabel}${timesInPeriod}回`;
            }
            break;
        }
        
        if (scheduleText) {
          finalUsage = `${finalUsage} ${scheduleText}`;
          finalFrequency = `${finalFrequency} ${scheduleText}`;
          finalTiming = `${finalTiming} ${scheduleText}`;
        }
      }
    }

    const orderDetail: OrderDetail = {
      ...currentEditingDrug,
      id: editingHistoryOrder ? editingHistoryOrder.id : `order-${Date.now()}-${Math.random()}`,
      quantity: `${quantityValue} ${quantityUnit}`,
      frequency: finalFrequency,
      timing: finalTiming,
      period: period === 'その他' ? `${customPeriod}${isAsNeeded ? '回分' : '日分'}` : period,
      startDate,
      isAsNeeded: isAsNeeded,
      asNeededCondition: isAsNeeded ? asNeededCondition : undefined,
      maxTimesPerDay: isAsNeeded ? maxTimesPerDay : undefined,
      notes,
      type: 'prescription',
      isRefillEligible,
      refillCount: isRefillEligible ? parseInt(refillCount) : undefined,
      isOnePackage: isPackaged,
      isCrushed: isPowdered,
      isMixed,
      selectedUnit: quantityUnit,
      noGenericSubstitution,
      prescriptionType, // 処方区分を設定
      source: editingHistoryOrder ? 'history' : 'new', // 履歴からの編集かどうかを示す
      // 用法詳細情報を保存（編集時の復元用）
      usageDetails: {
        usageType,
        mealFrequency,
        mealTiming,
        unevenFrequency,
        unevenTiming,
        unevenDoses,
        intervalType,
        timesPerDay,
        timeSlots,
        breastfeedingFrequency,
        asNeededCondition,
        maxTimesPerDay,
        topicalUsageType,
        topicalLifestyleFrequency,
        topicalLifestyleTiming,
        topicalFrequency,
        topicalIntervalType,
        topicalAsNeededCondition,
        topicalMaxTimesPerDay,
        scheduleType,
        scheduleWeekdays,
        intervalDays,
        restDays,
        dateSpecificType,
        monthlyDates,
        absoluteDates,
        periodType,
        timesInPeriod,
      },
    };

    onConfirmDrug(orderDetail);
    handleClear();
    
    // 履歴編集モードを終了
    if (editingHistoryOrder) {
      setEditingHistoryOrder(null);
    }
  };

  const handleClear = () => {
    // フォームをリセット
    setQuantityValue('1');
    setQuantityUnit('錠');
    setUsageType('meal');
    setScheduleType('none');
    setMealTiming('朝昼夕食後');
    setIntervalType('1日2回（12時間ごと）');
    setTimesPerDay('3');
    setTimeSlots(['08:00', '12:00', '18:00']);
    setSelectedWeekdays([]);
    setWeekdayTiming('朝食後');
    setDayInterval('');
    setDayIntervalTiming('');
    setSpecificDates([]);
    setPeriodDays('');
    setPeriodCount('');
    setAsNeededCondition('頭痛時');
    // 外用薬関連のリセット
    setTopicalLifestyleFrequency('１日１回');
    setTopicalLifestyleTiming('');
    setTopicalFrequency('');
    setTopicalTiming('');
    setTopicalIntervalType('');
    setTopicalAsNeededCondition('');
    setTopicalMaxTimesPerDay('');
    setTopicalSite([]);
    setPeriod('7日分');
    setStartDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsRefillEligible(false);
    setRefillCount('2');
    setIsPackaged(false);
    setIsPowdered(false);
    setIsMixed(false);
    setNoGenericSubstitution(false);
    onClearSelection();
  };

  // 履歴選択モード用の状態
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  
  // 履歴オーダーの展開状態
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);
  
  // 履歴レコード自体の展開状態
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  
  // 履歴オーダーの編集モード（オーダーIDを保持）
  const [editingOrderInHistory, setEditingOrderInHistory] = useState<string | null>(null);
  
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderIds(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // 履歴が選択されたときに全選択状態にする
  useEffect(() => {
    if (selectedHistory) {
      setSelectedOrderIds(selectedHistory.orders.map(o => o.id));
    }
  }, [selectedHistory]);

  const handleToggleOrder = (orderId: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedHistory) {
      setSelectedOrderIds(selectedHistory.orders.map(o => o.id));
    }
  };

  const handleDeselectAll = () => {
    setSelectedOrderIds([]);
  };

  const handleAddSelectedToConfirmed = () => {
    if (!selectedHistory || !onAddMultipleHistoryToConfirmed) return;
    
    const selectedOrders = selectedHistory.orders.filter(o => selectedOrderIds.includes(o.id));
    onAddMultipleHistoryToConfirmed(selectedOrders.map(order => ({ ...order, source: 'history' })));
    
    // 選択をクリア
    if (onClearHistorySelection) {
      onClearHistorySelection();
    }
    setSelectedOrderIds([]);
    setEditingHistoryOrder(null);
  };
  
  // 履歴オーダーの編集を開始（折り畳み内に表示）
  const handleEditHistoryOrderInline = (order: OrderItem) => {
    // 展開状態にして編集モードに設定
    if (!expandedOrderIds.includes(order.id)) {
      setExpandedOrderIds(prev => [...prev, order.id]);
    }
    
    // フォームの値を履歴オーダーの値で初期化
    if (order.quantity) {
      const match = order.quantity.match(/^([\d.]+)(.+)$/);
      if (match) {
        setQuantityValue(match[1]);
        setQuantityUnit(match[2]);
      }
    }
    if (order.period) {
      setPeriod(order.period);
    }
    
    setEditingOrderInHistory(order.id);
  };
  
  // 履歴オーダーの編集をキャンセル
  const handleCancelEditHistoryOrder = () => {
    setEditingHistoryOrder(null);
  };

  return (
    <div className="w-[450px] bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border flex-shrink-0">
        <h2 className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-blue-600" />
          処方詳細設定
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {editingHistoryOrder
            ? `${editingHistoryOrder.name}の処方詳細を設定してください。`
            : selectedHistory 
            ? '追加するオーダーを選択してください。' 
            : '選択された薬剤の用量、用法、投与日数などの詳細を設定してください。'
          }
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedHistory ? (
          <div className="p-4">
            {/* 履歴情報ヘッダー（展開/折りたたみ可能） */}
            <div className="border rounded-lg mb-4">
              <div className="p-3 bg-muted/30">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                    className="hover:bg-muted rounded p-1"
                  >
                    {isHistoryExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  <Checkbox 
                    checked={selectedOrderIds.length === selectedHistory.orders.length && selectedHistory.orders.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleSelectAll();
                      } else {
                        handleDeselectAll();
                      }
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{selectedHistory.date}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {selectedHistory.department}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        登録: {selectedHistory.registeredBy}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedOrderIds.length}/{selectedHistory.orders.length}種目選択
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    disabled={selectedOrderIds.length === 0}
                    onClick={handleAddSelectedToConfirmed}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    選択項目を追加
                  </Button>
                </div>
              </div>

              {/* 展開時のみオーダー一覧を表示 */}
              {isHistoryExpanded && (
                <div className="p-3">
                  {/* オーダー一覧 */}
                  <div className="space-y-2">
                    {selectedHistory.orders.map((order) => {
                      const isExpanded = expandedOrderIds.includes(order.id);
                      return (
                        <div 
                          key={order.id}
                          className="border rounded"
                        >
                          {/* オーダーヘッダー */}
                          <div className="flex items-start gap-2 p-2">
                            <Checkbox 
                              checked={selectedOrderIds.includes(order.id)}
                              onCheckedChange={() => handleToggleOrder(order.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">{order.name}</div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditHistoryOrderInline(order);
                              }}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </div>
                    
                    {/* 展開時の詳細情報または編集フォーム */}
                    {isExpanded && editingOrderInHistory === order.id ? (
                      <div className="px-3 pb-3 pt-2 border-t bg-muted/5 space-y-3">
                        {/* 編集フォーム */}
                        <div className="text-xs font-medium text-primary mb-2">処方詳細を編集</div>
                        
                        {/* 用量設定 */}
                        <div>
                          <Label className="text-xs mb-1">用量</Label>
                          <div className="grid grid-cols-2 gap-1">
                            <Input
                              type="number"
                              value={quantityValue}
                              onChange={(e) => setQuantityValue(e.target.value)}
                              placeholder="1"
                              className="h-8 text-xs"
                            />
                            {order.units && order.units.length > 1 ? (
                              <Select value={quantityUnit} onValueChange={setQuantityUnit}>
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {order.units.map(unit => (
                                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                value={quantityUnit}
                                disabled
                                className="bg-muted h-8 text-xs"
                              />
                            )}
                          </div>
                        </div>

                        {/* 用法（簡略版） */}
                        <div>
                          <Label className="text-xs mb-1">用法タイプ</Label>
                          <Select value={usageType} onValueChange={(value: any) => setUsageType(value)}>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="meal">食事タイミング</SelectItem>
                              <SelectItem value="interval">時間間隔</SelectItem>
                              <SelectItem value="timesperday">1日回数指定</SelectItem>
                              <SelectItem value="asneeded">頓用</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {usageType === 'meal' && (
                          <div>
                            <Label className="text-xs mb-1">食事タイミング</Label>
                            <Select value={mealTiming} onValueChange={setMealTiming}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="朝昼夕食後">朝昼夕食後</SelectItem>
                                <SelectItem value="朝昼夕食前">朝昼夕食前</SelectItem>
                                <SelectItem value="朝夕食後">朝夕食後</SelectItem>
                                <SelectItem value="朝夕食前">朝夕食前</SelectItem>
                                <SelectItem value="毎食後">毎食後</SelectItem>
                                <SelectItem value="毎食前">毎食前</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* 投与日数 */}
                        <div>
                          <Label className="text-xs mb-1">投与日数</Label>
                          <Input
                            type="number"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            placeholder="日数を入力"
                            className="h-8 text-xs"
                          />
                        </div>

                        {/* 開始日 */}
                        <div>
                          <Label className="text-xs mb-1">開始日</Label>
                          <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>

                        {/* 調剤指示 */}
                        <div className="space-y-2">
                          <Label className="text-xs">調剤指示</Label>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="one-package"
                                checked={isPackaged}
                                onCheckedChange={(checked) => setIsPackaged(checked as boolean)}
                              />
                              <Label htmlFor="one-package" className="text-xs cursor-pointer">一包化</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="crushed"
                                checked={isPowdered}
                                onCheckedChange={(checked) => setIsPowdered(checked as boolean)}
                              />
                              <Label htmlFor="crushed" className="text-xs cursor-pointer">粉砕</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="mixed"
                                checked={isMixed}
                                onCheckedChange={(checked) => setIsMixed(checked as boolean)}
                              />
                              <Label htmlFor="mixed" className="text-xs cursor-pointer">混合</Label>
                            </div>
                          </div>
                        </div>

                        {/* リフィル処方 */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="refill-eligible"
                              checked={isRefillEligible}
                              onCheckedChange={(checked) => setIsRefillEligible(checked as boolean)}
                            />
                            <Label htmlFor="refill-eligible" className="text-xs cursor-pointer">リフィル処方</Label>
                          </div>
                          {isRefillEligible && (
                            <div>
                              <Label className="text-xs mb-1">リフィル回数</Label>
                              <Input
                                type="number"
                                value={refillCount}
                                onChange={(e) => setRefillCount(e.target.value)}
                                placeholder="2"
                                min="1"
                                max="3"
                                className="h-8 text-xs"
                              />
                            </div>
                          )}
                        </div>

                        {/* 備考・特記事項 */}
                        <div>
                          <Label htmlFor="notes-edit" className="text-xs mb-1">備考・特記事項</Label>
                          <Textarea
                            id="notes-edit"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="特別な指示や注意事項があれば入力してください"
                            rows={2}
                            className="text-xs"
                          />
                        </div>

                        {/* アクションボタン */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={() => {
                              // 編集内容を保存して確定オーダーに追加
                              const editedOrder = {
                                ...order,
                                quantity: `${quantityValue}${quantityUnit}`,
                                usage: isAsNeeded ? `頓用（${asNeededCondition}）${maxTimesPerDay ? ' ' + maxTimesPerDay : ''}` :
                                       usageType === 'meal' ? mealTiming : 
                                       usageType === 'interval' ? intervalType : '',
                                period: period,
                                startDate: startDate,
                                isOnePackage: isPackaged,
                                isCrushed: isPowdered,
                                isMixed: isMixed,
                                isRefillEligible: isRefillEligible,
                                refillCount: isRefillEligible ? Number(refillCount) : undefined,
                                notes: notes,
                                source: 'history' as const,
                              };
                              onConfirmDrug(editedOrder);
                              setEditingOrderInHistory(null);
                              setExpandedOrderIds(prev => prev.filter(id => id !== order.id));
                            }}
                          >
                            確定して追加
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs"
                            onClick={() => {
                              setEditingOrderInHistory(null);
                            }}
                          >
                            キャンセル
                          </Button>
                        </div>
                      </div>
                    ) : isExpanded ? (
                      <div className="px-2 pb-2 pt-1 border-t bg-muted/5 text-xs space-y-1">
                        {order.quantity && (
                          <div className="flex gap-2">
                            <span className="text-muted-foreground">用量:</span>
                            <span>{order.quantity}</span>
                          </div>
                        )}
                        {order.usage && (
                          <div className="flex gap-2">
                            <span className="text-muted-foreground">用法:</span>
                            <span>{order.usage}</span>
                          </div>
                        )}
                        {order.frequency && (
                          <div className="flex gap-2">
                            <span className="text-muted-foreground">頻度:</span>
                            <span>{order.frequency}</span>
                          </div>
                        )}
                        {order.period && (
                          <div className="flex gap-2">
                            <span className="text-muted-foreground">投与期間:</span>
                            <span>{order.period}</span>
                          </div>
                        )}
                        {order.notes && (
                          <div className="flex gap-2">
                            <span className="text-muted-foreground">備考:</span>
                            <span>{order.notes}</span>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : !selectedDrug && !editingHistoryOrder ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="text-lg mb-2">薬剤が選択されていません</div>
            <div className="text-sm">左ペインから薬剤を選択してください</div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* 薬剤名表示 */}
            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="font-medium">{currentEditingDrug?.name}</h4>
            </div>

            {/* 用量設定 */}
            <div>
              <Label htmlFor="quantity" className="flex items-center gap-1">
                <Pill className="w-4 h-4" />
                用量
              </Label>
              <div className="grid grid-cols-2 gap-1">
                <Input
                  id="quantity"
                  type="number"
                  value={quantityValue}
                  onChange={(e) => setQuantityValue(e.target.value)}
                  placeholder="1"
                />
                {currentEditingDrug?.units && currentEditingDrug.units.length > 1 ? (
                  <Select value={quantityUnit} onValueChange={setQuantityUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentEditingDrug.units.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={quantityUnit}
                    disabled
                    className="bg-muted"
                  />
                )}
              </div>
            </div>

            {/* 用法設定 */}
            <div>
              <Label htmlFor="frequency" className="flex items-center gap-1 mb-2">
                <Clock className="w-4 h-4" />
                用法
              </Label>
              
              {/* 外用薬の場合は専用のUI */}
              {currentEditingDrug?.routeType === '外用' ? (
                <div className="space-y-3">
                  {/* 部位選択（複数選択可） */}
                  <div>
                    <div 
                      className="flex items-center justify-between cursor-pointer mb-1 p-1.5 -mx-1.5 rounded hover:bg-muted/50 transition-colors"
                      onClick={() => setIsSiteSelectionExpanded(!isSiteSelectionExpanded)}
                    >
                      <Label className="text-xs cursor-pointer">部位（複数選択可）</Label>
                      <div className="flex items-center gap-2">
                        {topicalSite.length > 0 && (
                          <Badge variant="secondary" className="text-xs h-5">
                            {topicalSite.length}件選択
                          </Badge>
                        )}
                        {isSiteSelectionExpanded ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    {isSiteSelectionExpanded && (
                      <>
                        <div className="border rounded-md p-2 max-h-52 overflow-y-auto bg-background">
                          <div className="grid grid-cols-3 gap-x-2 gap-y-1.5">
                            {topicalSiteOptions.map((site) => (
                              <div key={site} className="flex items-center space-x-1.5">
                                <Checkbox
                                  id={`site-${site}`}
                                  checked={topicalSite.some(s => s.site === site)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setTopicalSite([...topicalSite, { site, side: 'なし' }]);
                                    } else {
                                      setTopicalSite(topicalSite.filter(s => s.site !== site));
                                    }
                                  }}
                                  className="h-3.5 w-3.5"
                                />
                                <label
                                  htmlFor={`site-${site}`}
                                  className="text-xs cursor-pointer leading-none"
                                >
                                  {site}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* 選択中の部位と左右指定 */}
                        {topicalSite.length > 0 && (
                          <div className="mt-2 border rounded-md p-2 bg-muted/30 space-y-2">
                            <div className="text-xs font-medium text-muted-foreground mb-1">左右指定</div>
                            {topicalSite.map((siteObj, index) => (
                              <div key={index} className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/50 last:border-0 last:pb-0">
                                <span className="text-xs font-medium">{siteObj.site}</span>
                                <div className="flex gap-1">
                                  {[
                                    { value: 'なし', label: '左右指定なし' },
                                    { value: '左', label: '左' },
                                    { value: '右', label: '右' },
                                    { value: '両', label: '両' }
                                  ].map(({ value, label }) => (
                                    <button
                                      key={value}
                                      type="button"
                                      onClick={() => {
                                        const newSites = [...topicalSite];
                                        newSites[index] = { ...newSites[index], side: value as 'なし' | '左' | '右' | '両' };
                                        setTopicalSite(newSites);
                                      }}
                                      className={`px-2 py-0.5 text-xs rounded transition-colors ${
                                        siteObj.side === value
                                          ? 'bg-primary text-primary-foreground'
                                          : 'bg-background border border-border hover:bg-muted'
                                      }`}
                                    >
                                      {label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                            <div className="text-xs text-muted-foreground pt-1.5 border-t border-border/50">
                              <span className="text-muted-foreground">表示: </span>
                              <span className="font-medium">
                                {topicalSite.map(s => s.side === 'なし' ? s.site : `${s.site}(${s.side})`).join('・')}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* 基本用法選択（タブ形式） */}
                  <div className="mt-2">
                    <Label className="text-xs mb-2 block">基本用法</Label>
                    <Tabs 
                      value={topicalUsageType} 
                      onValueChange={(value: string) => setTopicalUsageType(value as 'lifestyle' | 'frequency' | 'interval' | 'asneeded')}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="frequency">回数のみ</TabsTrigger>
                        <TabsTrigger value="lifestyle">タイミング指定</TabsTrigger>
                        <TabsTrigger value="interval">時間間隔</TabsTrigger>
                        <TabsTrigger value="asneeded">頓用</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  {/* タイミング指定型 */}
                  {topicalUsageType === 'lifestyle' && (
                    <div className="mt-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="topicalLifestyleFrequency" className="text-xs mb-1">1日回数</Label>
                          <Select value={topicalLifestyleFrequency} onValueChange={(value) => {
                            setTopicalLifestyleFrequency(value);
                            setTopicalLifestyleTiming(''); // 回数変更時にタイミングをリセット
                          }}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="１日１回">１日１回</SelectItem>
                              <SelectItem value="１日２回">１日２回</SelectItem>
                              <SelectItem value="１日３回">１日３回</SelectItem>
                              <SelectItem value="１日４回">１日４回</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="topicalLifestyleTiming" className="text-xs mb-1">タイミング</Label>
                          <Select value={topicalLifestyleTiming} onValueChange={setTopicalLifestyleTiming}>
                            <SelectTrigger>
                              <SelectValue placeholder="タイミングを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              {getTopicalLifestyleTimingOptions().map(option => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 1日回数指定型 */}
                  {topicalUsageType === 'frequency' && (
                    <div className="mt-2">
                      <Select value={topicalFrequency} onValueChange={setTopicalFrequency}>
                        <SelectTrigger>
                          <SelectValue placeholder="回数を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="１日１回">１日１回</SelectItem>
                          <SelectItem value="１日２回">１日２回</SelectItem>
                          <SelectItem value="１日３回">１日３回</SelectItem>
                          <SelectItem value="１日４回">１日４回</SelectItem>
                          <SelectItem value="１日５回">１日５回</SelectItem>
                          <SelectItem value="１日６回">１日６回</SelectItem>
                          <SelectItem value="１日７回">１日７回</SelectItem>
                          <SelectItem value="１日８回">１日８回</SelectItem>
                          <SelectItem value="１日９回">１日９回</SelectItem>
                          <SelectItem value="１日１０回">１日１０回</SelectItem>
                          <SelectItem value="１日３回程度">１日３回程度</SelectItem>
                          <SelectItem value="１日４回程度">１日４回程度</SelectItem>
                          <SelectItem value="１日６回程度">１日６回程度</SelectItem>
                          <SelectItem value="１日１～２回">１日１～２回</SelectItem>
                          <SelectItem value="１日１～数回">１日１～数回</SelectItem>
                          <SelectItem value="１日２～３回">１日２～３回</SelectItem>
                          <SelectItem value="１日３～４回">１日３～４回</SelectItem>
                          <SelectItem value="１日４～５回">１日４～５回</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {/* 時間間隔型 */}
                  {topicalUsageType === 'interval' && (
                    <div className="mt-2">
                      <Select value={topicalIntervalType} onValueChange={setTopicalIntervalType}>
                        <SelectTrigger>
                          <SelectValue placeholder="時間間隔を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="２～３時間毎">２～３時間毎</SelectItem>
                          <SelectItem value="４～６時間毎">４～６時間毎</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {/* 頓用 */}
                  {topicalUsageType === 'asneeded' && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="topicalAsNeededCondition" className="text-xs mb-1">症状・条件</Label>
                        <Select value={topicalAsNeededCondition} onValueChange={setTopicalAsNeededCondition}>
                          <SelectTrigger>
                            <SelectValue placeholder="症状・条件を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {getTopicalAsNeededConditionOptions().map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="topicalMaxTimesPerDay" className="text-xs mb-1">1日回数</Label>
                        <Select value={topicalMaxTimesPerDay} onValueChange={setTopicalMaxTimesPerDay}>
                          <SelectTrigger>
                            <SelectValue placeholder="回数を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1日1回まで">1日1回まで</SelectItem>
                            <SelectItem value="1日2回まで">1日2回まで</SelectItem>
                            <SelectItem value="1日3回まで">1日3回まで</SelectItem>
                            <SelectItem value="1日4回まで">1日4回まで</SelectItem>
                            <SelectItem value="1日5回まで">1日5回まで</SelectItem>
                            <SelectItem value="1日6回まで">1日6回まで</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // 内服薬の場合
                <div className="space-y-3">
                  {/* 基本用法の選択（タブ形式） */}
                  <div>
                    <Label className="text-xs mb-2 block">基本用法</Label>
                    <Tabs 
                      value={isAsNeeded ? 'asneeded' : usageType} 
                      onValueChange={(value: string) => {
                        const typedValue = value as 'meal' | 'uneven' | 'time' | 'asneeded';
                        if (typedValue === 'asneeded') {
                        setIsAsNeeded(true);
                        setPeriod('');
                        setCustomPeriod('');
                        setAsNeededCondition('');
                        setMaxTimesPerDay('');
                        setScheduleType('none');
                        } else {
                          setIsAsNeeded(false);
                          setUsageType(typedValue as 'meal' | 'uneven' | 'time');
                          setMealTiming('');
                          if (typedValue === 'uneven') {
                            setScheduleType('none');
                            setUnevenFrequency('');
                            setUnevenTiming('');
                          } else if (typedValue === 'time') {
                            setScheduleType('none');
                            setTimesPerDay('3');
                            setTimeSlots(['08:00', '12:00', '18:00']);
                          }
                        }
                      }}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="meal">標準用法</TabsTrigger>
                        <TabsTrigger value="uneven">不均等用法</TabsTrigger>
                        <TabsTrigger value="time">時間指定</TabsTrigger>
                        <TabsTrigger value="asneeded">頓用</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  {isAsNeeded ? (
                    // 頓用の場合
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="asNeededCondition" className="text-xs mb-1">症状・条件</Label>
                        <Select value={asNeededCondition} onValueChange={setAsNeededCondition}>
                          <SelectTrigger>
                            <SelectValue placeholder="症状・条件を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAsNeededConditionOptions().map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="maxTimesPerDay" className="text-xs mb-1">1日回数</Label>
                        <Select value={maxTimesPerDay} onValueChange={setMaxTimesPerDay}>
                          <SelectTrigger>
                            <SelectValue placeholder="回数を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1日1回まで">1日1回まで</SelectItem>
                            <SelectItem value="1日2回まで">1日2回まで</SelectItem>
                            <SelectItem value="1日3回まで">1日3回まで</SelectItem>
                            <SelectItem value="1日4回まで">1日4回まで</SelectItem>
                            <SelectItem value="1日5回まで">1日5回まで</SelectItem>
                            <SelectItem value="1日6回まで">1日6回まで</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : usageType === 'meal' ? (
                    // 標準用法設定
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="mealFrequency" className="text-xs mb-1">1日回数</Label>
                        <Select value={mealFrequency} onValueChange={(value) => {
                          setMealFrequency(value);
                          setMealTiming('');
                        }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1日1回">1日1回</SelectItem>
                            <SelectItem value="1日2回">1日2回</SelectItem>
                            <SelectItem value="1日3回">1日3回</SelectItem>
                            <SelectItem value="1日4回">1日4回</SelectItem>
                            <SelectItem value="1日5回">1日5回</SelectItem>
                            <SelectItem value="1日6回">1日6回</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="mealTiming" className="text-xs mb-1">タイミング</Label>
                        <Select value={mealTiming} onValueChange={setMealTiming}>
                          <SelectTrigger>
                            <SelectValue placeholder="タイミングを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {getMealTimingOptions().map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : usageType === 'uneven' ? (
                    // 不均等用法設定
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="unevenFrequency" className="text-xs">1日回数（自動判定）</Label>
                          <Input
                            value={unevenFrequency}
                            disabled
                            className="h-9 bg-muted"
                            placeholder="投与量入力で自動設定"
                          />
                        </div>
                        <div>
                          <Label htmlFor="unevenTiming" className="text-xs">タイミング</Label>
                          <Select value={unevenTiming} onValueChange={setUnevenTiming}>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="食前">食前</SelectItem>
                              <SelectItem value="食間">食間</SelectItem>
                              <SelectItem value="食後">食後</SelectItem>
                              <SelectItem value="直前">直前</SelectItem>
                              <SelectItem value="直後">直後</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        <div>
                          <Label className="text-xs">起床時</Label>
                          <Input
                            value={unevenDoses.wakeup}
                            onChange={(e) => setUnevenDoses({...unevenDoses, wakeup: e.target.value})}
                            placeholder="錠"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">朝</Label>
                          <Input
                            value={unevenDoses.breakfast}
                            onChange={(e) => setUnevenDoses({...unevenDoses, breakfast: e.target.value})}
                            placeholder="錠"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">昼</Label>
                          <Input
                            value={unevenDoses.lunch}
                            onChange={(e) => setUnevenDoses({...unevenDoses, lunch: e.target.value})}
                            placeholder="錠"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">夕</Label>
                          <Input
                            value={unevenDoses.dinner}
                            onChange={(e) => setUnevenDoses({...unevenDoses, dinner: e.target.value})}
                            placeholder="錠"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">就寝前</Label>
                          <Input
                            value={unevenDoses.bedtime}
                            onChange={(e) => setUnevenDoses({...unevenDoses, bedtime: e.target.value})}
                            placeholder="錠"
                          />
                        </div>
                      </div>
                    </div>
                  ) : usageType === 'time' ? (
                    // 時間指定設定
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="timesPerDay" className="text-xs mb-1">1日回数</Label>
                        <Select value={timesPerDay} onValueChange={(value) => {
                          setTimesPerDay(value);
                          const count = parseInt(value);
                          const newSlots = Array(count).fill(0).map((_, i) => {
                            const hour = 8 + (i * 4);
                            return `${hour.toString().padStart(2, '0')}:00`;
                          });
                          setTimeSlots(newSlots);
                        }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1回</SelectItem>
                            <SelectItem value="2">2回</SelectItem>
                            <SelectItem value="3">3回</SelectItem>
                            <SelectItem value="4">4回</SelectItem>
                            <SelectItem value="5">5回</SelectItem>
                            <SelectItem value="6">6回</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">時刻指定</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time, index) => (
                            <div key={index}>
                              <Input
                                type="time"
                                value={time}
                                onChange={(e) => {
                                  const newSlots = [...timeSlots];
                                  newSlots[index] = e.target.value;
                                  setTimeSlots(newSlots);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  
                  {/* 投与スケジュール選択（頓用以外で表示。不均等・時間指定にも適用可能） */}
                  {!isAsNeeded && (
                    <div>
                      <Label className="text-xs mb-2 block">投与スケジュール</Label>
                      <RadioGroup 
                        value={scheduleType} 
                        onValueChange={(value: 'none' | 'dayinterval' | 'weekday' | 'datespecific' | 'periodcount') => setScheduleType(value)}
                        className="flex flex-wrap gap-x-3 gap-y-2"
                      >
                        <div className="flex items-center space-x-1.5">
                          <RadioGroupItem value="none" id="schedule-none" className="h-3.5 w-3.5" />
                          <Label htmlFor="schedule-none" className="text-xs cursor-pointer">なし</Label>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <RadioGroupItem value="weekday" id="schedule-weekday" className="h-3.5 w-3.5" />
                          <Label htmlFor="schedule-weekday" className="text-xs cursor-pointer">曜日指定</Label>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <RadioGroupItem value="dayinterval" id="schedule-dayinterval" className="h-3.5 w-3.5" />
                          <Label htmlFor="schedule-dayinterval" className="text-xs cursor-pointer">日数間隔</Label>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <RadioGroupItem value="datespecific" id="schedule-datespecific" className="h-3.5 w-3.5" />
                          <Label htmlFor="schedule-datespecific" className="text-xs cursor-pointer">日付指定</Label>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <RadioGroupItem value="periodcount" id="schedule-periodcount" className="h-3.5 w-3.5" />
                          <Label htmlFor="schedule-periodcount" className="text-xs cursor-pointer">期間内回数</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                  
                  {!isAsNeeded && scheduleType === 'weekday' && (
                    <div className="mt-2 space-y-2">
                      <Label className="text-xs">曜日指定</Label>
                      <div className="p-3 bg-muted/30 rounded-md">
                        <div className="flex flex-wrap gap-2">
                          {['月', '火', '水', '木', '金', '土', '日'].map(day => (
                            <div key={day} className="flex items-center space-x-1">
                              <Checkbox
                                id={`schedule-weekday-${day}`}
                                checked={scheduleWeekdays.includes(day)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setScheduleWeekdays([...scheduleWeekdays, day]);
                                  } else {
                                    setScheduleWeekdays(scheduleWeekdays.filter(d => d !== day));
                                  }
                                }}
                              />
                              <Label htmlFor={`schedule-weekday-${day}`} className="text-sm cursor-pointer">
                                {day}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!isAsNeeded && scheduleType === 'dayinterval' && (
                    <div className="mt-2 space-y-2">
                      <Label className="text-xs">日数間隔指定</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            type="number"
                            min="1"
                            value={intervalDays}
                            onChange={(e) => setIntervalDays(e.target.value)}
                            placeholder="2"
                            className="h-9"
                          />
                        </div>
                        <span className="text-xs mt-5">日間隔投与</span>
                      </div>
                    </div>
                  )}
                  
                  {!isAsNeeded && scheduleType === 'datespecific' && (
                    <div className="mt-2 space-y-2">
                      <Label className="text-xs">日付指定</Label>
                      <div className="space-y-2">
                        <Select value={dateSpecificType} onValueChange={(value: 'monthly' | 'absolute') => setDateSpecificType(value)}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">毎月指定日</SelectItem>
                            <SelectItem value="absolute">絶対日付指定</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {dateSpecificType === 'monthly' && (
                          <div>
                            <Label className="text-xs mb-1 block">服用日（複数選択可）</Label>
                            <div className="p-2 border rounded-md max-h-40 overflow-y-auto">
                              <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                  <Button
                                    key={day}
                                    size="sm"
                                    variant={monthlyDates.includes(day) ? "default" : "outline"}
                                    className="h-8 text-xs"
                                    onClick={() => {
                                      if (monthlyDates.includes(day)) {
                                        setMonthlyDates(monthlyDates.filter(d => d !== day));
                                      } else {
                                        setMonthlyDates([...monthlyDates, day].sort((a, b) => a - b));
                                      }
                                    }}
                                  >
                                    {day}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            {monthlyDates.length > 0 && (
                              <div className="mt-2 text-xs text-muted-foreground p-2 bg-muted/30 rounded">
                                毎月 {monthlyDates.join('、')}日
                              </div>
                            )}
                          </div>
                        )}
                        
                        {dateSpecificType === 'absolute' && (
                          <div>
                            <Label className="text-xs mb-1 block">日付入力（MM/DD形式）</Label>
                            <div className="flex gap-2">
                              <Input
                                placeholder="例：12/10"
                                className="h-9"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const value = e.currentTarget.value.trim();
                                    if (value && !absoluteDates.includes(value)) {
                                      setAbsoluteDates([...absoluteDates, value]);
                                      e.currentTarget.value = '';
                                    }
                                  }
                                }}
                              />
                            </div>
                            {absoluteDates.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {absoluteDates.map((date, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs">
                                    <span>{date}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      onClick={() => setAbsoluteDates(absoluteDates.filter((_, i) => i !== index))}
                                    >
                                      ×
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="mt-1 text-xs text-muted-foreground">
                              Enterキーで追加
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {!isAsNeeded && scheduleType === 'periodcount' && (
                    <div className="mt-2 space-y-2">
                      <Label className="text-xs">指定期間内回数指定</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="periodType" className="text-xs">期間</Label>
                          <Select value={periodType} onValueChange={(value: 'year' | 'month' | 'week') => setPeriodType(value)}>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="week">1週間</SelectItem>
                              <SelectItem value="month">1ヶ月</SelectItem>
                              <SelectItem value="year">1年</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="timesInPeriod" className="text-xs">回数</Label>
                          <Input
                            type="number"
                            min="1"
                            value={timesInPeriod}
                            onChange={(e) => setTimesInPeriod(e.target.value)}
                            placeholder="2"
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded">
                        {periodType === 'week' && `週${timesInPeriod}回`}
                        {periodType === 'month' && `月${timesInPeriod}回`}
                        {periodType === 'year' && `年${timesInPeriod}回`}
                      </div>
                    </div>
                  )}
                  
                  {usageType === 'asneeded' && (
                    <div className="flex items-center gap-2 mt-2">
                      <Select value={asNeededCondition} onValueChange={setAsNeededCondition}>
                        <SelectTrigger>
                          <SelectValue placeholder="頓用指示を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="疼痛時">疼痛時</SelectItem>
                          <SelectItem value="頭痛時">頭痛時</SelectItem>
                          <SelectItem value="歯痛時">歯痛時</SelectItem>
                          <SelectItem value="胸痛時">胸痛時</SelectItem>
                          <SelectItem value="腹痛時">腹痛時</SelectItem>
                          <SelectItem value="腰痛時">腰痛時</SelectItem>
                          <SelectItem value="関節痛時">関節痛時</SelectItem>
                          <SelectItem value="喘鳴時">喘鳴時</SelectItem>
                          <SelectItem value="喘息発作時">喘息発作時</SelectItem>
                          <SelectItem value="喉がゴロゴロする時">喉がゴロゴロする時</SelectItem>
                          <SelectItem value="しゃっくり時">しゃっくり時</SelectItem>
                          <SelectItem value="咳込時">咳込時</SelectItem>
                          <SelectItem value="血圧上昇時">血圧上昇時</SelectItem>
                          <SelectItem value="便秘時">便秘時</SelectItem>
                          <SelectItem value="お腹がゴロゴロする時">お腹がゴロゴロする時</SelectItem>
                          <SelectItem value="下痢時">下痢時</SelectItem>
                          <SelectItem value="排便時">排便時</SelectItem>
                          <SelectItem value="嘔吐時">嘔吐時</SelectItem>
                          <SelectItem value="口腔乾燥時">口腔乾燥時</SelectItem>
                          <SelectItem value="吐き気時">吐き気時</SelectItem>
                          <SelectItem value="空腹時">空腹時</SelectItem>
                          <SelectItem value="出血時">出血時</SelectItem>
                          <SelectItem value="乏尿時">乏尿時</SelectItem>
                          <SelectItem value="多尿時">多尿時</SelectItem>
                          <SelectItem value="むくみ時">むくみ時</SelectItem>
                          <SelectItem value="不眠時">不眠時</SelectItem>
                          <SelectItem value="不安時">不安時</SelectItem>
                          <SelectItem value="不穏時">不穏時</SelectItem>
                          <SelectItem value="いらいら時">いらいら時</SelectItem>
                          <SelectItem value="けいれん時">けいれん時</SelectItem>
                          <SelectItem value="めまい時">めまい時</SelectItem>
                          <SelectItem value="疲労時">疲労時</SelectItem>
                          <SelectItem value="発熱時">発熱時</SelectItem>
                          <SelectItem value="悪寒時">悪寒時</SelectItem>
                          <SelectItem value="かゆい時">かゆい時</SelectItem>
                          <SelectItem value="発疹時">発疹時</SelectItem>
                          <SelectItem value="発作時">発作時</SelectItem>
                          <SelectItem value="症状ある時">症状ある時</SelectItem>
                          <SelectItem value="検査前">検査前</SelectItem>
                          <SelectItem value="検査時">検査時</SelectItem>
                          <SelectItem value="検査後">検査後</SelectItem>
                          <SelectItem value="起床時">起床時</SelectItem>
                          <SelectItem value="入浴前">入浴前</SelectItem>
                          <SelectItem value="食事前">食事前</SelectItem>
                          <SelectItem value="食事後">食事後</SelectItem>
                          <SelectItem value="就寝前">就寝前</SelectItem>
                          <SelectItem value="外出時">外出時</SelectItem>
                          <SelectItem value="必要時">必要時</SelectItem>
                          <SelectItem value="適宜">適宜</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 投与日数・開始日（頓用の場合は処方回数） */}
            {/* 外用薬の場合はリフィル処方時のみ投与日数を表示 */}
            <div className={currentEditingDrug?.routeType === '外用' && !isRefillEligible ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-2 gap-3'}>
              {/* 外用薬でリフィル処方でない場合は投与日数入力欄を非表示 */}
              {!(currentEditingDrug?.routeType === '外用' && !isRefillEligible) && (
                <div>
                  <Label htmlFor="period" className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    {currentEditingDrug?.routeType === '外用' ? '投与日数' : isAsNeeded ? '処方回数' : '投与日数'}
                    {currentEditingDrug?.routeType === '外用' && isRefillEligible && (
                      <Badge variant="destructive" className="text-xs ml-1">必須</Badge>
                    )}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="period"
                      type="number"
                      min="1"
                      max="999"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      placeholder="1-999"
                      className={currentEditingDrug?.routeType === '外用' && isRefillEligible && !period ? 'border-red-500 h-9' : 'h-9'}
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{isAsNeeded && currentEditingDrug?.routeType !== '外用' ? '回分' : '日分'}</span>
                  </div>
                  {currentEditingDrug?.routeType === '外用' && isRefillEligible && !period && (
                    <p className="text-xs text-red-600 mt-1">
                      外用薬のリフィル処方では投与日数が必須です
                    </p>
                  )}
                </div>
              )}
              <div>
                <Label htmlFor="startDate" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  開始日
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>

            {/* 調剤指示 */}
            {currentEditingDrug?.routeType !== '外用' && (
              <div className="border rounded-lg p-3 bg-muted/10">
                <Label className="text-sm font-medium mb-3 block">調剤指示</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="packaged"
                      checked={isPackaged}
                      onCheckedChange={(checked) => setIsPackaged(checked as boolean)}
                    />
                    <Label htmlFor="packaged" className="text-sm cursor-pointer">
                      一包化
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="powdered"
                      checked={isPowdered}
                      onCheckedChange={(checked) => setIsPowdered(checked as boolean)}
                    />
                    <Label htmlFor="powdered" className="text-sm cursor-pointer">
                      粉砕
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mixed"
                      checked={isMixed}
                      onCheckedChange={(checked) => setIsMixed(checked as boolean)}
                    />
                    <Label htmlFor="mixed" className="text-sm cursor-pointer">
                      混合
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* 後発医薬品変更不可 */}
            <div className="border rounded-lg p-3 bg-muted/10">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="no-generic-substitution"
                  checked={noGenericSubstitution}
                  onCheckedChange={(checked) => setNoGenericSubstitution(checked as boolean)}
                />
                <Label htmlFor="no-generic-substitution" className="text-sm cursor-pointer">
                  後発医薬品への変更不可
                </Label>
              </div>
            </div>

            {/* リフィル処方設定 */}
            <div className="border rounded-lg p-3 bg-muted/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-purple-600" />
                  <Label htmlFor="refillEligible" className="text-sm font-medium">リフィル処方</Label>
                </div>
                <Switch
                  id="refillEligible"
                  checked={isRefillEligible}
                  onCheckedChange={setIsRefillEligible}
                  disabled={currentEditingDrug?.isRefillProhibited || isAsNeeded || usageType === 'asneeded' || topicalUsageType === 'asneeded'}
                />
              </div>
              
              {currentEditingDrug?.isRefillProhibited && (
                <div className="text-xs text-muted-foreground bg-orange-50 border border-orange-200 p-2 rounded mb-3">
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                      リフィル対象外
                    </Badge>
                    <span className="ml-1">
                      この薬剤はリフィル処方箋の対象外です（{currentEditingDrug.refillProhibitionReason}）
                    </span>
                  </div>
                </div>
              )}
              
              {(isAsNeeded || usageType === 'asneeded' || topicalUsageType === 'asneeded') && (
                <div className="text-xs text-muted-foreground bg-orange-50 border border-orange-200 p-2 rounded mb-3">
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                      リフィル対象外
                    </Badge>
                    <span className="ml-1">
                      頓用処方はリフィル処方箋の対象外です（服用量が不定のため）
                    </span>
                  </div>
                </div>
              )}
              
              {isRefillEligible && (
                <div className="space-y-3 pt-3 border-t border-border">
                  <div>
                    <Label htmlFor="refillCount" className="text-xs">リフィル回数</Label>
                    <Select value={refillCount} onValueChange={setRefillCount}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1回</SelectItem>
                        <SelectItem value="2">2回</SelectItem>
                        <SelectItem value="3">3回</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-xs text-muted-foreground bg-purple-50 p-2 rounded">
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 mb-1">
                      リフィル処方について
                    </Badge>
                    <p className="mt-1">
                      処方開始日から{period}日分を{refillCount}回リフィルで給付されます。（合計{parseInt(period || '0') * (parseInt(refillCount) + 1)}日分）
                    </p>
                    {currentEditingDrug?.routeType === '外用' && (
                      <p className="mt-2 text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                        ⚠️ 外用薬のリフィル処方では投与日数の記載が必須です
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 備考欄 */}
            <div>
              <Label htmlFor="notes" className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                備考・特記事項
              </Label>
              <Textarea
                id="notes"
                placeholder="特別な指示や注意事項があれば入力してください"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        )}
      </div>

      {(selectedDrug || editingHistoryOrder) && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                if (editingHistoryOrder) {
                  handleCancelEditHistoryOrder();
                } else {
                  handleClear();
                }
              }} 
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              <Plus className="w-4 h-4 mr-1" />
              {editingHistoryOrder ? '変更を保存' : (currentEditingDrug?.quantity && currentEditingDrug?.frequency) ? '更新' : 'オーダーリストに追加'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CenterPanel;