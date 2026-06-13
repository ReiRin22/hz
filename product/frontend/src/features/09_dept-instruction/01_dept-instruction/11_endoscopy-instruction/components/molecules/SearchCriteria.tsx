import { useState, useEffect } from 'react';
import { Button } from '@shared/components/atoms/button';
import { Input } from '@shared/components/atoms/input';
import { Label } from '@shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/atoms/select';
import { Calendar } from '@shared/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/components/atoms/popover';
import { RadioGroup, RadioGroupItem } from '@shared/components/atoms/radio-group';
import { CalendarIcon, Search, X, ChevronDown, User, ChevronUp } from 'lucide-react';
import type { OrderStatus, OrderType, Department } from '../../types';
import type { DateRange } from 'react-day-picker';

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
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: today,
    to: today
  });
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
  const [isExpanded, setIsExpanded] = useState(true);

  // 患者マスタデータ（患者IDと氏名の対応）
  const patientMaster: { [key: string]: string } = {
    'P00012353': '小林 健',
    'P00012354': '松本 恵子',
    'P00012374': '中野 裕太',
    'P00012355': '田中 太郎',
    'P00012356': '佐藤 花子',
    'P00012357': '鈴木 一郎',
    'P00012358': '高橋 美咲',
    'P00012359': '伊藤 健太',
    'P00012360': '渡辺 由美'
  };

  const availableStatuses: OrderStatus[] = ['指示受済', '受付済', '開始済', '採取済', '実施済', 'レポート作成済'];

  // 患者IDが変更されたら自動的に氏名を取得
  useEffect(() => {
    if (patientId && patientMaster[patientId]) {
      setPatientName(patientMaster[patientId]);
    } else if (!patientId) {
      // 患者IDがクリアされたら氏名もクリア
      setPatientName('');
    }
  }, [patientId]);

  const handleSearch = () => {
    onSearch({
      dateFrom: dateRange?.from || today,
      dateTo: dateRange?.to || today,
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
    setDateRange({ from: today, to: today });
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

  // 日付範囲の表示テキストを生成
  const formatDateRange = (): string => {
    if (!dateRange?.from) {
      return '日付を選択';
    }
    
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    };
    
    const fromStr = formatDate(dateRange.from);
    
    // 終了日がない、または開始日と同じ場合は単日表示
    if (!dateRange.to || dateRange.from.toDateString() === dateRange.to.toDateString()) {
      return fromStr;
    }
    
    // 期間表示
    const toStr = formatDate(dateRange.to);
    return `${fromStr} ～ ${toStr}`;
  };

  // 検索条件のサマリを生成
  const generateSummary = (): JSX.Element => {
    const parts: JSX.Element[] = [];
    
    // 1. 日付
    if (dateRange?.from) {
      parts.push(
        <span key="date">
          <span className="font-semibold">日付:</span> {formatDateRange()}
        </span>
      );
    }
    
    // 2. 入外区分
    if (locationFilter !== '全て') {
      parts.push(
        <span key="location">
          <span className="font-semibold">入外区分:</span> {locationFilter}
        </span>
      );
    }
    
    // 3. 診療科
    if (department !== '全て') {
      parts.push(
        <span key="department">
          <span className="font-semibold">診療科:</span> {department}
        </span>
      );
    }
    
    // 4. オーダー種
    if (orderType !== '全オーダー種') {
      parts.push(
        <span key="orderType">
          <span className="font-semibold">オーダー種:</span> {orderType}
        </span>
      );
    }
    
    // 5. 受付未/済
    if (statusCompletion !== 'all') {
      const completionText = statusCompletion === 'incomplete' ? '未' : '済';
      parts.push(
        <span key="completion">
          <span className="font-semibold">受付未/済:</span> {completionText}
        </span>
      );
    }
    
    // 6. 指示医
    if (attendingDoctor) {
      parts.push(
        <span key="doctor">
          <span className="font-semibold">指示医:</span> {attendingDoctor}
        </span>
      );
    }
    
    // 7. 病棟
    if (ward !== '全て') {
      parts.push(
        <span key="ward">
          <span className="font-semibold">病棟:</span> {ward}
        </span>
      );
    }
    
    // 8. ステータス
    if (statusFrom || statusTo) {
      const statusText = statusFrom && statusTo 
        ? `${statusFrom} ～ ${statusTo}`
        : statusFrom 
          ? `${statusFrom} ～`
          : `～ ${statusTo}`;
      parts.push(
        <span key="status">
          <span className="font-semibold">ステータス:</span> {statusText}
        </span>
      );
    }
    
    // 9. 患者ID
    if (patientId) {
      parts.push(
        <span key="patientId">
          <span className="font-semibold">患者ID:</span> {patientId}
        </span>
      );
    }
    
    // 10. 患者氏名
    if (patientName) {
      parts.push(
        <span key="patientName">
          <span className="font-semibold">患者氏名:</span> {patientName}
        </span>
      );
    }
    
    if (parts.length === 0) {
      return <span>条件未設定</span>;
    }
    
    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {index > 0 && <span className="mx-2">/</span>}
            {part}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 折りたたみ可能なヘッダー */}
      <div 
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3 flex-1">
          <h3 className="text-lg font-medium whitespace-nowrap">検索条件</h3>
          {!isExpanded && (
            <div className="text-sm text-gray-600 flex flex-wrap items-center gap-x-2 gap-y-1">
              {generateSummary()}
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" className="shrink-0">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* 折りたたみ可能なコンテンツエリア */}
      {isExpanded && (
        <div className="p-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* 日付 */}
            <div className="space-y-2">
              <Label>日付</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(newDate) => newDate && setDateRange(newDate)}
                    numberOfMonths={2}
                  />
                  <div className="flex justify-between items-center px-3 py-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDateRange(undefined)}
                      className="text-blue-600 hover:text-blue-700 h-8"
                    >
                      クリア
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDateRange({ from: today, to: today })}
                      className="text-blue-600 hover:text-blue-700 h-8"
                    >
                      今日
                    </Button>
                  </div>
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
                  <RadioGroupItem value="all" id="completion-all" />
                  <label
                    htmlFor="completion-all"
                    className="cursor-pointer select-none"
                  >
                    全て
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="incomplete" id="completion-incomplete" />
                  <label
                    htmlFor="completion-incomplete"
                    className="cursor-pointer select-none"
                  >
                    未
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="complete" id="completion-complete" />
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
                  <SelectItem value="外A">外来A</SelectItem>
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
              <div className="flex gap-2">
                <Select value={statusFrom} onValueChange={setStatusFrom}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStatuses.map((statusValue) => (
                      <SelectItem key={statusValue} value={statusValue}>
                        {statusValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-gray-600">～</span>
                <Select value={statusTo} onValueChange={setStatusTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStatuses.map((statusValue) => (
                      <SelectItem key={statusValue} value={statusValue}>
                        {statusValue}
                      </SelectItem>
                    ))}
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
                onChange={(e) => setPatientId(e.target.value)}
              />
            </div>

            {/* 患者氏名 */}
            <div className="space-y-2">
              <Label>患者氏名</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="患者ID/患者検索から自動入力"
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
        </div>
      )}
    </div>
  );
}