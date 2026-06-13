import { useState } from 'react';
import { Button } from '@shared/components/atoms/button';
import { Input } from '@shared/components/atoms/input';
import { Label } from '@shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/atoms/select';
import { Calendar } from '@shared/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/components/atoms/popover';
import { RadioGroup, RadioGroupItem } from '@shared/components/atoms/radio-group';
import { Checkbox } from '@shared/components/atoms/checkbox';
import { CalendarIcon, Search, X, ChevronDown, ChevronUp, User } from 'lucide-react';
import type { OrderStatus, OrderType, Department } from '../../types';
import type { DateRange } from 'react-day-picker';

interface SearchCriteriaProps {
  onSearch: (criteria: SearchFilters) => void;
  onClear: () => void;
}

export interface StatusFilter {
  status: string;
  completion: 'incomplete' | 'complete';
}

export interface SearchFilters {
  dateFrom: Date;
  dateTo: Date;
  locationFilter: string;
  department: string;
  orderType: string;
  selectedStatuses: StatusFilter[];
  statusCompletion: 'all' | 'incomplete' | 'complete';
  patientId: string;
  patientName: string;
  attendingDoctor: string;
  ward: string;
  labTestLocation: string; // 院内/院外検査の絞り込み
  imageTestType: string; // 画像検査の種類
  physiologicalTestType: string; // 生理検査の種類
  prescriptionLocation: string; // 処方の絞り込み
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
  const [selectedStatuses, setSelectedStatuses] = useState<StatusFilter[]>([]);
  const [statusCompletion, setStatusCompletion] = useState<'all' | 'incomplete' | 'complete'>('all');
  const [patientId, setPatientId] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [attendingDoctor, setAttendingDoctor] = useState<string>('');
  const [ward, setWard] = useState<string>('全て');
  const [isExpanded, setIsExpanded] = useState(true);
  const [labTestLocation, setLabTestLocation] = useState<string>('全て'); // 院内/院外検査
  const [imageTestType, setImageTestType] = useState<string>('全て'); // 画像検査の種類
  const [physiologicalTestType, setPhysiologicalTestType] = useState<string>('全て'); // 生理検査の種類
  const [prescriptionLocation, setPrescriptionLocation] = useState<string>('全て'); // 処方

  const availableStatuses: OrderStatus[] = ['指示受済', '受付済', '開始済', '採取済', '出庫済', '実施済'];

  const handleSearch = () => {
    onSearch({
      dateFrom: dateRange?.from || today,
      dateTo: dateRange?.to || today,
      locationFilter,
      department,
      orderType,
      selectedStatuses: selectedStatuses,
      statusCompletion,
      patientId,
      patientName,
      attendingDoctor,
      ward,
      labTestLocation,
      imageTestType,
      physiologicalTestType,
      prescriptionLocation
    });
  };

  const handleClear = () => {
    const today = new Date();
    setDateRange({ from: today, to: today });
    setLocationFilter('全て');
    setDepartment('全て');
    setOrderType('全オーダー種');
    setSelectedStatuses([]);
    setStatusCompletion('all');
    setPatientId('');
    setPatientName('');
    setAttendingDoctor('');
    setWard('全て');
    setLabTestLocation('全て'); // 院内/院外検査
    setImageTestType('全て'); // 画像検査の種類
    setPhysiologicalTestType('全て'); // 生理検査の種類
    setPrescriptionLocation('全て'); // 処方
    onClear();
  };

  const handlePatientSearch = () => {
    // 患者ID検索ロジック（実際にはAPIを呼び出すなど）
    if (!patientId.trim()) {
      setPatientName('');
      return;
    }
    
    // モックデータ: 患者IDから患者氏名を取得
    const mockPatients: Record<string, string> = {
      '00001': '山田 太郎',
      '00002': '佐藤 花子',
      '00003': '鈴木 一郎',
      '00004': '田中 美咲',
      '00005': '高橋 健太',
      '12345': '伊藤 良子',
      '67890': '渡辺 直樹',
    };
    
    const foundPatientName = mockPatients[patientId] || '';
    setPatientName(foundPatientName);
    
    if (!foundPatientName) {
      console.log('患者が見つかりませんでした:', patientId);
    }
  };

  // ステータスのチェックボックスハンドラー
  const handleStatusToggle = (status: OrderStatus) => {
    setSelectedStatuses(prev => 
      prev.some(s => s.status === status) 
        ? prev.filter(s => s.status !== status)
        : [...prev, { status, completion: 'incomplete' }]
    );
  };

  // ステータスの未/済切り替えハンドラー
  const handleCompletionChange = (status: OrderStatus, completion: 'incomplete' | 'complete') => {
    setSelectedStatuses(prev => 
      prev.map(s => s.status === status ? { ...s, completion } : s)
    );
  };

  // 日付範囲の表示テキスト
  const getDateRangeText = () => {
    if (!dateRange?.from) return '日付を選択';
    
    const fromText = dateRange.from.toLocaleDateString('ja-JP');
    const toText = dateRange.to ? dateRange.to.toLocaleDateString('ja-JP') : fromText;
    
    if (fromText === toText) {
      return fromText;
    }
    
    return `${fromText} 〜 ${toText}`;
  };

  // ステータス範囲の表示テキスト
  const getStatusRangeText = () => {
    if (selectedStatuses.length === 0) return '';
    if (selectedStatuses.length === 1) return `ステータス: ${selectedStatuses[0].status}`;
    return `ステータス: ${selectedStatuses.map(s => s.status).join(', ')}`;
  };

  // サマリテキストを生成
  const getSummaryText = () => {
    const parts: JSX.Element[] = [];
    
    parts.push(<><strong>日付:</strong> {getDateRangeText()}</>);
    
    if (locationFilter !== '全て') {
      parts.push(<><strong>入外区分:</strong> {locationFilter}</>);
    }
    
    if (department !== '全て') {
      parts.push(<><strong>診療科:</strong> {department}</>);
    }
    
    if (orderType !== '全オーダー種') {
      parts.push(<><strong>オーダー種:</strong> {orderType}</>);
    }
    
    if (statusCompletion !== 'all') {
      const completionLabel = statusCompletion === 'incomplete' ? '未' : '済';
      parts.push(<><strong>受付未/済:</strong> {completionLabel}</>);
    }
    
    if (attendingDoctor) {
      parts.push(<><strong>指示医:</strong> {attendingDoctor}</>);
    }
    
    if (ward !== '全て') {
      parts.push(<><strong>病棟:</strong> {ward}</>);
    }
    
    // ステータス
    if (selectedStatuses.length > 0) {
      parts.push(<><strong>ステータス:</strong> {selectedStatuses.map(s => s.status).join(', ')}</>);
    }
    
    if (patientId) {
      parts.push(<><strong>患者ID:</strong> {patientId}</>);
    }
    
    if (patientName) {
      parts.push(<><strong>患者氏名:</strong> {patientName}</>);
    }
    
    return parts;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* ヘッダー */}
      <div 
        className="flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-base">検索条件</h2>
            {!isExpanded && (
              <span className="text-sm text-gray-600">
                {getSummaryText().map((part, index) => (
                  <span key={index}>
                    {index > 0 && '、'}
                    {part}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* 検索フォーム */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* 日付 */}
            <div className="space-y-2">
              <Label>日付</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {getDateRangeText()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
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
              <div className="flex gap-2">
                <Select 
                  value={orderType} 
                  onValueChange={(value) => {
                    setOrderType(value);
                    // オーダー種が変更されたらサブカテゴリをリセット
                    if (value !== '検体検査') setLabTestLocation('全て');
                    if (value !== '画像検査') setImageTestType('全て');
                    if (value !== '生理検査') setPhysiologicalTestType('全て');
                    if (value !== '処方') setPrescriptionLocation('全て');
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="全オーダー種">全オーダー種</SelectItem>
                    <SelectItem value="注射">注射</SelectItem>
                    <SelectItem value="処方">処方</SelectItem>
                    <SelectItem value="処置">処置</SelectItem>
                    <SelectItem value="服薬指導">服薬指導</SelectItem>
                    <SelectItem value="栄養指導">栄養指導</SelectItem>
                    <SelectItem value="検体検査">検体検査</SelectItem>
                    <SelectItem value="生理検査">生理検査</SelectItem>
                    <SelectItem value="病理検査">病理検査</SelectItem>
                    <SelectItem value="細菌検査">細菌検査</SelectItem>
                    <SelectItem value="内視鏡検査">内視鏡検査</SelectItem>
                    <SelectItem value="画像検査">画像検査</SelectItem>
                    <SelectItem value="汎用">汎用</SelectItem>
                    <SelectItem value="リハビリ">リハビリ</SelectItem>
                  </SelectContent>
                </Select>
                {orderType === '処方' && (
                  <Select value={prescriptionLocation} onValueChange={setPrescriptionLocation}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全て">全て</SelectItem>
                      <SelectItem value="院内">院内</SelectItem>
                      <SelectItem value="院外">院外</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {orderType === '検体検査' && (
                  <Select value={labTestLocation} onValueChange={setLabTestLocation}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全て">全て</SelectItem>
                      <SelectItem value="院内">院内</SelectItem>
                      <SelectItem value="院外">院外</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {orderType === '画像検査' && (
                  <Select value={imageTestType} onValueChange={setImageTestType}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全て">全て</SelectItem>
                      <SelectItem value="一般">一般</SelectItem>
                      <SelectItem value="CT">CT</SelectItem>
                      <SelectItem value="MRI">MRI</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {orderType === '生理検査' && (
                  <Select value={physiologicalTestType} onValueChange={setPhysiologicalTestType}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全て">全て</SelectItem>
                      <SelectItem value="心電図">心電図</SelectItem>
                      <SelectItem value="ホルター心電図">ホルター心電図</SelectItem>
                      <SelectItem value="超音波">超音波</SelectItem>
                      <SelectItem value="腹部超音波">腹部超音波</SelectItem>
                      <SelectItem value="心臓超音波">心臓超音</SelectItem>
                      <SelectItem value="甲状腺超音波">甲状腺超音波</SelectItem>
                      <SelectItem value="頸動脈エコー">頸動脈エコー</SelectItem>
                      <SelectItem value="血圧脈波検査">血圧脈波検査</SelectItem>
                      <SelectItem value="脳波">脳波</SelectItem>
                      <SelectItem value="眼底カメラ">眼底カメラ</SelectItem>
                      <SelectItem value="眼圧測定">眼圧測定</SelectItem>
                      <SelectItem value="肺機能検査">肺機能検査</SelectItem>
                      <SelectItem value="呼気NO測定">呼気NO測定</SelectItem>
                      <SelectItem value="聴力検査">聴力検査</SelectItem>
                      <SelectItem value="24時間血圧測定">24時間血圧測定</SelectItem>
                      <SelectItem value="起立試験">起立試験</SelectItem>
                      <SelectItem value="体成分分析">体成分分析</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
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

            {/* 主治医 */}
            <div className="space-y-2">
              <Label>指示医</Label>
              <Input
                placeholder="指示医名を入力"
                value={attendingDoctor}
                onChange={(e) => setAttendingDoctor(e.target.value)}
              />
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
                  placeholder="患者ID/患者検索機能から自動表示"
                  value={patientName}
                  readOnly
                  className="flex-1 bg-gray-50 cursor-not-allowed"
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
            <div className="space-y-2 lg:col-span-2">
              <Label>ステータス</Label>
              <div className="grid grid-cols-3 gap-x-2 gap-y-1.5">
                {availableStatuses.map(status => {
                  const selectedStatus = selectedStatuses.find(s => s.status === status);
                  const isChecked = !!selectedStatus;
                  
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
                        {status.replace('済', '')}
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
                          未
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
                          済
                        </button>
                      </div>
                    </div>
                  );
                })}
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