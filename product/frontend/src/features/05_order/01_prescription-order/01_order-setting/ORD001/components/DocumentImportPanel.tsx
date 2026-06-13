import React, { useState, useRef } from 'react';
import { Upload, FileText, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, X, File, Calendar as CalendarIcon, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Card } from '@/shared/components/atoms/card';
import { Calendar } from '@/shared/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/shared/components/atoms/dialog';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
  birthDate?: string;
}

interface DocumentImportPanelProps {
  currentPatient?: CurrentPatient;
  onBack?: () => void;
  requirePatientSelection?: boolean; // カルテ外からの遷移の場合true
}

// 患者検索用のモックデータ
const mockPatients: CurrentPatient[] = [
  { id: 'p001', name: '山田太郎', age: 45, gender: 'male', patientNumber: '12345678', visitDate: '2025-10-23', birthDate: '1980-01-15' },
  { id: 'p002', name: '佐藤花子', age: 32, gender: 'female', patientNumber: '87654321', visitDate: '2025-10-23', birthDate: '1993-05-20' },
  { id: 'p003', name: '鈴木一郎', age: 68, gender: 'male', patientNumber: '11223344', visitDate: '2025-10-23', birthDate: '1957-09-10' },
  { id: 'p004', name: '田中美咲', age: 28, gender: 'female', patientNumber: '99887766', visitDate: '2025-10-23', birthDate: '1997-03-25' },
];

export function DocumentImportPanel({ currentPatient, onBack, requirePatientSelection = false }: DocumentImportPanelProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Patient selection states
  const [selectedPatient, setSelectedPatient] = useState<CurrentPatient | undefined>(currentPatient);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [showPatientSelection, setShowPatientSelection] = useState(requirePatientSelection && !currentPatient);

  // Dialog states
  const [showMetaDialog, setShowMetaDialog] = useState(false);
  const [dialogStep, setDialogStep] = useState(1); // 1: 文書種別, 2: 発行情報, 3: 確認

  // Meta information states
  const [documentType, setDocumentType] = useState('');
  const [issueDate, setIssueDate] = useState<Date>();
  const [issuer, setIssuer] = useState('');
  const [notes, setNotes] = useState('');

  const documentTypes = [
    '紹介状',
    '健診結果',
    '検査報告',
    'サマリー',
    '診断書',
    '処方箋',
    'その他'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // 患者選択が必要な場合はチェック
    if (requirePatientSelection && !selectedPatient) {
      alert('先に患者を選択してください');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setCurrentPage(1);
    setZoomLevel(100);
    
    // Show meta information dialog
    setShowMetaDialog(true);
    setDialogStep(1);
  };

  const handlePatientSelect = (patient: CurrentPatient) => {
    setSelectedPatient(patient);
    setShowPatientSelection(false);
    setPatientSearchQuery('');
  };

  const filteredPatients = mockPatients.filter(patient => 
    patient.name.includes(patientSearchQuery) || 
    patient.patientNumber.includes(patientSearchQuery)
  );

  const handleClearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setCurrentPage(1);
    setZoomLevel(100);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleNextStep = () => {
    if (dialogStep === 1) {
      if (!documentType) {
        alert('文書種別を選択してください');
        return;
      }
      setDialogStep(2);
    } else if (dialogStep === 2) {
      if (!issueDate || !issuer) {
        alert('発行日と発行元を入力してください');
        return;
      }
      setDialogStep(3);
    }
  };

  const handlePrevStep = () => {
    if (dialogStep > 1) {
      setDialogStep(dialogStep - 1);
    }
  };

  const handleImport = () => {
    console.log('Importing document:', {
      file: selectedFile,
      patientId: selectedPatient?.patientNumber,
      patientName: selectedPatient?.name,
      birthDate: selectedPatient?.birthDate,
      documentType,
      issueDate,
      issuer,
      notes
    });
    
    alert('文書を取り込みました');
    setShowMetaDialog(false);
    handleClearAll();
  };

  const handleCancelDialog = () => {
    setShowMetaDialog(false);
    handleClearAll();
  };

  const handleClearAll = () => {
    handleClearFile();
    setDocumentType('');
    setIssueDate(undefined);
    setIssuer('');
    setNotes('');
    setDialogStep(1);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                戻る
              </Button>
            )}
            <Upload className="w-6 h-6 text-primary" />
            <h1 className="text-gray-900">受領文書取込</h1>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          患者：{selectedPatient?.name || '未選択'} {selectedPatient?.patientNumber ? `(${selectedPatient.patientNumber})` : ''}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Document Import & Preview (Full Width) */}
        <div className="flex-1 bg-white flex flex-col min-w-0">
          {/* Patient Selection Area (if required) */}
          {requirePatientSelection && !selectedPatient && (
            <div className="p-6 border-b bg-blue-50">
              <h2 className="text-gray-900 mb-4">患者選択</h2>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="患者ID または 氏名で検索"
                    value={patientSearchQuery}
                    onChange={(e) => setPatientSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="space-y-2 max-h-[400px] overflow-auto">
                  {filteredPatients.map((patient) => (
                    <Card
                      key={patient.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{patient.name}</span>
                            <span className="text-xs text-gray-500">
                              {patient.age}歳 / {patient.gender === 'male' ? '男性' : '女性'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            患者ID: {patient.patientNumber}
                          </div>
                          {patient.birthDate && (
                            <div className="text-xs text-gray-500">
                              生年月日: {patient.birthDate}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Document Import Area */}
          {(!requirePatientSelection || selectedPatient) && (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-gray-900">文書取込操作</h2>
                {requirePatientSelection && selectedPatient && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPatient(undefined);
                      setShowPatientSelection(true);
                      handleClearAll();
                    }}
                  >
                    患者変更
                  </Button>
                )}
              </div>

              <div className="flex-1 overflow-auto p-6">
                {!selectedFile ? (
              /* File Upload Area */
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-gray-700">ファイルをドラッグ&ドロップ</h3>
                <p className="text-sm text-gray-500 mb-4">または</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  <File className="w-4 h-4 mr-2" />
                  ファイルを選択
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
                <p className="text-xs text-gray-500 mt-4">
                  対応形式: PDF, JPG, PNG
                </p>
              </div>
            ) : (
              /* Document Preview */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm truncate">{selectedFile.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFile}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Preview Controls */}
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 50}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm w-16 text-center">{zoomLevel}%</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 200}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Preview Area */}
                <Card className="p-4 bg-gray-50 min-h-[500px] flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Document preview"
                      style={{ transform: `scale(${zoomLevel / 100})` }}
                      className="max-w-full max-h-full object-contain transition-transform"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FileText className="w-16 h-16 mx-auto mb-2" />
                      <p>プレビュー表示</p>
                    </div>
                  )}
                </Card>
              </div>
            )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Meta Information Dialog */}
      <Dialog open={showMetaDialog} onOpenChange={setShowMetaDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              文書情報入力 (ステップ {dialogStep}/3)
            </DialogTitle>
            <DialogDescription>
              取り込む文書の情報を入力してください
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {dialogStep === 1 && (
              <>
                {/* Step 1: Document Type */}
                <div>
                  <Label className="mb-2 block">
                    文書種別 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {dialogStep === 2 && (
              <>
                {/* Step 2: Issue Information */}
                <div>
                  <Label className="mb-2 block">
                    発行日 <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {issueDate ? format(issueDate, 'yyyy/MM/dd') : '選択してください'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={issueDate}
                        onSelect={setIssueDate}
                        locale={ja}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="mb-2 block">
                    発行元 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="例：○○病院"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">備考</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="備考を入力"
                    rows={3}
                  />
                </div>
              </>
            )}

            {dialogStep === 3 && (
              <>
                {/* Step 3: Confirmation */}
                <div className="space-y-3">
                  <Card className="p-4 bg-blue-50">
                    <h3 className="text-sm mb-3">患者情報</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">患者ID:</span>
                        <span>{selectedPatient?.patientNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">氏名:</span>
                        <span>{selectedPatient?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">生年月日:</span>
                        <span>{selectedPatient?.birthDate || '1980/01/01'}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="text-sm mb-3">文書情報</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ファイル名:</span>
                        <span className="truncate ml-2 max-w-[200px]">{selectedFile?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">文書種別:</span>
                        <span>{documentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">発行日:</span>
                        <span>{issueDate ? format(issueDate, 'yyyy/MM/dd') : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">発行元:</span>
                        <span>{issuer}</span>
                      </div>
                      {notes && (
                        <div>
                          <span className="text-gray-600">備考:</span>
                          <p className="mt-1">{notes}</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  <p className="text-sm text-gray-600">
                    上記の内容で文書を取り込みます。よろしいですか？
                  </p>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <div className="flex justify-between w-full">
              <div>
                {dialogStep > 1 && (
                  <Button variant="outline" onClick={handlePrevStep}>
                    戻る
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleCancelDialog}>
                  キャンセル
                </Button>
                {dialogStep < 3 ? (
                  <Button onClick={handleNextStep}>
                    次へ
                  </Button>
                ) : (
                  <Button onClick={handleImport}>
                    <Upload className="w-4 h-4 mr-2" />
                    取込実行
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DocumentImportPanel;