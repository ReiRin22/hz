import { z } from 'zod';

export const PostPatientIdCheckCompleteSchema = z.object({
  orderId: z.string().min(1),
  patientBarcodeRead: z.string().optional(),
  itemBarcodeRead: z.string().optional(),
  practitionerBarcodeRead: z.string().optional(),
  patientVisualConfirmed: z.boolean().optional(),
  patientConfirmer: z.enum(['PERSON', 'PROXY', 'TWO_STAFF', 'OTHER']),
  patientConfirmReason: z
    .object({
      presetCode: z.string().optional(),
      customText: z.string().optional(),
    })
    .optional(),
  itemVisualConfirmed: z.boolean().optional(),
  manualPractitionerId: z.string().optional(),
  checkedBy: z.string().min(1),
  completedAt: z.string().datetime({ offset: true }),
});

export const PostPatientConfirmReasonSchema = z.object({
  orderId: z.string().min(1),
  presetCode: z.string().optional(),
  customText: z.string().optional(),
  savedBy: z.string().min(1),
  timestamp: z.string().datetime({ offset: true }),
});

export type PostPatientIdCheckCompleteInput = z.infer<typeof PostPatientIdCheckCompleteSchema>;
export type PostPatientConfirmReasonInput = z.infer<typeof PostPatientConfirmReasonSchema>;
