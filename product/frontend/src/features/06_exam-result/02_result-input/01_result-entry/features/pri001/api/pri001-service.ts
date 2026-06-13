// TODO: BFF定義確定後に本番エンドポイントへ差し替える
// 設計書: docs/01_アプリ/フロントエンド/06_exam-result/02_result-input/design_detail-RES002_結果入力.md
// 「【PRI001】代行入力確認ダイアログの読出し」参照

export type ProxyInputConfirmResponse = {
  requiresConfirmation: boolean;
  message: string;
};

export const pri001Service = {
  async getProxyInputConfirm(orderUuid: string): Promise<ProxyInputConfirmResponse> {
    // TODO: BFF定義確定後は以下のエンドポイントを使用する
    // const res = await fetch(`/bff/pri001/${orderUuid}`);
    // if (!res.ok) throw new Error(`GET /bff/pri001/${orderUuid} failed: ${res.status}`);
    // return res.json() as Promise<ProxyInputConfirmResponse>;

    // スタブ: 常に代行入力確認ダイアログを表示する
    void orderUuid;
    return { requiresConfirmation: true, message: '代行入力を行います。よろしいですか？' };
  },
};
