import { Injectable, Inject } from "@nestjs/common";
import { PatientsClient } from "./patients.client";
import type { UpstreamPatient, UpstreamPatientInfo } from "./types/patients.type";
import type { PatientResponse, GetPatientInfoResponse, PatientInfoResponse, GetPatientHeaderResponse, PatientHeaderResponse } from "./types/patients.api.response";

@Injectable()
export class PatientsService {
  constructor(@Inject(PatientsClient) private readonly patientsClient: PatientsClient) {}

  async getPatient(patientId: string): Promise<PatientResponse> {
    const upstream = await this.patientsClient.fetchPatient(patientId);
    return this.transform(upstream);
  }

  async getPatientInfo(patientId: string): Promise<GetPatientInfoResponse> {
    const upstream = await this.patientsClient.fetchPatientInfo(patientId);
    return { patientInfo: this.transformPatientInfo(upstream) };
  }

  private transformPatientInfo(upstream: UpstreamPatientInfo): PatientInfoResponse {
    // NOTE: UpstreamPatientInfo と PatientInfoResponse は現時点で同一構造。
    // 上流 API 実装後にフィールド名が diverge した場合に備えて明示的にマッピングする。
    return {
      basicInfo: { ...upstream.basicInfo },
      allergyHistory: {
        allergies: upstream.allergyHistory.allergies.map((r) => ({ ...r })),
        medicalHistories: upstream.allergyHistory.medicalHistories.map((r) => ({ ...r })),
        surgeries: upstream.allergyHistory.surgeries.map((r) => ({ ...r })),
      },
      vaccinations: upstream.vaccinations.map((r) => ({ ...r })),
      familyInfo: {
        familyMembers: upstream.familyInfo.familyMembers.map((r) => ({ ...r })),
        guarantor: { ...upstream.familyInfo.guarantor },
      },
      infections: upstream.infections.map((r) => ({ ...r })),
      implantDevices: {
        pacemakers: upstream.implantDevices.pacemakers.map((r) => ({ ...r })),
        aneurysmClips: upstream.implantDevices.aneurysmClips.map((r) => ({ ...r })),
        metalImplants: upstream.implantDevices.metalImplants.map((r) => ({ ...r })),
      },
      lifestyle: { ...upstream.lifestyle },
      medicalMemos: upstream.medicalMemos.map((r) => ({ ...r })),
      philosophies: upstream.philosophies.map((r) => ({ ...r })),
      accessControl: {
        vipSetting: { ...upstream.accessControl.vipSetting },
        userAccesses: upstream.accessControl.userAccesses.map((r) => ({ ...r })),
      },
    };
  }

  async getPatientHeader(patientId: string): Promise<GetPatientHeaderResponse> {
    const [upstream, info] = await Promise.all([
      this.patientsClient.fetchPatient(patientId),
      this.patientsClient.fetchPatientInfo(patientId),
    ]);
    return { patientHeader: this.transformHeader(upstream, info) };
  }

  private calcAge(birthDateStr: string | null | undefined): number {
    if (!birthDateStr) return 0;
    const birthDate = new Date(birthDateStr);
    return Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  }

  private transformHeader(upstream: UpstreamPatient, info: UpstreamPatientInfo): PatientHeaderResponse {
    const age = this.calcAge(info.basicInfo.birthDate);

    return {
      patientId: info.basicInfo.patientId,
      name: info.basicInfo.name,
      nameKana: info.basicInfo.nameKana,
      birthDate: info.basicInfo.birthDate,
      age,
      gender: info.basicInfo.gender,
      ward: info.basicInfo.ward,
      room: info.basicInfo.room,
      // TODO: 上流 API（患者マスタ）実装後に削除
      department: '内科',
      // TODO: 上流 API（患者マスタ）実装後に削除
      doctor: '鈴木 次郎',
      // TODO: 上流 API（入院管理）実装後に削除
      admissionType: 'inpatient',
      // TODO: 上流 API（診察管理）実装後に削除
      consultationStatus: 'waiting',
      // TODO: 上流 API（処方箋管理）実装後に削除
      prescriptionStatus: 'electronic',
      // TODO: 上流 API（情報共有管理）実装後に削除
      medicalInfoSharing: { status: 'full-consent' },
      // TODO: 上流 API（保険管理）実装後に削除
      insurance: { type: '社保', number: '', burden: '3割' },
      allergies: (upstream.allergyList ?? []).map((a) => a.name),
      infections: info.infections
        .filter((i) => i.result === 'positive')
        .map((i) => i.infectionName),
    };
  }

  private transform(upstream: UpstreamPatient): PatientResponse {
    const ELDERLY_AGE_THRESHOLD = 65;
    const ageYears = this.calcAge(upstream.birthDate);

    return {
      id: upstream.patientId,
      name: upstream.patientName,
      allergies: (upstream.allergyList ?? []).map((a) => a.name),
      conditions: {
        pregnancy: upstream.conditions?.pregnancyFlag ?? false,
        renalImpairment: upstream.conditions?.renalImpairmentFlag ?? false,
        hepaticImpairment: upstream.conditions?.hepaticImpairmentFlag ?? false,
        elderly: ageYears >= ELDERLY_AGE_THRESHOLD,
      },
      renalFunction: {
        ccr: upstream.renalFunction?.ccrValue ?? 0,
      },
    };
  }
}
