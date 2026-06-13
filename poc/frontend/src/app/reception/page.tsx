'use client';

import { useState, useEffect } from 'react';
import { Button } from './_components/atoms/button';
import { Input } from './_components/atoms/input';
import { Label } from './_components/atoms/label';
import { Checkbox } from './_components/atoms/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './_components/atoms/popover';
import { Calendar } from './_components/atoms/calendar';
import { Card, CardContent, CardHeader, CardTitle } from './_components/atoms/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './_components/atoms/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './_components/atoms/select';
import { CalendarIcon, Users, Calendar as CalendarTabIcon, Filter, Clock, Search } from 'lucide-react';
import { Header } from './_components/molecules/Header';
import { PatientReception } from './_components/templates/PatientReception';
import { UnifiedAppointments } from './_components/templates/UnifiedAppointments';
import { QuestionnaireDialog } from './_components/organisms/QuestionnaireDialog';
import { QuestionnaireInputDialog } from './_components/organisms/QuestionnaireInputDialog';
import { ReceptionDialog } from './_components/organisms/ReceptionDialog';
import { WalkInReceptionDialog } from './_components/organisms/WalkInReceptionDialog';
import { PatientSearchDialog } from './_components/organisms/PatientSearchDialog';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('reception');
  
  // フィルタ状態
  const [filters, setFilters] = useState({
    department: 'all',
    doctor: 'all',
    patientId: '',
    patientName: '',
    statusFilters: {
      waitingForExamination: true,
      waitingForConsultation: true,
      waitingForResults: true,
      waitingForAccounting: true
    },
    slotNotReserved: false // 枠未取得フィルタ（予約状況タブ用）
  });
  
  // 本日と明日の日付を取得
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  // 過去と未来の日付も取得
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(today.getDate() + 2);
  
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(today.getDate() - 3);
  
  const todayString = today.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '/');
  
  const tomorrowString = tomorrow.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '/');
  
  const yesterdayString = yesterday.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '/');
  
  const dayAfterTomorrowString = dayAfterTomorrow.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '/');
  
  const threeDaysAgoString = threeDaysAgo.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '/');
  
  // 受付済み患者一覧（受付状況）
  const [receptionedPatients, setReceptionedPatients] = useState([
    {
      id: '1',
      name: '佐藤花子',
      nameKana: 'サトウハナコ',
      patientNo: 'P001',
      age: 65,
      gender: '女性',
      department: '外科',
      doctor: '田中医師',
      medicalMemo: '左膝関節症の定期検診',
      multiDepartment: '整形外科',
      insuranceConfirmDate: '2024/12/15',
      remarks: '車椅子使用',
      medicalHistory: '高血圧症',
      status: '受付済' as const,
      hospitalStatus: 'waiting_for_consultation' as const,
      order: 1,
      receptionTime: '09:15',
      appointmentTime: '09:00',
      receptionDate: todayString,
      dailyMemo: '左膝の痛み継続、歩行困難',
      treatmentStatus: {
        consultation: true,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: true,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      accounting: '未済',
      birthDate: '1959/03/15',
      consultationType: '再診' as const,
      hasPostExamConsultation: false,
      receptionist: '山本受付',
      medicalCategory: '予約推薦',
      reservationComment: '定期検診のため',
      receptionCategory: '当日'
    },
    {
      id: '2',
      name: '田中太郎',
      nameKana: 'タナカタロウ',
      patientNo: 'P002',
      age: 45,
      gender: '男性',
      department: '内科',
      doctor: '山田医師',
      medicalMemo: '高血圧症の薬物療法',
      multiDepartment: '',
      insuranceConfirmDate: '2024/12/20',
      remarks: '',
      medicalHistory: '糖尿病',
      status: '受付済' as const,
      hospitalStatus: 'waiting_for_examination' as const,
      order: 2,
      receptionTime: '09:30',
      appointmentTime: '-',
      receptionDate: todayString,
      dailyMemo: '血圧高め、薬の副作用確認希望',
      treatmentStatus: {
        consultation: false,
        prescription: true,
        injection: false,
        treatment: false,
        specimen: true,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      accounting: '未済',
      birthDate: '1979/07/22',
      consultationType: '初診' as const,
      hasPostExamConsultation: true,
      receptionist: '佐々木受付',
      medicalCategory: '検査のみ',
      reservationComment: '',
      receptionCategory: '健診'
    },
    {
      id: '3',
      name: '山田花子',
      nameKana: 'ヤマダハナコ',
      patientNo: 'P003',
      age: 32,
      gender: '女性',
      department: '皮膚科',
      doctor: '鈴木医師',
      medicalMemo: 'アトピー性皮膚炎',
      multiDepartment: '',
      insuranceConfirmDate: '2024/12/18',
      remarks: 'アレルギー体質',
      medicalHistory: 'アレルギー性鼻炎',
      status: '受付済' as const,
      hospitalStatus: 'waiting_for_results' as const,
      order: 3,
      receptionTime: '09:45',
      appointmentTime: '09:30',
      receptionDate: todayString,
      dailyMemo: 'アレルギー検査結果待ち',
      treatmentStatus: {
        consultation: true,
        prescription: true,
        injection: false,
        treatment: true,
        specimen: true,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: true,
        hospitalization: false
      },
      accounting: '済',
      birthDate: '1992/11/08',
      consultationType: '再診' as const,
      hasPostExamConsultation: true,
      receptionist: '山本受付',
      medicalCategory: '急診対応',
      reservationComment: '他院からの紹介',
      receptionCategory: '紹介'
    },
    {
      id: '4',
      name: '中島美穂',
      nameKana: 'ナカジマミホ',
      patientNo: 'P004',
      age: 29,
      gender: '女性',
      department: '内科',
      doctor: '田中医師',
      medicalMemo: '風邪症状',
      multiDepartment: '',
      insuranceConfirmDate: '2024/12/25',
      remarks: '',
      medicalHistory: '',
      status: '受付済' as const,
      hospitalStatus: 'waiting_for_accounting' as const,
      order: 4,
      receptionTime: '10:15',
      appointmentTime: '-',
      receptionDate: todayString,
      dailyMemo: '咳・発熱あり',
      treatmentStatus: {
        consultation: true,
        prescription: true,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      accounting: '未済',
      birthDate: '1995/02/14',
      consultationType: '初診' as const,
      hasPostExamConsultation: false,
      receptionist: '田中受付',
      medicalCategory: '急患',
      reservationComment: '',
      receptionCategory: '当日'
    },
    {
      id: '5',
      name: '高田健二',
      nameKana: 'タカダケンジ',
      patientNo: 'P005',
      age: 58,
      gender: '男性',
      department: '外科',
      doctor: '田中医師',
      medicalMemo: '定期検診',
      multiDepartment: '',
      insuranceConfirmDate: '2024/12/25',
      remarks: '',
      medicalHistory: '高血圧',
      status: '受付済' as const,
      hospitalStatus: 'accounting_completed' as const,
      order: 5,
      receptionTime: '11:00',
      appointmentTime: '11:00',
      receptionDate: todayString,
      dailyMemo: '年次健康診断完了',
      treatmentStatus: {
        consultation: true,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: true,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: true,
        hospitalization: false
      },
      accounting: '済',
      birthDate: '1966/08/10',
      consultationType: '再診' as const,
      hasPostExamConsultation: false,
      receptionist: '佐々木受付',
      medicalCategory: 'リハビリ推薦',
      reservationComment: '健康診断',
      receptionCategory: '健診'
    },
    // 明日のデータ
    {
      id: '6',
      name: '高橋次郎',
      nameKana: 'タカハシジロウ',
      patientNo: 'P006',
      age: 55,
      gender: '男性',
      department: '内科',
      doctor: '田中医師',
      medicalMemo: '定期健診',
      multiDepartment: '',
      insuranceConfirmDate: '2024/12/20',
      remarks: '',
      medicalHistory: '',
      status: '受付済' as const,
      hospitalStatus: 'waiting_for_consultation' as const,
      order: 1,
      receptionTime: '10:00',
      appointmentTime: '10:00',
      receptionDate: tomorrowString,
      dailyMemo: '年次健康診断',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: true,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      accounting: '未済',
      birthDate: '1969/01/15',
      consultationType: '再診' as const,
      hasPostExamConsultation: false,
      receptionist: '山本受付',
      medicalCategory: '放射線診療',
      reservationComment: '',
      receptionCategory: '当日'
    },
    // 昨日のデータ
    {
      id: '7',
      name: '小林美香',
      nameKana: 'コバヤシミカ',
      patientNo: 'P007',
      age: 28,
      gender: '女性',
      department: '産婦人科',
      doctor: '佐藤医師',
      medicalMemo: '妊婦健診',
      multiDepartment: '',
      insuranceConfirmDate: '2024/12/19',
      remarks: '妊娠8ヶ月',
      medicalHistory: '',
      status: '受付済' as const,
      hospitalStatus: 'waiting_for_results' as const,
      order: 1,
      receptionTime: '14:00',
      appointmentTime: '14:00',
      receptionDate: yesterdayString,
      dailyMemo: '胎児の成長確認',
      treatmentStatus: {
        consultation: true,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: true,
        rehabilitation: false,
        surgery: false,
        guidance: true,
        hospitalization: false
      },
      accounting: '済',
      birthDate: '1996/03/22',
      consultationType: '再診' as const,
      hasPostExamConsultation: false,
      receptionist: '田中受付',
      medicalCategory: '緊急時リハビリ',
      reservationComment: '',
      receptionCategory: '紹介'
    }
  ]);

  // 診療予約データ
  const [medicalAppointments, setMedicalAppointments] = useState([
    {
      id: '1',
      patientName: '鈴木一郎',
      nameKana: 'スズキイチロウ',
      patientNo: 'P008',
      age: 58,
      gender: '男性',
      date: todayString,
      time: '10:00',
      department: '内科',
      doctor: '山田医師',
      medicalMemo: '胸部不快感',
      multiDepartment: '循環器内科',
      remarks: '喫煙歴あり',
      medicalHistory: '高脂血症',
      status: '予約済' as const,
      dailyMemo: '胸の痛み、息切れあり',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: '1966/04/12',
      phone1: '090-1234-5678',
      phone2: '03-1234-5678',
      phone3: '',
      slotNotReserved: false,
      consultationType: '再診' as const,
      medicalCategory: '急診対応'
    },
    {
      id: '1-2',
      patientName: '木村和子',
      nameKana: 'キムラカズコ',
      patientNo: 'P013',
      age: 71,
      gender: '女性',
      date: todayString,
      time: '09:00',
      department: '整形外科',
      doctor: '高橋医師',
      medicalMemo: '膝痛の経過観察',
      multiDepartment: '',
      remarks: '',
      medicalHistory: '変形性膝関節症',
      status: '予約済' as const,
      dailyMemo: '階段の昇降が困難',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: '1953/05/20',
      phone1: '080-2222-3333',
      phone2: '',
      phone3: '',
      slotNotReserved: true,
      consultationType: '再診' as const,
      medicalCategory: 'リハビリ推薦'
    },
    {
      id: '1-3',
      patientName: '加藤健',
      nameKana: 'カトウケン',
      patientNo: 'P014',
      age: 38,
      gender: '男性',
      date: todayString,
      time: '11:30',
      department: '内科',
      doctor: '田中医師',
      medicalMemo: '頭痛・めまい',
      multiDepartment: '',
      remarks: '仕事のストレス多い',
      medicalHistory: '',
      status: '予約済' as const,
      dailyMemo: '片頭痛が頻発',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: '1986/11/03',
      phone1: '090-4444-5555',
      phone2: '03-6666-7777',
      phone3: '',
      slotNotReserved: false,
      consultationType: '初診' as const,
      medicalCategory: '予約推薦'
    },
    {
      id: '1-4',
      patientName: '斉藤美咲',
      nameKana: 'サイトウミサキ',
      patientNo: 'P015',
      age: 24,
      gender: '女性',
      date: todayString,
      time: '14:00',
      department: '皮膚科',
      doctor: '鈴木医師',
      medicalMemo: 'ニキビ治療',
      multiDepartment: '',
      remarks: '',
      medicalHistory: '',
      status: '予約済' as const,
      dailyMemo: '顔面の炎症性ニキビ',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: '2000/08/15',
      phone1: '080-8888-9999',
      phone2: '',
      phone3: '',
      slotNotReserved: true,
      consultationType: '再診' as const,
      medicalCategory: '検査のみ'
    },
    {
      id: '1-5',
      patientName: '井上隆',
      nameKana: 'イノウエタカシ',
      patientNo: 'P016',
      age: 52,
      gender: '男性',
      date: todayString,
      time: '15:30',
      department: '外科',
      doctor: '田中医師',
      medicalMemo: '痔の診察',
      multiDepartment: '',
      remarks: '',
      medicalHistory: '高血圧症',
      status: '予約済' as const,
      dailyMemo: '出血が続いている',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: '1972/02/28',
      phone1: '090-1111-0000',
      phone2: '03-2222-1111',
      phone3: '',
      slotNotReserved: false,
      consultationType: '再診' as const,
      medicalCategory: '急患'
    },
    // 明日の診療予約
    {
      id: '2',
      patientName: '渡辺由美',
      nameKana: 'ワタナベユミ',
      patientNo: 'P009',
      age: 42,
      gender: '女性',
      date: tomorrowString,
      time: '11:00',
      department: '皮膚科',
      doctor: '鈴木医師',
      medicalMemo: '湿疹の経過観察',
      multiDepartment: '',
      remarks: '薬アレルギーあり',
      medicalHistory: 'アトピー性皮膚炎',
      status: '予約済' as const,
      dailyMemo: '新しい薬の効果確認',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: '1982/09/10',
      phone1: '090-9876-5432',
      phone2: '03-5555-1111',
      phone3: '',
      slotNotReserved: true,
      consultationType: '再診' as const,
      medicalCategory: '放射線診療'
    },
    {
      id: '2-2',
      patientName: '佐々木翔太',
      nameKana: 'ササキショウタ',
      patientNo: 'P017',
      age: 19,
      gender: '男性',
      date: tomorrowString,
      time: '09:30',
      department: '整形外科',
      doctor: '高橋医師',
      medicalMemo: '捻挫の診察',
      multiDepartment: '',
      remarks: 'スポーツ傷害',
      medicalHistory: '',
      status: '予約済' as const,
      dailyMemo: 'サッカーで足首を捻った',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: '2005/03/12',
      phone1: '080-3333-4444',
      phone2: '',
      phone3: '',
      slotNotReserved: true,
      consultationType: '初診' as const,
      medicalCategory: '緊急時リハビリ'
    },
    {
      id: '2-3',
      patientName: '林恵子',
      nameKana: 'ハヤシケイコ',
      patientNo: 'P018',
      age: 63,
      gender: '女性',
      date: tomorrowString,
      time: '10:00',
      department: '内科',
      doctor: '山田医師',
      medicalMemo: '糖尿病の定期検診',
      multiDepartment: '',
      remarks: 'インスリン使用中',
      medicalHistory: '2型糖尿病、高血圧症',
      status: '予約済' as const,
      dailyMemo: '血糖値のコントロール状況確認',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: '1961/07/18',
      phone1: '090-5555-6666',
      phone2: '03-7777-8888',
      phone3: '',
      slotNotReserved: false,
      consultationType: '再診' as const,
      medicalCategory: '予約推薦'
    },
    {
      id: '2-4',
      patientName: '森田直樹',
      nameKana: 'モリタナオキ',
      patientNo: 'P019',
      age: 47,
      gender: '男性',
      date: tomorrowString,
      time: '13:00',
      department: '内科',
      doctor: '田中医師',
      medicalMemo: '腹痛の診察',
      multiDepartment: '消化器内科',
      remarks: '',
      medicalHistory: '胃潰瘍の既往',
      status: '予約済' as const,
      dailyMemo: '右下腹部の痛み',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: '1977/10/22',
      phone1: '080-9999-0000',
      phone2: '',
      phone3: '',
      slotNotReserved: false,
      consultationType: '再診' as const,
      medicalCategory: '急患'
    },
    {
      id: '2-5',
      patientName: '青木真',
      nameKana: 'アオキマリ',
      patientNo: 'P020',
      age: 35,
      gender: '女性',
      date: tomorrowString,
      time: '14:30',
      department: '産婦人科',
      doctor: '佐藤医師',
      medicalMemo: '妊婦健診',
      multiDepartment: '',
      remarks: '第二子妊娠中',
      medicalHistory: '',
      status: '予約済' as const,
      dailyMemo: '妊娠20週、順調',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: '1989/04/05',
      phone1: '090-6666-7777',
      phone2: '03-8888-9999',
      phone3: '',
      slotNotReserved: true,
      consultationType: '再診' as const,
      medicalCategory: '予約推薦'
    },
    // 昨日の診療予約
    {
      id: '3',
      patientName: '松本健一',
      nameKana: 'マツモトケンイチ',
      patientNo: 'P010',
      age: 67,
      gender: '男性',
      date: yesterdayString,
      time: '15:30',
      department: '整形外科',
      doctor: '高橋医師',
      medicalMemo: '腰痛の治療',
      multiDepartment: '',
      remarks: '車椅子使用',
      medicalHistory: '椎間板ヘルニア',
      status: '予約済' as const,
      dailyMemo: 'リハビリ効果の確認',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: '1957/12/05',
      phone1: '090-1111-2222',
      phone2: '03-3333-4444',
      phone3: '',
      slotNotReserved: false,
      consultationType: '再診' as const,
      medicalCategory: 'リハビリ推薦'
    },
    {
      id: '3-2',
      patientName: '岡田優子',
      nameKana: 'オカダユウコ',
      patientNo: 'P021',
      age: 56,
      gender: '女性',
      date: yesterdayString,
      time: '10:30',
      department: '眼科',
      doctor: '中村医師',
      medicalMemo: '白内障の検査',
      multiDepartment: '',
      remarks: '',
      medicalHistory: '緑内障',
      status: '予約済' as const,
      dailyMemo: '視力低下が進行',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: '1968/06/14',
      phone1: '080-4444-5555',
      phone2: '',
      phone3: '',
      slotNotReserved: true,
      consultationType: '初診' as const,
      medicalCategory: '検査のみ'
    }
  ]);

  // 検査予約データ
  const [examAppointments, setExamAppointments] = useState([
    {
      id: '1',
      patientName: '伊藤健太',
      nameKana: 'イトウケンタ',
      patientNo: 'P011',
      age: 35,
      gender: '男性',
      date: todayString,
      time: '13:00',
      examType: '血液検査',
      doctor: '検査技師_A',
      multiDepartment: '',
      remarks: '',
      medicalHistory: '',
      status: '予約済' as const,
      dailyMemo: '肝機能・腎機能精密検査',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: '1989/06/18',
      phone1: '080-1111-2222',
      phone2: '03-9999-8888',
      phone3: ''
    },
    // 明日の検査予約
    {
      id: '2',
      patientName: '中村幸子',
      nameKana: 'ナカムラサチコ',
      patientNo: 'P012',
      age: 51,
      gender: '女性',
      date: tomorrowString,
      time: '09:00',
      examType: 'MRI検査',
      doctor: '検査技師_B',
      multiDepartment: '',
      remarks: '閉所恐怖症',
      medicalHistory: '',
      status: '予約済' as const,
      dailyMemo: '頭部MRI検査、造影剤なし',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: '1973/08/25',
      phone1: '080-7777-8888',
      phone2: '03-2222-3333',
      phone3: ''
    }
  ]);

  // 問診票ダイアログの状態
  const [questionnaireDialog, setQuestionnaireDialog] = useState({
    isOpen: false,
    patientName: '',
    patientId: '',
    department: '',
    doctor: '',
    type: '' as 'medical' | 'exam'
  });

  // 受付ダイアログの状態（予約用）
  const [receptionDialog, setReceptionDialog] = useState({
    isOpen: false
  });

  // 当日受付ダイアログの状態
  const [walkInReceptionDialog, setWalkInReceptionDialog] = useState({
    isOpen: false
  });

  // 問診入力ダイアログの状態
  const [questionnaireInputDialog, setQuestionnaireInputDialog] = useState({
    isOpen: false,
    patientName: '',
    patientId: '',
    department: '',
    doctor: ''
  });

  // 患者検索ダイアログの状態
  const [patientSearchDialog, setPatientSearchDialog] = useState({
    isOpen: false
  });

  // 受付ダイアログのハンドラー（予約用）
  const handleOpenReceptionDialog = () => {
    setReceptionDialog({ isOpen: true });
  };

  // 当日受付ダイアログのハンドラー
  const handleOpenWalkInReceptionDialog = () => {
    setWalkInReceptionDialog({ isOpen: true });
  };

  const handleReceptionDialogSchedule = (data: any) => {
    console.log('予約データ:', data);
    
    // 新しい予約レコードを作成
    const newAppointment = {
      id: `med_${Date.now()}`,
      patientName: data.name,
      nameKana: data.nameKana || '',
      patientNo: data.id || `P${String(Date.now()).slice(-3)}`,
      age: parseInt(data.age) || 0,
      gender: data.gender || '不明',
      date: data.appointmentDateTime || selectedDateString,
      time: data.appointmentDateTime ? data.appointmentDateTime.split(' ')[1] || '09:00' : '09:00',
      department: data.department || '内科',
      doctor: data.doctor || '担当医',
      medicalMemo: data.medicalMemo || data.reservationComment || '',
      multiDepartment: '',
      remarks: data.reservationComment || '',
      medicalHistory: data.pastHistory || '',
      status: '予約済' as const,
      dailyMemo: data.presentIllness || data.chiefComplaint || '',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      birthDate: data.birthDate || '',
      phone1: data.phone1 || '',
      phone2: data.phone2 || '',
      phone3: data.phone3 || ''
    };

    // 診療予約リストに追加
    setMedicalAppointments(prev => [...prev, newAppointment]);
    
    alert(`予約が完了しました: ${data.name || '新規患者'}\n予約日時: ${newAppointment.date} ${newAppointment.time}\n診療科: ${newAppointment.department}`);
  };

  const handleReceptionDialogReception = (data: any) => {
    console.log('受付データ:', data);
    
    // 新しい受付レコードを作成
    const currentTime = new Date();
    const receptionTime = currentTime.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const newReception = {
      id: `rec_${Date.now()}`,
      name: data.name,
      nameKana: data.nameKana || '',
      patientNo: data.id || `P${String(Date.now()).slice(-3)}`,
      age: parseInt(data.age) || 0,
      gender: data.gender || '不明',
      department: data.department || '内科',
      doctor: data.doctor || '担当医',
      medicalMemo: data.medicalMemo || data.reservationComment || '',
      multiDepartment: '',
      insuranceConfirmDate: selectedDateString,
      remarks: data.reservationComment || '',
      medicalHistory: data.pastHistory || '',
      status: '受付済' as const,
      hospitalStatus: 'waiting_for_consultation' as const,
      order: receptionedPatients.filter(p => p.receptionDate === selectedDateString).length + 1,
      receptionTime: receptionTime,
      appointmentTime: data.appointmentDateTime ? data.appointmentDateTime.split(' ')[1] || '-' : '-',
      receptionDate: selectedDateString,
      dailyMemo: data.presentIllness || data.chiefComplaint || '',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      accounting: '未済',
      birthDate: data.birthDate || '',
      consultationType: (data.consultationType || '初診') as '初診' | '再診',
      hasPostExamConsultation: false,
      receptionist: '受付',
      medicalCategory: data.medicalCategory || '', // 診療区分（予約推薦、急患など）
      reservationComment: data.reservationComment || '', // 予約コメント
      receptionCategory: data.receptionCategory || '当日' // 受付区分（紹介/健診/当日）
    };

    setReceptionedPatients(prev => [...prev, newReception]);
    
    // 受付状況タブに切り替え
    setActiveTab('reception');
    
    alert(`受付が完了しました: ${data.name || '新規患者'}\n受付時間: ${receptionTime}\n診療科: ${newReception.department}\n\n受付状況タブに移動しました。`);
  };

  // 当日受付ダイアログの受付処理
  const handleWalkInReception = (data: any) => {
    console.log('当日受付データ:', data);
    
    const currentTime = new Date();
    const receptionTime = currentTime.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const newReception = {
      id: `walkin_${Date.now()}`,
      name: data.name,
      nameKana: '-',
      patientNo: data.id || `P${String(Date.now()).slice(-3)}`,
      age: parseInt(data.age) || 0,
      gender: '-',
      department: data.department || '内科',
      doctor: data.doctor || '担当医',
      medicalMemo: data.medicalMemo || '',
      multiDepartment: '',
      insuranceConfirmDate: selectedDateString,
      remarks: data.questionnaireType ? `問診票: ${data.questionnaireType}` : '',
      medicalHistory: '',
      status: '受付済' as const,
      hospitalStatus: 'waiting_for_consultation' as const,
      order: receptionedPatients.filter(p => p.receptionDate === selectedDateString).length + 1,
      receptionTime: receptionTime,
      appointmentTime: '-',
      receptionDate: selectedDateString,
      dailyMemo: '',
      treatmentStatus: {
        consultation: false,
        prescription: false,
        injection: false,
        treatment: false,
        specimen: false,
        physiology: false,
        endoscopy: false,
        imaging: false,
        rehabilitation: false,
        surgery: false,
        guidance: false,
        hospitalization: false
      },
      accounting: '未済',
      birthDate: data.birthDate || '',
      consultationType: (data.consultationType || '初診') as '初診' | '再診',
      hasPostExamConsultation: false,
      receptionist: '受付',
      medicalCategory: data.medicalCategory || '', // 診療区分（予約推薦、急患など）
      reservationComment: '', // 予約コメント
      receptionCategory: data.receptionCategory || '当日' // 受付区分（紹介/健診/当日）
    };

    setReceptionedPatients(prev => [...prev, newReception]);
    
    alert(`当日受付が完了しました: ${data.name}\n受付時間: ${receptionTime}\n診療科: ${newReception.department}${data.questionnaireType ? `\n問診票タイプ: ${data.questionnaireType}` : ''}`);
  };

  // 現在時刻を更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // 日付フォーマット関数
  const formatDateForComparison = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '/');
  };

  // 選択した日付に基づいてデータをフィルタリング
  const selectedDateString = formatDateForComparison(selectedDate);
  
  // 診療科の一覧を取得
  const getAllDepartments = () => {
    const departments = new Set<string>();
    
    receptionedPatients.forEach(patient => {
      departments.add(patient.department);
      if (patient.multiDepartment) {
        departments.add(patient.multiDepartment);
      }
    });
    
    medicalAppointments.forEach(appointment => {
      departments.add(appointment.department);
      if (appointment.multiDepartment) {
        departments.add(appointment.multiDepartment);
      }
    });
    
    examAppointments.forEach(() => {
      departments.add('検査科');
    });
    
    return Array.from(departments).sort();
  };

  // 医師の一覧を取得
  const getAllDoctors = () => {
    const doctors = new Set<string>();
    
    receptionedPatients.forEach(patient => {
      doctors.add(patient.doctor);
    });
    
    medicalAppointments.forEach(appointment => {
      doctors.add(appointment.doctor);
    });
    
    examAppointments.forEach(appointment => {
      doctors.add(appointment.doctor);
    });
    
    return Array.from(doctors).sort();
  };
  
  const allDepartments = getAllDepartments();
  const allDoctors = getAllDoctors();
  
  // フィルタリング関数
  const applyFilters = (patients: any[]) => {
    return patients.filter(patient => {
      const dateMatch = patient.receptionDate === selectedDateString;
      
      const departmentMatch = filters.department === 'all' || 
                             patient.department === filters.department || 
                             patient.multiDepartment === filters.department;
      
      const doctorMatch = filters.doctor === 'all' || patient.doctor === filters.doctor;
      
      const patientIdMatch = !filters.patientId || 
                            patient.patientNo?.toLowerCase().includes(filters.patientId.toLowerCase()) ||
                            patient.id?.includes(filters.patientId);
      
      const patientNameMatch = !filters.patientName || 
                              patient.name?.includes(filters.patientName) ||
                              patient.nameKana?.includes(filters.patientName);
      
      // 会計完了の患者を除外
      if (patient.hospitalStatus === 'accounting_completed') {
        return false;
      }
      
      // ステータスフィルタ
      const statusMatch = (
        (filters.statusFilters.waitingForExamination && patient.hospitalStatus === 'waiting_for_examination') ||
        (filters.statusFilters.waitingForConsultation && patient.hospitalStatus === 'waiting_for_consultation') ||
        (filters.statusFilters.waitingForResults && patient.hospitalStatus === 'waiting_for_results') ||
        (filters.statusFilters.waitingForAccounting && patient.hospitalStatus === 'waiting_for_accounting')
      );
      
      return dateMatch && departmentMatch && doctorMatch && patientIdMatch && patientNameMatch && statusMatch;
    });
  };
  
  // フィルタリング（予約用）
  const applyAppointmentFilters = (appointments: any[]) => {
    return appointments.filter(appointment => {
      const dateMatch = appointment.date === selectedDateString;
      
      const departmentMatch = filters.department === 'all' || 
                             appointment.department === filters.department || 
                             appointment.multiDepartment === filters.department;
      
      const doctorMatch = filters.doctor === 'all' || appointment.doctor === filters.doctor;
      
      const patientIdMatch = !filters.patientId || 
                            appointment.patientNo?.toLowerCase().includes(filters.patientId.toLowerCase()) ||
                            appointment.id?.includes(filters.patientId);
      
      const patientNameMatch = !filters.patientName || 
                              appointment.patientName?.includes(filters.patientName) ||
                              appointment.nameKana?.includes(filters.patientName);
      
      return dateMatch && departmentMatch && doctorMatch && patientIdMatch && patientNameMatch;
    });
  };
  
  const filteredMedicalAppointments = applyAppointmentFilters(medicalAppointments);
  
  const filteredExamAppointments = examAppointments.filter(appointment => {
    const dateMatch = appointment.date === selectedDateString;
    const departmentMatch = filters.department === 'all' || filters.department === '検査科';
    return dateMatch && departmentMatch;
  });
  
  const filteredReceptionedPatients = applyFilters(receptionedPatients);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // フィルタ変更ハンドラー
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      statusFilters: {
        ...prev.statusFilters,
        [status]: checked
      }
    }));
  };

  // フィルタクリア
  const handleClearFilters = () => {
    setFilters({
      department: 'all',
      doctor: 'all',
      patientId: '',
      patientName: '',
      statusFilters: {
        waitingForExamination: true,
        waitingForConsultation: true,
        waitingForResults: true,
        waitingForAccounting: true
      },
      slotNotReserved: false
    });
  };

  // 患者検索ダイアログ
  const handleOpenPatientSearch = () => {
    setPatientSearchDialog({ isOpen: true });
  };

  const handleSelectPatient = (patient: any) => {
    setFilters(prev => ({
      ...prev,
      patientId: patient.patientNo,
      patientName: patient.name,
      department: patient.department || 'all',
      doctor: patient.doctor || 'all'
    }));
    
    // 選択完了を通知
    const filterMessage = [
      `患者ID: ${patient.patientNo}`,
      `氏名: ${patient.name}`,
      patient.department && `診療科: ${patient.department}`,
      patient.doctor && `医師: ${patient.doctor}`
    ].filter(Boolean).join('\n');
    
    alert(`患者が選択されました。フィルタが設定されました:\n\n${filterMessage}`);
  };

  // 診療予約の受付処理
  const handleMedicalReception = (appointmentId: string, patientName: string, department: string, doctor: string) => {
    setQuestionnaireDialog({
      isOpen: true,
      patientName,
      patientId: appointmentId,
      department,
      doctor,
      type: 'medical'
    });
  };

  // 検査予約の受付処理
  const handleExamReception = (appointmentId: string, patientName: string, examType: string, doctor: string) => {
    setQuestionnaireDialog({
      isOpen: true,
      patientName,
      patientId: appointmentId,
      department: '検査科',
      doctor,
      type: 'exam'
    });
  };

  // 問診票発行の確認後の処理
  const handleQuestionnaireConfirm = (issueQuestionnaire: boolean, issueReceptionSheet: boolean) => {
    const messages = [];
    if (issueQuestionnaire) {
      messages.push('問診票を発行しました');
    }
    if (issueReceptionSheet) {
      messages.push('受付表を発行しました');
    }
    
    if (messages.length > 0) {
      alert(messages.join('\n'));
    } else {
      alert('受付が完了しました');
    }
    
    setActiveTab('reception');
  };

  // ステータス変更ハンドラー
  const handleMoveToConsultation = (patientId: string) => {
    console.log('診察待に移動:', patientId);
  };

  const handleMoveToResults = (patientId: string) => {
    console.log('結果待ちに移動:', patientId);
  };

  const handleMoveToExamination = (patientId: string) => {
    console.log('予診待ちに移動:', patientId);
  };

  const handleQuestionnaireInput = (patientId: string) => {
    // 患者情報を取得して問診入力ダイアログを開く
    const patient = filteredReceptionedPatients.find(p => p.id === patientId);
    if (patient) {
      setQuestionnaireInputDialog({
        isOpen: true,
        patientName: patient.name,
        patientId: patient.patientNo,
        department: patient.department,
        doctor: patient.doctor
      });
    }
  };

  // 問診入力ダイアログのハンドラー
  const handleQuestionnaireInputSave = (questionnaireData: any) => {
    console.log('問診票アップロード:', questionnaireData);
    alert(`問診票がアップロードされました: ${questionnaireData.patientName}\nファイル数: ${questionnaireData.files.length}`);
    setQuestionnaireInputDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleAddPatient = () => {
    console.log('患者追加');
  };

  const handleAddMedicalAppointment = () => {
    console.log('診療予約追加');
  };

  const handleAddExamAppointment = () => {
    console.log('検査予約追加');
  };

  // 統計情報を計算
  const receptionCount = filteredReceptionedPatients.length;
  const totalAppointments = filteredMedicalAppointments.length + filteredExamAppointments.length;

  // ヘッダーのハンドラー
  const handleLogout = () => {
    console.log('ログアウト処理');
    alert('ログアウトしました');
  };

  const handleSettings = () => {
    console.log('システム設定面を開く');
    alert('システム設定画面を開きます');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <Header 
        userName="高見" 
        jobTitle="医師"
        department="内科"
        loginTime="08:30"
        onLogout={handleLogout}
        onSettings={handleSettings}
        alertCount={1}
      />
      
      {/* メインコンテンツ */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 最上部：日付選択とフィルタ */}
          <Card>
            <CardHeader>
              <CardTitle>検索・フィルタ条件</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 第1行：日付選択、診療科 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date-select">日付選択</Label>
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start mt-1"
                          type="button"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formatDate(selectedDate)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date: Date | undefined) => {
                            if (date) {
                              setSelectedDate(date);
                              setIsPopoverOpen(false);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="department">診療科</Label>
                    <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="診療科を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべての診療科</SelectItem>
                        {allDepartments.map(department => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 第2行：主治医、患者フィルタ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="doctor">主治医</Label>
                    <Select value={filters.doctor} onValueChange={(value) => handleFilterChange('doctor', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="医師を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべての医師</SelectItem>
                        {allDoctors.map(doctor => (
                          <SelectItem key={doctor} value={doctor}>
                            {doctor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="patient-id">患者ID</Label>
                    <Input
                      id="patient-id"
                      value={filters.patientId}
                      onChange={(e) => handleFilterChange('patientId', e.target.value)}
                      placeholder="P001"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="patient-name">患者氏名</Label>
                    <Input
                      id="patient-name"
                      value={filters.patientName}
                      onChange={(e) => handleFilterChange('patientName', e.target.value)}
                      placeholder="佐藤"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button 
                      onClick={handleOpenPatientSearch}
                      className="bg-blue-600 hover:bg-blue-700 text-white mt-1"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      患者検索
                    </Button>
                  </div>
                </div>

                {/* 第3行：ステータスフィルタと操作ボタン */}
                <div className="flex flex-wrap items-center gap-6">
                  {/* 受付状況タブの場合：ステータスフィルタ（会計待ち・会計完了を除く） */}
                  {activeTab === 'reception' && (
                    <div>
                      <Label className="text-sm font-medium">ステータスフィルタ</Label>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="waiting-examination"
                            checked={filters.statusFilters.waitingForExamination}
                            onCheckedChange={(checked) => handleStatusFilterChange('waitingForExamination', checked as boolean)}
                          />
                          <Label htmlFor="waiting-examination" className="text-sm">予診待ち</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="waiting-consultation"
                            checked={filters.statusFilters.waitingForConsultation}
                            onCheckedChange={(checked) => handleStatusFilterChange('waitingForConsultation', checked as boolean)}
                          />
                          <Label htmlFor="waiting-consultation" className="text-sm">診察待ち</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="waiting-results"
                            checked={filters.statusFilters.waitingForResults}
                            onCheckedChange={(checked) => handleStatusFilterChange('waitingForResults', checked as boolean)}
                          />
                          <Label htmlFor="waiting-results" className="text-sm">結果待ち</Label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 予約状況タブの場合：枠未取得フィルタ */}
                  {activeTab === 'appointments' && (
                    <div>
                      <Label className="text-sm font-medium">予約フィルタ</Label>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="slot-not-reserved"
                            checked={filters.slotNotReserved}
                            onCheckedChange={(checked) => setFilters(prev => ({ ...prev, slotNotReserved: checked as boolean }))}
                          />
                          <Label htmlFor="slot-not-reserved" className="text-sm">枠未取得</Label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 ml-auto">
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="text-sm"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      フィルタクリア
                    </Button>
                  </div>
                </div>

                {/* フィルタ適用状況の表示 */}
                <div className="text-sm text-muted-foreground">
                  {(filters.department !== 'all' || filters.doctor !== 'all' || filters.patientId || filters.patientName) && (
                    <span>
                      フィルタ適用中:
                      {filters.department !== 'all' && <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{filters.department}</span>}
                      {filters.doctor !== 'all' && <span className="ml-2 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">{filters.doctor}</span>}
                      {filters.patientId && <span className="ml-2 px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">ID: {filters.patientId}</span>}
                      {filters.patientName && <span className="ml-2 px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs">氏名: {filters.patientName}</span>}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* タブ切り替えセクション */}
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="reception" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    受付状況 ({receptionCount})
                  </TabsTrigger>
                  <TabsTrigger value="appointments" className="flex items-center gap-2">
                    <CalendarTabIcon className="h-4 w-4" />
                    予約状況 ({totalAppointments})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="reception" className="mt-6">
                  <PatientReception
                    patients={filteredReceptionedPatients}
                    onMoveToConsultation={handleMoveToConsultation}
                    onMoveToResults={handleMoveToResults}
                    onMoveToExamination={handleMoveToExamination}
                    onQuestionnaireInput={handleQuestionnaireInput}
                    onOpenWalkInReception={handleOpenWalkInReceptionDialog}
                  />
                </TabsContent>

                <TabsContent value="appointments" className="mt-6">
                  <UnifiedAppointments
                    medicalAppointments={filteredMedicalAppointments}
                    examAppointments={filteredExamAppointments}
                    onMedicalReception={handleMedicalReception}
                    onExamReception={handleExamReception}
                    onOpenAppointment={handleOpenReceptionDialog}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 問診票発行確認ダイアログ */}
          <QuestionnaireDialog
            isOpen={questionnaireDialog.isOpen}
            onClose={() => setQuestionnaireDialog(prev => ({ ...prev, isOpen: false }))}
            onConfirm={handleQuestionnaireConfirm}
            patientName={questionnaireDialog.patientName}
          />

          {/* 受付ダイアログ（予約用） */}
          <ReceptionDialog
            isOpen={receptionDialog.isOpen}
            onClose={() => setReceptionDialog({ isOpen: false })}
            onSchedule={handleReceptionDialogSchedule}
            onReception={handleReceptionDialogReception}
          />

          {/* 当日受付ダイアログ */}
          <WalkInReceptionDialog
            isOpen={walkInReceptionDialog.isOpen}
            onClose={() => setWalkInReceptionDialog({ isOpen: false })}
            onReception={handleWalkInReception}
          />

          {/* 問診入力ダイアログ */}
          <QuestionnaireInputDialog
            isOpen={questionnaireInputDialog.isOpen}
            onClose={() => setQuestionnaireInputDialog(prev => ({ ...prev, isOpen: false }))}
            onSave={handleQuestionnaireInputSave}
            patientName={questionnaireInputDialog.patientName}
            patientId={questionnaireInputDialog.patientId}
            department={questionnaireInputDialog.department}
            doctor={questionnaireInputDialog.doctor}
          />

          {/* 患者検索ダイアログ */}
          <PatientSearchDialog
            isOpen={patientSearchDialog.isOpen}
            onClose={() => setPatientSearchDialog({ isOpen: false })}
            onSelectPatient={handleSelectPatient}
          />
        </div>
      </div>
    </div>
  );
}