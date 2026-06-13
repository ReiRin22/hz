from fastapi import FastAPI, Header, HTTPException, Depends
from sqlalchemy import text
from database import SessionLocal
import models

app = FastAPI()

@app.get("/patients")
async def get_patients(x_tenant_id: str = Header(None)):
    if not x_tenant_id:
        raise HTTPException(status_code=400, detail="X-Tenant-ID header is missing")

    db = SessionLocal()
    try:
        # 1. スキーマ（search_path）を動的に切り替え
        # これにより、以降のクエリは指定したスキーマのテーブルを見に行く
        db.execute(text(f'SET search_path TO "{x_tenant_id}";'))
        
        # 2. 患者一覧を取得
        patients = db.query(models.Patient).all()
        
        return {
            "tenant": x_tenant_id,
            "data": patients
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()