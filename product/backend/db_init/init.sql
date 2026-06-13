CREATE SCHEMA IF NOT EXISTS tenant_a;
CREATE SCHEMA IF NOT EXISTS tenant_b;

-- ============================================================
-- 薬剤マスタ (MDrugs)
-- ============================================================

create table tenant_a."MDrugs" (
  "DrugId"     text not null
  , "Name"     text not null
  , "Price"    numeric not null
  , "Category" text not null
  , "IsActive" boolean not null default true
  , constraint MDrugs_PKC primary key ("DrugId")
);

create table tenant_b."MDrugs" (
  "DrugId"     text not null
  , "Name"     text not null
  , "Price"    numeric not null
  , "Category" text not null
  , "IsActive" boolean not null default true
  , constraint MDrugs_PKC primary key ("DrugId")
);

insert into tenant_a."MDrugs"("DrugId","Name","Price","Category","IsActive") values
    ('DRG-001', 'アモキシシリンカプセル', 12.5, '抗生剤', true)
  , ('DRG-002', 'ロキソプロフェン錠',     8.0,  '鎮痛剤', true);

insert into tenant_b."MDrugs"("DrugId","Name","Price","Category","IsActive") values
    ('DRG-001', 'アモキシシリンカプセル', 12.5, '抗生剤', true)
  , ('DRG-002', 'ロキソプロフェン錠',     8.0,  '鎮痛剤', true);

-- ============================================================
-- 血液型マスタ (MBloodTypes)
-- ============================================================

create table tenant_a."MBloodTypes" (
  "Id"          serial not null
  , "Value"     text not null
  , "Label"     text not null
  , "SortOrder" integer not null default 0
  , constraint MBloodTypes_PKC primary key ("Id")
);

create table tenant_b."MBloodTypes" (
  "Id"          serial not null
  , "Value"     text not null
  , "Label"     text not null
  , "SortOrder" integer not null default 0
  , constraint MBloodTypes_PKC primary key ("Id")
);

insert into tenant_a."MBloodTypes"("Value","Label","SortOrder") values
    ('A',  'A型',  1)
  , ('B',  'B型',  2)
  , ('O',  'O型',  3)
  , ('AB', 'AB型', 4);

insert into tenant_b."MBloodTypes"("Value","Label","SortOrder") values
    ('A',  'A型',  1)
  , ('B',  'B型',  2)
  , ('O',  'O型',  3)
  , ('AB', 'AB型', 4);

-- ============================================================
-- Rh因子マスタ (MRhFactors)
-- ============================================================

create table tenant_a."MRhFactors" (
  "Id"          serial not null
  , "Value"     text not null
  , "Label"     text not null
  , "SortOrder" integer not null default 0
  , constraint MRhFactors_PKC primary key ("Id")
);

create table tenant_b."MRhFactors" (
  "Id"          serial not null
  , "Value"     text not null
  , "Label"     text not null
  , "SortOrder" integer not null default 0
  , constraint MRhFactors_PKC primary key ("Id")
);

insert into tenant_a."MRhFactors"("Value","Label","SortOrder") values
    ('positive', '陽性(+)', 1)
  , ('negative', '陰性(-)', 2);

insert into tenant_b."MRhFactors"("Value","Label","SortOrder") values
    ('positive', '陽性(+)', 1)
  , ('negative', '陰性(-)', 2);

-- ============================================================
-- 主訴・所見 (TChiefComplaints)
-- ============================================================

create table tenant_a."TChiefComplaints" (
  "Id"          serial not null
  , "PatientId" text not null
  , "Text"      text not null
  , "RecordedAt" timestamp with time zone not null default now()
  , constraint TChiefComplaints_PKC primary key ("Id")
);

create table tenant_b."TChiefComplaints" (
  "Id"          serial not null
  , "PatientId" text not null
  , "Text"      text not null
  , "RecordedAt" timestamp with time zone not null default now()
  , constraint TChiefComplaints_PKC primary key ("Id")
);

insert into tenant_a."TChiefComplaints"("PatientId","Text","RecordedAt") values
    ('P-TENANT_A-001', '頭痛・発熱が続いている。倦怠感あり。', TIMESTAMP WITH TIME ZONE '2026-04-01 09:00:00+00');

insert into tenant_b."TChiefComplaints"("PatientId","Text","RecordedAt") values
    ('P-TENANT_B-001', '頭痛・発熱が続いている。倦怠感あり。', TIMESTAMP WITH TIME ZONE '2026-04-01 09:00:00+00');

-- ============================================================
-- バイタル情報 (TVitalInfos)
-- ============================================================

create table tenant_a."TVitalInfos" (
  "Id"              serial not null
  , "PatientId"     text not null
  , "BloodPressure" text
  , "BloodType"     text
  , "RhFactor"      text
  , "RecordedAt"    timestamp with time zone not null default now()
  , constraint TVitalInfos_PKC primary key ("Id")
);

create table tenant_b."TVitalInfos" (
  "Id"              serial not null
  , "PatientId"     text not null
  , "BloodPressure" text
  , "BloodType"     text
  , "RhFactor"      text
  , "RecordedAt"    timestamp with time zone not null default now()
  , constraint TVitalInfos_PKC primary key ("Id")
);

insert into tenant_a."TVitalInfos"("PatientId","BloodPressure","BloodType","RhFactor","RecordedAt") values
    ('P-TENANT_A-001', '120/80', 'A', 'positive', TIMESTAMP WITH TIME ZONE '2026-04-01 09:00:00+00');

insert into tenant_b."TVitalInfos"("PatientId","BloodPressure","BloodType","RhFactor","RecordedAt") values
    ('P-TENANT_B-001', '120/80', 'A', 'positive', TIMESTAMP WITH TIME ZONE '2026-04-01 09:00:00+00');

-- ============================================================
-- 処方オーダー (TPrescriptionOrders)
-- ============================================================

create table tenant_a."TPrescriptionOrders" (
  "OrderId"     text not null
  , "PatientId" text not null
  , "DrugId"    text not null
  , "Frequency" text not null
  , "Timing"    text not null
  , "Duration"  text not null
  , "OrderedAt" timestamp with time zone not null default now()
  , constraint TPrescriptionOrders_PKC primary key ("OrderId")
  , constraint TPrescriptionOrders_Drug_FK foreign key ("DrugId") references tenant_a."MDrugs"("DrugId")
);

create table tenant_b."TPrescriptionOrders" (
  "OrderId"     text not null
  , "PatientId" text not null
  , "DrugId"    text not null
  , "Frequency" text not null
  , "Timing"    text not null
  , "Duration"  text not null
  , "OrderedAt" timestamp with time zone not null default now()
  , constraint TPrescriptionOrders_PKC primary key ("OrderId")
  , constraint TPrescriptionOrders_Drug_FK foreign key ("DrugId") references tenant_b."MDrugs"("DrugId")
);

insert into tenant_a."TPrescriptionOrders"("OrderId","PatientId","DrugId","Frequency","Timing","Duration","OrderedAt") values
    ('ORD-001', 'P-TENANT_A-001', 'DRG-001', '1日3回', '食後', '7日間', TIMESTAMP WITH TIME ZONE '2026-04-01 09:00:00+00')
  , ('ORD-002', 'P-TENANT_A-001', 'DRG-002', '1日3回', '食後', '5日間', TIMESTAMP WITH TIME ZONE '2026-04-01 09:00:00+00');

insert into tenant_b."TPrescriptionOrders"("OrderId","PatientId","DrugId","Frequency","Timing","Duration","OrderedAt") values
    ('ORD-001', 'P-TENANT_B-001', 'DRG-001', '1日3回', '食後', '7日間', TIMESTAMP WITH TIME ZONE '2026-04-01 09:00:00+00')
  , ('ORD-002', 'P-TENANT_B-001', 'DRG-002', '1日3回', '食後', '5日間', TIMESTAMP WITH TIME ZONE '2026-04-01 09:00:00+00');
