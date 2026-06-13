import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  PipeTransform,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ExaminationReservationsService } from './examination-reservations.service';
import type {
  GetExaminationReservationsResponse,
  GetExaminationEquipmentResponse,
  CreateExaminationReservationResponse,
  UpdateExaminationReservationResponse,
} from './types/examination-reservations.api.response';
import type {
  CreateExaminationReservationRequest,
  UpdateExaminationReservationRequest,
} from './types/examination-reservations.api.request';

/** YYYY-MM-DD 形式のクエリパラメータを検証するパイプ */
class ParseDatePipe implements PipeTransform {
  transform(value: unknown): string | undefined {
    if (value === undefined) return undefined;
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException(`Invalid date format: "${value}". Expected YYYY-MM-DD.`);
    }
    return value;
  }
}

/** GET /bff/examinationReservations, GET /bff/examinationEquipment */
@Controller('examination-reservations')
export class ExaminationReservationsController {
  constructor(
    @Inject(ExaminationReservationsService)
    private readonly examinationReservationsService: ExaminationReservationsService,
  ) {}

  /** GET /bff/examinationReservations?equipmentId=...&startDate=...&endDate=... */
  @Get()
  async getReservations(
    @Query('equipmentId') equipmentId?: string,
    @Query('startDate', ParseDatePipe) startDate?: string,
    @Query('endDate', ParseDatePipe) endDate?: string,
  ): Promise<GetExaminationReservationsResponse> {
    return this.examinationReservationsService.getReservations(
      equipmentId,
      startDate,
      endDate,
    );
  }
}

/** GET /bff/examinationEquipment */
@Controller('examination-equipment')
export class ExaminationEquipmentController {
  constructor(
    @Inject(ExaminationReservationsService)
    private readonly examinationReservationsService: ExaminationReservationsService,
  ) {}

  @Get()
  async getEquipment(): Promise<GetExaminationEquipmentResponse> {
    return this.examinationReservationsService.getEquipment();
  }
}

/** CreateExaminationReservationRequest の必須フィールドを検証するパイプ */
class ValidateCreateReservationBodyPipe implements PipeTransform {
  transform(value: unknown): CreateExaminationReservationRequest {
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Request body is required.');
    }
    const body = value as Record<string, unknown>;
    const requiredFields: (keyof CreateExaminationReservationRequest)[] = [
      'patientName', 'examType', 'startTime', 'endTime', 'date', 'equipment', 'doctorId', 'doctorName',
    ];
    for (const field of requiredFields) {
      if (typeof body[field] !== 'string' || body[field] === '') {
        throw new BadRequestException(`Field "${field}" is required and must be a non-empty string.`);
      }
    }
    return body as unknown as CreateExaminationReservationRequest;
  }
}

/** UpdateExaminationReservationRequest の必須フィールドを検証するパイプ */
class ValidateUpdateReservationBodyPipe implements PipeTransform {
  transform(value: unknown): UpdateExaminationReservationRequest {
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Request body is required.');
    }
    const body = value as Record<string, unknown>;
    const requiredFields: (keyof UpdateExaminationReservationRequest)[] = [
      'date', 'startTime', 'endTime',
    ];
    for (const field of requiredFields) {
      if (typeof body[field] !== 'string' || body[field] === '') {
        throw new BadRequestException(`Field "${field}" is required and must be a non-empty string.`);
      }
    }
    return body as unknown as UpdateExaminationReservationRequest;
  }
}

/** GET /bff/patients/:patientId/examinationReservations, POST, PUT */
@Controller('patients/:patientId')
export class PatientExaminationReservationsController {
  constructor(
    @Inject(ExaminationReservationsService)
    private readonly examinationReservationsService: ExaminationReservationsService,
  ) {}

  /** GET /bff/patients/:patientId/examinationReservations */
  @Get('examination-reservations')
  async getPatientReservations(
    @Param('patientId') patientId: string,
  ): Promise<GetExaminationReservationsResponse> {
    return this.examinationReservationsService.getPatientReservations(patientId);
  }

  /** POST /bff/patients/:patientId/examinationReservations */
  @Post('examination-reservations')
  @HttpCode(HttpStatus.CREATED)
  async createReservation(
    @Param('patientId') patientId: string,
    @Body(ValidateCreateReservationBodyPipe) body: CreateExaminationReservationRequest,
  ): Promise<CreateExaminationReservationResponse> {
    return this.examinationReservationsService.createReservation(patientId, body);
  }

  /** PUT /bff/patients/:patientId/examinationReservations/:reservationId */
  @Put('examination-reservations/:reservationId')
  async updateReservation(
    @Param('patientId') patientId: string,
    @Param('reservationId') reservationId: string,
    @Body(ValidateUpdateReservationBodyPipe) body: UpdateExaminationReservationRequest,
  ): Promise<UpdateExaminationReservationResponse> {
    return this.examinationReservationsService.updateReservation(
      patientId,
      reservationId,
      body,
    );
  }
}
