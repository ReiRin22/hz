import { z } from 'zod';

export const UpdateDeptInstructionStatusSchema = z.object({
  orderId: z.string().min(1),
  newStatus: z.string().min(1),
  updatedBy: z.string().min(1),
  timestamp: z.string().min(1),
});

export const PostThreePointCheckSchema = z.object({
  orderId: z.string().min(1),
  patientConfirmed: z.boolean(),
  orderConfirmed: z.boolean(),
  allergyConfirmed: z.boolean(),
  checkedBy: z.string().min(1),
  timestamp: z.string().min(1),
});

export const PostImplementerSchema = z.object({
  orderId: z.string().min(1),
  implementer: z.string().min(1),
  witness: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  implementedAt: z.string().min(1),
  reason: z.string().optional(),
});

export const PostBillingLinkSchema = z.object({
  orderId: z.string().min(1),
  triggerStatus: z.string().min(1),
  timestamp: z.string().min(1),
});

export type UpdateDeptInstructionStatusInput = z.infer<typeof UpdateDeptInstructionStatusSchema>;
export type PostThreePointCheckInput = z.infer<typeof PostThreePointCheckSchema>;
export type PostImplementerInput = z.infer<typeof PostImplementerSchema>;
export type PostBillingLinkInput = z.infer<typeof PostBillingLinkSchema>;
