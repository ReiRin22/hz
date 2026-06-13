import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from '@/features/ui-common/menu-header/login/auth.module';
import { UserModule } from '@/features/ui-common/menu-header/user-header/user.module';
import { KarteModule } from '@/features/karte/karte.module';
import { PatientModule } from '@/features/patient/patient.module';
import { PatientsModule } from '@/features/patients/patients.module';
import { OrdersModule } from '@/features/orders/orders.module';
import { StaffModule } from '@/features/staff/staff.module';
import { MedicalFormsModule } from '@/features/medical-forms/medical-forms.module';
import { ClinicalRecordsModule } from '@/features/diagnosis/diagnosisRecord/recordInput/clinical-records.module';
import { OrderSetsModule } from '@/features/order-sets/order-sets.module';
import { MemosModule } from '@/features/memos/memos.module';
import { BulletinsModule } from '@/features/bulletins/bulletins.module';
import { DepartmentsModule } from '@/features/departments/departments.module';
import { ImagingOrdersModule } from '@/features/imaging-orders/imaging-orders.module';
import { SpecimenOrdersModule } from '@/features/specimen-orders/specimen-orders.module';
import { CurrentUserModule } from '@/features/current-user/current-user.module';
import { ExaminationReservationsModule } from '@/features/examination-reservations/examination-reservations.module';
import { ReceptionPatientsModule } from '@/features/reception/receptionPatientList/reception-patients.module';
import { DecryptionMiddleware } from '@shared/plugins/decryption.middleware';
import { ClinicalEntryModule } from '@/features/sample/diagnosis/record-management/clinical-entry/clinical-entry.module';
import { BloodTypeMasterModule } from '@shared/sample/master/blood-type-master.module';
import { TestErrorModule } from '@/features/test-error/test-error.module';
import { MenuModule } from '@/features/menu/menu.module';
import { RightSideMenuModule } from '@/features/ui-common/menu-header/right-sidemenu/right-side-menu.module';
import { TestItemMasterModule } from '@shared/master/test-item-master/test-item-master.module';
import { TestResultsModule } from '@/features/execution/test-results/test-results.module';
import { OrderConfirmationModule } from '@/features/orders/orderConfirmed/orderConfirmation/order-confirmation.module';
import { DeptInstructionModule } from '@/features/dept-instruction/lab-instruction/dept-instruction.module';
import { PatientIdCheckModule } from '@/features/dept-instruction/patient-id-check/patient-id-check.module';
import { RecordInputModule } from '@/features/diagnosis/diagnosisRecord/recordInput/record-input.module';

@Module({
  imports: [
    AuthModule,
    CurrentUserModule,
    UserModule,
    KarteModule,
    PatientModule,
    PatientsModule,
    OrdersModule,
    OrderSetsModule,
    StaffModule,
    MedicalFormsModule,
    ClinicalRecordsModule,
    MemosModule,
    BulletinsModule,
    DepartmentsModule,
    ImagingOrdersModule,
    SpecimenOrdersModule,
    ExaminationReservationsModule,
    ReceptionPatientsModule,
    ClinicalEntryModule,
    BloodTypeMasterModule,
    TestErrorModule,
    MenuModule,
    RightSideMenuModule,
    TestItemMasterModule,
    TestResultsModule,
    OrderConfirmationModule,
    DeptInstructionModule,
    PatientIdCheckModule,
    RecordInputModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecryptionMiddleware)
      .forRoutes('*'); // 全てのルートに適用（必要に応じて特定のパスに絞れます）
  }
}