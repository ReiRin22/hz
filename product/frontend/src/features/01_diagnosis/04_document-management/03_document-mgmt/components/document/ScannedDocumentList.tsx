import { X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';

interface ScannedDocument {
  id: string;
  imageData: string;
  registered: boolean;
  patientId: string;
  patientName: string;
  docType: string;
  department: string;
  doctor: string;
  createdDate: Date;
  referralType: string;
  referralHospital: string;
  referralDepartment: string;
  referralDoctor: string;
  comment: string;
}

interface ScannedDocumentListProps {
  documents: ScannedDocument[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
  showPatientName?: boolean;
}

export function ScannedDocumentList({
  documents,
  selectedIndex,
  onSelect,
  onRemove,
  showPatientName = false
}: ScannedDocumentListProps) {
  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6">
      <h3 className="text-sm text-gray-700 mb-3 sticky top-0 bg-white py-2 -mt-2">
        スキャン済み ({documents.length}枚)
      </h3>
      <div className="space-y-2">
        {documents.map((doc, index) => (
          <div
            key={doc.id}
            onClick={() => onSelect(index)}
            className={`relative aspect-[3/4] bg-gray-100 border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
              selectedIndex === index
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <FileText className="w-16 h-16" />
            </div>

            <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
              doc.registered
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {doc.registered ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  登録済
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  未登録
                </>
              )}
            </div>

            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                className="h-7 w-7 p-0 bg-white/90 hover:bg-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
