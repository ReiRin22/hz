import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, FileText, Save, Eye, Printer, CheckCircle, X, Copy, History, Clock, GitBranch } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { Label } from '@/shared/components/atoms/label';
import { Badge } from '@/shared/components/atoms/badge';

interface DocumentContent {
  templateId: string;
  templateName: string;
  patientName: string;
  patientAge: string;
  patientGender: '男' | '女';
  birthDate: string;
  department: string;
  doctor: string;
  allergy: string;
  diagnosis: string;
  treatmentSummary: string;
  purpose: string;
  medicalHistory: string;
  treatmentPlan: string;
  notes: string;
}

interface FieldChange {
  field: string;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
}

interface RevisionRecord {
  revisionNumber: number;
  timestamp: string;
  updatedBy: string;
  action: '作成' | '更新' | '一時保存' | '承認';
  changes: FieldChange[];
  memo?: string;
}

interface DocumentCreationPanelProps {
  currentPatient: {
    id: string;
    name: string;
    patientNumber: string;
    age: number;
    gender: '男' | '女';
    birthDate?: string;
  };
  onClose: () => void;
  onSave?: (documentData: {
    type: string;
    department: string;
    content: DocumentContent;
    revisionMemo?: string; // 変更理由
  }, status: '作成中' | '作成済') => void;
  editingDocument?: {
    id: string;
    type: string;
    department: string;
    status?: '作成中' | '作成済' | '取込済';
    documentDate?: string;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    content?: DocumentContent;
    revisionHistory?: RevisionRecord[];
  } | null;
  documents?: Array<{
    id: string;
    type: string;
    documentDate: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    createdDate: string;
    updatedDate: string;
    status: '作成中' | '作成済' | '取込済';
    department: string;
    content?: DocumentContent;
    revisionHistory: RevisionRecord[];
  }>;
}

interface TemplateNode {
  id: string;
  label: string;
  description?: string;
  documentType?: string; // 正式な文書タイプ名（一覧表示用）
  children?: TemplateNode[];
}

const templateTree: TemplateNode[] = [
  {
    id: 'doctor',
    label: '医師',
    description: '医師が作成する文書',
    children: [
      {
        id: 'doctor-referral',
        label: '紹介状',
        description: '他医療機関への患者紹介文書',
        children: [
          { id: 'doctor-referral-standard', label: '標準', description: '汎用紹介状テンプレート', documentType: '診療情報提供書' },
          { id: 'doctor-referral-internal', label: '内科用', description: '内科専用紹介状', documentType: '診療情報提供書（内科）' },
          { id: 'doctor-referral-surgery', label: '外科用', description: '外科専用紹介状', documentType: '診療情報提供書（外科）' },
        ],
      },
      {
        id: 'doctor-reply',
        label: '返書',
        description: '紹介元への返信文書',
        children: [
          { id: 'doctor-reply-standard', label: '標準', description: '汎用返書テンプレート', documentType: '診療情報返書' },
          { id: 'doctor-reply-chronic', label: '特定疾患向け', description: '慢性疾患管理用返書', documentType: '診療情報返書（特定疾患）' },
        ],
      },
      {
        id: 'doctor-certificate',
        label: '診断書',
        description: '診断内容の証明文書',
        children: [
          { id: 'doctor-certificate-general', label: '一般診断書', description: '汎用診断書', documentType: '診断書' },
          { id: 'doctor-certificate-work', label: '就労可否診断書', description: '就労に関する診断書', documentType: '就労可否診断書' },
        ],
      },
      {
        id: 'doctor-proof',
        label: '証明書',
        description: '各種証明文書',
        children: [
          { id: 'doctor-proof-attendance', label: '通院証明', description: '通院履歴の証明', documentType: '通院証明書' },
          { id: 'doctor-proof-work', label: '就労証明', description: '就労可否の証明', documentType: '就労証明書' },
        ],
      },
      {
        id: 'doctor-opinion',
        label: '意見書',
        description: '主治医意見書等',
        children: [
          { id: 'doctor-opinion-care', label: '介護保険用', description: '介護保険主治医意見書', documentType: '主治医意見書（介護保険）' },
          { id: 'doctor-opinion-disability', label: '障害年金用', description: '障害年金診断書', documentType: '診断書（障害年金）' },
        ],
      },
    ],
  },
  {
    id: 'nurse',
    label: '看護師',
    description: '看護師が作成する文書',
    children: [
      {
        id: 'nurse-report',
        label: '看護記録',
        description: '看護経過記録',
        children: [
          { id: 'nurse-report-daily', label: '日常記録', description: '日々の看護記録', documentType: '看護記録' },
          { id: 'nurse-report-summary', label: 'サマリー', description: '看護サマリー', documentType: '看護サマリー' },
        ],
      },
      {
        id: 'nurse-plan',
        label: '看護計画',
        description: '看護ケア計画',
        children: [
          { id: 'nurse-plan-standard', label: '標準計画', description: '標準看護計画', documentType: '看護計画書（標準）' },
          { id: 'nurse-plan-individual', label: '個別計画', description: '個別看護計画', documentType: '看護計画書（個別）' },
        ],
      },
      {
        id: 'nurse-guidance',
        label: '指導記録',
        description: '患者指導記録',
        children: [
          { id: 'nurse-guidance-medication', label: '服薬指導', description: '服薬指導記録', documentType: '服薬指導記録' },
          { id: 'nurse-guidance-lifestyle', label: '生活指導', description: '生活指導記録', documentType: '生活指導記録' },
        ],
      },
    ],
  },
  {
    id: 'technician',
    label: '技師',
    description: '検査技師・放射線技師が作成する文書',
    children: [
      {
        id: 'technician-report',
        label: '検査報告書',
        description: '検査結果報告',
        children: [
          { id: 'technician-report-lab', label: '検体検査', description: '検体検査報告書', documentType: '検体検査報告書' },
          { id: 'technician-report-imaging', label: '画像検査', description: '画像検査報告書', documentType: '画像検査報告書' },
          { id: 'technician-report-physio', label: '生理検査', description: '生理検査報告書', documentType: '生理検査報告書' },
        ],
      },
    ],
  },
  {
    id: 'pharmacist',
    label: '薬剤師',
    description: '薬剤師が作成する文書',
    children: [
      {
        id: 'pharmacist-guidance',
        label: '薬剤指導記録',
        description: '服薬指導記録',
        children: [
          { id: 'pharmacist-guidance-initial', label: '初回指導', description: '初回服薬指導記録', documentType: '薬剤管理指導記録（初回）' },
          { id: 'pharmacist-guidance-followup', label: '継続指導', description: '継続服薬指導記録', documentType: '薬剤管理指導記録（継続）' },
        ],
      },
      {
        id: 'pharmacist-report',
        label: '薬剤管理報告',
        description: '薬剤管理記録',
        children: [
          { id: 'pharmacist-report-interaction', label: '相互作用確認', description: '薬剤相互作用確認記録', documentType: '相互作用確認記録' },
          { id: 'pharmacist-report-adjustment', label: '用量調整', description: '用量調整記録', documentType: '用量調整記録' },
        ],
      },
    ],
  },
];

export function DocumentCreationPanel({ currentPatient, onClose, onSave, editingDocument, documents = [] }: DocumentCreationPanelProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['doctor', 'nurse', 'technician', 'pharmacist']))
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [hoveredTemplate, setHoveredTemplate] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewHistoryDoc, setPreviewHistoryDoc] = useState<typeof documents[0] | null>(null);
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);
  const [viewingRevisionDoc, setViewingRevisionDoc] = useState<typeof documents[0] | null>(null);
  const [showRevisionMemoModal, setShowRevisionMemoModal] = useState(false);
  const [revisionMemo, setRevisionMemo] = useState('');

  // Form state - 全て編集可能
  const [documentDate, setDocumentDate] = useState(() => {
    if (editingDocument?.documentDate) {
      return editingDocument.documentDate;
    }
    // デフォルトは今日の日付
    const today = new Date();
    return `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
  });
  const [patientName, setPatientName] = useState(currentPatient.name);
  const [patientAge, setPatientAge] = useState(currentPatient.age.toString());
  const [patientGender, setPatientGender] = useState(currentPatient.gender);
  const [birthDate, setBirthDate] = useState(currentPatient.birthDate || '1990年1月1日');
  const [department, setDepartment] = useState('内科');
  const [doctor, setDoctor] = useState('田中太郎');
  const [allergy, setAllergy] = useState('ペニシリン系');
  const [diagnosis, setDiagnosis] = useState('高血圧症、糖尿病');
  const [treatmentSummary, setTreatmentSummary] = useState('2023年4月より当科にて降圧剤投与開始。血圧コントロール良好。');
  const [purpose, setPurpose] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingDocument && editingDocument.content) {
      const content = editingDocument.content;
      if (editingDocument.documentDate) {
        setDocumentDate(editingDocument.documentDate);
      }
      setPatientName(content.patientName);
      setPatientAge(content.patientAge);
      setPatientGender(content.patientGender);
      setBirthDate(content.birthDate);
      setDepartment(content.department);
      setDoctor(content.doctor);
      setAllergy(content.allergy);
      setDiagnosis(content.diagnosis);
      setTreatmentSummary(content.treatmentSummary);
      setPurpose(content.purpose);
      setMedicalHistory(content.medicalHistory);
      setTreatmentPlan(content.treatmentPlan);
      setNotes(content.notes);
      setSelectedTemplate(content.templateId);
    }
  }, [editingDocument]);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleTemplateClick = (templateId: string, templateLabel: string) => {
    setSelectedTemplate(templateId);
    // テンプレートに応じたデフォルト内容を設定
    if (templateId.startsWith('referral')) {
      setPurpose('精査・加療目的');
      setMedicalHistory('上記患者を専門的な診療が必要と判断し、ご紹介申し上げます。');
    } else if (templateId.startsWith('reply')) {
      setPurpose('経過報告');
      setMedicalHistory('ご紹介いただきました患者の診療経過をご報告いたします。');
    }
  };

  const renderTemplateTree = (nodes: TemplateNode[], depth: number = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = selectedTemplate === node.id;
      const isHovered = hoveredTemplate === node.id;

      return (
        <div key={node.id}>
          <div
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
              isSelected ? 'bg-blue-100 border-l-2 border-blue-600' : 
              isHovered ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            style={{ paddingLeft: `${depth * 16 + 12}px` }}
            onClick={() => hasChildren ? toggleNode(node.id) : handleTemplateClick(node.id, node.label)}
            onMouseEnter={() => setHoveredTemplate(node.id)}
            onMouseLeave={() => setHoveredTemplate('')}
            title={node.description}
          >
            {hasChildren && (
              isExpanded ? 
                <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" /> : 
                <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
            )}
            {!hasChildren && <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />}
            <span className="text-sm">{node.label}</span>
          </div>
          {hasChildren && isExpanded && renderTemplateTree(node.children!, depth + 1)}
        </div>
      );
    });
  };

  const getSelectedTemplateName = () => {
    const findTemplate = (nodes: TemplateNode[]): string => {
      for (const node of nodes) {
        if (node.id === selectedTemplate) {
          // documentTypeが定義されていればそれを使用（正式な文書タイプ名）
          if (node.documentType) {
            return node.documentType;
          }
          // なければlabelを返す（フォールバック）
          return node.label;
        }
        if (node.children) {
          const found = findTemplate(node.children);
          if (found) return found;
        }
      }
      return '';
    };
    return findTemplate(templateTree);
  };

  const handleSaveTemporary = () => {
    console.log('handleSaveTemporary called');
    console.log('onSave:', onSave);
    
    if (!onSave) {
      console.log('onSave is not defined');
      return;
    }
    
    const documentData = {
      type: getSelectedTemplateName(),
      department,
      content: {
        templateId: selectedTemplate,
        templateName: getSelectedTemplateName(),
        patientName,
        patientAge,
        patientGender,
        birthDate,
        department,
        doctor,
        allergy,
        diagnosis,
        treatmentSummary,
        purpose,
        medicalHistory,
        treatmentPlan,
        notes
      }
    };
    
    console.log('Saving document data:', documentData);
    onSave(documentData, '作成中');
    
    // 一時保存では画面を閉じない（作業を継続できる）
  };

  const handleRegister = () => {
    console.log('handleRegister called');
    console.log('onSave:', onSave);
    
    if (!onSave) {
      console.log('onSave is not defined');
      return;
    }
    
    // 既存文書（作成済）の更新（改訂）の場合は変更理由入力モーダルを表示
    if (editingDocument && editingDocument.status === '作成済') {
      setShowRevisionMemoModal(true);
      return;
    }
    
    // 新規作成または一時保存からの登録の場合は直接登録
    const documentData = {
      type: getSelectedTemplateName(),
      department,
      content: {
        templateId: selectedTemplate,
        templateName: getSelectedTemplateName(),
        patientName,
        patientAge,
        patientGender,
        birthDate,
        department,
        doctor,
        allergy,
        diagnosis,
        treatmentSummary,
        purpose,
        medicalHistory,
        treatmentPlan,
        notes
      }
    };
    
    console.log('Registering document data:', documentData);
    onSave(documentData, '作成済');
    
    // 登録完了のフィードバック
    toast.success('文書を登録しました');
  };

  // 変更理由を入力して登録を実行
  const handleConfirmRevision = () => {
    if (!revisionMemo.trim()) {
      alert('変更理由は必須項目です');
      return;
    }

    if (!onSave) {
      return;
    }

    const documentData = {
      type: getSelectedTemplateName(),
      department,
      content: {
        templateId: selectedTemplate,
        templateName: getSelectedTemplateName(),
        patientName,
        patientAge,
        patientGender,
        birthDate,
        department,
        doctor,
        allergy,
        diagnosis,
        treatmentSummary,
        purpose,
        medicalHistory,
        treatmentPlan,
        notes
      },
      revisionMemo // 変更理由を含める
    };

    console.log('Registering document with revision memo:', documentData);
    onSave(documentData as any, '作成済');

    // モーダルを閉じる
    setShowRevisionMemoModal(false);
    setRevisionMemo('');
    
    // 登録完了のフィードバック
    toast.success('文書を更新しまた');
  };

  // 文書タイプの基本部分を取得（バリエーション名を除く）
  const getBaseDocumentType = (docType: string): string => {
    // カッコ書きの部分を除去: "診療情報提供）" → "診療情報提供書"
    return docType.replace(/[（(].*?[）)]/g, '').trim();
  };

  // 作成履歴の取得（同じ文書タイプ + 同一患者の文書）
  const getHistoryDocuments = () => {
    if (!selectedTemplate) return [];
    
    const currentDocType = getBaseDocumentType(getSelectedTemplateName());
    
    return documents
      .filter(doc => {
        const docBaseType = getBaseDocumentType(doc.type);
        return docBaseType === currentDocType;
      })
      .filter(doc => doc.content?.patientName === currentPatient.name) // 同一患者のみ
      .filter(doc => editingDocument ? doc.id !== editingDocument.id : true) // 編集中の文書は除外
      .filter(doc => doc.status === '作成済') // 作成済のみ（取込済は除外）
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  };

  // 最新版をコピー
  const handleCopyLatest = () => {
    const historyDocs = getHistoryDocuments();
    const latestDoc = historyDocs.find(doc => doc.status === '作成済');
    if (latestDoc && latestDoc.content) {
      copyDocumentContent(latestDoc.content);
    } else {
      alert('コピー可能な最新の作成済文書がありません');
    }
  };

  // 文書内容をコピー
  const copyDocumentContent = (content: DocumentContent) => {
    setPatientName(content.patientName);
    setPatientAge(content.patientAge);
    setPatientGender(content.patientGender);
    setBirthDate(content.birthDate);
    setDepartment(content.department);
    setDoctor(content.doctor);
    setAllergy(content.allergy);
    setDiagnosis(content.diagnosis);
    setTreatmentSummary(content.treatmentSummary);
    setPurpose(content.purpose);
    setMedicalHistory(content.medicalHistory);
    setTreatmentPlan(content.treatmentPlan);
    setNotes(content.notes);
  };

  const getStatusColor = (status: '作成中' | '作成済' | '取込済') => {
    switch (status) {
      case '作成中':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case '作成済':
        return 'bg-green-100 text-green-800 border-green-200';
      case '取込済':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg">
              {editingDocument ? `${editingDocument.type} - 編集` : '文書作成'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveTemporary}
                className="h-9"
                disabled={!selectedTemplate}
              >
                <Save className="w-4 h-4 mr-2" />
                一時保存
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleRegister}
                className="bg-blue-600 hover:bg-blue-700 text-white h-9"
                disabled={!selectedTemplate || !purpose}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                登録
              </Button>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="h-9"
                disabled={!selectedTemplate}
              >
                <Eye className="w-4 h-4 mr-2" />
                プレビュー
              </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="h-9"
              disabled={!selectedTemplate}
            >
              <Printer className="w-4 h-4 mr-2" />
              印刷
            </Button>
            <div className="w-px h-6 bg-gray-300"></div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9"
            >
              キャンセル
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar: Template Tree */}
          <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200 bg-white">
              <h3 className="text-sm text-gray-700">文書テンプレート</h3>
            </div>
            <div className="py-2">
              {renderTemplateTree(templateTree)}
            </div>
          </div>

          {/* Right Main Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Center: Form Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
            {/* Selected Template Header */}
            {selectedTemplate && (
              <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-700">{getSelectedTemplateName()}</span>
                </div>
              </div>
            )}

            {/* Scrollable Work Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 space-y-6">
                {!selectedTemplate ? (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>左側のテンプレートツリーから文書種別を選択してください</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* 患者情報セクション */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm flex items-center gap-1">
                          文書日付
                          <span className="text-red-600 text-xs">*必須</span>
                        </Label>
                        <Input
                          type="text"
                          value={documentDate}
                          onChange={(e) => setDocumentDate(e.target.value)}
                          placeholder="YYYY/MM/DD"
                          className="mt-1.5 h-9"
                        />
                      </div>
                      <div></div>
                      
                      <div>
                        <Label className="text-sm">氏名</Label>
                        <Input
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="患者の氏名"
                          className="mt-1.5 h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">生年月日</Label>
                        <Input
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          placeholder="生年月日"
                          className="mt-1.5 h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">年齢</Label>
                        <Input
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                          placeholder="年齢"
                          className="mt-1.5 h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">性別</Label>
                        <select
                          value={patientGender}
                          onChange={(e) => setPatientGender(e.target.value as '男' | '女')}
                          className="mt-1.5 h-9 w-full px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="男">男</option>
                          <option value="女">女</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm">診療科</Label>
                        <Input
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="診療科"
                          className="mt-1.5 h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">主治医</Label>
                        <Input
                          value={doctor}
                          onChange={(e) => setDoctor(e.target.value)}
                          placeholder="主治医"
                          className="mt-1.5 h-9"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">アレルギー</Label>
                        <Input
                          value={allergy}
                          onChange={(e) => setAllergy(e.target.value)}
                          placeholder="アレルギー情報"
                          className="mt-1.5 h-9"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">病名</Label>
                        <Input
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          placeholder="病名"
                          className="mt-1.5 h-9"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">治療経過（概要）</Label>
                        <textarea
                          value={treatmentSummary}
                          onChange={(e) => setTreatmentSummary(e.target.value)}
                          placeholder="治療経過の概要"
                          className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm flex items-center gap-1">
                          紹介目的
                          <span className="text-red-600 text-xs">*必須</span>
                        </Label>
                        <Input
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          placeholder="紹介の目的"
                          className="mt-1.5 h-9"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">診療経過</Label>
                        <textarea
                          value={medicalHistory}
                          onChange={(e) => setMedicalHistory(e.target.value)}
                          placeholder="詳細な診療経過"
                          className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">治療方針</Label>
                        <textarea
                          value={treatmentPlan}
                          onChange={(e) => setTreatmentPlan(e.target.value)}
                          placeholder="今後の治療方針"
                          className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">注意事項</Label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="特記事項・注意点"
                          className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

            {/* Right Sidebar: Document History */}
            {selectedTemplate && (
              <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
                {/* この文書の情報（編集時のみ） */}
                {editingDocument && (
                  <>
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <h3 className="text-sm text-gray-700">この文書の情報</h3>
                      </div>
                    </div>
                    <div className="p-3 bg-white border-b-4 border-gray-300 mb-3">
                      <div className="space-y-1.5 text-xs text-gray-600">
                        <div>
                          作成: {editingDocument.createdAt || editingDocument.createdDate || '-'} ({editingDocument.createdBy || '-'})
                        </div>
                        {(editingDocument.updatedAt || editingDocument.updatedDate) && 
                         (editingDocument.updatedAt !== editingDocument.createdAt) && (
                          <div>
                            更新: {editingDocument.updatedAt || editingDocument.updatedDate || '-'} ({editingDocument.updatedBy || editingDocument.createdBy || '-'})
                          </div>
                        )}
                        {editingDocument.revisionHistory && editingDocument.revisionHistory.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 mt-2"
                            onClick={() => setShowRevisionHistory(true)}
                          >
                            <History className="w-4 h-4 mr-2" />
                            修正履歴 (第{editingDocument.revisionHistory[0].revisionNumber}版)
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
                
                {/* 作成履歴 */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-gray-600" />
                    <h3 className="text-sm text-gray-700">過去文書</h3>
                  </div>
                </div>
                
                {getHistoryDocuments().length > 0 ? (
                  <div className="p-3 space-y-2">
                    {/* Copy Latest Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={handleCopyLatest}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      最新文書をコピー
                    </Button>

                    {/* History List */}
                    <div className="space-y-2">
                      {getHistoryDocuments().map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-white border border-gray-200 rounded p-2.5 hover:border-blue-300 transition-colors"
                        >
                          {/* 文書日付 + 版番号 */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{doc.documentDate}</span>
                            {doc.revisionHistory && doc.revisionHistory.length > 0 && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                第{doc.revisionHistory[0].revisionNumber}版
                              </Badge>
                            )}
                          </div>

                          {/* 作成日・更新日 */}
                          <div className="text-xs text-gray-600 space-y-0.5 mb-2">
                            <div>作成: {doc.createdAt || doc.createdDate} ({doc.createdBy})</div>
                            {doc.updatedAt && doc.updatedAt !== doc.createdAt && (
                              <div>更新: {doc.updatedAt || doc.updatedDate} ({doc.updatedBy || doc.createdBy})</div>
                            )}
                          </div>

                          {/* アクションボタン */}
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-7 text-xs text-blue-700 bg-white hover:bg-blue-50 border-blue-300"
                              onClick={() => doc.content && copyDocumentContent(doc.content)}
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              コピー
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-7 text-xs"
                              onClick={() => setPreviewHistoryDoc(doc)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              参照
                            </Button>
                            {doc.revisionHistory && doc.revisionHistory.length > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-7 text-xs"
                                onClick={() => {
                                  setViewingRevisionDoc(doc);
                                  setShowRevisionHistory(true);
                                }}
                              >
                                <History className="w-3 h-3 mr-1" />
                                履歴
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-400 text-xs">
                    <History className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>作成履歴はありません</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Document Preview Area */}
              <div className="bg-gray-50 border border-gray-200 rounded p-6 min-h-[500px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-xs">文書の内容がここに表示されます</p>
                  <p className="text-xs text-gray-400 mt-1">（プレビュー機能は開発中）</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                キャンセル
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* History Preview Modal */}
      {previewHistoryDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setPreviewHistoryDoc(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{previewHistoryDoc.type}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>文書日付：{previewHistoryDoc.documentDate}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-blue-600 font-medium">
                      第{previewHistoryDoc.revisionHistory && previewHistoryDoc.revisionHistory.length > 0 
                        ? previewHistoryDoc.revisionHistory[0].revisionNumber 
                        : 1}版
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {previewHistoryDoc.content ? (
                <div className="space-y-4 text-sm">
                  {/* 患者情報 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xs font-medium text-gray-700 mb-3">患者情報</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-500">氏名</div>
                        <div className="text-gray-900 font-medium">{previewHistoryDoc.content.patientName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">生年月日</div>
                        <div className="text-gray-900">{previewHistoryDoc.content.birthDate}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">年齢</div>
                        <div className="text-gray-900">{previewHistoryDoc.content.patientAge}歳</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">性別</div>
                        <div className="text-gray-900">{previewHistoryDoc.content.patientGender}</div>
                      </div>
                    </div>
                  </div>

                  {/* 診療情報 */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">診療科</div>
                      <div className="text-gray-900">{previewHistoryDoc.content.department}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">主治医</div>
                      <div className="text-gray-900">{previewHistoryDoc.content.doctor}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">アレルギー</div>
                      <div className="text-gray-900">{previewHistoryDoc.content.allergy || 'なし'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">病名</div>
                      <div className="text-gray-900">{previewHistoryDoc.content.diagnosis}</div>
                    </div>
                    {previewHistoryDoc.content.purpose && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">紹介目的</div>
                        <div className="text-gray-900">{previewHistoryDoc.content.purpose}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">治療経過（概要）</div>
                      <div className="text-gray-900 whitespace-pre-wrap">{previewHistoryDoc.content.treatmentSummary}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">診療経過</div>
                      <div className="text-gray-900 whitespace-pre-wrap">{previewHistoryDoc.content.medicalHistory}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">治療方針</div>
                      <div className="text-gray-900 whitespace-pre-wrap">{previewHistoryDoc.content.treatmentPlan}</div>
                    </div>
                    {previewHistoryDoc.content.notes && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">注意事項</div>
                        <div className="text-gray-900 whitespace-pre-wrap">{previewHistoryDoc.content.notes}</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <p className="text-sm">文書の内容がありません</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (previewHistoryDoc.content) {
                    copyDocumentContent(previewHistoryDoc.content);
                    setPreviewHistoryDoc(null);
                  }
                }}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Copy className="w-4 h-4 mr-2" />
                この内容をコピー
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewHistoryDoc(null)}
              >
                閉じる
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Revision History Modal */}
      {showRevisionHistory && (editingDocument || viewingRevisionDoc) && (editingDocument?.revisionHistory || viewingRevisionDoc?.revisionHistory) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => { setShowRevisionHistory(false); setViewingRevisionDoc(null); }}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-blue-600" />
                    修正履歴：{(viewingRevisionDoc || editingDocument)?.type}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    文書日付：{(viewingRevisionDoc || editingDocument)?.documentDate}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setShowRevisionHistory(false); setViewingRevisionDoc(null); }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {((viewingRevisionDoc || editingDocument)?.revisionHistory?.length || 0) > 0 ? (
                <div className="space-y-4">
                  {/* 新しい順に表示（デフォルト順） */}
                  {(viewingRevisionDoc || editingDocument)!.revisionHistory!.map((revision, index) => {
                    const isFirstVersion = revision.revisionNumber === 1;
                    const isLatestVersion = index === 0; // 新しい順なので最初が最新
                    
                    return (
                      <div
                        key={revision.revisionNumber}
                        className={`border rounded p-3 ${
                          isLatestVersion ? 'border-blue-200 bg-white' : 'border-gray-200 bg-white'
                        }`}
                      >
                        {/* Revision Header */}
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className={isLatestVersion ? 'bg-white text-blue-700 border-blue-300 text-sm' : 'bg-white text-gray-700 border-gray-300 text-sm'}
                          >
                            第{revision.revisionNumber}版
                          </Badge>
                          {isLatestVersion && (
                            <span className="text-sm text-blue-600 font-medium">最新</span>
                          )}
                          <span className="text-sm text-gray-500 ml-auto">
                            {revision.timestamp} / {revision.updatedBy}
                          </span>
                        </div>

                        {/* First Version (初版作成) */}
                        {isFirstVersion ? (
                          <div className="text-sm text-gray-600">
                            📝 初版作成
                            {revision.memo && <span className="ml-2">：{revision.memo}</span>}
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {/* Change Reason */}
                            {revision.memo && (
                              <div className="text-sm text-gray-700 border-l-2 border-amber-400 pl-2">
                                <span className="text-gray-500">理由：</span>{revision.memo}
                              </div>
                            )}

                            {/* Changes - Compact List */}
                            {revision.changes.length > 0 && (
                              <div className="text-sm space-y-1">
                                {revision.changes.map((change, changeIndex) => (
                                  <div key={changeIndex} className="flex items-start gap-2">
                                    <span className="text-gray-600 flex-shrink-0 min-w-[80px]">{change.fieldLabel}：</span>
                                    <span className="text-gray-400 flex-shrink-0">
                                      {change.oldValue ? (
                                        <span className="line-through">{change.oldValue.length > 30 ? change.oldValue.substring(0, 30) + '...' : change.oldValue}</span>
                                      ) : (
                                        <span className="italic">（空欄）</span>
                                      )}
                                    </span>
                                    <span className="text-gray-400 flex-shrink-0">→</span>
                                    <span className="text-gray-900 font-medium">
                                      {change.newValue.length > 30 ? change.newValue.substring(0, 30) + '...' : change.newValue}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <GitBranch className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">修正履歴はありません</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowRevisionHistory(false); setViewingRevisionDoc(null); }}
              >
                閉じる
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Memo Modal */}
      {showRevisionMemoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRevisionMemoModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    変更理由の入力
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    {(viewingRevisionDoc || editingDocument)?.type}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setShowRevisionMemoModal(false); }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div>
                <Label className="text-sm font-medium flex items-center gap-1">
                  変更理由
                  <span className="text-red-600 text-xs">*必須</span>
                </Label>
                <textarea
                  value={revisionMemo}
                  onChange={(e) => setRevisionMemo(e.target.value)}
                  placeholder="例：住所変更、治療方針の修正、診断名の追加など"
                  className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowRevisionMemoModal(false); }}
              >
                キャンセル
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleConfirmRevision}
                className="bg-blue-600 hover:bg-blue-700 text-white h-9"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                更新
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}