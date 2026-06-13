import { z } from "zod";

export const OrderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
  "ordered",
  "accepted",
  "in-progress",
  "completed",
]);

export const ConfirmOrdersRequestSchema = z.object({
  patientId: z.string().min(1),
  orderIds: z.array(z.string()).min(1),
  confirmedBy: z.string().min(1),
});

export const RevokeOrderRequestSchema = z.object({
  reason: z.string().min(1),
  revokedBy: z.string().min(1),
});

export const OutputMedicalFormsRequestSchema = z.object({
  patientId: z.string().min(1),
  formIds: z.array(z.string()).min(1),
});
