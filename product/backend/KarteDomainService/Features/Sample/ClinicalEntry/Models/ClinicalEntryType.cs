namespace KarteDomainService.Features.Sample.ClinicalEntry.Models;

// ── リクエスト型 ──────────────────────────────────────────────
// 患者IDは個人情報のため、URIパス・クエリパラメータに含めずリクエストボディで渡す。
// そのためGETではなくPOSTを使用し、各エンドポイントに対応したリクエスト型を個別に定義している。

/// <summary>
/// 主訴・所見取得 リクエスト型。
/// </summary>
/// <param name="PatientId">対象患者のID（個人情報のためボディに含める）</param>
public record ChiefComplaintRequest(string PatientId);

/// <summary>
/// バイタル情報取得 リクエスト型。
/// </summary>
/// <param name="PatientId">対象患者のID（個人情報のためボディに含める）</param>
public record VitalInfoRequest(string PatientId);

/// <summary>
/// 処方オーダー取得 リクエスト型。
/// </summary>
/// <param name="PatientId">対象患者のID（個人情報のためボディに含める）</param>
public record PrescriptionOrderRequest(string PatientId);

// ── レスポンス型（処方オーダーのみ構造が複雑なため個別定義）──
// ChiefComplaint / VitalInfo はエンティティをそのまま返すためここでは定義しない。

/// <summary>
/// 薬剤情報。drug_master テーブルから取得した値を格納する。
/// </summary>
/// <param name="DrugId">薬剤コード（外部マスタとの連携キー）</param>
/// <param name="DrugName">薬剤名</param>
/// <param name="DrugPrice">薬剤単価</param>
/// <param name="DrugCategory">薬剤カテゴリ（例: 抗生剤、鎮痛剤）</param>
public record Drug(
    string DrugId,
    string DrugName,
    decimal DrugPrice,
    string DrugCategory);

/// <summary>
/// 処方1明細。オーダーIDと薬剤情報、用法・用量を保持する。
/// </summary>
/// <param name="PatientId">患者ID</param>
/// <param name="OrderId">処方オーダーID</param>
/// <param name="Drug">薬剤情報（drug_master から結合）</param>
/// <param name="Frequency">投与頻度（例: 1日3回）</param>
/// <param name="Timing">服用タイミング（例: 食後）</param>
/// <param name="Duration">投与期間（例: 7日間）</param>
public record PrescriptionItem(
    string PatientId,
    string OrderId,
    Drug Drug,
    string Frequency,
    string Timing,
    string Duration);

/// <summary>
/// 処方オーダー取得 レスポンス型。
/// 患者に対する処方明細の一覧を返す。
/// </summary>
/// <param name="Orders">処方明細リスト（オーダー日時昇順）</param>
public record PrescriptionOrderData(List<PrescriptionItem> Orders);
