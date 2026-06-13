import React, { useState } from 'react';
import { Search, Filter, FileText, Printer, Edit, Send, Trash2, Archive, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Badge } from '@/shared/components/atoms/badge';
import { Card } from '@/shared/components/atoms/card';
import { Calendar } from '@/shared/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Separator } from '@/shared/components/atoms/separator';

interface Document {
  id: string;
  type: string;
  patientName: string;
  patientNumber: string;
  createdDate: string;
  creator: string;
  status: '作成中' | '承認済' | '送信済' | '破棄';
  content: string;
  history: {
    date: string;
    user: string;
    action: string;
  }[];
}

interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
}

interface DocumentManagementPanelProps {
  currentPatient?: CurrentPatient;
  onImportClick?: () => void;
}

export function DocumentManagementPanel({ currentPatient, onImportClick }: DocumentManagementPanelProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'patient'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  // Filter states
  const [filterPatient, setFilterPatient] = useState<string>('all');
  const [filterDocType, setFilterDocType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCreator, setFilterCreator] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<Date>();
  const [filterDateTo, setFilterDateTo] = useState<Date>();
  const [searchKeyword, setSearchKeyword] = useState('');

  // Sample data
  const documents: Document[] = [
    {
      id: 'doc001',
      type: '診断書',
      patientName: '山田太郎',
      patientNumber: '12345678',
      createdDate: '2025/10/14',
      creator: '田中医師',
      status: '作成中',
      content: '上記の者は、2025年10月12日に当院を受診し、急性上気道炎と診断されました。治療のため、本日より3日間の自宅療養が必要と認めます。',
      history: [
        { date: '2025/10/14 14:30', user: '田中医師', action: '新規作成' },
        { date: '2025/10/14 14:45', user: '田中医師', action: '編集' }
      ]
    },
    {
      id: 'doc002',
      type: '紹介状',
      patientName: '佐藤花子',
      patientNumber: '23456789',
      createdDate: '2025/10/13',
      creator: '山本医師',
      status: '承認済',
      content: '貴院での精査・加療をお願い申し上げます。\n\n【診断名】高血圧症、糖尿病\n【現病歴】3ヶ月前より血圧高値を指摘。降圧薬内服にて経過観察中。\n【現症】血圧 160/95 mmHg、脈拍 72/分、体温 36.5℃',
      history: [
        { date: '2025/10/13 10:00', user: '山本医師', action: '新規作成' },
        { date: '2025/10/13 10:30', user: '山本医師', action: '編集' },
        { date: '2025/10/13 11:00', user: '山本医師', action: '承認' }
      ]
    },
    {
      id: 'doc003',
      type: '診療情報提供書',
      patientName: '鈴木一郎',
      patientNumber: '34567890',
      createdDate: '2025/10/12',
      creator: '佐藤医師',
      status: '送信済',
      content: '【傷病名】狭心症の疑い\n【紹介目的】循環器専門医による精査依頼\n【現病歴】1週間前より労作時胸部圧迫感あり。安静時には症状なし。\n【検査所見】心電図：ST低下、心エコー：異常なし',
      history: [
        { date: '2025/10/12 09:00', user: '佐藤医師', action: '新規作成' },
        { date: '2025/10/12 09:30', user: '佐藤医師', action: '承認' },
        { date: '2025/10/12 10:00', user: '医事課', action: '送信' }
      ]
    },
    {
      id: 'doc004',
      type: '診断書',
      patientName: '山田太郎',
      patientNumber: '12345678',
      createdDate: '2025/10/10',
      creator: '田中医師',
      status: '送信済',
      content: '上記の者は、2025年10月8日に当院を受診し、急性胃腸炎と診断されました。治療のため、10月8日より5日間の自宅療養が必要と認めます。',
      history: [
        { date: '2025/10/10 13:00', user: '田中医師', action: '新規作成' },
        { date: '2025/10/10 13:20', user: '田中医師', action: '承認' },
        { date: '2025/10/10 14:00', user: '医事課', action: '送信' }
      ]
    },
    {
      id: 'doc005',
      type: '処方箋',
      patientName: '田中次郎',
      patientNumber: '45678901',
      createdDate: '2025/10/11',
      creator: '山本医師',
      status: '承認済',
      content: '【処方内容】\nアムロジピン錠5mg 1錠 1日1回 朝食後 28日分\nアトルバスタチン錠10mg 1錠 1日1回 夕食後 28日分',
      history: [
        { date: '2025/10/11 11:00', user: '山本医師', action: '新規作成' },
        { date: '2025/10/11 11:15', user: '山本医師', action: '承認' }
      ]
    }
  ];

  const documentTypes = ['診断書', '紹介状', '診療情報提供書', '処方箋', '意見書', '証明書'];
  const creators = ['田中医師', '山本医師', '佐藤医師'];
  const statuses = ['作成中', '承認済', '送信済', '破棄'];

  const handleSelectDocument = (doc: Document) => {
    setSelectedDocument(doc);
  };

  const handleToggleDocument = (docId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map(doc => doc.id));
    }
  };

  const handleSort = (column: 'date' | 'type' | 'patient') => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleSearch = () => {
    console.log('Search with filters:', {
      patient: filterPatient,
      docType: filterDocType,
      status: filterStatus,
      creator: filterCreator,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
      keyword: searchKeyword
    });
  };

  const handleClearFilters = () => {
    setFilterPatient('all');
    setFilterDocType('all');
    setFilterStatus('all');
    setFilterCreator('all');
    setFilterDateFrom(undefined);
    setFilterDateTo(undefined);
    setSearchKeyword('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '作成中':
        return <Clock className="w-3 h-3" />;
      case '承認済':
        return <CheckCircle className="w-3 h-3" />;
      case '送信済':
        return <Send className="w-3 h-3" />;
      case '破棄':
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '作成中':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '承認済':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '送信済':
        return 'bg-green-100 text-green-800 border-green-200';
      case '破棄':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActiveFiltersText = () => {
    const filters = [];
    if (filterStatus !== 'all') filters.push(`ステータス：${filterStatus}`);
    if (filterPatient !== 'all') filters.push(`患者：${filterPatient}`);
    if (filterDocType !== 'all') filters.push(`文書種別：${filterDocType}`);
    if (filterCreator !== 'all') filters.push(`作成者：${filterCreator}`);
    if (filterDateFrom) filters.push(`作成日：${format(filterDateFrom, 'yyyy/MM/dd')}～`);
    return filters.length > 0 ? filters.join('、') : 'フィルターなし';
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-gray-900">文書管理</h1>
          </div>
          <div className="flex items-center gap-2">
            {selectedDocuments.length > 0 && (
              <>
                <span className="text-sm text-gray-600">{selectedDocuments.length}件選択中</span>
                <Button size="sm" variant="outline">一括承認</Button>
                <Button size="sm" variant="outline">一括送信</Button>
                <Button size="sm" variant="outline">一括削除</Button>
              </>
            )}
            <Button size="sm" onClick={onImportClick}>
              <Upload className="w-4 h-4 mr-1" />
              取込
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>{getActiveFiltersText()}</span>
          <span className="ml-2">|</span>
          <span className="ml-2">{documents.length}件の文書</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Pane: Filter & Search */}
        <div className="w-[280px] bg-white border-r flex flex-col shrink-0">
          <div className="p-4 border-b">
            <h2 className="text-gray-900 mb-3">フィルター・検索</h2>
            
            {/* Keyword Search */}
            <div className="mb-4">
              <Label className="text-xs mb-1 block">キーワード検索</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="文書内容を検索"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
            </div>

            {/* Advanced Filter Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between mb-3"
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            >
              <span className="text-xs">高度な検索条件</span>
              {showAdvancedFilter ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Patient Filter */}
              <div>
                <Label className="text-xs mb-1 block">患者</Label>
                <Select value={filterPatient} onValueChange={setFilterPatient}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="山田太郎">山田太郎</SelectItem>
                    <SelectItem value="佐藤花子">佐藤花子</SelectItem>
                    <SelectItem value="鈴木一郎">鈴木一郎</SelectItem>
                    <SelectItem value="田中次郎">田中次郎</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Document Type Filter */}
              <div>
                <Label className="text-xs mb-1 block">文書種別</Label>
                <Select value={filterDocType} onValueChange={setFilterDocType}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <Label className="text-xs mb-1 block">ステータス</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Creator Filter */}
              <div>
                <Label className="text-xs mb-1 block">作成者</Label>
                <Select value={filterCreator} onValueChange={setFilterCreator}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {creators.map(creator => (
                      <SelectItem key={creator} value={creator}>{creator}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showAdvancedFilter && (
                <>
                  {/* Date From Filter */}
                  <div>
                    <Label className="text-xs mb-1 block">作成日（開始）</Label>
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

                  {/* Date To Filter */}
                  <div>
                    <Label className="text-xs mb-1 block">作成日（終了）</Label>
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
                </>
              )}

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Button size="sm" className="w-full" onClick={handleSearch}>
                  検索
                </Button>
                <Button size="sm" variant="outline" className="w-full" onClick={handleClearFilters}>
                  クリア
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Center Pane: Document List */}
        <div className="flex-1 bg-white border-r flex flex-col min-w-0">
          <div className="p-3 border-b flex items-center justify-between">
            <h2 className="text-gray-900">文書一覧</h2>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b sticky top-0">
                <tr>
                  <th className="px-2 py-2 w-10">
                    <Checkbox
                      checked={selectedDocuments.length === documents.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th
                    className="px-2 py-2 text-left text-xs text-gray-600 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => handleSort('type')}
                  >
                    文書種別 {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-2 py-2 text-left text-xs text-gray-600 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => handleSort('patient')}
                  >
                    患者氏名 {sortBy === 'patient' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-2 py-2 text-left text-xs text-gray-600 whitespace-nowrap">患者番号</th>
                  <th
                    className="px-2 py-2 text-left text-xs text-gray-600 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => handleSort('date')}
                  >
                    作成日 {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-2 py-2 text-left text-xs text-gray-600 whitespace-nowrap">作成者</th>
                  <th className="px-2 py-2 text-left text-xs text-gray-600 whitespace-nowrap">ステータス</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className={`border-b cursor-pointer hover:bg-gray-50 ${
                      selectedDocument?.id === doc.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelectDocument(doc)}
                  >
                    <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={() => handleToggleDocument(doc.id)}
                      />
                    </td>
                    <td className="px-2 py-3 text-sm">{doc.type}</td>
                    <td className="px-2 py-3 text-sm">{doc.patientName}</td>
                    <td className="px-2 py-3 text-sm text-gray-600">{doc.patientNumber}</td>
                    <td className="px-2 py-3 text-sm whitespace-nowrap">{doc.createdDate}</td>
                    <td className="px-2 py-3 text-sm">{doc.creator}</td>
                    <td className="px-2 py-3">
                      <Badge variant="outline" className={`${getStatusColor(doc.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(doc.status)}
                        <span>{doc.status}</span>
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Pane: Document Detail */}
        <div className="w-[450px] bg-white overflow-auto shrink-0">
          {selectedDocument ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900">文書詳細</h2>
                <Badge variant="outline" className={`${getStatusColor(selectedDocument.status)} flex items-center gap-1`}>
                  {getStatusIcon(selectedDocument.status)}
                  <span>{selectedDocument.status}</span>
                </Badge>
              </div>

              {/* Document Info */}
              <Card className="p-4 mb-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">文書種別</div>
                      <div className="text-sm">{selectedDocument.type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">作成日</div>
                      <div className="text-sm">{selectedDocument.createdDate}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">患者氏名</div>
                      <div className="text-sm">{selectedDocument.patientName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">患者番号</div>
                      <div className="text-sm">{selectedDocument.patientNumber}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">作成者</div>
                    <div className="text-sm">{selectedDocument.creator}</div>
                  </div>
                </div>
              </Card>

              {/* Document Content Preview */}
              <div className="mb-4">
                <h3 className="text-sm mb-2">文書内容プレビュー</h3>
                <Card className="p-4 bg-gray-50">
                  <div className="text-sm whitespace-pre-wrap">{selectedDocument.content}</div>
                </Card>
              </div>

              {/* History */}
              <div className="mb-6">
                <h3 className="text-sm mb-2">履歴・改訂情報</h3>
                <Card className="p-3">
                  <div className="space-y-2">
                    {selectedDocument.history.map((item, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs">
                        <div className="text-gray-500 whitespace-nowrap">{item.date}</div>
                        <div className="text-gray-700">{item.user}</div>
                        <div className="text-gray-600">- {item.action}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <Separator className="my-4" />

              {/* Action Buttons */}
              <div className="space-y-2">
                <h3 className="text-sm mb-3">操作</h3>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  編集（コピーして新規作成）
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  印刷
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Send className="w-4 h-4 mr-2" />
                  電子署名／送信
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  ステータス更新
                </Button>
                <Separator className="my-2" />
                <Button variant="outline" className="w-full justify-start text-orange-600 hover:text-orange-700" size="sm">
                  <Archive className="w-4 h-4 mr-2" />
                  アーカイブ
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  削除
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>文書を選択して詳細を表示</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentManagementPanel;