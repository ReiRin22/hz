import { Injectable } from "@nestjs/common";
import type { UpstreamClinicalRecord, UpstreamSOAPTemplate, UpstreamComment, UpstreamMedicalRecord } from "./types/clinical-records.type";
import type { CreateClinicalRecordRequest } from "./types/clinical-records.api.request";

/** モックデータ（上流診察記録システム API 未実装のため） */
const MOCK_SOAP_TEMPLATES: UpstreamSOAPTemplate[] = [
  {
    templateId: "tpl-1",
    templateName: "内科初診",
    templateContent: "S: \nO: \nA: \nP: ",
  },
  {
    templateId: "tpl-2",
    templateName: "経過観察",
    templateContent: "S: 経過良好\nO: \nA: \nP: ",
  },
  {
    templateId: "tpl-3",
    templateName: "退院サマリー",
    templateContent: "S: 退院可能\nO: \nA: \nP: ",
  },
];

const MOCK_COMMENTS: UpstreamComment[] = [
  { commentId: "cmt-1", commentContent: "アレルギー歴あり", commentType: "MY" },
  { commentId: "cmt-2", commentContent: "血圧管理中", commentType: "MY" },
  { commentId: "cmt-3", commentContent: "服薬コンプライアンス良好", commentType: "PATIENT" },
  { commentId: "cmt-4", commentContent: "処方時は腎機能に注意", commentType: "PATIENT" },
  { commentId: "cmt-5", commentContent: "内科部門：抗菌薬は承認済みのもののみ使用", commentType: "DEPARTMENT" },
];

@Injectable()
export class ClinicalRecordsClient {
  /**
   * 上流システムから診察記録を単件取得する
   * TODO: 上流 API の URL・認証ヘッダーを実装する
   */
  async fetchRecord(patientId: string, recordId: string): Promise<UpstreamClinicalRecord> {
    // TODO: axios.get(`${UPSTREAM_BASE_URL}/patients/${patientId}/clinical-records/${recordId}`) に差し替え
    const now = new Date().toISOString();
    return {
      recordId,
      patientId,
      recordDate: new Date().toISOString().split("T")[0] ?? "",
      recordedBy: "doc0",
      recordedByName: "田中 一郎",
      soapRecord: "",
      isConfirmed: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * 上流システムに診察記録を作成（一時保存・確定）する
   * TODO: 上流 API の URL・認証ヘッダーを実装する
   */
  async createRecord(
    patientId: string,
    body: CreateClinicalRecordRequest,
  ): Promise<UpstreamClinicalRecord> {
    // TODO: axios.post(`${UPSTREAM_BASE_URL}/patients/${patientId}/clinical-records`, body) に差し替え
    const now = new Date().toISOString();
    return {
      recordId: `rec-${Date.now()}`,
      patientId,
      recordDate: body.recordDate,
      recordedBy: body.recordedBy,
      recordedByName: "田中 一郎", // TODO: staff マスターから取得する
      soapRecord: body.soapRecord,
      isConfirmed: body.isConfirmed,
      ...(body.isConfirmed && { confirmedAt: now }),
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * 上流システムから SOAP テンプレート一覧を取得する
   * TODO: 上流 API の URL・認証ヘッダーを実装する
   */
  async fetchSOAPTemplates(patientId: string): Promise<UpstreamSOAPTemplate[]> {
    // TODO: axios.get(`${UPSTREAM_BASE_URL}/patients/${patientId}/soap-templates`) に差し替え
    void patientId;
    return MOCK_SOAP_TEMPLATES;
  }

  /**
   * 上流システムからコメント一覧を取得する
   * TODO: 上流 API の URL・認証ヘッダーを実装する
   */
  async fetchComments(patientId: string): Promise<UpstreamComment[]> {
    // TODO: axios.get(`${UPSTREAM_BASE_URL}/patients/${patientId}/comments`) に差し替え
    void patientId;
    return MOCK_COMMENTS;
  }

  /**
   * 上流システムから診察記録一覧を取得する
   * TODO: 上流 API の URL・認証ヘッダーを実装する
   */
  async fetchRecords(patientId: string): Promise<UpstreamMedicalRecord[]> {
    // TODO: axios.get(`${UPSTREAM_BASE_URL}/patients/${patientId}/clinical-records`) に差し替え
    void patientId;
    return MOCK_MEDICAL_RECORDS;
  }
}

const MOCK_MEDICAL_RECORDS: UpstreamMedicalRecord[] = [
  {
    id: 'r001',
    date: '2024-12-30',
    time: '14:15',
    type: 'progress',
    visitType: 'inpatient',
    content: '定期診察・症状フォローアップ。胸痛症状は改善傾向。処方継続。',
    author: '田中 医師',
    insurance: { type: '社保', burden: '3割' },
    soapRecord: 'S: 胸痛は軽減している。息切れなし。\nO: BP 128/76、脈拍 72、体温 36.5°C、SpO2 98%\nA: 高血圧症 改善傾向\nP: 現処方継続。2週後再診。',
    vitalSigns: { bloodPressure: '128/76', pulse: '72', temperature: '36.5', oxygenSaturation: '98' },
  },
  {
    id: 'r002',
    date: '2024-12-30',
    time: '16:00',
    type: 'nursing',
    visitType: 'inpatient',
    content: '服薬確認実施。全薬剤内服確認。転倒リスク継続評価中。',
    author: '鈴木 看護師',
    insurance: { type: '社保', burden: '3割' },
  },
  {
    id: 'r003',
    date: '2024-12-29',
    time: '08:00',
    type: 'vital',
    visitType: 'inpatient',
    content: '朝バイタル測定。異常なし。',
    author: '鈴木 看護師',
    insurance: { type: '社保', burden: '3割' },
    vitalSigns: { bloodPressure: '130/80', pulse: '74', temperature: '36.2', respiratoryRate: '16', oxygenSaturation: '97' },
  },
  {
    id: 'r004',
    date: '2024-12-27',
    time: '14:30',
    type: 'progress',
    visitType: 'inpatient',
    content: '胸痛症状の改善確認。安静時の胸痛は消失。',
    author: '田中 医師',
    insurance: { type: '社保', burden: '3割' },
    soapRecord: 'S: 胸痛は安静時には消失。労作時に軽度残存。\nO: BP 135/82、脈拍 76\nA: 狭心症 改善中\nP: 冠動脈造影検査を予定。',
  },
  {
    id: 'r005',
    date: '2024-12-28',
    time: '10:00',
    type: 'prescription',
    visitType: 'outpatient',
    content: 'アムロジピン 5mg 1錠 毎朝食後 28日分',
    author: '山本 医師（循環器科）',
    insurance: { type: '社保', burden: '3割' },
  },
  {
    id: 'r006',
    date: '2024-12-26',
    time: '11:30',
    type: 'injection',
    visitType: 'outpatient',
    content: '生理食塩水 100mL + フロセミド 20mg IV',
    author: '佐藤 看護師',
    insurance: { type: '社保', burden: '3割' },
  },
  {
    id: 'r007',
    date: '2024-12-29',
    time: '10:45',
    type: 'test',
    content: '血液一般・生化学検査\nWBC 6.2×10³/μL、RBC 4.5×10⁶/μL、Hb 13.8 g/dL\nNa 140、K 4.0、Cl 102、BUN 18、Cr 0.9',
    author: '山田 検査技師',
    insurance: { type: '社保', burden: '3割' },
  },
  {
    id: 'r008',
    date: '2024-12-28',
    time: '14:00',
    type: 'radiology',
    content: '胸部X線検査（正面・側面）\n心陰影の拡大なし。肺野に浸潤影なし。',
    author: '伊藤 放射線技師',
    insurance: { type: '社保', burden: '3割' },
  },
];
