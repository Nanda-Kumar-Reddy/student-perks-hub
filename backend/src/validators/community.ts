import { z } from "zod";

export const createCommunityTaskSchema = z.object({
  title: z.string().trim().min(3).max(300),
  category: z.enum([
    "Home & Garden", "Childcare", "Tutoring", "Cleaning",
    "Moving", "Pet Care", "Technology Help", "Event Help",
    "Delivery", "Other",
  ]),
  description: z.string().trim().min(10).max(2000),
  location: z.string().trim().min(2).max(500),
  date: z.string().datetime(),
  time: z.string().trim().max(50),
  duration: z.string().trim().max(100),
  payment: z.coerce.number().positive().max(99999),
  requiresExperience: z.boolean().default(false),
  requiresTransport: z.boolean().default(false),
  requiresPoliceCheck: z.boolean().default(false),
  requiresChildrenCheck: z.boolean().default(false),
  requiresFirstAid: z.boolean().default(false),
  showPhonePublicly: z.boolean().default(false),
  chatThroughApp: z.boolean().default(true),
});

export const applyForTaskSchema = z.object({
  message: z.string().trim().max(1000).optional(),
});

export const sendTaskMessageSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

export const adminTaskActionSchema = z.object({
  reason: z.string().trim().max(500).optional(),
  adminNotes: z.string().trim().max(1000).optional(),
});

export const adminEditTaskSchema = z.object({
  title: z.string().trim().min(3).max(300).optional(),
  category: z.enum([
    "Home & Garden", "Childcare", "Tutoring", "Cleaning",
    "Moving", "Pet Care", "Technology Help", "Event Help",
    "Delivery", "Other",
  ]).optional(),
  description: z.string().trim().min(10).max(2000).optional(),
  location: z.string().trim().min(2).max(500).optional(),
  date: z.string().datetime().optional(),
  time: z.string().trim().max(50).optional(),
  duration: z.string().trim().max(100).optional(),
  payment: z.coerce.number().positive().max(99999).optional(),
  adminNotes: z.string().trim().max(1000).optional(),
});

export const taskSearchQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  location: z.string().trim().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
