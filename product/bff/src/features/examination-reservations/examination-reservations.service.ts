import { Injectable, Inject } from '@nestjs/common';
import { ExaminationReservationsClient } from './examination-reservations.client';
import type {
  UpstreamExaminationReservation,
  UpstreamExaminationEquipment,
} from './types/examination-reservations.type';
import type {
  ExaminationReservationResponse,
  ExaminationEquipmentResponse,
  GetExaminationReservationsResponse,
  GetExaminationEquipmentResponse,
  CreateExaminationReservationResponse,
  UpdateExaminationReservationResponse,
} from './types/examination-reservations.api.response';
import type {
  CreateExaminationReservationRequest,
  UpdateExaminationReservationRequest,
} from './types/examination-reservations.api.request';

@Injectable()
export class ExaminationReservationsService {
  constructor(
    @Inject(ExaminationReservationsClient)
    private readonly examinationReservationsClient: ExaminationReservationsClient,
  ) {}

  async getReservations(
    equipmentId?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<GetExaminationReservationsResponse> {
    const upstream = await this.examinationReservationsClient.fetchReservations();
    const filtered = upstream.filter((r) => {
      if (equipmentId && r.equipmentId !== equipmentId) return false;
      if (r.date === '未定') return false;
      if (startDate && r.date < startDate) return false;
      if (endDate && r.date > endDate) return false;
      return true;
    });
    return { reservations: filtered.map((r) => this.transformReservation(r)) };
  }

  async getPatientReservations(
    patientId: string,
  ): Promise<GetExaminationReservationsResponse> {
    const upstream =
      await this.examinationReservationsClient.fetchPatientReservations(patientId);
    return { reservations: upstream.map((r) => this.transformReservation(r)) };
  }

  async createReservation(
    patientId: string,
    body: CreateExaminationReservationRequest,
  ): Promise<CreateExaminationReservationResponse> {
    const upstream = await this.examinationReservationsClient.createReservation(
      patientId,
      body,
    );
    return { reservation: this.transformReservation(upstream) };
  }

  async updateReservation(
    patientId: string,
    reservationId: string,
    body: UpdateExaminationReservationRequest,
  ): Promise<UpdateExaminationReservationResponse> {
    const upstream = await this.examinationReservationsClient.updateReservation(
      patientId,
      reservationId,
      body,
    );
    return { reservation: this.transformReservation(upstream) };
  }

  async getEquipment(): Promise<GetExaminationEquipmentResponse> {
    const upstream = await this.examinationReservationsClient.fetchEquipment();
    return { equipment: upstream.map((e) => this.transformEquipment(e)) };
  }

  private transformReservation(
    upstream: UpstreamExaminationReservation,
  ): ExaminationReservationResponse {
    return {
      id: upstream.reservationId,
      patientId: upstream.patientId,
      patientName: upstream.patientName,
      examType: upstream.examType,
      startTime: upstream.startTime,
      endTime: upstream.endTime,
      date: upstream.date,
      equipment: upstream.equipmentId,
      status: upstream.status,
      ...(upstream.notes !== undefined && { notes: upstream.notes }),
      ...(upstream.doctorId !== undefined && { doctorId: upstream.doctorId }),
      ...(upstream.doctorName !== undefined && { doctorName: upstream.doctorName }),
      ...(upstream.checkedIn !== undefined && { checkedIn: upstream.checkedIn }),
    };
  }

  private transformEquipment(
    upstream: UpstreamExaminationEquipment,
  ): ExaminationEquipmentResponse {
    return {
      id: upstream.equipmentId,
      name: upstream.equipmentName,
      type: upstream.equipmentType,
      capacity: upstream.slotCapacity,
    };
  }
}
