import { z } from "zod";

export const uuidParam = z.object({
  id: z.string().uuid("Invalid ID"),
});

export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(200).optional(),
  phone: z.string().trim().max(30).optional(),
  address: z.string().trim().max(500).optional(),
  university: z.string().trim().max(300).optional(),
});

export const createBookingSchema = z.object({
  serviceType: z.enum(["accommodation", "airport_pickup", "car_rent", "consultation", "driving_licence", "event"]),
  serviceId: z.string().uuid(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  notes: z.string().trim().max(1000).optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["confirmed", "cancelled", "completed"]),
});
