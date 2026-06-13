CREATE SCHEMA IF NOT EXISTS tenant_a;
CREATE SCHEMA IF NOT EXISTS tenant_b;

create table tenant_a."Patients" (
  "Id" integer not null
  , "Name" text not null
  , "PatientCode" text not null
  , "ImagePath" text
  , "CreatedAt" timestamp(6) with time zone not null
  , constraint Patients_PKC primary key ("Id")
) ;

create table tenant_b."Patients" (
  "Id" integer not null
  , "Name" text not null
  , "PatientCode" text not null
  , "ImagePath" text
  , "CreatedAt" timestamp(6) with time zone not null
  , constraint Patients_PKC primary key ("Id")
) ;

insert into tenant_a."Patients"("Id","Name","PatientCode","ImagePath","CreatedAt") values 
    (1,'tenant_aのテスト患者1','P-TENANT_A-001','/uploads/tenant_a/1/face_photo.png',TIMESTAMP '2026-02-19 17:58:48.018')
  , (2,'tenant_aのテスト患者2','P-TENANT_A-002','/uploads/tenant_a/2/face_photo.png',TIMESTAMP '2026-02-13 15:02:05.964');

insert into tenant_b."Patients"("Id","Name","PatientCode","ImagePath","CreatedAt") values 
    (1,'tenant_bのテスト患者1','P-TENANT_B-001',null,TIMESTAMP '2026-02-13 15:02:05.964')
  , (2,'tenant_bのテスト患者2','P-TENANT_B-002',null,TIMESTAMP '2026-02-13 15:02:05.964');
