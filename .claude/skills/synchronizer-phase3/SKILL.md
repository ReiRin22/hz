---
name: synchronizer-phase3
description: synchronizer Phase 3 実装ガイド。BFF Client 層の実装。axios で BE エンドポイントを呼び出す。BE がモック中でも HTTP 経由で呼ぶ実装にする。Phase 3 開始時（S3-1）に必ず参照すること。
---

# synchronizer Phase 3 実装ガイド

## Phase 3 の実装内容

Phase 3 では **BFF Client 層** を実装する:

- **BFF Client 層実装** — `bff/src/features/{domain}/{feature-path}/*.client.ts`
- **BE エンドポイントを呼び出す** — axios (bffAxiosClient) を使用
- **モックデータ禁止** — BE がモック中でも HTTP で BE を呼ぶ実装にする

---

## Client 層の責務

| 責務 | 内容 |
|------|------|
| **BE との HTTP 通信** | axios を使って BE エンドポイントを呼び出す |
| **型変換** | BE レスポンス型 → BFF internal 型への変換 |
| **エラーハンドリング** | HTTP エラーを throw（Service 層でキャッチ） |
| **モックデータ禁止** | BE がモックでも HTTP 経由で呼ぶ |

**やってはいけないこと**:
- ❌ Client 層にモックデータをハードコード
- ❌ データ整形・ビジネスロジック（Service 層の責務）
- ❌ HTTP レスポンス操作（Controller 層の責務）

---

## ステップ1: Client ファイル構造

### ファイル配置

```
product/bff/src/features/{domain}/{feature-path}/
├── {feature-name}.client.ts         ← Phase 3 で実装
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
| `clinical-entry.client.ts` | `ClinicalEntryClient` | 診療記録入力 |
| `schema-creation.client.ts` | `SchemaCreationClient` | シェーマ作成 |
| `patient-list.client.ts` | `PatientListClient` | 患者一覧 |

**ルール**: kebab-case ファイル名 → PascalCase クラス名

---

## ステップ2: Client 実装パターン

### 基本構造

```typescript
import { Injectable } from '@nestjs/common';
import { axiosClient } from '@shared/plugins/bffAxiosClient';
import type { EntityData } from './types/entity.type';
import type { EntityRequest } from './types/entity.request.type';

@Injectable()
export class FeatureClient {
  
  // GET の例
  async fetchEntity(request: EntityRequest): Promise<EntityData> {
    console.log(`Fetching entity for id: ${request.id}`);
    const response = await axiosClient.get<EntityData>(
      `/api/entities/${request.id}`
    );
    return response.data;
  }

  // POST の例
  async createEntity(request: EntityRequest): Promise<EntityData> {
    console.log(`Creating entity with data:`, request);
    const response = await axiosClient.post<EntityData>(
      '/api/entities',
      request
    );
    return response.data;
  }

  // PUT の例
  async updateEntity(id: string, request: EntityRequest): Promise<EntityData> {
    console.log(`Updating entity ${id}`);
    const response = await axiosClient.put<EntityData>(
      `/api/entities/${id}`,
      request
    );
    return response.data;
  }

  // DELETE の例
  async deleteEntity(id: string): Promise<void> {
    console.log(`Deleting entity ${id}`);
    await axiosClient.delete(`/api/entities/${id}`);
  }
}
```

### 実装例: clinical-entry.client.ts

```typescript
import { Injectable } from '@nestjs/common';
import type { ChiefComplaintData } from './types/chief-complaint.type';
import type { ChiefComplaintRequest } from './types/chief-complaint.request.type';
import type { VitalInfoData } from './types/vital-info.type';
import type { VitalInfoRequest } from './types/vital-info.request.type';
import type { PrescriptionOrderData } from './types/prescription.type';
import type { PrescriptionOrderRequest } from './types/prescription.request.type';
import { axiosClient } from '@shared/plugins/bffAxiosClient';

@Injectable()
export class ClinicalEntryClient {

  // 主訴取得
  async fetchChiefComplaint(request: ChiefComplaintRequest): Promise<ChiefComplaintData> {
    console.log(`Fetching chief complaint for patientId: ${request.patientId}`);
    const response = await axiosClient.post<ChiefComplaintData>(
      '/clinical/entry/chief-complaint',
      request
    );
    return response.data;
  }

  // バイタル情報取得
  async fetchVitalInfo(request: VitalInfoRequest): Promise<VitalInfoData> {
    console.log(`Fetching vital info for patientId: ${request.patientId}`);
    const response = await axiosClient.post<VitalInfoData>(
      '/clinical/entry/vital-info',
      request
    );
    return response.data;
  }

  // 処方箋取得
  async fetchPrescriptionOrder(request: PrescriptionOrderRequest): Promise<PrescriptionOrderData> {
    console.log(`Fetching prescription order for patientId: ${request.patientId}`);
    const response = await axiosClient.post<PrescriptionOrderData>(
      '/clinical/entry/prescription-order',
      request
    );
    return response.data;
  }
}
```

---

## ステップ3: bffAxiosClient の使用

### import 方法

```typescript
import { axiosClient } from '@shared/plugins/bffAxiosClient';
```

### bffAxiosClient が自動実行する処理

`product/bff/src/shared/plugins/bffAxiosClient.ts` は以下を自動処理する:

| 処理 | 内容 |
|------|------|
| **Base URL 設定** | `http://localhost:5000` (BE サーバー) |
| **共通ヘッダー注入** | `X-Tenant-Id` / `X-Correlation-ID` 等 |
| **エラーハンドリング** | HTTP エラーを throw |

**実装者は axiosClient を呼ぶだけで、これらの処理は自動実行される。**

---

## ステップ4: エラーハンドリング

### Client 層でのエラーハンドリング

```typescript
async fetchEntity(request: EntityRequest): Promise<EntityData> {
  try {
    const response = await axiosClient.get<EntityData>(`/api/entities/${request.id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch entity: ${request.id}`, error);
    throw error; // Service 層でキャッチする
  }
}
```

**原則**: Client 層では基本的に catch せずに throw（Service 層でハンドリング）

---

## チェックリスト (Phase 3)

### S3-1: BFF Client 層実装

- [ ] 対象機能の `bff/src/features/{domain}/{feature-path}/` 配下に `*.client.ts` を作成している
- [ ] クラス名は PascalCase（例: `ClinicalEntryClient`）
- [ ] `@Injectable()` デコレーターを付与している
- [ ] `axiosClient` を `@shared/plugins/bffAxiosClient` からインポートしている
- [ ] 全メソッドで `axiosClient.get/post/put/delete` を使用している
- [ ] BE エンドポイント（`/api/*` または `/clinical/*`）を呼び出している
- [ ] モックデータをハードコードしていない（BE がモックでも HTTP 経由で呼ぶ）
- [ ] 型定義を `./types/*.type.ts` からインポートしている
- [ ] 各メソッドに console.log でリクエスト内容を出力している
- [ ] エラーは基本的に throw（Service 層でハンドリング）

---

## 実装の流れ（まとめ）

```
Phase 3 開始
  ↓
S3-1: BFF Client 層実装
  - {feature-name}.client.ts 作成
  - @Injectable() デコレーター付与
  - axiosClient で BE エンドポイント呼び出し
  - モックデータ禁止（HTTP 経由で BE を呼ぶ）
  - 型定義を types/ からインポート
  ↓
Phase 3 完了
```

---

## 参照ファイル

| ファイル | 内容 |
|---------|------|
| `product/bff/src/shared/plugins/bffAxiosClient.ts` | bffAxiosClient 実体 |
| `product/bff/src/features/sample/diagnosis/record-management/clinical-entry/clinical-entry.client.ts` | Client 実装例 |
| `.claude/commands/synchronizer.md` | synchronizer 全体ワークフロー |
| `.claude/rules/cross-layer-rules.md` | 3層横断の禁止事項 |
| `.claude/commands/bff_structure.md` | BFF 実装の構造ルール |
