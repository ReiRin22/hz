import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, Headers, Inject } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PatientService } from '@/features/patient/patient.service';

@Controller('patient')
export class PatientController {
  constructor(@Inject(PatientService) private readonly patientService: PatientService) {}

  @Get(':id')
  async getPatient(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantId: string
  ) {
    console.log(`Received request for patient ID: ${id} with Tenant ID: ${tenantId}`);
    return await this.patientService.getPatientDetail(id, tenantId);
  }

  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('file')) // フロントの FormData key名 'file'
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Headers('x-tenant-id') tenantId: string
  ) {
    console.log(file);
    return await this.patientService.uploadPhoto(id, file, tenantId);
  }
}