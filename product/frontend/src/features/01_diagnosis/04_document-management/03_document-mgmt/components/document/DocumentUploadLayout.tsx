import { Scan, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { ScannerSettings } from './ScannerSettings';
import { ScannedDocumentList } from './ScannedDocumentList';
import { DocumentForm } from './DocumentForm';
import { ScannedDocument } from '../../src/hooks/useDocumentScanning';

interface DocumentUploadLayoutProps {
  // State
  isScanning: boolean;
  scannedDocuments: ScannedDocument[];
  selectedDocIndex: number | null;
  selectedDoc: ScannedDocument | null;
  registeredCount: number;
  totalCount: number;
  allRegistered: boolean;
  
  // Props
  documentTypes: string[];
  departments: string[];
  patientField: React.ReactNode;
  
  // Actions
  handleScan: () => void;
  removeScannedDocument: (index: number) => void;
  selectDocument: (index: number) => void;
  updateSelectedDocument: (field: string, value: any) => void;
  handleRegisterDocument: () => void;
  handleComplete: () => void;
}

export function DocumentUploadLayout({
  isScanning,
  scannedDocuments,
  selectedDocIndex,
  selectedDoc,
  registeredCount,
  totalCount,
  allRegistered,
  documentTypes,
  departments,
  patientField,
  handleScan,
  removeScannedDocument,
  selectDocument,
  updateSelectedDocument,
  handleRegisterDocument,
  handleComplete
}: DocumentUploadLayoutProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col bg-white border-x border-gray-200 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-900">受領文書取込</h2>
            </div>
            {totalCount > 0 && (
              <div className="text-right">
                <div className="text-xs text-gray-500">登録進捗</div>
                <div className={`text-lg font-medium ${allRegistered ? 'text-green-600' : 'text-blue-600'}`}>
                  {registeredCount} / {totalCount} 枚
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Left Sidebar */}
          <div className="w-80 border-r border-gray-200 flex flex-col flex-shrink-0">
            <div className="p-6 pb-4 flex-shrink-0">
              <ScannerSettings onScan={handleScan} isScanning={isScanning} />
            </div>

            <ScannedDocumentList
              documents={scannedDocuments}
              selectedIndex={selectedDocIndex}
              onSelect={selectDocument}
              onRemove={removeScannedDocument}
            />
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {selectedDoc ? (
                <DocumentForm
                  selectedDoc={selectedDoc}
                  selectedDocIndex={selectedDocIndex}
                  documentTypes={documentTypes}
                  departments={departments}
                  patientField={patientField}
                  onUpdate={updateSelectedDocument}
                />
              ) : allRegistered && totalCount > 0 ? (
                <CompletionMessage totalCount={totalCount} />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
          <div>
            {/* Left side - empty for now */}
          </div>
          <div className="flex gap-2">
            {selectedDoc && !selectedDoc.registered && (
              <Button
                onClick={handleRegisterDocument}
                className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                登録
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleComplete}
            >
              閉じる
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center text-gray-500">
      <div className="text-center">
        <Scan className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-lg mb-2">スキャンして文書を追加してください</p>
        <p className="text-sm">左側の「スキャン実行」ボタンを押してください</p>
      </div>
    </div>
  );
}

function CompletionMessage({ totalCount }: { totalCount: number }) {
  return (
    <div className="h-full flex items-center justify-center text-gray-500">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
        <p className="text-lg mb-2 text-gray-900">すべての文書が登録されました</p>
        <p className="text-sm mb-4">登録した文書数: {totalCount} 枚</p>
        <p className="text-xs text-gray-500">
          左側の文書をクリックすると、登録内容を確認できます
        </p>
      </div>
    </div>
  );
}