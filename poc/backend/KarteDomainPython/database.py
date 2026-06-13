from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# ポートやパスワードはご自身の環境（PostgreSQLの設定）に合わせてください
SQLALCHEMY_DATABASE_URL = "postgresql://harz_user:password@localhost:5433/harz"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)