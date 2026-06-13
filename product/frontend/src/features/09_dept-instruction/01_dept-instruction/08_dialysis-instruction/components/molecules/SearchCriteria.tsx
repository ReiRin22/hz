import { useState } from 'react';
import { Button } from '@shared/components/atoms/button';
import { Input } from '@shared/components/atoms/input';
import { Label } from '@shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/atoms/select';
import { Calendar } from '@shared/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/components/atoms/popover';
import { RadioGroup, RadioGroupItem } from '@shared/components/atoms/radio-group';
import { CalendarIcon, Search, X, ChevronDown, ChevronUp, User } from 'lucide-react';
import type { OrderStatus, OrderType, Department } from '../../types';
import { getPatientInfo } from '../../lib/patientData';

interface SearchCriteriaProps {
  onSearch: (criteria: SearchFilters) => void;
  onClear: () => void;
}

export interface SearchFilters {
  dateFrom: Date;
  dateTo: Date;
  locationFilter: string;
  department: string;
  orderType: string;
  statusFrom: string;
  statusTo: string;
  statusCompletion: 'all' | 'incomplete' | 'complete';
  patientId: string;
  patientName: string;
  attendingDoctor: string;
  ward: string;
}

export function SearchCriteria({ onSearch, onClear }: SearchCriteriaProps) {
  const [dateFrom, setDateFrom] = useState<Date>(new Date());
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [locationFilter, setLocationFilter] = useState<string>('全て');
  const [department, setDepartment] = useState<string>('全て');
  const [orderType, setOrderType] = useState<string>('全オーダー種');
  const [statusFrom, setStatusFrom] = useState<string>('');
  const [statusTo, setStatusTo] = useState<string>('');
  const [statusCompletion, setStatusCompletion] = useState<'all' | 'incomplete' | 'complete'>('all');
  const [patientId, setPatientId] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [attendingDoctor, setAttendingDoctor] = useState<string>('');
  const [ward, setWard] = useState<string>('全て');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 日付フォーマット関数（YYYY/MM/DD形式）
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // 日付表示テキストを生成
  const getDateDisplayText = (): string => {
    if (!dateFrom && !dateTo) return '日付を選択';
    if (!dateFrom) return formatDate(dateTo);
    if (!dateTo) return formatDate(dateFrom);
    
    // 同じ日付の場合は単日表記
    if (dateFrom.toDateString() === dateTo.toDateString()) {
      return formatDate(dateFrom);
    }
    
    // 異なる日付の場合は範囲表記
    return `${formatDate(dateFrom)} - ${formatDate(dateTo)}`;
  };

  const availableStatuses: OrderStatus[] = ['指示受済', '実施済', '結果待ち', '実施済み', '出庫'];

  const handleSearch = () => {
    onSearch({
      dateFrom,
      dateTo,
      locationFilter,
      department,
      orderType,
      statusFrom,
      statusTo,
      statusCompletion,
      patientId,
      patientName,
      attendingDoctor,
      ward
    });
  };

  const handleClear = () => {
    setDateFrom(new Date());
    setDateTo(new Date());
    setLocationFilter('全て');
    setDepartment('全て');
    setOrderType('全オーダー種');
    setStatusFrom('');
    setStatusTo('');
    setStatusCompletion('all');
    setPatientId('');
    setPatientName('');
    setAttendingDoctor('');
    setWard('全て');
    onClear();
  };

  const handlePatientSearch = () => {
    // 患者検索ロジック（実際にはAPIを呼び出すなど）
    console.log('患者検索:', { patientId, patientName });
    // ここでは検索を実行
    handleSearch();
  };

  // 検索条件のサマリを生成
  const getSummary = () => {
    const items = [];
    
    items.push(`日付: ${getDateDisplayText()}`);
    
    if (locationFilter !== '全て') {
      items.push(`入外区分: ${locationFilter}`);
    }
    
    if (department !== '全て') {
      items.push(`診療科: ${department}`);
    }
    
    if (orderType !== '全オーダー種') {
      items.push(`オーダー種: ${orderType}`);
    }
    
    if (statusFrom || statusTo) {
      items.push(`ステータス: ${statusFrom}～${statusTo}`);
    }
    
    if (statusCompletion !== 'all') {
      const completionText = statusCompletion === 'incomplete' ? '未' : '済';
      items.push(`オーダー未/済: ${completionText}`);
    }
    
    if (ward !== '全て') {
      items.push(`病棟: ${ward}`);
    }
    
    if (attendingDoctor) {
      items.push(`主治医: ${attendingDoctor}`);
    }
    
    if (patientId) {
      items.push(`患者ID: ${patientId}`);
    }
    
    if (patientName) {
      items.push(`患者氏名: ${patientName}`);
    }
    
    return items.join(' | ');
  };

  return (
    <div className="bg-white px-6 py-6 rounded-lg shadow-sm border border-gray-200">
      {/* ヘッダー部分 */}
      <div 
        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <h3 className="text-lg font-semibold shrink-0">検索条件</h3>
          {isCollapsed && (
            <p className="text-sm text-gray-600 truncate">{getSummary()}</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 shrink-0">
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* 折りたたみ時のサマリ表示 */}
      {isCollapsed ? (
        null
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 mt-4">
            {/* 日付 */}
            <div className="space-y-2">
              <Label>日付</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {getDateDisplayText()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: dateFrom, to: dateTo }}
                    onSelect={(range) => {
                      if (range?.from) {
                        setDateFrom(range.from);
                        setDateTo(range.to || range.from);
                      }
                    }}
                    numberOfMonths={2}
                    onClear={() => {
                      setDateFrom(new Date());
                      setDateTo(new Date());
                    }}
                    onToday={() => {
                      const today = new Date();
                      setDateFrom(today);
                      setDateTo(today);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 入外区分 */}
            <div className="space-y-2">
              <Label>入外区分</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全て">全て</SelectItem>
                  <SelectItem value="外来">外来</SelectItem>
                  <SelectItem value="入院">入院</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 診療科 */}
            <div className="space-y-2">
              <Label>診療科</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全て">全て</SelectItem>
                  <SelectItem value="内科">内科</SelectItem>
                  <SelectItem value="外科">外科</SelectItem>
                  <SelectItem value="小児科">小児科</SelectItem>
                  <SelectItem value="整形外科">整形外科</SelectItem>
                  <SelectItem value="産婦人科">産婦人科</SelectItem>
                  <SelectItem value="循環器科">循環器科</SelectItem>
                  <SelectItem value="呼吸器科">呼吸器科</SelectItem>
                  <SelectItem value="皮膚科">皮膚科</SelectItem>
                  <SelectItem value="泌尿器科">泌尿器科</SelectItem>
                  <SelectItem value="耳鼻咽喉科">耳鼻咽喉科</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* オーダー種 */}
            <div className="space-y-2">
              <Label>オーダー種</Label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全オーダー種">全オーダー種</SelectItem>
                  <SelectItem value="栄養">栄養</SelectItem>
                  <SelectItem value="検体検査">検体検査</SelectItem>
                  <SelectItem value="生理検査">生理検査</SelectItem>
                  <SelectItem value="内視鏡検査">内視鏡検査</SelectItem>
                  <SelectItem value="画像検査">画像検査</SelectItem>
                  <SelectItem value="処置オーダー">処置オーダー</SelectItem>
                  <SelectItem value="注射オーダー">注射オーダー</SelectItem>
                  <SelectItem value="薬剤">薬剤</SelectItem>
                  <SelectItem value="処方">処方</SelectItem>
                  <SelectItem value="服薬指導">服薬指導</SelectItem>
                  <SelectItem value="リハビリ">リハビリ</SelectItem>
                  <SelectItem value="放射線">放射線</SelectItem>
                  <SelectItem value="看護指示">看護指示</SelectItem>
                  <SelectItem value="病理">病理</SelectItem>
                  <SelectItem value="細菌">細菌</SelectItem>
                  <SelectItem value="透析">透析</SelectItem>
                  <SelectItem value="汎用オーダー">汎用オーダー</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 受付未/済 */}
            <div className="space-y-2">
              <Label>受付未/済</Label>
              <RadioGroup 
                value={statusCompletion} 
                onValueChange={(value) => setStatusCompletion(value as 'all' | 'incomplete' | 'complete')}
                className="flex gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="completion-all" className="border-gray-400" />
                  <label
                    htmlFor="completion-all"
                    className="cursor-pointer select-none"
                  >
                    全て
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="incomplete" id="completion-incomplete" className="border-gray-400" />
                  <label
                    htmlFor="completion-incomplete"
                    className="cursor-pointer select-none"
                  >
                    未
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="complete" id="completion-complete" className="border-gray-400" />
                  <label
                    htmlFor="completion-complete"
                    className="cursor-pointer select-none"
                  >
                    済
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* 指示医 */}
            <div className="space-y-2">
              <Label>指示医</Label>
              <Input
                placeholder="指示医名を入力"
                value={attendingDoctor}
                onChange={(e) => setAttendingDoctor(e.target.value)}
              />
            </div>

            {/* 病棟 */}
            <div className="space-y-2">
              <Label>病棟</Label>
              <Select value={ward} onValueChange={setWard}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全て">全て</SelectItem>
                  <SelectItem value="外来A">外来A</SelectItem>
                  <SelectItem value="外来B">外来B</SelectItem>
                  <SelectItem value="外来C">外来C</SelectItem>
                  <SelectItem value="1病棟">1病棟</SelectItem>
                  <SelectItem value="2病棟">2病棟</SelectItem>
                  <SelectItem value="3病棟">3病棟</SelectItem>
                  <SelectItem value="4病棟">4病棟</SelectItem>
                  <SelectItem value="ICU">ICU</SelectItem>
                  <SelectItem value="救急">救急</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ステータス（範囲選択） */}
            <div className="space-y-2">
              <Label>ステータス</Label>
              <div className="flex items-center gap-2">
                <Select value={statusFrom} onValueChange={setStatusFrom}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="指示受済">指示受済</SelectItem>
                    <SelectItem value="実施済">実施済</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-gray-500 shrink-0">～</span>
                <Select value={statusTo} onValueChange={setStatusTo}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="指示受済">指示受済</SelectItem>
                    <SelectItem value="実施済">実施済</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 患者ID */}
            <div className="space-y-2">
              <Label>患者ID</Label>
              <Input
                placeholder="患者IDを入力"
                value={patientId}
                onChange={(e) => {
                  const id = e.target.value;
                  setPatientId(id);
                  // 患者IDから自動的に氏名を取得
                  const patientInfo = getPatientInfo(id);
                  if (patientInfo) {
                    setPatientName(patientInfo.patientName);
                  } else {
                    setPatientName('');
                  }
                }}
              />
            </div>

            {/* 患者氏名 */}
            <div className="space-y-2">
              <Label>患者氏名</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="自動取得"
                  value={patientName}
                  readOnly
                  className="flex-1 bg-gray-50"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handlePatientSearch}
                  title="患者検索"
                >
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleClear} className="gap-2">
              <X className="h-4 w-4" />
              クリア
            </Button>
            <Button onClick={handleSearch} className="gap-2">
              <Search className="h-4 w-4" />
              検索
            </Button>
          </div>
        </>
      )}
    </div>
  );
}