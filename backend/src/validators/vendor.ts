import { z } from "zod";

export const createCouponSchema = z.object({
  templateType: z.string().trim().min(1).max(50),
  couponTitle: z.string().trim().min(1).max(300),
  discountValue: z.string().trim().min(1).max(50),
  description: z.string().trim().max(80).optional(),
});

export const updateSettingsSchema = z.object({
  businessName: z.string().trim().min(1).max(300).optional(),
  phone: z.string().trim().max(30).optional(),
  address: z.string().trim().max(500).optional(),
  category: z.string().trim().max(100).optional(),
});
