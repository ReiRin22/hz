import { Injectable, Inject } from "@nestjs/common";
import { ReceptionPatientsClient } from "./reception-patients.client";
import { UpstreamReceptionPatient } from "./types/reception-patients.type";
import {
  ReceptionPatientResponse,
  GetReceptionPatientsResponse,
} from "./types/reception-patients.api.response";

@Injectable()
export class ReceptionPatientsService {
  constructor(
    @Inject(ReceptionPatientsClient)
    private readonly receptionPatientsClient: ReceptionPatientsClient,
  ) {}

  async getReceptionPatients(date: string): Promise<GetReceptionPatientsResponse> {
    const upstream = await this.receptionPatientsClient.fetchReceptionPatients(date);
    const patients = upstream.map((p) => ({ ...this.transform(p), date }));
    const { consulted, recepted } = patients.reduce(
      (acc, p) => {
        if (p.status.consultation === true) acc.consulted++;
        // NOTE: isReservation は「予約のみ・未来院」を表す固定フラグ。来院済みの患者は receptionTime が設定されており isReservation は false になる。
      if (p.receptionTime && !p.isReservation) acc.recepted++;
        return acc;
      },
      { consulted: 0, recepted: 0 },
    );
    // TODO: 上流 API 連携時は departmentId / doctorIds フィルタを適用したカウントに変更する。
    // 現時点ではフロントエンド側（computeStats）でフィルタ適用後の stats を再計算している。
    return {
      patients,
      stats: { consulted, recepted, target: patients.length },
    };
  }

  private transform(upstream: UpstreamReceptionPatient): Omit<ReceptionPatientResponse, "date"> {
    return {
      id: upstream.id,
      category: upstream.category,
      type: upstream.type,
      receptionTime: upstream.receptionTime,
      appointmentSlot: upstream.appointmentSlot,
      patientId: upstream.patientId,
      name: upstream.name,
      kana: upstream.kana,
      birthDate: upstream.birthDate,
      gender: upstream.gender,
      age: upstream.age,
      medicalCategory: upstream.medicalCategory,
      memo: upstream.memo,
      multiDepartment: upstream.multiDepartment,
      remarks: upstream.remarks,
      status: {
        consultation: upstream.status.consultation,
        prescription: upstream.status.prescription,
        injection: upstream.status.injection,
        treatment: upstream.status.treatment,
        specimen: upstream.status.specimen,
        bacteria: upstream.status.bacteria,
        pathology: upstream.status.pathology,
        physiology: upstream.status.physiology,
        endoscopy: upstream.status.endoscopy,
        imaging: upstream.status.imaging,
        rehabilitation: upstream.status.rehabilitation,
        dialysis: upstream.status.dialysis,
        surgery: upstream.status.surgery,
        guidance: upstream.status.guidance,
      },
      paymentComplete: upstream.paymentComplete,
      consultationComplete: upstream.consultationComplete,
      isReservation: upstream.isReservation,
      doctorId: upstream.doctorId,
      departmentId: upstream.departmentId,
    };
  }
}
