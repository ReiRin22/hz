from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Patient(Base):
    __tablename__ = "Patients" # 大文字小文字は .NET 側に合わせます
    
    Id = Column(Integer, primary_key=True, index=True)
    Name = Column(String)
    PatientCode = Column(String)


# 薬品モデル
class Drug(Base):
    __tablename__ = "Drugs"

    Id = Column(Integer, primary_key=True, index=True)
    Code = Column(String, unique=True, index=True)
    Name = Column(String)


# 診察クラス
class Consultation:
    def __init__(self, patient_id: int):
        self.patient_id = patient_id
        self.prescriptions = []  # 処方リスト

    def add_prescription(self, prescription):
        # prescription は Prescription インスタンスで、drug 属性を持つ想定
        if not hasattr(prescription, "drug") or not hasattr(prescription.drug, "Code"):
            raise ValueError("処方は有効な Drug を参照している必要があります。")

        if self.is_duplicate_medicine(prescription.drug.Code):
            raise ValueError(f"薬品 '{prescription.drug.Name}' (Code={prescription.drug.Code}) はすでに追加されています。")
        self.prescriptions.append(prescription)

    def is_duplicate_medicine(self, drug_code: str) -> bool:
        return any(getattr(p, "drug", None) is not None and getattr(p.drug, "Code", None) == drug_code for p in self.prescriptions)


# 処方クラス
class Prescription:
    def __init__(self, drug: Drug, dose: str, days: int):
        # drug は Drug のインスタンス（DBから取得したものや新規インスタンス）
        self.drug = drug
        self.dose = dose  # 用量
        self.days = days  # 日数