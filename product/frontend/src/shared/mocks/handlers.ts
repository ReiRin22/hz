import { http, HttpResponse, bypass } from "msw";
import { MOCK_PATIENT } from "./patientMocks";
import { MOCK_PENDING_ORDERS, MOCK_CONFIRMED_ORDERS } from "./orderMocks";
import type { OrderResponse } from "@/front_bff_shared/features/orders/orderConfirmed/orderConfirmation/types/responses/orderConfirmation.response";
import type { GetClinicalRecordsResponse } from "@/front_bff_shared/features/karte/recordReference/types/responses/record-reference.response";
import type { GetReceptionPatientsResponse } from "@/front_bff_shared/features/reception/receptionPatientList/types/responses/receptionPatientList.response";
import type { GetPatientInfoResponse } from "@/front_bff_shared/features/karte/patientInfo/types/responses/patient-info.response";
import type { GetPatientHeaderResponse, PatientHeaderResponse } from "@/front_bff_shared/features/karte/patientHeader/types/responses/patient-header.response";

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? "http://localhost:3001";

/**
 * Next.jsの内部リクエスト（ページナビゲーション）を除外
 * MSWはBFFへのAPIリクエストのみをモックする
 */
function shouldBypassRequest(url: string): boolean {
  const urlObj = new URL(url);
  // Next.jsの内部リクエストをバイパス（/_next/や相対パスのページ遷移）
  return !urlObj.pathname.startsWith('/bff/');
}

/** 確定操作をメモリ上で保持（テスト中の状態変化を反映するため） */
let pendingOrders: OrderResponse[] = [...MOCK_PENDING_ORDERS];
let confirmedOrders: OrderResponse[] = [...MOCK_CONFIRMED_ORDERS];

/** テスト間でモック状態をリセットする */
export function resetMockOrders() {
  pendingOrders = [...MOCK_PENDING_ORDERS];
  confirmedOrders = [...MOCK_CONFIRMED_ORDERS];
}

export const handlers = [
  /**
   * GET /bff/patients/:patientId
   * 患者情報取得
   */
  http.get(`${BFF_BASE_URL}/bff/patients/:patientId`, ({ params }) => {
    const { patientId } = params;
    if (patientId !== MOCK_PATIENT.id) {
      return HttpResponse.json({ message: "Patient not found" }, { status: 404 });
    }
    return HttpResponse.json(MOCK_PATIENT);
  }),

  /**
   * GET /bff/patients/:patientId/orders?status=pending|confirmed
   * オーダー一覧取得
   */
  http.get(`${BFF_BASE_URL}/bff/patients/:patientId/orders`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    if (status === "pending") {
      return HttpResponse.json({ orders: pendingOrders });
    }
    if (status === "confirmed") {
      return HttpResponse.json({ orders: confirmedOrders });
    }
    return HttpResponse.json({ orders: [...pendingOrders, ...confirmedOrders] });
  }),

  /**
   * POST /bff/patients/:patientId/orders/confirm
   * オーダー一括確定
   */
  http.post(`${BFF_BASE_URL}/bff/patients/:patientId/orders/confirm`, async ({ request }) => {
    const body = await request.json() as { orderIds: string[]; confirmedBy: string };
    const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

    const newlyConfirmed: OrderResponse[] = pendingOrders
      .filter((o) => body.orderIds.includes(o.id))
      .map((o) => ({
        ...o,
        status: "confirmed" as const,
        confirmedAt: now,
        confirmedBy: body.confirmedBy,
      }));

    pendingOrders = pendingOrders.filter((o) => !body.orderIds.includes(o.id));
    confirmedOrders = [...confirmedOrders, ...newlyConfirmed];

    return HttpResponse.json({ confirmedOrders: newlyConfirmed });
  }),

  /**
   * PATCH /bff/patients/:patientId/orders/:orderId/cancel
   * 確定済みオーダーの取り消し
   */
  http.patch(
    `${BFF_BASE_URL}/bff/patients/:patientId/orders/:orderId/cancel`,
    async ({ params, request }) => {
      const { orderId } = params;
      const body = await request.json() as { reason: string; cancelledBy: string };
      const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

      const target = confirmedOrders.find((o) => o.id === orderId);
      if (!target) {
        return HttpResponse.json({ message: "Order not found" }, { status: 404 });
      }

      const cancelled: OrderResponse = {
        ...target,
        status: "cancelled" as const,
        cancelledAt: now,
        cancelledBy: body.cancelledBy,
      };
      confirmedOrders = confirmedOrders.map((o) => (o.id === orderId ? cancelled : o));

      return HttpResponse.json({ order: cancelled });
    },
  ),

  /**
   * PUT /bff/patients/:patientId/orders/:orderId
   * 確定済みオーダーの編集
   */
  http.put(
    `${BFF_BASE_URL}/bff/patients/:patientId/orders/:orderId`,
    async ({ params, request }) => {
      const { orderId } = params;
      const body = await request.json() as { order: Partial<OrderResponse>; editReason: string; editedBy: string };

      const target = confirmedOrders.find((o) => o.id === orderId);
      if (!target) {
        return HttpResponse.json({ message: "Order not found" }, { status: 404 });
      }

      const updated: OrderResponse = { ...target, ...body.order };
      confirmedOrders = confirmedOrders.map((o) => (o.id === orderId ? updated : o));

      return HttpResponse.json({ order: updated });
    },
  ),

  /**
   * GET /bff/patients/:patientId/clinical-records
   * 診察記録一覧取得
   */
  http.get(`${BFF_BASE_URL}/bff/patients/:patientId/clinical-records`, () => {
    const response: GetClinicalRecordsResponse = {
      records: [
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
      ],
    };
    return HttpResponse.json(response);
  }),

  /**
   * GET /bff/patients/:patientId/clinical-records/:recordId
   * 診察記録単件取得
   */
  http.get(`${BFF_BASE_URL}/bff/patients/:patientId/clinical-records/:recordId`, ({ params }) => {
    const { patientId, recordId } = params;
    const now = new Date().toISOString();
    return HttpResponse.json({
      record: {
        id: recordId,
        patientId,
        recordDate: new Date().toISOString().split("T")[0],
        recordedBy: "doc0",
        recordedByName: "田中 一郎",
        soapRecord: "",
        isConfirmed: false,
        createdAt: now,
        updatedAt: now,
      },
    });
  }),

  /**
   * POST /bff/patients/:patientId/clinical-records
   * 診察記録の作成（一時保存・確定）
   */
  http.post(
    `${BFF_BASE_URL}/bff/patients/:patientId/clinical-records`,
    async ({ params, request }) => {
      const { patientId } = params;
      const body = await request.json() as {
        recordDate: string;
        recordedBy: string;
        soapRecord: string;
        isConfirmed: boolean;
      };
      const now = new Date().toISOString();
      return HttpResponse.json({
        record: {
          id: `rec-${Date.now()}`,
          patientId,
          recordDate: body.recordDate,
          recordedBy: body.recordedBy,
          recordedByName: "田中 一郎",
          soapRecord: body.soapRecord,
          isConfirmed: body.isConfirmed,
          confirmedAt: body.isConfirmed ? now : undefined,
          createdAt: now,
          updatedAt: now,
        },
      });
    },
  ),

  /**
   * GET /bff/patients/:patientId/soap-templates
   * SOAP テンプレート一覧取得
   */
  http.get(`${BFF_BASE_URL}/bff/patients/:patientId/soap-templates`, () => {
    return HttpResponse.json({
      templates: [
        { id: "tpl-1", name: "内科初診", content: "S: \nO: \nA: \nP: " },
        { id: "tpl-2", name: "経過観察", content: "S: 経過良好\nO: \nA: \nP: " },
        { id: "tpl-3", name: "退院サマリー", content: "S: 退院可能\nO: \nA: \nP: " },
      ],
    });
  }),

  /**
   * GET /bff/patients/:patientId/comments
   * コメント一覧取得
   */
  http.get(`${BFF_BASE_URL}/bff/patients/:patientId/comments`, () => {
    return HttpResponse.json({
      myComments: [
        { id: "cmt-1", content: "アレルギー歴あり" },
        { id: "cmt-2", content: "血圧管理中" },
      ],
      patientComments: [
        { id: "cmt-3", content: "服薬コンプライアンス良好" },
        { id: "cmt-4", content: "処方時は腎機能に注意" },
      ],
      departmentComments: [
        { id: "cmt-5", content: "内科部門：抗菌薬は承認済みのもののみ使用" },
      ],
    });
  }),

  /**
   * GET /bff/staff
   * スタッフマスター取得
   */
  http.get(`${BFF_BASE_URL}/bff/staff`, () => {
    return HttpResponse.json({
      staff: [
        { id: "doc0", name: "田中 一郎", role: "doctor", department: "内科" },
        { id: "doc1", name: "山田 太郎", role: "doctor", department: "内科" },
        { id: "doc2", name: "佐藤 花子", role: "doctor", department: "外科" },
        { id: "doc3", name: "田中 次郎", role: "doctor", department: "整形外科" },
        { id: "nurse1", name: "鈴木 美咲", role: "nurse", department: "内科" },
        { id: "nurse2", name: "高橋 健太", role: "nurse", department: "外科" },
        { id: "clerk1", name: "伊藤 愛美", role: "clerk", department: "医事課" },
      ],
    });
  }),

  /**
   * GET /bff/patients/:patientId/medical-forms?orderIds=id1,id2
   * 帳票情報取得
   */
  http.get(`${BFF_BASE_URL}/bff/patients/:patientId/medical-forms`, ({ params, request }) => {
    const { patientId } = params;
    const url = new URL(request.url);
    const orderIdsParam = url.searchParams.get("orderIds");
    const orderIds = orderIdsParam ? orderIdsParam.split(",") : null;

    const targetOrders = orderIds
      ? confirmedOrders.filter((o) => orderIds.includes(o.id))
      : confirmedOrders;

    const formTypeMap: Record<string, string> = {
      prescription: "PRESCRIPTION",
      lab: "LAB_REQUEST",
      pathology: "LAB_REQUEST",
      microbiology: "LAB_REQUEST",
      imaging: "IMAGING_REQUEST",
      endoscopy: "IMAGING_REQUEST",
      procedure: "PROCEDURE_CONSENT",
      surgery: "PROCEDURE_CONSENT",
      injection: "NURSING_INSTRUCTION",
      transfusion: "NURSING_INSTRUCTION",
    };

    const forms = targetOrders.map((order) => ({
      id: `form-${order.id}`,
      type: formTypeMap[order.type] ?? "NURSING_INSTRUCTION",
      name: formTypeMap[order.type] === "PRESCRIPTION" ? "処方箋" : formTypeMap[order.type] === "LAB_REQUEST" ? "検査依頼書" : formTypeMap[order.type] === "IMAGING_REQUEST" ? "画像検査依頼書" : formTypeMap[order.type] === "PROCEDURE_CONSENT" ? "処置同意書" : "看護指示書",
      description: `${order.name}の指示書`,
      relatedOrderIds: [order.id],
      patientId,
      createdAt: order.confirmedAt
        ? new Date(order.confirmedAt).toISOString()
        : new Date().toISOString(),
      createdBy: order.confirmedBy ?? "",
      status: "PRINTED",
      priority: order.priority === "緊急" ? "URGENT" : "NORMAL",
    }));

    return HttpResponse.json({ forms });
  }),

  /**
   * GET /bff/order-sets/my-sets
   * Myセット一覧取得
   */
  http.get(`${BFF_BASE_URL}/bff/order-sets/my-sets`, () => {
    return HttpResponse.json({
      mySets: [
        { id: "myset-1", name: "糖尿病セット", description: "HbA1c、血糖値、尿検査", items: ["HbA1c", "血糖値", "尿糖", "尿蛋白"] },
        { id: "myset-2", name: "高血圧セット", description: "腎機能、電解質、尿検査", items: ["クレアチニン", "eGFR", "Na", "K", "Cl", "尿蛋白"] },
        { id: "myset-3", name: "肝機能セット", description: "肝機能基本検査", items: ["AST", "ALT", "γ-GTP", "ALP", "T-Bil"] },
        { id: "myset-4", name: "脂質異常症セット", description: "脂質関連検査", items: ["TC", "TG", "HDL-C", "LDL-C"] },
      ],
    });
  }),

  /**
   * POST /bff/order-sets/my-sets
   * Myセット新規作成
   */
  http.post(`${BFF_BASE_URL}/bff/order-sets/my-sets`, async ({ request }) => {
    const body = await request.json() as { name: string; description?: string; items: string[] };
    return HttpResponse.json(
      { id: `myset-${Date.now()}`, name: body.name, description: body.description ?? "", items: body.items },
      { status: 201 }
    );
  }),

  /**
   * GET /bff/order-sets/composite-sets?orderType=prescription|injection|lab
   * 複合セット一覧取得
   */
  http.get(`${BFF_BASE_URL}/bff/order-sets/composite-sets`, ({ request }) => {
    const url = new URL(request.url);
    const orderType = url.searchParams.get("orderType") ?? "prescription";

    const allSets: Record<string, { id: string; name: string; description: string; items: string[] }[]> = {
      prescription: [
        { id: "preset-1", name: "糖尿病治療セット", description: "糖尿病の標準的な治療薬セット", items: ["メトホルミン 500mg", "グリメピリド 1mg"] },
        { id: "preset-2", name: "高血圧治療セット", description: "高血圧の標準的な治療薬セット", items: ["アムロジピン 5mg", "カンデサルタン 8mg"] },
        { id: "preset-3", name: "脂質異常症セット", description: "脂質異常症の標準的な治療薬セット", items: ["アトルバスタチン 10mg", "エゼチミブ 10mg"] },
        { id: "preset-4", name: "感冒セット", description: "感冒症状の標準的な治療薬セット", items: ["カロナール 200mg", "PL配合顆粒", "ムコダイン 250mg"] },
      ],
      injection: [
        { id: "injset-1", name: "輸液基本セット", description: "標準的な輸液セット", items: ["生理食塩水 500ml"] },
        { id: "injset-2", name: "電解質補正セット", description: "電解質補正用の輸液セット", items: ["ソリタT3号 500ml", "KCL 20mEq"] },
        { id: "injset-3", name: "ビタミン補充セット", description: "ビタミン補充用セット", items: ["ビタミンB1 100mg", "ビタミンC 500mg"] },
        { id: "injset-4", name: "抗菌薬投与セット", description: "抗菌薬投与用セット", items: ["生理食塩水 500ml", "セフトリアキソン 1g"] },
      ],
      lab: [
        { id: "labset-1", name: "糖尿病セット", description: "HbA1c、血糖値、尿検査", items: ["HbA1c", "血糖値", "尿糖", "尿蛋白"] },
        { id: "labset-2", name: "高血圧セット", description: "腎機能、電解質、尿検査", items: ["クレアチニン", "eGFR", "Na", "K", "Cl", "尿蛋白"] },
        { id: "labset-3", name: "肝機能セット", description: "肝機能基本検査", items: ["AST", "ALT", "γ-GTP", "ALP", "T-Bil"] },
        { id: "labset-4", name: "脂質異常症セット", description: "脂質関連検査", items: ["TC", "TG", "HDL-C", "LDL-C"] },
      ],
    };

    return HttpResponse.json({ compositeSets: allSets[orderType] ?? [] });
  }),

  /**
   * GET /bff/order-sets/available-orders
   * Myセット作成用オーダー候補一覧取得
   */
  http.get(`${BFF_BASE_URL}/bff/order-sets/available-orders`, () => {
    return HttpResponse.json({
      availableOrders: [
        { id: "order-1", name: "アムロジピン錠5mg「サワイ」1錠", type: "処方" },
        { id: "order-2", name: "血算（CBC）", type: "検体" },
        { id: "order-3", name: "インスリン注射", type: "注射" },
        { id: "order-4", name: "胸部X線", type: "画像" },
        { id: "order-5", name: "創傷処置（清拭・ガーゼ交換）", type: "処置" },
        { id: "order-6", name: "心電図検査", type: "生理" },
        { id: "order-7", name: "理学療法（PT）", type: "リハビリ" },
        { id: "order-8", name: "食事指導（糖尿病）", type: "指導" },
        { id: "order-9", name: "HbA1c", type: "検体" },
      ],
    });
  }),

  /**
   * GET /bff/memos?type=received|sent
   * メモ一覧取得
   */
  http.get(`${BFF_BASE_URL}/bff/memos`, ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");

    const receivedMemos = [
      { id: "memo1", title: "採血追加のお願い", content: "先生、お疲れ様です。本日の山田太郎様（病室: 302号）の採血にHbA1cを追加していただけますでしょうか。先ほど患者様から糖尿病の既往があるとお聞きしました。", to: "田中 健太 医師", from: "看護部", datetime: "2025/10/27 11:40" },
      { id: "memo2", title: "回診時刻の変更について", content: "明日の午前回診を10:00から11:00に変更していただけますか。処置室の予約が入っています。", to: "外科・臨床検査科", from: "田中 健太 医師", datetime: "2024/12/23 09:15" },
      { id: "memo3", title: "抗生剤処方量の確認", content: "先生、現在処方中の抗生剤（セフトリアキソン）の用量を再確認していただけますでしょうか。患者体重の変化があり、適正用量かどうか気になっています。", to: "薬剤部", from: "田中 健太 医師", datetime: "2024/12/22 16:45" },
      { id: "memo4", title: "予約患者様からの問い合わせ", content: "来週月曜日に予約されている佐藤花子様から、診察時間の変更希望のご連絡がありました。先生のご都合をお伺いしたく、ご連絡いたしました。", to: "田中 健太 医師", from: "事務", datetime: "2024/12/22 14:20" },
      { id: "memo5", title: "栄養指導実施のご報告", content: "本日、田中一郎様（病室: 205号）の栄養指導を実施いたしました。塩分制限食の指導を行い、患者様も理解されていました。", to: "田中 健太 医師", from: "栄養科", datetime: "2024/12/21 11:00" },
      { id: "memo6", title: "CT読影結果の確認依頼", content: "昨日撮影した山本様のCT画像の読影が完了しました。レポートを電子カルテに登録済みです。緊急所見はありませんが、先生のご確認をお願いいたします。", to: "田中 健太 医師", from: "放射線科", datetime: "2024/12/21 08:30" },
    ];
    const sentMemos = [
      { id: "sent1", title: "カンファレンス日程調整のお願い", content: "来週のケースカンファレンスについて、患者数が増えているため時間を30分延長させてください。", to: "看護部・リハビリ科", from: "田中 健太 医師", datetime: "2024/12/23 14:00" },
      { id: "sent2", title: "MRI検査追加オーダーについて", content: "鈴木様（病室: 412号）のMRI検査を追加オーダーしました。今週中に撮影をお願いします。", to: "放射線科", from: "田中 健太 医師", datetime: "2024/12/23 11:20" },
      { id: "sent3", title: "薬剤変更の連絡", content: "高橋様の降圧薬をアムロジピン5mgからニフェジピンCR錠20mgに変更しました。引き続き経過観察をお願いします。", to: "看護部", from: "田中 健太 医師", datetime: "2024/12/22 17:30" },
      { id: "sent4", title: "退院サマリーの提出", content: "伊藤様の退院サマリーを電子カルテに提出しました。かかりつけ医への情報提供書も作成済みです。", to: "医事課", from: "田中 健太 医師", datetime: "2024/12/22 17:00" },
      { id: "sent5", title: "リハビリ開始の指示", content: "渡辺様（病室: 318号）のリハビリを本日より開始してください。起立訓練から始め、段階的に負荷をあげていく方針です。", to: "リハビリテーション科", from: "田中 健太 医師", datetime: "2024/12/20 13:45" },
      { id: "sent6", title: "特別食対応のお願い", content: "中村様（病室: 201号）は食物アレルギー（そば・えび）があります。配膳時にアレルギー確認を徹底してください。", to: "栄養科・看護部", from: "田中 健太 医師", datetime: "2024/12/19 10:00" },
    ];

    if (type === "received") {
      return HttpResponse.json({ memos: receivedMemos });
    }
    if (type === "sent") {
      return HttpResponse.json({ memos: sentMemos });
    }
    return HttpResponse.json(
      { message: "type must be one of: received, sent" },
      { status: 400 },
    );
  }),

  /**
   * POST /bff/memos
   * メモ新規作成
   */
  http.post(`${BFF_BASE_URL}/bff/memos`, async ({ request }) => {
    const body = await request.json() as { title: string; content: string; to: string };
    const now = new Date().toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    return HttpResponse.json(
      {
        id: `memo-${Date.now()}`,
        title: body.title,
        content: body.content,
        to: body.to,
        from: "田中 健太 医師",
        datetime: now,
      },
      { status: 201 },
    );
  }),

  /**
   * PATCH /bff/memos/:memoId/confirm
   * メモ確認済みマーク
   */
  http.patch(`${BFF_BASE_URL}/bff/memos/:memoId/confirm`, ({ params }) => {
    const { memoId } = params;
    return HttpResponse.json({ id: memoId, confirmed: true });
  }),

  /**
   * GET /bff/bulletins
   * 掲示板投稿一覧取得
   */
  http.get(`${BFF_BASE_URL}/bff/bulletins`, () => {
    return HttpResponse.json({
      posts: [
        { id: "1", category: "重要", categoryColor: "red", date: "2024/12/20", title: "年末年始の診療体制について", content: "12月29日（日）から1月3日（金）まで、救急外来のみ診療いたします。通常外来は1月4日（土）より再開予定です。", author: "事務局" },
        { id: "2", category: "お知らせ", categoryColor: "blue", date: "2024/12/18", title: "電子カルテシステムメンテナンス", content: "12月22日（日）AM2:00〜6:00の間、システムメンテナンスを実施します。この時間帯は電子カルテが使用できません。", author: "システム管理室" },
        { id: "3", category: "研修", categoryColor: "green", date: "2024/12/15", title: "感染対策研修会のご案内", content: "12月25日（水）15:00より、感染対策研修会を開催します。全スタッフ参加必須です。場所: 3階会議室A", author: "感染対策委員会" },
        { id: "4", category: "連絡", categoryColor: "yellow", date: "2024/12/12", title: "薬剤在庫確認のお願い", content: "各病棟の薬剤担当者は、12月20日までに在庫確認を完了し、薬剤部まで報告してください。", author: "薬剤部" },
        { id: "5", category: "イベント", categoryColor: "purple", date: "2024/12/10", title: "クリスマスイベント開催", content: "12月24日（火）に小児病棟でクリスマスイベントを開催します。ボランティア参加者を募集中です。", author: "地域連携室" },
      ],
    });
  }),

  /**
   * GET /bff/current-user
   * ログインユーザー情報取得
   */
  http.get(`${BFF_BASE_URL}/bff/current-user`, () => {
    return HttpResponse.json({
      currentUser: {
        id: "U001",
        name: "山田 太郎",
        role: "医師",
        department: "内科",
        loginTime: "09:00",
      },
      userAlerts: [],
      proxyApprovalCount: 0,
      hpkiRemainingTime: "HPKI残り 2時間15分",
    });
  }),

  /**
   * GET /bff/patients/:patientId/header
   * 患者情報ヘッダ取得
   */
  http.get(`${BFF_BASE_URL}/bff/patients/:patientId/header`, ({ params }) => {
    const { patientId } = params;
    const patientHeader: PatientHeaderResponse = {
      patientId: String(patientId),
      name: '山田 太郎',
      nameKana: 'ヤマダ タロウ',
      birthDate: '1985-05-15',
      age: 39,
      gender: 'male',
      ward: '第2病棟',
      room: '201号室',
      department: '内科',
      doctor: '鈴木 次郎',
      admissionType: 'inpatient',
      consultationStatus: 'waiting',
      prescriptionStatus: 'electronic',
      medicalInfoSharing: { status: 'full-consent' },
      insurance: { type: '社保', number: '', burden: '3割' },
      allergies: ['ペニシリン系', 'セフェム系', 'NSAIDs'],
      infections: [],
    };
    const response: GetPatientHeaderResponse = { patientHeader };
    return HttpResponse.json(response);
  }),

  /**
   * GET /bff/patients/:patientId/patient-info
   * 患者記録情報取得
   */
  http.get(`${BFF_BASE_URL}/bff/patients/:patientId/patient-info`, () => {
    const response: GetPatientInfoResponse = {
      patientInfo: {
        basicInfo: {
          patientId: 'P001',
          name: '山田 太郎',
          nameKana: 'ヤマダ タロウ',
          birthDate: '1950-05-15',
          gender: 'male',
          bloodType: 'A',
          insuranceNumber: '1234567890',
          address: '東京都新宿区西新宿1-1-1',
          phone: '03-1234-5678',
          emergencyContact: '山田 花子',
          emergencyPhone: '090-1234-5678',
          occupation: '無職（元会社員）',
          nationality: '日本',
          religion: '',
          primaryDiagnosis: '慢性心不全',
          admissionDate: '2025-01-10',
          ward: '第2病棟',
          room: '201号室',
        },
        allergyHistory: {
          allergies: [
            { id: 'al-001', allergen: 'ペニシリン系抗菌薬', reaction: '蕁麻疹・発疹', severity: 'moderate', confirmedDate: '2010-03-20', meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T10:00:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T10:00:00' } },
            { id: 'al-002', allergen: 'そば', reaction: 'アナフィラキシー', severity: 'severe', confirmedDate: '2015-07-01', meta: { createdBy: '田中 看護師', createdAt: '2025-01-11T09:30:00', updatedBy: '田中 看護師', updatedAt: '2025-01-11T09:30:00' } },
          ],
          medicalHistories: [
            { id: 'mh-001', disease: '高血圧症', diagnosisDate: '2000-04-15', hospital: '新宿総合病院', memo: '降圧薬内服中', meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T10:05:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T10:05:00' } },
            { id: 'mh-002', disease: '2型糖尿病', diagnosisDate: '2005-08-20', hospital: '新宿総合病院', memo: 'HbA1c管理中', meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T10:10:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T10:10:00' } },
          ],
          surgeries: [
            { id: 'su-001', surgeryName: '虫垂切除術', surgeryDate: '1985-06-10', hospital: '東京大学附属病院', memo: '合併症なし', meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T10:15:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T10:15:00' } },
          ],
        },
        vaccinations: [
          { id: 'va-001', vaccineName: 'インフルエンザワクチン', vaccinationDate: '2024-11-01', lotNumber: 'FL2024-001', administrator: '田中 看護師', memo: '左上腕に接種', meta: { createdBy: '田中 看護師', createdAt: '2024-11-01T14:00:00', updatedBy: '田中 看護師', updatedAt: '2024-11-01T14:00:00' } },
          { id: 'va-002', vaccineName: '新型コロナウイルスワクチン（4回目）', vaccinationDate: '2024-05-15', lotNumber: 'CV2024-005', administrator: '田中 看護師', memo: '', meta: { createdBy: '田中 看護師', createdAt: '2024-05-15T10:30:00', updatedBy: '田中 看護師', updatedAt: '2024-05-15T10:30:00' } },
        ],
        familyInfo: {
          familyMembers: [
            { id: 'fm-001', name: '山田 花子', relationship: '配偶者', birthDate: '1952-08-20', phone: '090-1234-5678', address: '東京都新宿区西新宿1-1-1', isEmergencyContact: true, meta: { createdBy: '田中 看護師', createdAt: '2025-01-10T11:00:00', updatedBy: '田中 看護師', updatedAt: '2025-01-10T11:00:00' } },
            { id: 'fm-002', name: '山田 一郎', relationship: '長男', birthDate: '1978-03-10', phone: '080-9876-5432', address: '東京都渋谷区道玄坂2-2-2', isEmergencyContact: false, meta: { createdBy: '田中 看護師', createdAt: '2025-01-10T11:05:00', updatedBy: '田中 看護師', updatedAt: '2025-01-10T11:05:00' } },
          ],
          guarantor: { name: '山田 花子', relationship: '配偶者', birthDate: '1952-08-20', phone: '090-1234-5678', address: '東京都新宿区西新宿1-1-1', occupation: '無職' },
        },
        infections: [
          { id: 'in-001', infectionName: 'B型肝炎（HBs抗原）', testDate: '2025-01-10', result: 'negative', memo: '', meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T12:00:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T12:00:00' } },
          { id: 'in-002', infectionName: 'C型肝炎（HCV抗体）', testDate: '2025-01-10', result: 'negative', memo: '', meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T12:05:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T12:05:00' } },
        ],
        implantDevices: {
          pacemakers: [],
          aneurysmClips: [],
          metalImplants: [
            { id: 'mi-001', partName: '右膝関節', materialName: '人工関節（チタン合金）', implantDate: '2018-09-15', memo: 'MRI検査時は要確認', meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T13:00:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T13:00:00' } },
          ],
        },
        lifestyle: {
          smokingStatus: 'former',
          smokingDetail: '40本/日 × 30年、2010年禁煙',
          alcoholStatus: 'occasional',
          alcoholDetail: '週1〜2回、ビール350ml程度',
          exerciseHabit: '週2回ウォーキング（30分）',
          sleepHours: '6〜7時間',
          dietRestriction: '塩分制限（6g/日未満）',
          memo: '',
          meta: { createdBy: '田中 看護師', createdAt: '2025-01-10T13:30:00', updatedBy: '田中 看護師', updatedAt: '2025-01-10T13:30:00' },
        },
        medicalMemos: [
          { id: 'mm-001', category: '注意事項', content: 'ペニシリン系アレルギーあり。処方時は必ず確認すること。', isImportant: true, meta: { createdBy: '鈴木 医師', createdAt: '2025-01-10T14:00:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-10T14:00:00' } },
          { id: 'mm-002', category: 'コミュニケーション', content: '難聴あり。大きな声でゆっくり話す。補聴器使用中。', isImportant: false, meta: { createdBy: '田中 看護師', createdAt: '2025-01-11T09:00:00', updatedBy: '田中 看護師', updatedAt: '2025-01-11T09:00:00' } },
        ],
        philosophies: [
          { id: 'ph-001', endOfLifeWish: '苦痛なく穏やかに逝きたい。延命処置は望まない。', resuscitationWish: 'doNot', artificialNutritionWish: 'doNot', mechanicalVentilationWish: 'doNot', decisionMaker: '山田 花子（配偶者）', decisionMakerPhone: '090-1234-5678', memo: '2025年1月に本人・家族と話し合い済み', isLatest: true, meta: { createdBy: '鈴木 医師', createdAt: '2025-01-15T15:00:00', updatedBy: '鈴木 医師', updatedAt: '2025-01-15T15:00:00' } },
        ],
        accessControl: {
          vipSetting: { isVip: false, restrictionLevel: 'none', memo: '', meta: { createdBy: 'admin', createdAt: '2025-01-10T08:00:00', updatedBy: 'admin', updatedAt: '2025-01-10T08:00:00' } },
          userAccesses: [
            { id: 'ua-001', userId: 'U001', userName: '鈴木 医師', role: 'doctor', canView: true, canEdit: true, grantedBy: 'admin', grantedAt: '2025-01-10T08:00:00' },
            { id: 'ua-002', userId: 'U002', userName: '田中 看護師', role: 'nurse', canView: true, canEdit: true, grantedBy: 'admin', grantedAt: '2025-01-10T08:00:00' },
          ],
        },
      },
    };
    return HttpResponse.json(response);
  }),

  /**
   * GET /bff/departments
   * 部門マスター一覧取得
   */
  http.get(`${BFF_BASE_URL}/bff/departments`, () => {
    return HttpResponse.json({
      departments: [
        { id: "dept-01", name: "内科" },
        { id: "dept-02", name: "外科" },
        { id: "dept-03", name: "小児科" },
        { id: "dept-04", name: "整形外科" },
        { id: "dept-05", name: "皮膚科" },
        { id: "dept-06", name: "眼科" },
        { id: "dept-07", name: "耳鼻咽喉科" },
        { id: "dept-08", name: "産婦人科" },
        { id: "dept-09", name: "泌尿器科" },
        { id: "dept-10", name: "精神科" },
        { id: "dept-11", name: "放射線科" },
        { id: "dept-12", name: "麻酔科" },
        { id: "dept-13", name: "救急科" },
        { id: "dept-14", name: "病理診断科" },
        { id: "dept-15", name: "リハビリテーション科" },
        { id: "dept-16", name: "臨床検査科" },
        { id: "dept-17", name: "内視鏡検査科" },
        { id: "dept-18", name: "栄養指示科" },
        { id: "dept-19", name: "薬剤部" },
        { id: "dept-20", name: "看護部" },
        { id: "dept-21", name: "事務" },
      ],
    });
  }),

  /**
   * GET /bff/examination-equipment
   * 検査室一覧・定員取得
   */
  http.get(`${BFF_BASE_URL}/bff/examination-equipment`, () => {
    return HttpResponse.json({
      equipment: [
        { id: "CT1", name: "CT室", type: "CT", capacity: 3 },
        { id: "MRI1", name: "MRI室", type: "MRI", capacity: 3 },
        { id: "US1", name: "エコー室", type: "US", capacity: 3 },
      ],
    });
  }),

  /**
   * GET /bff/examination-reservations?equipmentId=...&startDate=...&endDate=...
   * 週間スケジュール用 予約一覧取得
   */
  http.get(`${BFF_BASE_URL}/bff/examination-reservations`, ({ request }) => {
    const url = new URL(request.url);
    const equipmentId = url.searchParams.get("equipmentId");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const allReservations = [
      { id: "r001", patientId: "P12345", patientName: "田中花子", examType: "胸部CT", startTime: "09:00", endTime: "09:15", date: "2026-01-08", equipment: "CT1", status: "scheduled", notes: "造影剤使用", doctorId: "D001", doctorName: "医師 001", checkedIn: true },
      { id: "r002", patientId: "P67890", patientName: "佐藤太郎", examType: "腹部CT", startTime: "09:00", endTime: "09:20", date: "2026-01-08", equipment: "CT1", status: "scheduled", checkedIn: true },
      { id: "r003", patientId: "P11111", patientName: "山田次郎", examType: "造影CT", startTime: "09:00", endTime: "09:30", date: "2026-01-08", equipment: "CT1", status: "scheduled", notes: "腎機能チェック済み" },
      { id: "r004", patientId: "P22222", patientName: "鈴木美智子", examType: "胸部CT", startTime: "10:30", endTime: "10:45", date: "2026-01-08", equipment: "CT1", status: "scheduled", checkedIn: true },
      { id: "r005", patientId: "P33333", patientName: "高橋健一", examType: "頭部CT", startTime: "10:30", endTime: "10:45", date: "2026-01-08", equipment: "CT1", status: "scheduled" },
      { id: "r006", patientId: "P44444", patientName: "渡辺聡子", examType: "腹部CT", startTime: "14:00", endTime: "14:20", date: "2026-01-08", equipment: "CT1", status: "scheduled" },
      { id: "r007", patientId: "P55555", patientName: "伊藤雅子", examType: "頭部MRI", startTime: "09:00", endTime: "09:45", date: "2026-01-09", equipment: "MRI1", status: "scheduled" },
      { id: "r008", patientId: "P66666", patientName: "小林正男", examType: "腰椎MRI", startTime: "09:00", endTime: "10:00", date: "2026-01-09", equipment: "MRI1", status: "scheduled" },
      { id: "r009", patientId: "P77777", patientName: "加藤修", examType: "胸部CT", startTime: "11:00", endTime: "11:15", date: "2026-01-09", equipment: "CT1", status: "scheduled" },
      { id: "r010", patientId: "P88888", patientName: "木村優子", examType: "腹部CT", startTime: "11:00", endTime: "11:20", date: "2026-01-09", equipment: "CT1", status: "scheduled" },
      { id: "schedule-pr_001", patientId: "P001", patientName: "山田太郎", examType: "胸部CT", startTime: "10:00", endTime: "10:15", date: "2026-01-09", equipment: "CT1", status: "scheduled" },
      { id: "schedule-pr_002", patientId: "P001", patientName: "山田太郎", examType: "頭部MRI", startTime: "14:00", endTime: "14:45", date: "2026-01-10", equipment: "MRI1", status: "scheduled" },
      { id: "schedule-pr_003", patientId: "P001", patientName: "山田太郎", examType: "腹部エコー", startTime: "11:00", endTime: "11:30", date: "2026-01-11", equipment: "US1", status: "scheduled" },
    ];

    const filtered = allReservations.filter((r) => {
      if (equipmentId && r.equipment !== equipmentId) return false;
      if (startDate && r.date < startDate) return false;
      if (endDate && r.date > endDate) return false;
      return true;
    });

    return HttpResponse.json({ reservations: filtered });
  }),

  /**
   * GET /bff/patients/:patientId/examination-reservations
   * 患者別 予約一覧取得
   */
  http.get(`${BFF_BASE_URL}/bff/patients/:patientId/examination-reservations`, ({ params }) => {
    const { patientId } = params;
    const patientReservations = [
      { id: "pr_scheduled_001", patientId: "P001", patientName: "山田太郎", examType: "胸部CT", startTime: "10:00", endTime: "10:15", date: "2026-01-09", equipment: "CT1", status: "scheduled" },
      { id: "pr_scheduled_002", patientId: "P001", patientName: "山田太郎", examType: "頭部MRI", startTime: "14:00", endTime: "14:45", date: "2026-01-10", equipment: "MRI1", status: "scheduled" },
      { id: "pr_scheduled_003", patientId: "P001", patientName: "山田太郎", examType: "腹部エコー", startTime: "11:00", endTime: "11:30", date: "2026-01-11", equipment: "US1", status: "scheduled" },
      { id: "pr_undecided_001", patientId: "P001", patientName: "山田太郎", examType: "胸部CT", startTime: "未定", endTime: "未定", date: "未定", equipment: "CT1", status: "scheduled" },
      { id: "pr_undecided_002", patientId: "P001", patientName: "山田太郎", examType: "造影CT", startTime: "未定", endTime: "未定", date: "未定", equipment: "CT1", status: "scheduled", notes: "造影剤アレルギーチェック必要" },
      { id: "pr_undecided_003", patientId: "P001", patientName: "山田太郎", examType: "腹部CT", startTime: "未定", endTime: "未定", date: "未定", equipment: "CT1", status: "scheduled" },
      { id: "pr_undecided_004", patientId: "P001", patientName: "山田太郎", examType: "頭部MRI", startTime: "未定", endTime: "未定", date: "未定", equipment: "MRI1", status: "scheduled" },
      { id: "pr_undecided_005", patientId: "P001", patientName: "山田太郎", examType: "腰椎MRI", startTime: "未定", endTime: "未定", date: "未定", equipment: "MRI1", status: "scheduled" },
      { id: "pr_undecided_009", patientId: "P001", patientName: "山田太郎", examType: "腹部エコー", startTime: "未定", endTime: "未定", date: "未定", equipment: "US1", status: "scheduled" },
      { id: "pr_undecided_010", patientId: "P001", patientName: "山田太郎", examType: "心エコー", startTime: "未定", endTime: "未定", date: "未定", equipment: "US1", status: "scheduled" },
    ];
    const result = patientReservations.filter((r) => r.patientId === patientId);
    return HttpResponse.json({ reservations: result });
  }),

  /**
   * POST /bff/patients/:patientId/examination-reservations
   * 新規予約作成
   */
  http.post(`${BFF_BASE_URL}/bff/patients/:patientId/examination-reservations`, async ({ params, request }) => {
    const { patientId } = params;
    const body = await request.json() as {
      patientName: string;
      examType: string;
      startTime: string;
      endTime: string;
      date: string;
      equipment: string;
      notes?: string;
      doctorId: string;
      doctorName: string;
    };
    return HttpResponse.json(
      {
        reservation: {
          id: `r${Date.now()}`,
          patientId,
          patientName: body.patientName,
          examType: body.examType,
          startTime: body.startTime,
          endTime: body.endTime,
          date: body.date,
          equipment: body.equipment,
          status: "scheduled",
          notes: body.notes,
          doctorId: body.doctorId,
          doctorName: body.doctorName,
        },
      },
      { status: 201 },
    );
  }),

  /**
   * PUT /bff/patients/:patientId/examination-reservations/:reservationId
   * 予約日時確定・更新
   */
  http.put(
    `${BFF_BASE_URL}/bff/patients/:patientId/examination-reservations/:reservationId`,
    async ({ params, request }) => {
      const { patientId, reservationId } = params;
      const body = await request.json() as { date: string; startTime: string; endTime: string };
      return HttpResponse.json({
        reservation: {
          id: reservationId,
          patientId,
          patientName: "山田太郎",
          examType: "",
          startTime: body.startTime,
          endTime: body.endTime,
          date: body.date,
          equipment: "",
          status: "scheduled",
        },
      });
    },
  ),

  /**
   * GET /bff/patients/:patientId/specimen-history
   * 検体検査オーダー履歴取得
   */
  http.get(
    `${BFF_BASE_URL}/bff/patients/:patientId/specimen-history`,
    ({ params }) => {
      const { patientId } = params;
      return HttpResponse.json({
        history: [
          {
            id: "sh-001",
            date: "2025-04-01",
            testName: "血液一般",
            orderCode: "LAB-BLD-001",
            specimenType: "blood",
            status: "confirmed",
            confirmedAt: "2025-04-01T09:00:00Z",
            confirmedBy: "Dr. 鈴木",
            quantity: 2,
            priority: "normal",
          },
          {
            id: "sh-002",
            date: "2025-04-05",
            testName: "尿一般",
            orderCode: "LAB-URN-001",
            specimenType: "urine",
            status: "confirmed",
            confirmedAt: "2025-04-05T10:30:00Z",
            confirmedBy: "Dr. 田中",
          },
        ],
      });
    },
  ),

  /**
   * GET /bff/order-sets/specimen-sets
   * 検体検査セット取得
   */
  http.get(
    `${BFF_BASE_URL}/bff/order-sets/specimen-sets`,
    () => {
      return HttpResponse.json({
        specimenSets: [
          {
            id: "labset-1",
            name: "基本血液検査セット",
            description: "血算・生化学・凝固を含む基本セット",
            setType: "hospital",
            items: [
              {
                id: "sh-101",
                date: "2025-01-01",
                testName: "血算",
                orderCode: "LAB-CBC-001",
                specimenType: "blood",
                status: "confirmed",
                confirmedAt: "2025-01-01T00:00:00Z",
                confirmedBy: "system",
              },
            ],
          },
          {
            id: "labset-2",
            name: "尿検査セット",
            description: "尿一般・尿沈渣を含むセット",
            setType: "department",
            items: [
              {
                id: "sh-102",
                date: "2025-01-01",
                testName: "尿一般",
                orderCode: "LAB-URN-001",
                specimenType: "urine",
                status: "confirmed",
                confirmedAt: "2025-01-01T00:00:00Z",
                confirmedBy: "system",
              },
            ],
          },
        ],
      });
    },
  ),

  /**
   * POST /bff/patients/:patientId/specimen-orders
   * 検体検査オーダー確定
   */
  http.post(
    `${BFF_BASE_URL}/bff/patients/:patientId/specimen-orders`,
    async ({ params, request }) => {
      const { patientId } = params;
      const raw: unknown = await request.json();
      if (
        !raw ||
        typeof raw !== 'object' ||
        !('items' in raw) ||
        !Array.isArray((raw as { items: unknown }).items) ||
        !('confirmedBy' in raw) ||
        typeof (raw as { confirmedBy: unknown }).confirmedBy !== 'string'
      ) {
        return HttpResponse.json({ message: 'Bad Request' }, { status: 400 });
      }
      type RequestBody = { items: { specimenType: string; orderCode: string; testName: string }[]; confirmedBy: string };
      const body = raw as RequestBody;
      const confirmedOrders = body.items.map((item, i) => ({
        id: `so-${Date.now()}-${i}`,
        testName: item.testName,
        orderCode: item.orderCode,
        specimenType: item.specimenType,
        status: "confirmed",
        confirmedAt: new Date().toISOString(),
        confirmedBy: body.confirmedBy,
      }));
      void patientId;
      return HttpResponse.json({ confirmedOrders }, { status: 201 });
    },
  ),
];
