import { useState } from 'react';
import { ArrowLeft, Plus, FileText, MessageSquare } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Card } from '@/shared/components/atoms/card';
import { Label } from '@/shared/components/atoms/label';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Calendar } from '@/shared/components/atoms/calendar';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/atoms/alert-dialog';

interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
}

interface DepartmentConsultPanelProps {
  currentPatient: CurrentPatient;
  onNavigateToChart?: () => void;
}

interface ConsultRequest {
  id: string;
  patientId: string;
  requestDate: string;
  department: string;
  requester: string;
  requesterDepartment: string;
  requestedDoctor?: string;
  status: '未対応' | '対応中' | '完了' | '保留';
  content?: string;
  urgency?: '通常' | '至急';
  preferredDate?: Date;
  preferredTime?: string;
  reservationDate?: Date;
  reservationTime?: string;
  attachments?: string[];
  replies?: ConsultReply[]; // 返信履歴（複数対応）
  unreadReplyCount?: number; // 未読返信数
  isConfirmed?: boolean;
  editHistory?: EditHistoryEntry[];
  lastEditedBy?: string;
  lastEditedAt?: string;
}

interface ConsultReply {
  id: string;
  replyDate: string;
  replier: string;
  replierDepartment: string;
  content: string;
  attachments?: string[];
  isRead?: boolean; // 既読管理
}

interface EditHistoryEntry {
  editedBy: string;
  editedAt: string;
  action: '作成' | '編集' | '返信';
}

export function DepartmentConsultPanelNew({ currentPatient, onNavigateToChart }: DepartmentConsultPanelProps) {
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedRequest, setSelectedRequest] = useState<ConsultRequest | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  // フィルタ用のstate
  const [filterMode, setFilterMode] = useState<'all' | 'department' | 'doctor'>('all');
  const [showConfirmed, setShowConfirmed] = useState<boolean>(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false); // 未読返信のみ表示
  
  // 確認ダイアログ用のstate
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [requestToConfirm, setRequestToConfirm] = useState<ConsultRequest | null>(null);
  
  // 現在のユーザー（実際はログイン情報から取得）
  const currentUser = '鈴木医師';
  const currentUserDepartment = '循環器内科'; // 実際はログイン情報から取得
  
  // サンプルデータ（全て田中太郎さん = currentPatient.id のデータ）
  const [consultRequests, setConsultRequests] = useState<ConsultRequest[]>([
    {
      id: '1',
      patientId: currentPatient.id,
      requestDate: '2025/10/12 14:30',
      department: '循環器内科',
      requester: '山田医師',
      requesterDepartment: '内科',
      requestedDoctor: '鈴木医師',
      status: '対応中',
      content: '外来で施行した心電図にてST変化を認めました。虚血性心疾患の精査をお願いいたします。',
      urgency: '至急',
      preferredDate: new Date('2025-10-15'),
      attachments: ['心電図結果', '血液検査'],
      replies: [],
      unreadReplyCount: 0,
      isConfirmed: false
    },
    {
      id: '2',
      patientId: currentPatient.id,
      requestDate: '2025/10/10 09:15',
      department: '循環器内科',
      requester: '佐藤医師',
      requesterDepartment: '皮膚科',
      requestedDoctor: '鈴木医師',
      status: '完了',
      content: '両下肢に紅斑あり、薬疹の可能性について診察をお願いします。',
      urgency: '通常',
      preferredDate: new Date('2025-10-13'),
      attachments: ['写真'],
      replies: [
        {
          id: 'r1',
          replyDate: '2025/10/11 15:20',
          replier: '鈴木医師',
          replierDepartment: '循環器内科',
          content: '診察の結果、薬疹と診断しました。該当薬剤の中止と抗ヒスタミン薬の処方を推奨します。',
          isRead: true
        }
      ],
      unreadReplyCount: 0,
      isConfirmed: true
    },
    {
      id: '3',
      patientId: currentPatient.id,
      requestDate: '2025/10/11 16:20',
      department: '整形外科',
      requester: '山田医師',
      requesterDepartment: '内科',
      requestedDoctor: '高橋医師',
      status: '完了',
      content: '左膝関節痛を訴えています。変形性膝関節症の可能性があり、専門的な診察をお願いします。',
      urgency: '通常',
      preferredDate: new Date('2025-10-14'),
      attachments: ['X線画像'],
      replies: [
        {
          id: 'r2',
          replyDate: '2025/10/12 10:30',
          replier: '高橋医師',
          replierDepartment: '整形外科',
          content: 'X線所見より変形性膝関節症と診断しました。理学療法と消炎鎮痛剤の処方を開始しました。',
          isRead: true
        },
        {
          id: 'r3',
          replyDate: '2025/10/13 09:00',
          replier: '山田医師',
          replierDepartment: '内科',
          content: 'ありがとうございます。経過を見て再度ご相談させていただきます。',
          isRead: true
        }
      ],
      unreadReplyCount: 0,
      isConfirmed: true
    },
    {
      id: '4',
      patientId: currentPatient.id,
      requestDate: '2025/10/08 13:45',
      department: '皮膚科',
      requester: '佐藤医師',
      requesterDepartment: '皮膚科',
      requestedDoctor: '木村医師',
      status: '対応中',
      content: '顔面の発疹が難治性です。専門的な所見をお願いいたします。',
      urgency: '通常',
      preferredDate: new Date('2025-10-10'),
      attachments: ['写真'],
      replies: [
        {
          id: 'r7',
          replyDate: '2025/10/09 14:20',
          replier: '木村医師',
          replierDepartment: '皮膚科',
          content: '診察しました。接触性皮膚炎の可能性が高いです。原因物質の特定を進めています。',
          isRead: true
        }
      ],
      unreadReplyCount: 0,
      isConfirmed: false
    },
    {
      id: '5',
      patientId: currentPatient.id,
      requestDate: '2025/10/07 11:00',
      department: '呼吸器内科',
      requester: '山田医師',
      requesterDepartment: '内科',
      requestedDoctor: '伊藤医師',
      status: '完了',
      content: '慢性咳嗽が続いています。喘息の可能性について精査をお願いします。',
      urgency: '通常',
      preferredDate: new Date('2025-10-09'),
      attachments: ['胸部X線'],
      replies: [
        {
          id: 'r8',
          replyDate: '2025/10/08 16:00',
          replier: '伊藤医師',
          replierDepartment: '呼吸器内科',
          content: '呼吸機能検査を実施しました。喘息と診断し、吸入ステロイドを開始しました。',
          isRead: true
        }
      ],
      unreadReplyCount: 0,
      isConfirmed: true
    },
    {
      id: '6',
      patientId: currentPatient.id,
      requestDate: '2025/10/11 10:30',
      department: '消化器内科',
      requester: '鈴木医師',
      requesterDepartment: '循環器内科',
      requestedDoctor: '田中医師',
      status: '対応中',
      content: '循環器治療中の患者で、腹痛と下血を訴えています。抗血栓薬使用中ですが、消化管出血の可能性について精査をお願いいたします。',
      urgency: '至急',
      preferredDate: new Date('2025-10-12'),
      reservationDate: new Date('2025-10-12'),
      reservationTime: '14:00',
      attachments: ['血液検査', '内服薬リスト'],
      replies: [
        {
          id: 'r5',
          replyDate: '2025/10/12 09:15',
          replier: '田中医師',
          replierDepartment: '消化器内科',
          content: '内視鏡検査を実施しました。消化管出血を確認し、止血処置を行いました。抗血栓薬は一時中止し、経過を観察します。',
          isRead: false
        },
        {
          id: 'r6',
          replyDate: '2025/10/12 14:45',
          replier: '田中医師',
          replierDepartment: '消化器内科',
          content: '経過観察中です。出血は止まっています。再出血のリスクがあるため、抗血栓薬の再開は慎重に判断してください。',
          isRead: false
        }
      ],
      unreadReplyCount: 2,
      isConfirmed: false
    },
    {
      id: '7',
      patientId: currentPatient.id,
      requestDate: '2025/10/09 15:45',
      department: '神経内科',
      requester: '鈴木医師',
      requesterDepartment: '循環器内科',
      requestedDoctor: '吉田医師',
      status: '完了',
      content: '心房細動で抗凝固療法中の患者です。最近、めまいとふらつきを訴えています。脳血管障害の可能性について診察をお願いします。',
      urgency: '通常',
      preferredDate: new Date('2025-10-10'),
      reservationDate: new Date('2025-10-10'),
      reservationTime: '09:30',
      attachments: ['心電図', 'PT-INR値'],
      replies: [
        {
          id: 'r4',
          replyDate: '2025/10/10 11:00',
          replier: '吉田医師',
          replierDepartment: '神経内科',
          content: 'MRIを実施しましたが、急性期脳梗塞の所見は認めませんでした。末梢性めまいの可能性が高いと判断します。経過観察を継続してください。',
          isRead: true
        }
      ],
      unreadReplyCount: 0,
      isConfirmed: true
    },
  ]);
  
  // フォーム用state
  const [formData, setFormData] = useState({
    department: '',
    requestedDoctor: '',
    content: '',
    urgency: '通常' as '通常' | '至急',
    reservationDate: undefined as Date | undefined,
    reservationTime: '',
    noPreferredDateTime: false
  });

  // 返信フォーム用state
  const [replyFormData, setReplyFormData] = useState({
    content: ''
  });

  // 予約枠データ（医師ごとの空き枠）
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const departments = [
    '循環器内科',
    '消化器内科',
    '呼吸器内科',
    '神経内科',
    '整形外科',
    '皮膚科',
    '眼科',
    '耳鼻咽喉科',
    '泌尿器科',
    '精神科'
  ];

  // 診療科ごとの医師リスト
  const doctorsByDepartment: Record<string, string[]> = {
    '循環器内科': ['鈴木医師', '佐々木医師', '中村医師'],
    '消化器内科': ['田中医師', '渡辺医師', '小林医師'],
    '呼吸器内科': ['伊藤医師', '山本医師', '加藤医師'],
    '神経内科': ['吉田医師', '山田医師', '佐藤医師'],
    '整形外科': ['高橋医師', '松本医師', '井上医師'],
    '皮膚科': ['木村医師', '林医師', '清水医師'],
    '眼科': ['山崎医師', '森医師', '池田医師'],
    '耳鼻咽喉科': ['橋本医師', '石川医師', '前田医師'],
    '泌尿器科': ['藤田医師', '岡田医師', '後藤医師'],
    '精神科': ['長谷川医師', '村上医師', '近藤医師']
  };

  const handleCreateNew = () => {
    setViewMode('create');
    setIsEditMode(false);
    setSelectedRequest(null);
    setFormData({
      department: '',
      requestedDoctor: '',
      content: '',
      urgency: '通常',
      reservationDate: undefined,
      reservationTime: '',
      noPreferredDateTime: false
    });
    setAvailableSlots([]);
  };

  const handleEdit = (request: ConsultRequest) => {
    setSelectedRequest(request);
    setViewMode('create');
    setIsEditMode(true);
    
    // 既存の依頼内容をフォームに読み込む
    setFormData({
      department: request.department,
      requestedDoctor: request.requestedDoctor || '',
      content: request.content || '',
      urgency: request.urgency || '通常',
      reservationDate: request.reservationDate,
      reservationTime: request.reservationTime || '',
      noPreferredDateTime: !request.preferredDate
    });

    // 医師が選択されている場合、予約枠を読み込む
    if (request.requestedDoctor) {
      const mockSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
      ];
      setAvailableSlots(mockSlots);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedRequest(null);
    setReplyFormData({
      content: ''
    });
    setAvailableSlots([]);
  };

  // 詳細表示（時系列）
  const handleViewDetail = (request: ConsultRequest) => {
    setSelectedRequest(request);
    setViewMode('detail');
    setReplyFormData({
      content: ''
    });
    
    // 未読を既読にする
    if (request.unreadReplyCount && request.unreadReplyCount > 0) {
      setConsultRequests(consultRequests.map(req =>
        req.id === request.id
          ? {
              ...req,
              replies: req.replies?.map(r => ({ ...r, isRead: true })),
              unreadReplyCount: 0
            }
          : req
      ));
    }
  };

  // 医師選択時に予約枠を取得する
  const handleDoctorChange = (doctor: string) => {
    setFormData({ ...formData, requestedDoctor: doctor, reservationDate: undefined, reservationTime: '' });
    if (doctor) {
      const mockSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
      ];
      setAvailableSlots(mockSlots);
    } else {
      setAvailableSlots([]);
    }
  };

  // 予約日選択時に予約枠を更新する
  const handleReservationDateChange = (date: Date | undefined) => {
    setFormData({ ...formData, reservationDate: date, reservationTime: '' });
    if (date && formData.requestedDoctor) {
      const mockSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
      ];
      setAvailableSlots(mockSlots);
    }
  };

  const handleSubmit = () => {
    const now = new Date();
    const dateTime = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (isEditMode && selectedRequest) {
      // 編集モードの場合は既存の依頼を更新
      const editHistory = selectedRequest.editHistory || [];
      editHistory.push({
        editedBy: currentUser,
        editedAt: dateTime,
        action: '編集'
      });

      setConsultRequests(
        consultRequests.map((req) =>
          req.id === selectedRequest.id
            ? {
                ...req,
                department: formData.department,
                requestedDoctor: formData.requestedDoctor || undefined,
                content: formData.content,
                urgency: formData.urgency,
                reservationDate: formData.reservationDate,
                reservationTime: formData.reservationTime,
                editHistory: editHistory,
                lastEditedBy: currentUser,
                lastEditedAt: dateTime,
                isConfirmed: false, // 編集したらみをリセット
              }
            : req
        )
      );
    } else {
      // 新規作成モード
      const newRequest: ConsultRequest = {
        id: String(consultRequests.length + 1),
        patientId: currentPatient.id,
        requestDate: dateTime,
        department: formData.department,
        requestedDoctor: formData.requestedDoctor || undefined,
        requester: currentUser,
        requesterDepartment: currentUserDepartment,
        status: '対応中',
        content: formData.content,
        urgency: formData.urgency,
        reservationDate: formData.reservationDate,
        reservationTime: formData.reservationTime,
        replies: [],
        unreadReplyCount: 0,
        editHistory: [{
          editedBy: currentUser,
          editedAt: dateTime,
          action: '作成'
        }],
        lastEditedBy: currentUser,
        lastEditedAt: dateTime
      };
      
      setConsultRequests([newRequest, ...consultRequests]);
    }
    
    setViewMode('list');
    setIsEditMode(false);
    setSelectedRequest(null);
  };

  // 詳細画面から返信を送信
  const handleSubmitReplyFromDetail = () => {
    if (!selectedRequest || !replyFormData.content.trim()) return;

    const now = new Date();
    const dateTime = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newReply: ConsultReply = {
      id: `r${Date.now()}`,
      replyDate: dateTime,
      replier: currentUser,
      replierDepartment: currentUserDepartment,
      content: replyFormData.content,
      isRead: true
    };

    const editHistory = selectedRequest.editHistory || [];
    editHistory.push({
      editedBy: currentUser,
      editedAt: dateTime,
      action: '返信'
    });

    setConsultRequests(
      consultRequests.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              replies: [...(req.replies || []), newReply],
              status: '対応中' as const,
              isConfirmed: true,
              editHistory: editHistory,
              lastEditedBy: currentUser,
              lastEditedAt: dateTime
            }
          : req
      )
    );

    // フォームをクリア
    setReplyFormData({ content: '' });
    
    // selectedRequestを更新して最新の状態を反映
    setSelectedRequest({
      ...selectedRequest,
      replies: [...(selectedRequest.replies || []), newReply]
    });
  };

  // フィルタリング済みのリストを取得（現在の患者のデータのみ）
  const getFilteredRequests = () => {
    return consultRequests.filter(request => {
      // まず現在の患者のデータのみに絞る
      if (request.patientId !== currentPatient.id) {
        return false;
      }
      
      // 診療科フィルタ（自分の診療科宛ての依頼）
      if (filterMode === 'department' && request.department !== currentUserDepartment) {
        return false;
      }
      
      // 医師フィルタ（自分宛ての依頼）
      if (filterMode === 'doctor' && request.requestedDoctor !== currentUser) {
        return false;
      }
      
      // 確認済みフィルタ
      if (!showConfirmed && request.isConfirmed) {
        return false;
      }
      
      // 未読返信フィルタ
      if (showUnreadOnly && getUnreadRepliesForMe(request) === 0) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // 依頼日時で降順ソート（新しい順）
      return new Date(b.requestDate.replace(/\//g, '-')).getTime() - new Date(a.requestDate.replace(/\//g, '-')).getTime();
    });
  };

  // 自分宛の未読返信数を計算
  const getUnreadRepliesForMe = (request: ConsultRequest): number => {
    if (!request.replies || request.replies.length === 0) {
      return 0;
    }

    if (request.requester === currentUser) {
      // 自分が依頼者の場合：他者からの未読返信
      return request.replies.filter(r => 
        r.replier !== currentUser && !r.isRead
      ).length;
    } else if (request.requestedDoctor === currentUser) {
      // 自分が依頼先の場合：依頼者からの未読返信
      return request.replies.filter(r => 
        r.replier === request.requester && !r.isRead
      ).length;
    }
    
    return 0;
  };

  // 一覧画面から確認済みにする処理
  const handleMarkAsConfirmed = (request: ConsultRequest) => {
    // 既に確認済みの場合は何もしない
    if (request.isConfirmed) {
      return;
    }
    
    setRequestToConfirm(request);
    setConfirmDialogOpen(true);
  };

  const handleConfirmMarkAsConfirmed = () => {
    if (!requestToConfirm) return;

    const now = new Date();
    const dateTime = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 編集履歴を更新
    const editHistory = requestToConfirm.editHistory || [];
    editHistory.push({
      editedBy: currentUser,
      editedAt: dateTime,
      action: '返信'
    });

    setConsultRequests(
      consultRequests.map((req) =>
        req.id === requestToConfirm.id
          ? {
              ...req,
              isConfirmed: true,
              editHistory: editHistory,
              lastEditedBy: currentUser,
              lastEditedAt: dateTime
            }
          : req
      )
    );

    setConfirmDialogOpen(false);
    setRequestToConfirm(null);
  };

  const filteredRequests = getFilteredRequests();

  return (
    <div className="flex-1 flex flex-col bg-background">
      {viewMode === 'list' ? (
        <>
          {/* 一覧画面 */}
          <div className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-muted-foreground text-base font-normal">他科依頼</h1>
              <div className="flex items-center gap-2">
                {onNavigateToChart && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onNavigateToChart}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    カルテ
                  </Button>
                )}
                <Button
                  onClick={handleCreateNew}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  新規依頼
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {/* 依頼リスト */}
            <div className="h-full p-6 overflow-auto">
              {/* フィルタエリア */}
              <Card className="border border-border mb-4">
                <div className="p-4">
                  <div className="flex items-center gap-8">
                    {/* 表示モード */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="filterMode"
                          value="all"
                          checked={filterMode === 'all'}
                          onChange={(e) => setFilterMode(e.target.value as 'all' | 'department' | 'doctor')}
                          className="w-4 h-4"
                        />
                        <span>全て表示</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="filterMode"
                          value="department"
                          checked={filterMode === 'department'}
                          onChange={(e) => setFilterMode(e.target.value as 'all' | 'department' | 'doctor')}
                          className="w-4 h-4"
                        />
                        <span>診療科で表示</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="filterMode"
                          value="doctor"
                          checked={filterMode === 'doctor'}
                          onChange={(e) => setFilterMode(e.target.value as 'all' | 'department' | 'doctor')}
                          className="w-4 h-4"
                        />
                        <span>自分宛のみ表示</span>
                      </label>
                    </div>

                    {/* 確認済み */}
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={showConfirmed}
                        onCheckedChange={(checked) => setShowConfirmed(checked as boolean)}
                      />
                      <span>確認済を表示</span>
                    </div>

                    {/* 未読返信 */}
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={showUnreadOnly}
                        onCheckedChange={(checked) => setShowUnreadOnly(checked as boolean)}
                      />
                      <span>未読返信のみ表示</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border border-border">
                <div className="p-4">
                  <div className="border border-border rounded-lg overflow-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left border-b border-border whitespace-nowrap">依頼日時</th>
                          <th className="px-4 py-3 text-left border-b border-border whitespace-nowrap">区分</th>
                          <th className="px-4 py-3 text-left border-b border-border whitespace-nowrap">依頼元</th>
                          <th className="px-4 py-3 text-left border-b border-border whitespace-nowrap">依頼先</th>
                          <th className="px-4 py-3 text-left border-b border-border whitespace-nowrap">内容</th>
                          <th className="px-4 py-3 text-center border-b border-border whitespace-nowrap">依頼確認</th>
                          <th className="px-4 py-3 text-left border-b border-border whitespace-nowrap">返信状況</th>
                          <th className="px-4 py-3 text-center border-b border-border whitespace-nowrap">編集</th>
                          <th className="px-4 py-3 text-center border-b border-border whitespace-nowrap">返信</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.map((request) => {
                          const isMyRequest = request.requestedDoctor === currentUser;
                          const replyCount = request.replies?.length || 0;
                          const unreadCount = getUnreadRepliesForMe(request); // 動的に計算
                          
                          return (
                            <tr
                              key={request.id}
                              className={`hover:bg-muted/50 transition-colors ${
                                isMyRequest ? 'bg-blue-50' : ''
                              }`}
                            >
                              <td className="px-4 py-3 border-b border-border whitespace-nowrap">{request.requestDate}</td>
                              <td className="px-4 py-3 border-b border-border">
                                <span
                                  className={`inline-block px-2 py-1 rounded text-xs whitespace-nowrap ${
                                    request.urgency === '至急'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {request.urgency}
                                </span>
                              </td>
                              <td className="px-4 py-3 border-b border-border whitespace-nowrap">
                                <div>{request.requesterDepartment}</div>
                                <div className="text-xs text-muted-foreground">{request.requester}</div>
                              </td>
                              <td className="px-4 py-3 border-b border-border whitespace-nowrap">
                                <div>{request.department}</div>
                                {request.requestedDoctor && <div className="text-xs text-muted-foreground">{request.requestedDoctor}</div>}
                              </td>
                              <td className="px-4 py-3 border-b border-border max-w-md">
                                <div className="line-clamp-2">{request.content}</div>
                              </td>
                              <td className="px-4 py-3 border-b border-border text-center">
                                <div 
                                  className={`flex items-center justify-center ${!request.isConfirmed ? 'cursor-pointer' : ''}`}
                                  onClick={() => handleMarkAsConfirmed(request)}
                                  title={request.isConfirmed ? '確認済み' : 'クリックして確認済みにする'}
                                >
                                  {request.isConfirmed ? (
                                    <span className="inline-block w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</span>
                                  ) : (
                                    <span className="inline-block w-5 h-5 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"></span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 border-b border-border whitespace-nowrap">
                                {replyCount > 0 ? (
                                  <div className="flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-sm">{replyCount}件</span>
                                    {unreadCount > 0 && (
                                      <span className="text-xs text-red-600 ml-1">(未読返信{unreadCount}🔴)</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 border-b border-border text-center">
                                <Button
                                  onClick={() => handleEdit(request)}
                                  size="sm"
                                >
                                  編集
                                </Button>
                              </td>
                              <td className="px-4 py-3 border-b border-border text-center">
                                <Button
                                  onClick={() => handleViewDetail(request)}
                                  size="sm"
                                >
                                  返信
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {filteredRequests.length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">
                        該当する依頼がありません
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      ) : viewMode === 'create' ? (
        <>
          {/* 新規依頼作成画面 */}
          <div className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-muted-foreground text-base font-normal">
                {isEditMode ? '依頼編集' : '新規他科依頼'}
              </h1>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-3xl mx-auto">
              <Card className="border border-border">
                <div className="p-6 space-y-6">
                  {/* 依頼先科・依頼先医師 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>依頼先科 *</Label>
                      <div className="border border-border rounded-md">
                        <select
                          className="w-full px-3 py-2 bg-background rounded-md"
                          value={formData.department}
                          onChange={(e) =>
                            setFormData({ ...formData, department: e.target.value, requestedDoctor: '' })
                          }
                        >
                          <option value="">選択してください</option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>依頼先医師</Label>
                      <div className="border border-border rounded-md">
                        <select
                          className="w-full px-3 py-2 bg-background rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                          value={formData.requestedDoctor}
                          onChange={(e) =>
                            handleDoctorChange(e.target.value)
                          }
                          disabled={!formData.department}
                        >
                          <option value="">選択してください</option>
                          {formData.department && doctorsByDepartment[formData.department]?.map((doctor) => (
                            <option key={doctor} value={doctor}>
                              {doctor}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 緊急度 */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <Label>緊急度</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="urgency"
                          value="通常"
                          checked={formData.urgency === '通常'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              urgency: e.target.value as '通常' | '至急'
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span>通常</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="urgency"
                          value="至急"
                          checked={formData.urgency === '至急'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              urgency: e.target.value as '通常' | '至急'
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span>至急</span>
                      </label>
                    </div>
                  </div>

                  {/* 希望日時 */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <Label>希望日時</Label>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {/* 希望日 */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!formData.requestedDoctor || formData.noPreferredDateTime}
                          >
                            {formData.reservationDate
                              ? formData.reservationDate.toLocaleDateString('ja-JP')
                              : '日付を選択'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.reservationDate}
                            onSelect={handleReservationDateChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {/* 希望時間 */}
                      <div className="border border-border rounded-md">
                        <select
                          className="w-full px-3 py-2 bg-background rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                          value={formData.reservationTime}
                          onChange={(e) => setFormData({ ...formData, reservationTime: e.target.value })}
                          disabled={!formData.reservationDate || formData.noPreferredDateTime}
                        >
                          <option value="">時間を選択</option>
                          {availableSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 指定なしチェックボックス */}
                      <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={formData.noPreferredDateTime}
                            onCheckedChange={(checked) => {
                              setFormData({
                                ...formData,
                                noPreferredDateTime: checked as boolean,
                                reservationDate: undefined,
                                reservationTime: ''
                              });
                            }}
                          />
                          <span>指定なし</span>
                        </label>
                      </div>
                    </div>

                    {formData.reservationDate && formData.reservationTime && !formData.noPreferredDateTime && (
                      <div className="p-3 bg-primary/10 rounded border border-primary/20 mt-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">予約確定：</span>
                          <span className="ml-2">
                            {formData.reservationDate.toLocaleDateString('ja-JP')} {formData.reservationTime}
                          </span>
                          <span className="ml-2 text-muted-foreground">
                            ({formData.requestedDoctor})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 依頼内容 */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <Label>依頼内容 *</Label>
                    <Textarea
                      className="min-h-64 resize-none"
                      placeholder="依頼内容を記載してください&#10;&#10;例：&#10;・心電図にてST変化を認めました。虚血性心疾患の精査をお願いいたします。&#10;・2025/10/12の血液検査結果を参照してください。"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                    />
                  </div>

                  {/* ボタン */}
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button 
                      onClick={handleSubmit} 
                      className="flex-1"
                      disabled={!formData.department || !formData.content.trim()}
                    >
                      送信
                    </Button>
                    <Button
                      onClick={handleBackToList}
                      variant="outline"
                      className="flex-1"
                    >
                      キャンセル
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 詳細画面（時系列表示 - 左右2カラム） */}
          <div className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center gap-3">
              <h1 className="text-muted-foreground text-base font-normal">
                他科依頼返信
              </h1>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <Card className="border border-border overflow-hidden">
                {/* 左右2カラムレイアウト */}
                <div className="flex" style={{ minHeight: '600px' }}>
                  {/* 左側：タイムライン表示エリア（60%） */}
                  <div className="w-[60%] border-r border-border p-6 overflow-auto">
                    <div className="space-y-4">
                      {/* 元の依頼 */}
                      <Card className="border border-border">
                        <div className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="font-medium">
                                    {selectedRequest?.requesterDepartment} {selectedRequest?.requester} → {selectedRequest?.department}
                                    {selectedRequest?.requestedDoctor && ` ${selectedRequest.requestedDoctor}`}
                                  </div>
                                  <div className="text-sm text-muted-foreground">{selectedRequest?.requestDate}</div>
                                </div>
                                <span
                                  className={`inline-block px-3 py-1 rounded text-xs whitespace-nowrap ${
                                    selectedRequest?.urgency === '至急'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {selectedRequest?.urgency}
                                </span>
                              </div>
                              <div className="bg-muted/50 rounded p-4 mt-3">
                                <div className="font-medium mb-2">依頼内容</div>
                                <p className="whitespace-pre-wrap leading-relaxed">{selectedRequest?.content}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* 返信の履歴 */}
                      {selectedRequest?.replies && selectedRequest.replies.length > 0 && (
                        <>
                          {selectedRequest.replies.map((reply, index) => (
                            <Card key={reply.id} className="border border-border">
                              <div className="p-5">
                                <div className="flex items-start gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <div>
                                        <div className="font-medium">
                                          {reply.replierDepartment} {reply.replier}
                                        </div>
                                        <div className="text-sm text-muted-foreground">{reply.replyDate}</div>
                                      </div>
                                      {!reply.isRead && (
                                        <span className="inline-block px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                                          未読
                                        </span>
                                      )}
                                    </div>
                                    <div className="bg-muted/50 rounded p-4 mt-3">
                                      <div className="font-medium mb-2">返信 {index + 1}</div>
                                      <p className="whitespace-pre-wrap leading-relaxed">{reply.content}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* 右側：返信入力エリア（40%） */}
                  <div className="w-[40%] bg-blue-50/30 p-6 flex flex-col">
                    <div className="border-2 border-primary/30 rounded-lg shadow-sm flex-1 flex flex-col bg-background">
                      <div className="p-5 border-b border-border bg-primary/5 rounded-t-lg">
                        <h3 className="font-medium">返信を記入</h3>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <Textarea
                          className="flex-1 resize-none mb-4"
                          placeholder="返信内容を記載してださい..."
                          value={replyFormData.content}
                          onChange={(e) =>
                            setReplyFormData({ ...replyFormData, content: e.target.value })
                          }
                        />
                        <div className="flex gap-3">
                          <Button 
                            onClick={handleSubmitReplyFromDetail} 
                            className="flex-1"
                            disabled={!replyFormData.content.trim()}
                          >
                            送信
                          </Button>
                          <Button
                            onClick={handleBackToList}
                            variant="outline"
                            className="flex-1"
                          >
                            キャンセル
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* 確認ダイアログ */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>依頼内容の確認</AlertDialogTitle>
            <AlertDialogDescription>
              この依頼を確認済みとしてマークします。依頼元の医師に確認済みであることが通知されます。
            </AlertDialogDescription>
            <div className="mt-4 p-3 bg-muted rounded border border-border">
              <div className="text-sm space-y-1">
                <div className="flex gap-2">
                  <span className="text-muted-foreground min-w-16">依頼日時:</span>
                  <span className="text-foreground">{requestToConfirm?.requestDate}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground min-w-16">依頼元:</span>
                  <span className="text-foreground">{requestToConfirm?.requesterDepartment} / {requestToConfirm?.requester}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground min-w-16">依頼先:</span>
                  <span className="text-foreground">{requestToConfirm?.department}{requestToConfirm?.requestedDoctor && ` / ${requestToConfirm.requestedDoctor}`}</span>
                </div>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmMarkAsConfirmed}>
              確認済みにする
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}