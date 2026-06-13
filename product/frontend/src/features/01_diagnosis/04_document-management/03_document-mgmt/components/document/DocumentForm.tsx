import { ReactNode } from 'react';
import { FileText } from 'lucide-react';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Label } from '@/shared/components/atoms/label';
import { Calendar } from '@/shared/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const REFERRAL_TYPE_NONE = 'none';

interface ScannedDocument {
  id: string;
  imageData: string;
  registered: boolean;
  patientId: string;
  patientName: string;
  docType: string;
  department: string;
  doctor: string;
  documentDate: Date; // 文書日付（印字される日付）
  referralType: string;
  referralHospital: string;
  referralDepartment: string;
  referralDoctor: string;
  comment: string;
}

interface DocumentFormProps {
  selectedDoc: ScannedDocument;
  selectedDocIndex: number | null;
  documentTypes: string[];
  departments: string[];
  patientField: ReactNode;
  onUpdate: (field: keyof ScannedDocument, value: any) => void;
}

export function DocumentForm({
  selectedDoc,
  selectedDocIndex,
  documentTypes,
  departments,
  patientField,
  onUpdate
}: DocumentFormProps) {
  return (
    <div className="space-y-4">
      {/* Compact Header with Small Preview */}
      <div className="flex items-start gap-4">
        {/* Small Preview */}
        <div className="w-32 h-40 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-12 h-12 text-gray-400" />
        </div>
        
        {/* Header Info */}
        <div className="flex-1">
          <h3 className="text-lg text-gray-900 mb-1">
            {selectedDocIndex !== null ? `${selectedDocIndex + 1}枚目の文書情報` : ''}
          </h3>
          <p className="text-sm text-gray-600">
            {selectedDoc.registered 
              ? '✓ 登録済みの文書です。内容を確認できます。左側から別の未登録文書を選択して登録を続けてください。' 
              : '文書種別などの必須項目を入力し、画面下部の「登録」ボタンを押してください。'}
          </p>
        </div>
      </div>

      {/* Document Information Form - Compact */}
      <div className="p-4 border border-gray-200 rounded-lg bg-white">
        <h4 className="text-sm text-gray-700 mb-3">文書情報</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="doc-type" className="text-xs mb-1 block text-gray-600">
              文書種別 <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={selectedDoc.docType} 
              onValueChange={(value) => onUpdate('docType', value)}
              disabled={selectedDoc.registered}
            >
              <SelectTrigger id="doc-type" className="bg-white border-gray-300 h-9">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Patient Field - provided from parent */}
          {patientField}

          <div>
            <Label htmlFor="department" className="text-xs mb-1 block text-gray-600">
              診療科
            </Label>
            <Select 
              value={selectedDoc.department} 
              onValueChange={(value) => onUpdate('department', value)}
              disabled={selectedDoc.registered}
            >
              <SelectTrigger id="department" className="bg-white border-gray-300 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="内科">内科</SelectItem>
                <SelectItem value="外科">外科</SelectItem>
                <SelectItem value="整形外科">整形外科</SelectItem>
                <SelectItem value="小児科">小児科</SelectItem>
                <SelectItem value="産婦人科">産婦人科</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="doctor" className="text-xs mb-1 block text-gray-600">
              医師
            </Label>
            <Select 
              value={selectedDoc.doctor} 
              onValueChange={(value) => onUpdate('doctor', value)}
              disabled={selectedDoc.registered}
            >
              <SelectTrigger id="doctor" className="bg-white border-gray-300 h-9">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((doctor) => (
                  <SelectItem key={doctor} value={doctor}>
                    {doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="document-date" className="text-xs mb-1 block text-gray-600">
              文書日付
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={selectedDoc.registered}
                  className="w-full justify-start bg-white border-gray-300 h-9 text-xs"
                >
                  {format(selectedDoc.documentDate, 'yyyy/MM/dd')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDoc.documentDate}
                  onSelect={(date) => date && onUpdate('documentDate', date)}
                  locale={ja}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="referral-type" className="text-xs mb-1 block text-gray-600">
              紹介区分
            </Label>
            <Select 
              value={selectedDoc.referralType} 
              onValueChange={(value) => onUpdate('referralType', value)}
              disabled={selectedDoc.registered}
            >
              <SelectTrigger id="referral-type" className="bg-white border-gray-300 h-9">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={REFERRAL_TYPE_NONE}>未選択</SelectItem>
                <SelectItem value="紹介">紹介</SelectItem>
                <SelectItem value="逆紹介">逆紹介</SelectItem>
                <SelectItem value="他院からの依頼">他院からの依頼</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="hospital" className="text-xs mb-1 block text-gray-600">
              紹介病院
            </Label>
            <Input
              id="hospital"
              type="text"
              placeholder="病院名を入力"
              value={selectedDoc.referralHospital}
              onChange={(e) => onUpdate('referralHospital', e.target.value)}
              disabled={selectedDoc.registered}
              className="bg-white border-gray-300 h-9"
            />
          </div>

          <div>
            <Label htmlFor="ref-department" className="text-xs mb-1 block text-gray-600">
              紹介診療科
            </Label>
            <Input
              id="ref-department"
              type="text"
              placeholder="診療科を入力"
              value={selectedDoc.referralDepartment}
              onChange={(e) => onUpdate('referralDepartment', e.target.value)}
              disabled={selectedDoc.registered}
              className="bg-white border-gray-300 h-9"
            />
          </div>

          <div>
            <Label htmlFor="ref-doctor" className="text-xs mb-1 block text-gray-600">
              紹介医師
            </Label>
            <Input
              id="ref-doctor"
              type="text"
              placeholder="医師名を入力"
              value={selectedDoc.referralDoctor}
              onChange={(e) => onUpdate('referralDoctor', e.target.value)}
              disabled={selectedDoc.registered}
              className="bg-white border-gray-300 h-9"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="comment" className="text-xs mb-1 block text-gray-600">
              コメント
            </Label>
            <Input
              id="comment"
              type="text"
              placeholder="コメントを入力"
              value={selectedDoc.comment}
              onChange={(e) => onUpdate('comment', e.target.value)}
              disabled={selectedDoc.registered}
              className="bg-white border-gray-300 h-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}