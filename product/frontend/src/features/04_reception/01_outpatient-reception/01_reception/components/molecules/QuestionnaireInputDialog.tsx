import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@shared/components/atoms/dialog';
import { Button } from '@shared/components/atoms/button';
import { Input } from '@shared/components/atoms/input';
import { Label } from '@shared/components/atoms/label';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/atoms/card';
import { X, Upload, FileText, Trash2, Eye } from 'lucide-react';

interface QuestionnaireInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  patientName: string;
  patientId: string;
  department: string;
  doctor: string;
}

export function QuestionnaireInputDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  patientName, 
  patientId, 
  department, 
  doctor 
}: QuestionnaireInputDialogProps) {
  // 初期状態で1つのサンプルファイルを設定
  const createInitialFile = () => {
    // 実際のFileオブジェクトの代わりにモックオブジェクトを作成
    return {
      name: '問診票_202601051430.pdf',
      size: 245678,
      type: 'application/pdf',
      lastModified: Date.now(),
      isExisting: true // 既存ファイルのフラグ
    } as any;
  };

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([createInitialFile()]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => file.type === 'application/pdf');
      if (newFiles.length !== files.length) {
        alert('PDFファイルのみアップロード可能です。');
      }
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreviewFile = (file: any) => {
    if (file.isExisting) {
      alert(`既存ファイル「${file.name}」のプレビュー機能は実装中です。\n\nファイル情報:\nファイル名: ${file.name}\nサイズ: ${(file.size / 1024).toFixed(1)} KB\nアップロード日時: ${new Date(file.lastModified).toLocaleString('ja-JP')}`);
    } else {
      // 新規アップロードファイルの場合
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    }
  };

  const handleSave = () => {
    if (uploadedFiles.length === 0) {
      alert('PDFファイルをアップロードしてください。');
      return;
    }

    const uploadData = {
      patientId,
      patientName,
      department,
      doctor,
      files: uploadedFiles,
      timestamp: new Date().toISOString()
    };
    
    onSave(uploadData);
    setUploadedFiles([]);
    onClose();
  };

  const handleCancel = () => {
    setUploadedFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[90vw] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              問診票アップロード
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              患者ID: {patientId} | 診療科: {department} | 担当医: {doctor}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* PDFアップロード */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">問診票PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Input
                      id="pdf-upload"
                      type="file"
                      multiple
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Label htmlFor="pdf-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <div className="text-base mb-1">
                            PDFファイルをドラッグ&ドロップまたは
                            <span className="text-primary underline ml-1">クリックして選択</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ※ PDFファイルのみアップロード可能です
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* アップロード済みファイル一覧 */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">アップロード済みファイル ({uploadedFiles.length})</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div 
                              className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-muted-foreground/10 rounded p-2 -m-2 transition-colors"
                              onClick={() => handlePreviewFile(file)}
                              title="クリックして確認"
                            >
                              <FileText className="h-5 w-5 text-red-600" />
                              <div>
                                <div className="text-sm font-medium" title={file.name}>
                                  {file.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {(file.size / 1024).toFixed(1)} KB
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(index)}
                              title="削除"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 下部ボタン */}
          <div className="flex justify-center gap-4 p-4 border-t flex-shrink-0 bg-background">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-8"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              disabled={uploadedFiles.length === 0}
            >
              送信
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}