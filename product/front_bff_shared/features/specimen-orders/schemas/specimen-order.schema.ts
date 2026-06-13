import { z } from "zod";

export const SpecimenTypeSchema = z.enum(["blood", "urine", "stool", "other"]);

export const OrderPrioritySchema = z.enum(["normal", "urgent"]);

export const SpecimenOrderFormItemSchema = z.object({
  id: z.string().min(1),
  specimenType: SpecimenTypeSchema,
  orderCode: z.string().min(1),
  testName: z.string().min(1),
  category: z.string().optional(),
  quantity: z.number().optional(),
  priority: OrderPrioritySchema.optional(),
  clinicalPurpose: z.string().optional(),
  specialInstructions: z.string().optional(),
  scheduledDate: z.string().optional(),
});
