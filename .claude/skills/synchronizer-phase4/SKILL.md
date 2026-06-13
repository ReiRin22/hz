---
name: synchronizer-phase4
description: synchronizer Phase 4 実装ガイド。BFF Service 層の実装。Client 呼び出し・データ整形・ViewModel マッピング・並列処理を担当。HTTP レスポンス操作は禁止。Phase 4 開始時（S4-1）に必ず参照すること。
---

# synchronizer Phase 4 実装ガイド

## Phase 4 の実装内容

Phase 4 では **BFF Service 層** を実装する:

- **BFF Service 層実装** — `bff/src/features/{domain}/{feature-path}/*.service.ts`
- **Client 呼び出し** — Client 層のメソッドを呼び出す
- **データ整形・ViewModel マッピング** — BE レスポンス → フロントエンド ViewModel への変換
- **並列処理** — 複数の Client 呼び出しを `Promise.all` で並列実行
- **ビジネスロジック** — データ結合・フォーマット・計算

---

## Service 層の責務

| 責務 | 内容 |
|------|------|
| **Client 呼び出し** | Client 層のメソッドを呼び出す |
| **並列処理** | 複数の Client 呼び出しを `Promise.all` で並列実行 |
| **データ整形** | BE レスポンス → ViewModel への変換 |
| **ビジネスロジック** | データ結合・フォーマット・計算 |
| **エラーハンドリング** | Client エラーをキャッチして適切にハンドリング |

**やってはいけないこと**:
- ❌ HTTP レスポンス操作（status / header 設定）→ Controller 層の責務
- ❌ 直接 axios を呼ぶ → Client 層の責務
- ❌ モックデータのハードコード → BE Controller でモック実装

---

## ステップ1: Service ファイル構造

### ファイル配置

```
product/bff/src/features/{domain}/{feature-path}/
├── {feature-name}.client.ts         ← Phase 3 で実装済み
├── {feature-name}.service.ts        ← Phase 4 で実装
├── {feature-name}.controller.ts     ← Phase 5 で実装
├── {feature-name}.module.ts         ← Phase 6 で実装
└── types/
    ├── {entity}.type.ts              ← BFF internal 型
    └── {entity}.request.type.ts      ← BFF internal リクエスト型
```

### 命名規則

| ファイル | クラス名 | 例 |
|---------|---------|-----|
| `clinical-entry.service.ts` | `ClinicalEntryService` | 診療記録入力 |
| `schema-creation.service.ts` | `SchemaCreationService` | シェーマ作成 |
| `patient-list.service.ts` | `PatientListService` | 患者一覧 |

**ルール**: kebab-case ファイル名 → PascalCase クラス名

---

## ステップ2: Service 実装パターン

### 基本構造

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { FeatureClient } from './feature.client';
import type { FeatureResponse } from '@/front_bff_shared/{domain}/{feature}/types/feature.api.response';

@Injectable()
export class FeatureService {
  constructor(
    @Inject(FeatureClient) private readonly featureClient: FeatureClient
  ) {}

  async getFeatureData(params: { id: string }): Promise<FeatureResponse> {
    // Client 呼び出し
    const data = await this.featureClient.fetchEntity({ id: params.id });

    // ViewModel への変換
    return {
      id: data.entityId,
      name: data.entityName,
      // ... その他のマッピング
    };
  }
}
```

### 並列処理パターン（Promise.all）

```typescript
@Injectable()
export class ClinicalEntryService {
  constructor(
    @Inject(ClinicalEntryClient) private readonly clinicalEntryClient: ClinicalEntryClient
  ) {}

  async getClinicalEntryData(patientId: string): Promise<ClinicalEntryDataResponse> {
    // 並列実行（3つの API を同時に呼ぶ）
    const [chiefComplaintData, vitalInfoData, prescriptionOrderData] = await Promise.all([
      this.clinicalEntryClient.fetchChiefComplaint({ patientId }),
      this.clinicalEntryClient.fetchVitalInfo({ patientId }),
      this.clinicalEntryClient.fetchPrescriptionOrder({ patientId }),
    ]);

    // データ整形・ViewModel マッピング
    const formattedOrders = prescriptionOrderData.orders.map(order =>
      `${order.drug.drugName} ${order.frequency} ${order.timing} ${order.duration}`
    );

    return {
      chiefComplaint: chiefComplaintData.text,
      vitalInfo: {
        bloodPressure: vitalInfoData.bloodPressure ?? '',
        bloodType: vitalInfoData.bloodType ?? '',
        rhFactor: vitalInfoData.rhFactor ?? '',
      },
      prescriptionOrder: {
        orders: formattedOrders,
      },
    };
  }
}
```

### 実装例: clinical-entry.service.ts

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { ClinicalEntryClient } from '@/features/sample/diagnosis/record-management/clinical-entry/clinical-entry.client';
import { ClinicalEntryDataResponse } from '@/front_bff_shared/sample/diagnosis/record-management/clinical-entry/types/clinical-entry.api.response';

@Injectable()
export class ClinicalEntryService {
  constructor(@Inject(ClinicalEntryClient) private readonly clinicalEntryClient: ClinicalEntryClient) {}

  async getClinicalEntryData(patientId: string): Promise<ClinicalEntryDataResponse> {
    // 並列実行
    const [chiefComplaintData, vitalInfoData, prescriptionOrderData] = await Promise.all([
      this.clinicalEntryClient.fetchChiefComplaint({ patientId }),
      this.clinicalEntryClient.fetchVitalInfo({ patientId }),
      this.clinicalEntryClient.fetchPrescriptionOrder({ patientId }),
    ]);

    // 構造化された処方データを文字列に結合
    const formattedOrders = prescriptionOrderData.orders.map(order =>
      `${order.drug.drugName} ${order.frequency} ${order.timing} ${order.duration}`
    );

    // ViewModel への変換
    return {
      chiefComplaint: chiefComplaintData.text,
      vitalInfo: {
        bloodPressure: vitalInfoData.bloodPressure ?? '',
        bloodType: vitalInfoData.bloodType ?? '',
        rhFactor: vitalInfoData.rhFactor ?? '',
      },
      prescriptionOrder: {
        orders: formattedOrders,
      },
    };
  }
}
```

---

## ステップ3: Client の DI（依存性注入）

### constructor での注入

```typescript
constructor(
  @Inject(FeatureClient) private readonly featureClient: FeatureClient
) {}
```

**重要ポイント**:
- `@Inject(FeatureClient)` デコレーターを使用
- `private readonly` で宣言（変更不可）
- 複数の Client を注入する場合は複数の引数

### 複数 Client の例

```typescript
constructor(
  @Inject(ClientA) private readonly clientA: ClientA,
  @Inject(ClientB) private readonly clientB: ClientB,
  @Inject(ClientC) private readonly clientC: ClientC
) {}
```

---

## ステップ4: ViewModel マッピング

### マッピングの原則

| 変換方向 | 説明 |
|---------|------|
| **BE レスポンス → ViewModel** | Service 層で実施 |
| **フロントエンド入力 → BE リクエスト** | Controller 層で実施（または Service） |

### マッピング例

```typescript
// BE レスポンス型
interface PatientDataFromBE {
  patient_id: string;
  patient_name: string;
  birth_date: string;
  blood_type_code: string;
}

// ViewModel 型（front_bff_shared）
interface PatientViewModel {
  id: string;
  name: string;
  birthDate: string;
  bloodType: string;
}

// Service でのマッピング
async getPatientData(patientId: string): Promise<PatientViewModel> {
  const data = await this.patientClient.fetchPatient({ patientId });

  return {
    id: data.patient_id,
    name: data.patient_name,
    birthDate: data.birth_date,
    bloodType: this.formatBloodType(data.blood_type_code), // フォーマット処理
  };
}

private formatBloodType(code: string): string {
  const map: Record<string, string> = {
    'A+': 'A型 Rh+',
    'A-': 'A型 Rh-',
    'B+': 'B型 Rh+',
    // ...
  };
  return map[code] ?? '不明';
}
```

---

## ステップ5: エラーハンドリング

### Service 層でのエラーハンドリング

```typescript
async getFeatureData(params: { id: string }): Promise<FeatureResponse> {
  try {
    const data = await this.featureClient.fetchEntity({ id: params.id });
    return this.mapToViewModel(data);
  } catch (error) {
    console.error(`Failed to fetch feature data: ${params.id}`, error);
    
    // ビジネスエラーの場合は適切なエラーを throw
    if (error.response?.status === 404) {
      throw new Error(`Feature not found: ${params.id}`);
    }
    
    // その他のエラーはそのまま throw（Controller 層でハンドリング）
    throw error;
  }
}
```

---

## ステップ6: 単体テスト (S4-2)

### テストファイル配置

```
product/bff/src/features/{domain}/{feature-path}/
├── {feature-name}.service.ts
└── {feature-name}.service.test.ts    ← Phase 4 で実装
```

### テスト実装例

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalEntryService } from './clinical-entry.service';
import { ClinicalEntryClient } from './clinical-entry.client';

describe('ClinicalEntryService', () => {
  let service: ClinicalEntryService;
  let client: ClinicalEntryClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClinicalEntryService,
        {
          provide: ClinicalEntryClient,
          useValue: {
            fetchChiefComplaint: jest.fn(),
            fetchVitalInfo: jest.fn(),
            fetchPrescriptionOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClinicalEntryService>(ClinicalEntryService);
    client = module.get<ClinicalEntryClient>(ClinicalEntryClient);
  });

  it('should return clinical entry data', async () => {
    // Arrange
    jest.spyOn(client, 'fetchChiefComplaint').mockResolvedValue({
      text: '頭痛',
    });
    jest.spyOn(client, 'fetchVitalInfo').mockResolvedValue({
      bloodPressure: '120/80',
      bloodType: 'A',
      rhFactor: '+',
    });
    jest.spyOn(client, 'fetchPrescriptionOrder').mockResolvedValue({
      orders: [
        { drug: { drugName: 'アスピリン 100mg' }, frequency: '1日3回', timing: '食後', duration: '7日間' },
      ],
    });

    // Act
    const result = await service.getClinicalEntryData('patient-001');

    // Assert
    expect(result.chiefComplaint).toBe('頭痛');
    expect(result.vitalInfo.bloodPressure).toBe('120/80');
    expect(result.prescriptionOrder.orders).toHaveLength(1);
    expect(result.prescriptionOrder.orders[0]).toContain('アスピリン 100mg');
  });
});
```

---

## チェックリスト (Phase 4)

### S4-1: BFF Service 層実装

- [ ] 対象機能の `bff/src/features/{domain}/{feature-path}/` 配下に `*.service.ts` を作成している
- [ ] クラス名は PascalCase（例: `ClinicalEntryService`）
- [ ] `@Injectable()` デコレーターを付与している
- [ ] constructor で Client を `@Inject()` で注入している
- [ ] Client メソッドを呼び出している（axios は直接呼ばない）
- [ ] 複数の Client 呼び出しは `Promise.all` で並列実行している
- [ ] BE レスポンス → ViewModel への変換ロジックを実装している
- [ ] HTTP レスポンス操作（status / header 設定）をしていない
- [ ] 型定義を `@/front_bff_shared/` からインポートしている
- [ ] エラーハンドリングを適切に実装している

### S4-2: 変換ロジックの単体テスト

- [ ] `*.service.test.ts` ファイルを作成している
- [ ] `@nestjs/testing` の `Test.createTestingModule` を使用している
- [ ] Client をモック化している（`useValue` で jest.fn() を提供）
- [ ] 各メソッドのテストケースを実装している
- [ ] 正常系・異常系の両方をテストしている
- [ ] ViewModel マッピングの正しさを検証している
- [ ] `npm test` でテストが通ることを確認している

---

## 実装の流れ（まとめ）

```
Phase 4 開始
  ↓
S4-1: BFF Service 層実装
  - {feature-name}.service.ts 作成
  - @Injectable() デコレーター付与
  - constructor で Client を @Inject() 注入
  - Client 呼び出し・並列処理（Promise.all）
  - BE レスポンス → ViewModel マッピング
  - HTTP レスポンス操作禁止
  ↓
S4-2: 変換ロジックの単体テスト
  - {feature-name}.service.test.ts 作成
  - Client をモック化
  - ViewModel マッピングのテスト
  ↓
Phase 4 完了
```

---

## 参照ファイル

| ファイル | 内容 |
|---------|------|
| `product/bff/src/features/sample/diagnosis/record-management/clinical-entry/clinical-entry.service.ts` | Service 実装例 |
| `.claude/commands/synchronizer.md` | synchronizer 全体ワークフロー |
| `.claude/rules/cross-layer-rules.md` | 3層横断の禁止事項 |
| `.claude/commands/bff_structure.md` | BFF 実装の構造ルール |
| `docs/02_アプリ基盤/01_フロントエンド・BFF/02_詳細設計書/10.BFF設計.md` | BFF レイヤー定義 |
