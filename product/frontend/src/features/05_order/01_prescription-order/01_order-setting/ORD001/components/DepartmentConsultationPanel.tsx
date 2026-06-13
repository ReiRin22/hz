import React, { useState } from 'react';
import { Button } from '@/shared/components/atoms/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { Card } from '@/shared/components/atoms/card';
import { Label } from '@/shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Calendar } from '@/shared/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { RadioGroup, RadioGroupItem } from '@/shared/components/atoms/radio-group';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ConsultationRequest {
  id: string;
  requestDate: string;
  targetDepartment: string;
  requester: string;
  status: '対応中' | '完了' | '保留';
  reason?: string;
  content?: string;
  preferredDate?: Date;
  urgency?: '通常' | '至急';
  attachments?: string[];
  replyComment?: string;
}

interface DepartmentConsultationPanelProps {
  onBack: () => void;
  patientName: string;
}

export function DepartmentConsultationPanel({ onBack, patientName }: DepartmentConsultationPanelProps) {
  // Form state for new consultation
  const [targetDepartment, setTargetDepartment] = useState('');
  const [reason, setReason] = useState('');
  const [content, setContent] = useState('');
  const [preferredDate, setPreferredDate] = useState<Date>();
  const [urgency, setUrgency] = useState<'通常' | '至急'>('通常');
  const [attachTestResults, setAttachTestResults] = useState(false);
  const [attachImages, setAttachImages] = useState(false);

  // Filter state
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<Date>();
  const [filterDateTo, setFilterDateTo] = useState<Date>();
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [filterMyRequests, setFilterMyRequests] = useState(false);

  // Sample data
  const consultationRequests: ConsultationRequest[] = [
    {
      id: '1',
      requestDate: '2025/10/12',
      targetDepartment: '循環器内科',
      requester: '山田医師',
      status: '対応中',
      reason: '胸痛の精査',
      content: '数日前より胸部違和感を訴えており、心電図異常を認めたため、循環器内科での精査をお願いします。',
      urgency: '至急',
      attachments: ['心電図', '胸部X線'],
      replyComment: '本日午後に診察予定です。'
    },
    {
      id: '2',
      requestDate: '2025/10/10',
      targetDepartment: '皮膚科',
      requester: '佐藤医師',
      status: '完了',
      reason: '皮疹の診断',
      content: '全身に皮疹が出現。原因不明のため皮膚科での診断をお願いします。',
      urgency: '通常',
      attachments: ['写真'],
      replyComment: '接触性皮膚炎と診断しました。ステロイド外用薬を処方しています。'
    },
    {
      id: '3',
      requestDate: '2025/10/08',
      targetDepartment: '整形外科',
      requester: '鈴木医師',
      status: '完了',
      reason: '腰痛の精査',
      content: '慢性腰痛が悪化。MRI検査の必要性について相談させてください。',
      urgency: '通常',
      replyComment: '椎間板ヘルニアの疑い。MRI予約済みです。'
    }
  ];

  const departments = [
    '循環器内科',
    '呼吸器内科',
    '消化器内科',
    '神経内科',
    '皮膚科',
    '整形外科',
    '泌尿器科',
    '耳鼻咽喉科',
    '眼科',
    '精神科'
  ];

  const handleSubmit = () => {
    alert('依頼を送信しました');
    // Reset form after submission
    setTargetDepartment('');
    setReason('');
    setContent('');
    setPreferredDate(undefined);
    setUrgency('通常');
    setAttachTestResults(false);
    setAttachImages(false);
  };

  const handleSaveDraft = () => {
    alert('下書きを保存しました');
  };

  const handleClearForm = () => {
    setTargetDepartment('');
    setReason('');
    setContent('');
    setPreferredDate(undefined);
    setUrgency('通常');
    setAttachTestResults(false);
    setAttachImages(false);
  };

  const handleSearch = () => {
    // フィルタ検索処理のシミュレーション
    console.log('Filter search:', {
      status: filterStatus,
      department: filterDepartment,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
      urgency: filterUrgency,
      myRequests: filterMyRequests
    });
  };

  const handleClearFilters = () => {
    setFilterStatus('all');
    setFilterDepartment('all');
    setFilterDateFrom(undefined);
    setFilterDateTo(undefined);
    setFilterUrgency('all');
    setFilterMyRequests(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '対応中':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '完了':
        return 'bg-green-100 text-green-800 border-green-200';
      case '保留':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-gray-900">他科依頼（{patientName}）</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Pane: Consultation List */}
        <div className="flex-1 bg-white border-r flex flex-col min-w-0">
          <div className="p-4 border-b">
            <h2 className="text-gray-900">依頼一覧</h2>
          </div>
          
          {/* Filter Section */}
          <div className="p-4 border-b bg-gray-50 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {/* Status Filter */}
              <div>
                <Label htmlFor="filter-status" className="text-xs mb-1 block">ステータス</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="filter-status" className="h-8 text-sm">
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="未対応">未対応</SelectItem>
                    <SelectItem value="対応中">対応中</SelectItem>
                    <SelectItem value="完了">完了</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Department Filter */}
              <div>
                <Label htmlFor="filter-department" className="text-xs mb-1 block">依頼先科</Label>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger id="filter-department" className="h-8 text-sm">
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Urgency Filter */}
              <div>
                <Label htmlFor="filter-urgency" className="text-xs mb-1 block">緊急度</Label>
                <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                  <SelectTrigger id="filter-urgency" className="h-8 text-sm">
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="通常">通常</SelectItem>
                    <SelectItem value="至急">至急</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Date From */}
              <div>
                <Label className="text-xs mb-1 block">依頼日（開始）</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start h-8 text-sm">
                      {filterDateFrom ? format(filterDateFrom, 'yyyy/MM/dd') : '選択'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filterDateFrom}
                      onSelect={setFilterDateFrom}
                      locale={ja}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To */}
              <div>
                <Label className="text-xs mb-1 block">依頼日（終了）</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start h-8 text-sm">
                      {filterDateTo ? format(filterDateTo, 'yyyy/MM/dd') : '選択'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filterDateTo}
                      onSelect={setFilterDateTo}
                      locale={ja}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* My Requests Checkbox and Search Button */}
              <div className="flex flex-col justify-end">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filter-my-requests"
                      checked={filterMyRequests}
                      onCheckedChange={(checked) => setFilterMyRequests(checked as boolean)}
                    />
                    <Label htmlFor="filter-my-requests" className="text-sm cursor-pointer">
                      自分宛
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleClearFilters} className="h-8">
                      クリア
                    </Button>
                    <Button size="sm" onClick={handleSearch} className="h-8">
                      検索
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b sticky top-0">
                <tr>
                  <th className="px-2 py-2 text-left text-xs text-gray-600 whitespace-nowrap">依頼日</th>
                  <th className="px-2 py-2 text-left text-xs text-gray-600 whitespace-nowrap">依頼先科</th>
                  <th className="px-2 py-2 text-left text-xs text-gray-600 whitespace-nowrap">依頼者</th>
                  <th className="px-2 py-2 text-left text-xs text-gray-600 whitespace-nowrap">ステータス</th>
                  <th className="px-2 py-2 text-left text-xs text-gray-600 whitespace-nowrap">依頼理由</th>
                  <th className="px-2 py-2 text-left text-xs text-gray-600 whitespace-nowrap">依頼内容</th>
                  <th className="px-2 py-2 text-left text-xs text-gray-600 whitespace-nowrap">緊急度</th>
                  <th className="px-2 py-2 text-left text-xs text-gray-600 whitespace-nowrap">添付情報</th>
                  <th className="px-2 py-2 text-left text-xs text-gray-600 whitespace-nowrap">返信コメント</th>
                </tr>
              </thead>
              <tbody>
                {consultationRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-2 py-3 text-sm whitespace-nowrap align-top">{request.requestDate}</td>
                    <td className="px-2 py-3 text-sm whitespace-nowrap align-top">{request.targetDepartment}</td>
                    <td className="px-2 py-3 text-sm whitespace-nowrap align-top">{request.requester}</td>
                    <td className="px-2 py-3 align-top">
                      <span className={`inline-block px-2 py-1 text-xs border rounded ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-sm align-top">{request.reason || '-'}</td>
                    <td className="px-2 py-3 text-sm align-top max-w-xs">
                      {request.content || '-'}
                    </td>
                    <td className="px-2 py-3 align-top">
                      {request.urgency && (
                        <span className={`inline-block px-2 py-1 text-xs border rounded whitespace-nowrap ${
                          request.urgency === '至急' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {request.urgency}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-3 text-sm align-top">
                      {request.attachments && request.attachments.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {request.attachments.map((attachment, index) => (
                            <span key={index} className="px-1.5 py-0.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded whitespace-nowrap">
                              {attachment}
                            </span>
                          ))}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-2 py-3 text-sm align-top max-w-xs">
                      {request.replyComment || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Pane: New Request Form */}
        <div className="w-[450px] bg-white overflow-auto shrink-0">
          <div className="p-6">
            <h2 className="text-gray-900 mb-6">新規依頼作成</h2>
              
              <div className="space-y-6">
                {/* Target Department */}
                <div className="space-y-2">
                  <Label htmlFor="department">依頼先科 *</Label>
                  <Select value={targetDepartment} onValueChange={setTargetDepartment}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="診療科を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <Label htmlFor="reason">依頼理由 *</Label>
                  <input
                    id="reason"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="例：胸痛の精査"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">依頼内容 *</Label>
                  <Textarea
                    id="content"
                    rows={6}
                    placeholder="依頼内容の詳細を入力してください"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* Preferred Date */}
                <div className="space-y-2">
                  <Label>希望日時</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {preferredDate ? format(preferredDate, 'PPP', { locale: ja }) : '日付を選択'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={preferredDate}
                        onSelect={setPreferredDate}
                        locale={ja}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Urgency */}
                <div className="space-y-2">
                  <Label>緊急度</Label>
                  <RadioGroup value={urgency} onValueChange={(value) => setUrgency(value as '通常' | '至急')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="通常" id="normal" />
                      <Label htmlFor="normal">通常</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="至急" id="urgent" />
                      <Label htmlFor="urgent">至急</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <Label>添付情報</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="testResults"
                        checked={attachTestResults}
                        onCheckedChange={(checked) => setAttachTestResults(checked as boolean)}
                      />
                      <Label htmlFor="testResults" className="cursor-pointer">検査結果</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="images"
                        checked={attachImages}
                        onCheckedChange={(checked) => setAttachImages(checked as boolean)}
                      />
                      <Label htmlFor="images" className="cursor-pointer">画像</Label>
                    </div>
                  </div>
                </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSubmit} disabled={!targetDepartment || !reason || !content}>
                  送信
                </Button>
                <Button variant="outline" onClick={handleSaveDraft}>
                  下書き保存
                </Button>
                <Button variant="ghost" onClick={handleClearForm}>
                  クリア
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartmentConsultationPanel;