import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Upload, Eye, X, FileText, Printer, FileEdit } from 'lucide-react';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Label } from '@/shared/components/atoms/label';
import { Calendar } from '@/shared/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { Badge } from '@/shared/components/atoms/badge';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { DocumentCreationPanel } from './DocumentCreationPanel';
import { ReceivedDocumentUploadPanel } from './document/ReceivedDocumentUploadPanel';
import { departments } from '../src/data/documentData';
import { Document, Patient, UploadDocumentData, SaveDocumentData, DocumentStatus } from '../src/types/document';
import { 
  getStatusColor, 
  generatePageNumbers, 
  filterDocuments, 
  sortDocumentsByDate,
  extractUniqueValues 
} from '../src/utils/documentUtils';

// Constants
const ITEMS_PER_PAGE = 20;

interface DocumentManagementPanelProps {
  currentPatient: Patient;
  documents: Document[];
  onSaveDocument: (documentData: Omit<Document, 'id' | 'createdDate' | 'updatedDate' | 'createdBy'>, status: DocumentStatus) => string;
  onUpdateDocument: (documentId: string, documentData: Omit<Document, 'id' | 'createdDate' | 'updatedDate' | 'createdBy'>, status: DocumentStatus) => void;
  onDeleteDocument: (documentId: string) => void;
  onUploadDocument: (uploadData: UploadDocumentData) => void;
}

export function DocumentManagementPanel({ 
  currentPatient,
  documents,
  onSaveDocument,
  onUpdateDocument,
  onDeleteDocument,
  onUploadDocument
}: DocumentManagementPanelProps) {
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDocType, setFilterDocType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterReferralHospital, setFilterReferralHospital] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<Date>();
  const [filterDateTo, setFilterDateTo] = useState<Date>();
  
  // UI state
  const [currentPage, setCurrentPage] = useState(1);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreationPanel, setShowCreationPanel] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  // Extract unique values from documents
  const documentTypes = extractUniqueValues(documents, 'type');
  const referralHospitals = extractUniqueValues(documents, 'referralHospital');

  // Apply filters and sorting
  const filteredAndSortedDocuments = sortDocumentsByDate(
    filterDocuments(documents, {
      searchQuery,
      filterDocType,
      filterStatus,
      filterDepartment,
      filterReferralHospital,
      filterDateFrom,
      filterDateTo,
      currentPatient
    })
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDocType, searchQuery, filterStatus, filterDepartment, filterReferralHospital, filterDateFrom, filterDateTo]);

  // Event handlers
  const handleEdit = (doc: Document) => {
    setEditingDocument(doc);
    setShowCreationPanel(true);
  };

  const handlePrint = (doc: Document) => {
    alert(`文書「${doc.type}」を印刷します`);
  };

  const handleDelete = (docId: string) => {
    if (confirm(`文書を削除してもよろしいですか？`)) {
      onDeleteDocument(docId);
    }
  };

  const handleView = (doc: Document) => {
    setPreviewDocument(doc);
  };

  const handleSave = (documentData: SaveDocumentData, status: DocumentStatus) => {
    if (editingDocument) {
      // Update existing document
      onUpdateDocument(editingDocument.id, documentData, status);
      if (status === '作成中') {
        setEditingDocument({ ...editingDocument, status: '作成中', ...documentData });
      }
    } else {
      // Create new document
      const newDocumentId = onSaveDocument(documentData, status);
      const now = new Date();
      const dateString = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
      
      const newDoc: Document = {
        id: newDocumentId,
        type: documentData.type,
        createdDate: dateString,
        updatedDate: dateString,
        createdBy: '田中太郎',
        status: status,
        department: documentData.department,
        content: documentData.content
      };
      
      setEditingDocument(newDoc);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedDocuments.length / ITEMS_PER_PAGE);
  const paginatedDocuments = filteredAndSortedDocuments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Show different panels based on state
  if (showCreationPanel) {
    return (
      <div className="flex-1 h-full overflow-hidden">
        <DocumentCreationPanel 
          currentPatient={currentPatient}
          editingDocument={editingDocument}
          documents={documents}
          onClose={() => {
            setShowCreationPanel(false);
            setEditingDocument(null);
          }}
          onSave={handleSave}
        />
      </div>
    );
  }

  if (showUploadModal) {
    return (
      <ReceivedDocumentUploadPanel
        currentPatient={currentPatient}
        documentTypes={documentTypes}
        departments={departments}
        onUpload={(uploadData) => {
          onUploadDocument(uploadData);
          // 1文書ごとに閉じない（全文書登録完了まで開いたまま）
        }}
        onClose={() => setShowUploadModal(false)}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 flex-1">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DocumentListHeader />

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
          {/* Search Panel */}
          <SearchPanel
            searchQuery={searchQuery}
            filterDocType={filterDocType}
            filterStatus={filterStatus}
            filterDepartment={filterDepartment}
            filterReferralHospital={filterReferralHospital}
            filterDateFrom={filterDateFrom}
            filterDateTo={filterDateTo}
            documentTypes={documentTypes}
            referralHospitals={referralHospitals}
            onSearchChange={setSearchQuery}
            onDocTypeChange={setFilterDocType}
            onStatusChange={setFilterStatus}
            onDepartmentChange={setFilterDepartment}
            onReferralHospitalChange={setFilterReferralHospital}
            onDateFromChange={setFilterDateFrom}
            onDateToChange={setFilterDateTo}
            onNewDocument={() => {
              setShowCreationPanel(true);
              setEditingDocument(null);
            }}
            onUploadDocument={() => setShowUploadModal(true)}
          />

          {/* Document List Table */}
          <DocumentTable
            documents={paginatedDocuments}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Preview Modal */}
      {previewDocument && (
        <DocumentPreviewModal
          document={previewDocument}
          onClose={() => setPreviewDocument(null)}
          onPrint={handlePrint}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

// Sub-components

function DocumentListHeader() {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg">文書管理</h2>
      </div>
    </div>
  );
}

interface SearchPanelProps {
  searchQuery: string;
  filterDocType: string;
  filterStatus: string;
  filterDepartment: string;
  filterReferralHospital: string;
  filterDateFrom?: Date;
  filterDateTo?: Date;
  documentTypes: string[];
  referralHospitals: string[];
  onSearchChange: (value: string) => void;
  onDocTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onReferralHospitalChange: (value: string) => void;
  onDateFromChange: (value?: Date) => void;
  onDateToChange: (value?: Date) => void;
  onNewDocument: () => void;
  onUploadDocument: () => void;
}

function SearchPanel({
  searchQuery,
  filterDocType,
  filterStatus,
  filterDepartment,
  filterReferralHospital,
  filterDateFrom,
  filterDateTo,
  documentTypes,
  referralHospitals,
  onSearchChange,
  onDocTypeChange,
  onStatusChange,
  onDepartmentChange,
  onReferralHospitalChange,
  onDateFromChange,
  onDateToChange,
  onNewDocument,
  onUploadDocument
}: SearchPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-6 gap-3">
        <div className="col-span-2">
          <Label htmlFor="search" className="text-xs mb-1 block text-gray-600">
            キーワード
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="本文検索..."
              className="pl-10 bg-white border-gray-300 h-9"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="filter-doctype" className="text-xs mb-1 block text-gray-600">
            文書種別
          </Label>
          <Select value={filterDocType} onValueChange={onDocTypeChange}>
            <SelectTrigger id="filter-doctype" className="bg-white border-gray-300 h-9">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {documentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="filter-creator" className="text-xs mb-1 block text-gray-600">
            診療科
          </Label>
          <Select value={filterDepartment} onValueChange={onDepartmentChange}>
            <SelectTrigger id="filter-creator" className="bg-white border-gray-300 h-9">
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

        <div>
          <Label htmlFor="filter-status" className="text-xs mb-1 block text-gray-600">
            ステータス
          </Label>
          <Select value={filterStatus} onValueChange={onStatusChange}>
            <SelectTrigger id="filter-status" className="bg-white border-gray-300 h-9">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="作成中">作成中</SelectItem>
              <SelectItem value="作成済">作成済</SelectItem>
              <SelectItem value="取込済">取込済</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="filter-referraltype" className="text-xs mb-1 block text-gray-600">
            発行元
          </Label>
          <Select value={filterReferralHospital} onValueChange={onReferralHospitalChange}>
            <SelectTrigger id="filter-referraltype" className="bg-white border-gray-300 h-9">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {referralHospitals.map((hospital) => (
                <SelectItem key={hospital} value={hospital}>
                  {hospital}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 mt-3">
        <div className="col-span-2">
          <Label className="text-xs mb-1 block text-gray-600">文書日付</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1 justify-start bg-white border-gray-300 h-9 text-xs">
                  {filterDateFrom ? format(filterDateFrom, 'yyyy/MM/dd') : '開始日'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filterDateFrom}
                  onSelect={onDateFromChange}
                  locale={ja}
                />
              </PopoverContent>
            </Popover>
            <span className="text-gray-400 self-center">〜</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1 justify-start bg-white border-gray-300 h-9 text-xs">
                  {filterDateTo ? format(filterDateTo, 'yyyy/MM/dd') : '終了日'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filterDateTo}
                  onSelect={onDateToChange}
                  locale={ja}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="col-span-4 flex items-end justify-end gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={onNewDocument}
            className="bg-blue-600 hover:bg-blue-700 text-white h-9"
          >
            <Edit className="w-4 h-4 mr-2" />
            新規作成
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onUploadDocument}
            className="border-gray-300 h-9"
          >
            <Upload className="w-4 h-4 mr-2" />
            受領文書取込
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DocumentTableProps {
  documents: Document[];
  currentPage: number;
  itemsPerPage: number;
  onView: (doc: Document) => void;
  onEdit: (doc: Document) => void;
  onDelete: (docId: string) => void;
}

function DocumentTable({
  documents,
  currentPage,
  itemsPerPage,
  onView,
  onEdit,
  onDelete
}: DocumentTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2 text-left text-xs text-gray-600 w-12">No</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600 w-36">文書種別</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600 w-24">文書日付</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600 w-20">診療科</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600 w-24">ステータス</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600 w-16">改訂</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600 w-20">更新者</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600 w-28">更新日時</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600 w-20">紹介区分</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600 w-28">紹介病院</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600 w-24">紹介診療科</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600 w-24">紹介依頼医師</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600 w-32">コメント</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600 w-36">操作</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <DocumentTableRow
                key={doc.id}
                doc={doc}
                index={(currentPage - 1) * itemsPerPage + index + 1}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface DocumentTableRowProps {
  doc: Document;
  index: number;
  onView: (doc: Document) => void;
  onEdit: (doc: Document) => void;
  onDelete: (docId: string) => void;
}

function DocumentTableRow({ doc, index, onView, onEdit, onDelete }: DocumentTableRowProps) {
  return (
    <tr
      className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer"
      onClick={() => onView(doc)}
    >
      <td className="px-3 py-2 text-gray-700">{index}</td>
      <td className="px-3 py-2 text-gray-700">{doc.type}</td>
      <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
        {doc.documentDate || doc.createdDate}
      </td>
      <td className="px-3 py-2 text-gray-700">{doc.department}</td>
      <td className="px-3 py-2">
        <Badge variant="outline" className={getStatusColor(doc.status)}>
          {doc.status}
        </Badge>
      </td>
      <td className="px-3 py-2 text-gray-700">
        {doc.revisionHistory && doc.revisionHistory.length > 0 && doc.status !== '作成中' ? (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            第{doc.revisionHistory[0].revisionNumber}版
          </Badge>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        )}
      </td>
      <td className="px-3 py-2 text-gray-700">{doc.updatedBy || doc.createdBy}</td>
      <td className="px-3 py-2 text-gray-700 whitespace-nowrap text-xs">
        {doc.updatedAt || doc.updatedDate}
      </td>
      <td className="px-3 py-2 text-gray-700">{doc.referralType || '-'}</td>
      <td className="px-3 py-2 text-gray-700">{doc.referralHospital || '-'}</td>
      <td className="px-3 py-2 text-gray-700">{doc.referralDepartment || '-'}</td>
      <td className="px-3 py-2 text-gray-700">{doc.referralDoctor || '-'}</td>
      <td className="px-3 py-2 text-gray-700">{doc.comment || '-'}</td>
      <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
        {doc.status === '作成中' ? (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(doc)}
              className="h-7 w-7 p-0"
              title="編集"
            >
              <FileEdit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(doc.id)}
              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="削除"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : doc.status === '作成済' ? (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(doc)}
              className="h-7 w-7 p-0"
              title="編集（改訂）"
            >
              <FileEdit className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        )}
      </td>
    </tr>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <div className="bg-white rounded-lg border border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          &lt;&lt;
        </Button>
        
        {pageNumbers.map((page, idx) => (
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className="h-8 w-8 p-0"
            >
              {page}
            </Button>
          )
        ))}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          &gt;&gt;
        </Button>
      </div>
    </div>
  );
}

interface DocumentPreviewModalProps {
  document: Document;
  onClose: () => void;
  onPrint: (doc: Document) => void;
  onEdit: (doc: Document) => void;
}

function DocumentPreviewModal({ document, onClose, onPrint, onEdit }: DocumentPreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="bg-gray-50 border border-gray-200 rounded p-6 min-h-[500px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-xs">文書の内容がここに表示されます</p>
              <p className="text-xs text-gray-400 mt-1">（プレビュー機能は開発中）</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            閉じる
          </Button>
          <div className="flex gap-2">
            {(document.status === '作成中' || document.status === '作成済') && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    onPrint(document);
                    onClose();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  印刷
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onEdit(document);
                    onClose();
                  }}
                >
                  <FileEdit className="w-4 h-4 mr-2" />
                  編集
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}