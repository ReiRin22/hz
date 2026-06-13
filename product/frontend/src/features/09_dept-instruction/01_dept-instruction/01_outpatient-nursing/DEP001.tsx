"use client";
import { useState } from 'react';
import { SearchCriteria, type SearchFilters } from './components/molecules/SearchCriteria';
import { OrderTable } from './components/molecules/OrderTable';
import { ThreePointCheckModal } from './components/molecules/ThreePointCheckModal';
import { ImplementerInputDialog } from './components/molecules/ImplementerInputDialog';
import { PrescriptionDialog } from './components/molecules/PrescriptionDialog';
import { MedicationInfoDialog, type MedicationInfoData } from './components/molecules/MedicationInfoDialog';
import { AllergyDetailDialog } from './components/molecules/AllergyDetailDialog';
import { ResultInputDialog } from './components/molecules/ResultInputDialog';
import { NutritionRecordDialog, type NutritionRecordData } from './components/molecules/NutritionRecordDialog';
import { PharmacistGuidanceDialog, type PharmacistGuidanceData } from './components/molecules/PharmacistGuidanceDialog';
import { PrintDialog } from './components/molecules/PrintDialog';
import { Button } from '@shared/components/atoms/button';
import { Toaster } from '@shared/components/atoms/sonner';
import { toast } from 'sonner';
import { mockOrders } from './lib/mockData';
import { Printer, FileText, Upload } from 'lucide-react';
import type { Order, ImplementerInput, PrescriptionData, TestResult, StatusHistory } from './types';

export default function DEP001Page() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Modal states
  const [threePointCheckOpen, setThreePointCheckOpen] = useState(false);
  const [implementerDialogOpen, setImplementerDialogOpen] = useState(false);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [medicationInfoDialogOpen, setMedicationInfoDialogOpen] = useState(false);
  const [allergyDialogOpen, setAllergyDialogOpen] = useState(false);
  const [resultInputDialogOpen, setResultInputDialogOpen] = useState(false);
  const [nutritionRecordDialogOpen, setNutritionRecordDialogOpen] = useState(false);
  const [pharmacistGuidanceDialogOpen, setPharmacistGuidanceDialogOpen] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [printType, setPrintType] = useState<'label' | 'document'>('label');

  const currentUser = '看護師C';

  // ステータスの順序定義
  const statusOrder = ['指示受済', '受付済', '開始済', '採取済', '出庫済', '実施済'];

  // 検索処理
  const handleSearch = (criteria: SearchFilters) => {
    let filtered = [...orders];

    // 日付範囲フィルタ
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.orderDate);
      orderDate.setHours(0, 0, 0, 0);
      
      const fromDate = new Date(criteria.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      
      const toDate = new Date(criteria.dateTo);
      toDate.setHours(0, 0, 0, 0);
      
      return orderDate >= fromDate && orderDate <= toDate;
    });

    // 入外区分フィルタ
    if (criteria.locationFilter !== '全て') {
      filtered = filtered.filter(order => order.location === criteria.locationFilter);
    }

    // 診療科フィルタ
    if (criteria.department !== '全て') {
      filtered = filtered.filter(order => order.department === criteria.department);
    }

    // オーダー種フィルタ
    if (criteria.orderType !== '全オーダー種') {
      filtered = filtered.filter(order => order.orderType === criteria.orderType);
    }

    // 院内/院外検査フィルタ（検体検査が選択されている場合のみ）
    if (criteria.orderType === '検体検査' && criteria.labTestLocation !== '全て') {
      filtered = filtered.filter(order => order.labTestLocation === criteria.labTestLocation);
    }

    // 画像検査の種類フィルタ（画像検査が選択されている場合のみ）
    if (criteria.orderType === '画像検査' && criteria.imageTestType !== '全て') {
      filtered = filtered.filter(order => order.imageTestType === criteria.imageTestType);
    }

    // 生理検査の種類フィルタ（生理検査が選択されている場合のみ）
    if (criteria.orderType === '生理検査' && criteria.physiologicalTestType !== '全て') {
      filtered = filtered.filter(order => order.physiologicalTestType === criteria.physiologicalTestType);
    }

    // ステータスフィルタ（選択されたステータスと未/済の両方でフィルタリング）
    if (criteria.selectedStatuses && criteria.selectedStatuses.length > 0) {
      filtered = filtered.filter(order => {
        // 選択されたステータスフィルターをループして、いずれかにマッチするかチェック
        return criteria.selectedStatuses.some(sf => {
          const filterStatus = sf.status.replace('済', ''); // "指示受済" → "指示受"
          
          if (sf.completion === 'incomplete') {
            // 未が選択されている場合：操作ボタンから判断
            // 指示受未は除外（指示受のボタンは存在しない）
            if (filterStatus === '指示受') {
              return false;
            }
            
            // 受付未：指示受済で受付ボタンが表示される
            if (filterStatus === '受付') {
              return order.status === '指示受済' && 
                     ['検体検査', '生理検査', '内視鏡検査', '画像検査', '処置', '放射線', '病理検査', '細菌検査', '透析', '汎用'].includes(order.orderType);
            }
            
            // 開始未：受付済で開始ボタンが表示される
            if (filterStatus === '開始') {
              return order.status === '受付済' && 
                     !['病理検査', '細菌検査'].includes(order.orderType);
            }
            
            // 採取未：開始済で採取ボタンが表示される
            if (filterStatus === '採取') {
              return order.status === '開始済' && 
                     ['検体検査', '細菌検査'].includes(order.orderType);
            }
            
            // 出庫未：指示受済で出庫ボタンが表示される
            if (filterStatus === '出庫') {
              return order.status === '指示受済' && 
                     ['注射', '薬剤'].includes(order.orderType);
            }
            
            // 実施未：開始済/採取済/出庫済で実施ボタンが表示される、または指示受済で実施ボタンが表示される（処方・服薬指導）
            if (filterStatus === '実施') {
              return (order.status === '開始済' && !['検体検査', '細菌検査'].includes(order.orderType)) ||
                     order.status === '採取済' ||
                     (order.status === '出庫済' && order.orderType === '注射') ||
                     (order.status === '指示受済' && ['処方', '服薬指導'].includes(order.orderType));
            }
            
            return false;
          } else {
            // 済が選択されている場合：ステータス列から判断
            return order.status === sf.status;
          }
        });
      });
    }

    // 未/済フィルタ（実施済みまで到達しているかどうか）
    if (criteria.statusCompletion === 'incomplete') {
      // 未：実施済みに到達していない
      filtered = filtered.filter(order => {
        const orderStatusIndex = statusOrder.indexOf(order.status);
        const implementedStatusIndex = statusOrder.indexOf('実施済');
        return orderStatusIndex < implementedStatusIndex;
      });
    } else if (criteria.statusCompletion === 'complete') {
      // 済：実施済み以降
      filtered = filtered.filter(order => {
        const orderStatusIndex = statusOrder.indexOf(order.status);
        const implementedStatusIndex = statusOrder.indexOf('実施済');
        return orderStatusIndex >= implementedStatusIndex;
      });
    }

    // 患者IDフィルタ
    if (criteria.patientId.trim()) {
      const searchTerm = criteria.patientId.toLowerCase();
      filtered = filtered.filter(order => 
        order.patientId.toLowerCase().includes(searchTerm)
      );
    }

    // 患者氏名フィルタ
    if (criteria.patientName.trim()) {
      const searchTerm = criteria.patientName.toLowerCase();
      filtered = filtered.filter(order => 
        order.patientName.toLowerCase().includes(searchTerm) ||
        order.patientKana.toLowerCase().includes(searchTerm)
      );
    }

    // 担当医フィルタ
    if (criteria.attendingDoctor.trim()) {
      const searchTerm = criteria.attendingDoctor.toLowerCase();
      filtered = filtered.filter(order => 
        order.attendingDoctor?.toLowerCase().includes(searchTerm)
      );
    }

    // 病棟フィルタ
    if (criteria.ward !== '全て') {
      filtered = filtered.filter(order => order.ward === criteria.ward);
    }

    setFilteredOrders(filtered);
    toast.success(`${filtered.length}件のオーダーが見つかりました`);
  };

  // クリア処理
  const handleClear = () => {
    setFilteredOrders(orders);
    toast.info('検索条件をクリアしました');
  };

  // 受付処理（検査系・処置・放射線のみ）
  const handleAccept = (orderId: string) => {
    const timestamp = new Date().toLocaleString('ja-JP');
    
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: '受付済' as const,
              acceptedAt: timestamp,
              acceptedBy: currentUser,
              statusHistory: [
                ...(order.statusHistory || []),
                { status: '受付済' as const, timestamp, updatedBy: currentUser }
              ]
            }
          : order
      )
    );

    setFilteredOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: '受付済' as const,
              acceptedAt: timestamp,
              acceptedBy: currentUser,
              statusHistory: [
                ...(order.statusHistory || []),
                { status: '受付済' as const, timestamp, updatedBy: currentUser }
              ]
            }
          : order
      )
    );

    toast.success('オーダーを受付しました');
  };

  // 検査依頼処理（病理・細菌：受付→結果待ち）
  const handleTestRequest = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const timestamp = new Date().toLocaleString('ja-JP');

    setOrders(prevOrders =>
      prevOrders.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: '結果待ち' as const,
              implementedAt: timestamp,
              statusHistory: [
                ...(o.statusHistory || []),
                { status: '結果待ち' as const, timestamp, updatedBy: currentUser }
              ]
            }
          : o
      )
    );

    setFilteredOrders(prevOrders =>
      prevOrders.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: '結果待ち' as const,
              implementedAt: timestamp,
              statusHistory: [
                ...(o.statusHistory || []),
                { status: '結果待ち' as const, timestamp, updatedBy: currentUser }
              ]
            }
          : o
      )
    );

    // ログ記録
    console.log('検査依頼ログ:', {
      orderId,
      orderType: order.orderType,
      user: currentUser,
      timestamp
    });

    const requestType = order.orderType === '病理' ? '外部病理検査機関' : '培養検査室';
    toast.success(`${requestType}に検査を依頼しました`);
  };

  // 実施ボタン押下（3点チェック起動）
  const handleImplement = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setSelectedOrder(order);
    setThreePointCheckOpen(true);

    // ログ記録
    console.log('実施ボタン押下ログ:', {
      orderId,
      user: currentUser,
      timestamp: new Date().toLocaleString('ja-JP')
    });
  };

  // 3点チェック完了
  const handleThreePointCheckComplete = () => {
    setThreePointCheckOpen(false);
    
    // ログ記録
    console.log('3点チェック完了ログ:', {
      orderId: selectedOrder?.id,
      user: currentUser,
      timestamp: new Date().toLocaleString('ja-JP')
    });

    toast.success('3点チェックが完了しました');
    
    // 実施者入力ダイアログを開く
    setTimeout(() => {
      setImplementerDialogOpen(true);
    }, 300);
  };

  // 実施者入力保存
  const handleImplementerSave = (data: ImplementerInput) => {
    setImplementerDialogOpen(false);

    if (!selectedOrder) return;

    // ステータス判定：注射オーダー・薬剤・処方は「出庫」、それ以外は「実施済」
    const newStatus: Order['status'] = 
      ['注射オーダー', '薬剤', '処方'].includes(selectedOrder.orderType) ? '出庫済' : '実施済';

    // オーダー更新
    const updatedOrders = orders.map(order =>
      order.id === selectedOrder.id
        ? {
            ...order,
            status: newStatus,
            implementedAt: data.implementedAt,
            implementedBy: data.implementer,
            statusHistory: [
              ...(order.statusHistory || []),
              { status: newStatus, timestamp: data.implementedAt, updatedBy: data.implementer }
            ]
          }
        : order
    );

    setOrders(updatedOrders);
    setFilteredOrders(
      filteredOrders.map(order =>
        order.id === selectedOrder.id
          ? {
              ...order,
              status: newStatus,
              implementedAt: data.implementedAt,
              implementedBy: data.implementer,
              statusHistory: [
                ...(order.statusHistory || []),
                { status: newStatus, timestamp: data.implementedAt, updatedBy: data.implementer }
              ]
            }
          : order
      )
    );

    // ログ記録
    console.log('実施者入力ログ:', {
      orderId: selectedOrder.id,
      implementer: data.implementer,
      witness: data.witness,
      location: data.location,
      notes: data.notes,
      reason: data.reason,
      timestamp: data.implementedAt
    });

    toast.success('実施者情報を保存しました');

    // 薬剤科の場合は処方箋ダイアログを開く
    if (selectedOrder.orderType === '薬剤') {
      setTimeout(() => {
        setPrescriptionDialogOpen(true);
      }, 300);
    } else if (selectedOrder.orderType === '処方') {
      // 処方オーダーの場合は処方箋ダイアログを開く
      setTimeout(() => {
        setPrescriptionDialogOpen(true);
      }, 300);
    } else {
      // 薬剤・処方以外は完了（ステータス遷移済み）
      setSelectedOrder(null);
    }
  };

  // 処方箋発行処理
  const handlePrescriptionComplete = (data: PrescriptionData) => {
    setPrescriptionDialogOpen(false);

    if (!selectedOrder) return;

    // ログ記録
    console.log('処方箋発行ログ:', {
      orderId: selectedOrder.id,
      shouldIssue: data.shouldIssue,
      prescriptionType: data.prescriptionType,
      skipReason: data.skipReason,
      jobId: data.jobId,
      timestamp: new Date().toLocaleString('ja-JP')
    });

    if (data.shouldIssue) {
      toast.success(`処方箋を発行しました（${data.prescriptionType}）\nジョブID: ${data.jobId}`);
    } else {
      toast.info('処方箋発行をスキップしました');
    }

    // 処方オーダーの場合は薬剤情報提供文書ダイアログを開く
    if (selectedOrder.orderType === '処方') {
      setTimeout(() => {
        setMedicationInfoDialogOpen(true);
      }, 300);
    } else {
      // 薬剤オーダーの場合はここで完了
      completeOrder(selectedOrder.id);
    }
  };

  // 薬剤情報提供文書発行処理
  const handleMedicationInfoComplete = (data: MedicationInfoData) => {
    setMedicationInfoDialogOpen(false);

    if (!selectedOrder) return;

    // ログ記録
    console.log('薬剤情報提供文書発行ログ:', {
      orderId: selectedOrder.id,
      shouldIssue: data.shouldIssue,
      skipReason: data.skipReason,
      jobId: data.jobId,
      timestamp: new Date().toLocaleString('ja-JP')
    });

    if (data.shouldIssue) {
      toast.success(`薬剤情報提供文書を発行しました\nジョブID: ${data.jobId}`);
    } else {
      toast.info('薬剤情報提供文書発行をスキップしました');
    }

    // オーダーを完了に遷移
    completeOrder(selectedOrder.id);
  };

  // オーダー完了処理（処方箋発行後）
  const completeOrder = (orderId: string) => {
    // 処方箋発行後は既に「出庫」ステータスになっているのでそのまま維持
    toast.success('処理が完了しました');
    setSelectedOrder(null);
  };

  // アレルギー詳細表示
  const handleAllergyClick = (order: Order) => {
    setSelectedOrder(order);
    setAllergyDialogOpen(true);
  };

  // 結果入力ダイアログを開く
  const handleResultInput = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setSelectedOrder(order);
    setResultInputDialogOpen(true);

    // ログ記録
    console.log('結果入力ダイアログ起動:', {
      orderId,
      user: currentUser,
      timestamp: new Date().toLocaleString('ja-JP')
    });
  };

  // 結果入力保存
  const handleResultSave = (results: TestResult[], notes: string) => {
    if (!selectedOrder) return;

    const labResults = {
      results,
      notes,
      enteredAt: new Date().toLocaleString('ja-JP'),
      enteredBy: currentUser
    };

    // オーダー更新
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === selectedOrder.id
          ? { ...order, labResults }
          : order
      )
    );

    setFilteredOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === selectedOrder.id
          ? { ...order, labResults }
          : order
      )
    );

    // ログ記録
    console.log('検査結果入力ログ:', {
      orderId: selectedOrder.id,
      resultCount: results.length,
      abnormalCount: results.filter(r => r.isAbnormal).length,
      criticalCount: results.filter(r => r.abnormalLevel === 'critical').length,
      notes,
      enteredBy: currentUser,
      timestamp: labResults.enteredAt
    });

    const abnormalCount = results.filter(r => r.isAbnormal).length;
    const criticalCount = results.filter(r => r.abnormalLevel === 'critical').length;

    if (criticalCount > 0) {
      toast.error(`検査結果を保存しました。緊急異常値が${criticalCount}件あります！`, {
        duration: 5000
      });
    } else if (abnormalCount > 0) {
      toast.warning(`検査結果を保存しました。異常値が${abnormalCount}件あります。`, {
        duration: 4000
      });
    } else {
      toast.success('検査結果を保存しました。');
    }

    setSelectedOrder(null);
  };

  // 栄養指導記録入力
  const handleNutritionRecord = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setSelectedOrder(order);
    setNutritionRecordDialogOpen(true);

    // ログ記録
    console.log('栄養指導記録入力ダイアログ起動:', {
      orderId,
      user: currentUser,
      timestamp: new Date().toLocaleString('ja-JP')
    });
  };

  // 栄養指導記録保存
  const handleNutritionRecordSave = (data: NutritionRecordData) => {
    if (!selectedOrder) return;

    // ログ記録
    console.log('栄養指導記録入力ログ:', {
      orderId: selectedOrder.id,
      guidanceType: data.guidanceType,
      guidanceDuration: data.guidanceDuration,
      instructor: data.instructor,
      timestamp: data.guidanceDate
    });

    toast.success('栄養指導記録を保存しました');
    
    setNutritionRecordDialogOpen(false);
    setSelectedOrder(null);
  };

  // 薬剤師管理指導記録入力ダイアログを開く
  const handlePharmacistGuidance = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setSelectedOrder(order);
    setPharmacistGuidanceDialogOpen(true);

    // ログ記録
    console.log('薬剤師管理指導記録入力ダイアログ起動:', {
      orderId,
      user: currentUser,
      timestamp: new Date().toLocaleString('ja-JP')
    });
  };

  // 薬剤師管理指導記録保存
  const handlePharmacistGuidanceSave = (data: PharmacistGuidanceData) => {
    if (!selectedOrder) return;

    // ログ記録
    console.log('薬剤師管理指導記録入力ログ:', {
      orderId: selectedOrder.id,
      guidanceType: data.guidanceType,
      guidanceDuration: data.guidanceDuration,
      pharmacist: data.pharmacist,
      drugUnderstanding: data.drugUnderstanding,
      adverseReactions: data.adverseReactions,
      adherence: data.adherence,
      followUpNeeded: data.followUpNeeded,
      nextGuidanceDate: data.nextGuidanceDate,
      timestamp: data.guidanceDate
    });

    toast.success('薬剤師管理指導記録を保存しました');
    
    setPharmacistGuidanceDialogOpen(false);
    setSelectedOrder(null);
  };

  // 薬歴表示
  const handleMedicationHistory = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setSelectedOrder(order);
    setMedicationInfoDialogOpen(true);

    // ログ記録
    console.log('薬歴表示ダイアログ起動:', {
      orderId,
      orderType: order.orderType,
      user: currentUser,
      timestamp: new Date().toLocaleString('ja-JP')
    });

    toast.info('薬歴を表示しています');
  };

  // 内視鏡レポート作成
  const handleEndoscopyReport = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // ログ記録
    console.log('内視鏡レポート作成:', {
      orderId,
      patientId: order.patientId,
      patientName: order.patientName,
      content: order.content,
      user: currentUser,
      timestamp: new Date().toLocaleString('ja-JP')
    });

    toast.info('内視鏡レポート作成機能は実装予定です');
  };

  // PACS参照
  const handlePacsReference = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // ログ記録
    console.log('PACS参照:', {
      orderId,
      patientId: order.patientId,
      patientName: order.patientName,
      content: order.content,
      user: currentUser,
      timestamp: new Date().toLocaleString('ja-JP')
    });

    toast.info('PACS画像ビューアを起動しています...');
  };

  // チェックボックス操作
  const handleToggleOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  // 文書管理
  const handleDocumentManagement = () => {
    if (selectedOrders.length === 0) {
      toast.warning('オーダーを選択してください');
      return;
    }
    toast.info('文書管理機能は実装予定です');
  };

  // 結果アップロード
  const handleResultUpload = () => {
    if (selectedOrders.length === 0) {
      toast.warning('オーダーを選択してください');
      return;
    }
    
    const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));
    
    // ログ記録
    console.log('結果アップロード:', {
      orderCount: selectedOrders.length,
      orders: selectedOrdersData.map(o => ({
        id: o.id,
        patientId: o.patientId,
        patientName: o.patientName,
        orderType: o.orderType
      })),
      user: currentUser,
      timestamp: new Date().toLocaleString('ja-JP')
    });
    
    toast.info('結果アップロード機能は実装予定です');
  };

  // 帳票出力ダイアログ
  const handleDocumentPrint = () => {
    if (selectedOrders.length === 0) {
      toast.warning('発行するオーダーを選択してください');
      return;
    }
    setPrintType('document');
    setPrintDialogOpen(true);
  };

  // ラベル印刷ダイアログ
  const handleLabelPrint = () => {
    if (selectedOrders.length === 0) {
      toast.warning('印刷するオーダーを選択してください');
      return;
    }
    setPrintType('label');
    setPrintDialogOpen(true);
  };

  // 印刷実行
  const handlePrint = (selectedTypes: string[]) => {
    const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));
    
    // ログ記録
    console.log('印刷ログ:', {
      type: printType,
      selectedTypes,
      orderCount: selectedOrders.length,
      orders: selectedOrdersData.map(o => ({
        id: o.id,
        patientId: o.patientId,
        patientName: o.patientName,
        orderType: o.orderType
      })),
      user: currentUser,
      timestamp: new Date().toLocaleString('ja-JP')
    });

    const typeLabels = selectedTypes.map(type => {
      const labels: Record<string, string> = {
        'specimen-label': '検体ラベル',
        'tube-label': 'スピッツラベル',
        'prescription-external': '処方箋（院外）',
        'medication-info': '薬剤情報提供文書',
        'medicine-bag': '薬袋',
        'medicine-notebook-label': 'おくすり手帳に貼るラベル',
        'prescription-copy': '処方内容（控え）',
        'internal-prescription-voucher': '院内処方引換券',
        'injection-sheet': '注射箋',
        'exam-instruction': '検査説明書',
        'guidance-request': '指導依頼書',
        'rehab-request': 'リハビリ依頼箋'
      };
      return labels[type] || type;
    }).join('、');

    toast.success(`${selectedOrders.length}件のオーダーに対して${typeLabels}を発行しました`);
    
    setPrintDialogOpen(false);
    setSelectedOrders([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">外来看護指示受け一覧</h1>
              <p className="text-sm text-gray-600 mt-1">
                全オーダー種を横断的に表示し、実施・確認・処方・3点チェックを行います
              </p>
            </div>
            <div className="text-sm text-gray-600">
              <div>ログインユーザ: {currentUser}</div>
              <div>{new Date().toLocaleString('ja-JP')}</div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        {/* 検索条件エリア */}
        <SearchCriteria onSearch={handleSearch} onClear={handleClear} />

        {/* ラベル印刷・帳票発行ボタン */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              {selectedOrders.length > 0 && (
                <span className="text-blue-600">{selectedOrders.length}件のオーダーを選択中</span>
              )}
            </div>
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                onClick={handleResultUpload}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                結果アップロード
              </Button>
              <Button
                variant="outline"
                onClick={handleDocumentManagement}
                disabled={selectedOrders.length === 0}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                文書管理
              </Button>
              <Button
                variant="outline"
                onClick={handleDocumentPrint}
                disabled={selectedOrders.length === 0}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                帳票出力
              </Button>
              <Button
                variant="outline"
                onClick={handleLabelPrint}
                disabled={selectedOrders.length === 0}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                ラベル印刷
              </Button>
            </div>
          </div>
        </div>

        {/* 一覧テーブル */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-gray-700">部門指示一覧</h2>
            <div className="text-sm text-gray-600">
              {filteredOrders.length}件のオーダーを表示中
            </div>
          </div>
          <OrderTable
            orders={filteredOrders}
            allOrders={orders}
            onAccept={handleAccept}
            onImplement={handleImplement}
            onAllergyClick={handleAllergyClick}
            onResultInput={handleResultInput}
            onTestRequest={handleTestRequest}
            onNutritionRecord={handleNutritionRecord}
            onPharmacistGuidance={handlePharmacistGuidance}
            onMedicationHistory={handleMedicationHistory}
            onEndoscopyReport={handleEndoscopyReport}
            onPacsReference={handlePacsReference}
            selectedOrders={selectedOrders}
            onToggleOrder={handleToggleOrder}
            onToggleAll={handleToggleAll}
          />
        </div>
      </main>

      {/* ダイアログ群 */}
      <ThreePointCheckModal
        open={threePointCheckOpen}
        onClose={() => setThreePointCheckOpen(false)}
        onComplete={handleThreePointCheckComplete}
        order={selectedOrder}
      />

      <ImplementerInputDialog
        open={implementerDialogOpen}
        onClose={() => setImplementerDialogOpen(false)}
        onSave={handleImplementerSave}
        currentUser={currentUser}
      />

      <PrescriptionDialog
        open={prescriptionDialogOpen}
        onClose={() => setPrescriptionDialogOpen(false)}
        onComplete={handlePrescriptionComplete}
        order={selectedOrder}
      />

      <MedicationInfoDialog
        open={medicationInfoDialogOpen}
        onClose={() => setMedicationInfoDialogOpen(false)}
        onComplete={handleMedicationInfoComplete}
        order={selectedOrder}
      />

      <AllergyDetailDialog
        open={allergyDialogOpen}
        onClose={() => setAllergyDialogOpen(false)}
        order={selectedOrder}
      />

      <ResultInputDialog
        open={resultInputDialogOpen}
        onClose={() => setResultInputDialogOpen(false)}
        onSave={handleResultSave}
        order={selectedOrder}
      />

      <NutritionRecordDialog
        open={nutritionRecordDialogOpen}
        onClose={() => setNutritionRecordDialogOpen(false)}
        onSave={handleNutritionRecordSave}
        order={selectedOrder}
        currentUser={currentUser}
      />

      <PharmacistGuidanceDialog
        open={pharmacistGuidanceDialogOpen}
        onClose={() => setPharmacistGuidanceDialogOpen(false)}
        onSave={handlePharmacistGuidanceSave}
        order={selectedOrder}
        currentUser={currentUser}
      />

      <PrintDialog
        open={printDialogOpen}
        onClose={() => setPrintDialogOpen(false)}
        onPrint={handlePrint}
        selectedCount={selectedOrders.length}
        type={printType}
        selectedOrderTypes={
          orders
            .filter(order => selectedOrders.includes(order.id))
            .map(order => order.orderType)
        }
      />
    </div>
  );
}