import { z } from 'zod';

const orderTypeSchema = z.enum([
  'prescription', 'injection', 'procedure', 'guidance', 'lab',
  'physiology', 'endoscopy', 'imaging', 'pathology', 'microbiology',
  'general', 'rehabilitation', 'transfusion', 'surgery', 'dialysis',
  'nutrition', 'respiratory', 'bed', 'surgeryProcedure', 'neonatal', 'physicalTherapy'
]);

const orderEntryItemSchema = z.object({
  itemId: z.string(),
  name: z.string().min(1),
  dosage: z.string().optional(),
  usage: z.string().optional(),
  quantity: z.string().optional(),
  frequency: z.string().optional(),
  timing: z.string().optional(),
  route: z.string().optional(),
  period: z.string().optional(),
  startDate: z.string().optional(),
  notes: z.string().optional(),
  rpNumber: z.number().int().positive().optional(),
  groupId: z.string().optional(),
  groupName: z.string().optional(),
  orderType: orderTypeSchema,
});

export const postOrderEntrySchema = z.object({
  patientId: z.string().min(1),
  orderType: orderTypeSchema,
  orders: z.array(orderEntryItemSchema).min(1),
  confirmedBy: z.string().min(1),
});

export const getOrderHistorySchema = z.object({
  patientId: z.string().min(1),
  orderType: orderTypeSchema.optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export const getOrderSetsSchema = z.object({
  patientId: z.string().optional(),
  orderType: orderTypeSchema.optional(),
});

export const searchDrugsSchema = z.object({
  query: z.string().min(1),
  orderType: orderTypeSchema.optional(),
  limit: z.number().int().positive().max(50).optional(),
});

export const saveTemporaryOrderSchema = z.object({
  patientId: z.string().min(1),
  name: z.string().min(1).max(50),
  orders: z.array(orderEntryItemSchema),
  nextRpNumber: z.number().int().positive(),
});

export type PostOrderEntryInput = z.infer<typeof postOrderEntrySchema>;
export type GetOrderHistoryInput = z.infer<typeof getOrderHistorySchema>;
export type GetOrderSetsInput = z.infer<typeof getOrderSetsSchema>;
export type SearchDrugsInput = z.infer<typeof searchDrugsSchema>;
export type SaveTemporaryOrderInput = z.infer<typeof saveTemporaryOrderSchema>;
