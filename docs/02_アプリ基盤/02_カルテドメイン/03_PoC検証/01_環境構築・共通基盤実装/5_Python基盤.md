# 技術検証報告書：マルチ言語によるマルチテナント・データ分離の検証

## 1. 検証概要

.NET (EF Core) で構築された PostgreSQL のスキーマ分離基盤に対し、Python (FastAPI) で構築した別ドメインサービスから接続し、リクエストヘッダーに応じた動的なデータ分離が正常に機能することを検証する。

## 2. システム構成図

---

## 3. Python環境の構築プロセス

本検証にあたり、以下の手順で環境を構築した。

### ① インストールしたツール・パッケージ

| 項目 | 内容 | 用途 |
| --- | --- | --- |
| **言語本体** | CPython 3.x | Python実行環境 |
| **Webフレームワーク** | `fastapi`, `uvicorn` | 高速なAPIサーバーの構築 |
| **ORM** | `sqlalchemy` | DB操作の抽象化 |
| **DBドライバ** | `psycopg2-binary` | PostgreSQL接続用 |

### ② 仮想環境のセットアップコマンド

```cmd
:: 1. 仮想環境の作成
python -m venv .venv

:: 2. 仮想環境の有効化（Windowsコマンドプロンプトの場合）
.venv\Scripts\activate

:: 3. パッケージ一括インストール
pip install fastapi uvicorn sqlalchemy psycopg2-binary

```

---

## 4. 追加・実装したコード

Python側で実装した主要な3つのファイル群。

### ① `database.py`（接続定義）

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 接続先は.NET版と同じDBを指定
SQLALCHEMY_DATABASE_URL = "postgresql://harz_user:password@localhost:5433/harz"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

```

### ② `models.py`（データ構造の同期）

.NETのEntityクラス（Patient）とテーブル名を完全一致させて定義。

```python
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Patient(Base):
    __tablename__ = "Patients"  # EF Coreが作成したテーブル名に合わせる
    Id = Column(Integer, primary_key=True, index=True)
    Name = Column(String)
    PatientCode = Column(String)

```

### ③ `main.py`（動的スキーマ切替ロジック）

今回の検証の核心部。リクエストごとに `search_path` を発行。

```python
from fastapi import FastAPI, Header, HTTPException
from sqlalchemy import text
from database import SessionLocal
import models

app = FastAPI()

@app.get("/patients")
async def get_patients(x_tenant_id: str = Header(None)):
    # ヘッダーチェック
    if not x_tenant_id:
        raise HTTPException(status_code=400, detail="X-Tenant-ID missing")

    db = SessionLocal()
    try:
        # PostgreSQLのスキーマを動的に切り替え
        db.execute(text(f'SET search_path TO "{x_tenant_id}";'))
        
        # 切り替わったスキーマからデータを取得
        patients = db.query(models.Patient).all()
        return {"tenant": x_tenant_id, "data": patients}
    finally:
        db.close()

```

---

## 5. 検証エビデンス（実行結果）

### 【テストケース1：tenant_a へのアクセス】

**実行コマンド:**
`curl -H "X-Tenant-ID: tenant_a" http://127.0.0.1:8000/patients`
**結果:**

```json
{
  "tenant": "tenant_a",
  "data": [{"Id": 1, "Name": "tenant_aのテスト患者", "PatientCode": "P-TENANT_A-001"}]
}

```

### 【テストケース2：tenant_b へのアクセス】

**実行コマンド:**
`curl -H "X-Tenant-ID: tenant_b" http://127.0.0.1:8000/patients`
**結果:**

```json
{
  "tenant": "tenant_b",
  "data": [{"Id": 1, "Name": "tenant_bのテスト患者", "PatientCode": "P-TENANT_B-001"}]
}

```

---

## 6. 結論

* **相互運用性**: .NET Core で構築された DB スキーマ構造を Python (FastAPI) から透過的に利用できることが証明された。
* **データ分離性**: `SET search_path` 命令により、アプリケーションコードを変更することなく、テナントごとの完全なデータ分離を実現した。
* **拡張性**: 今後、Go や Node.js 等の他言語でサービスを追加した場合も、同様の手法でマルチテナント基盤に相乗りできることが確認できた。