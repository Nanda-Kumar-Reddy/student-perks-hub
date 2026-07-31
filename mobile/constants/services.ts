import type { ServiceType } from "@/types";

export interface ServiceMeta {
  slug: string;
  label: string;
  type: ServiceType;
  emoji: string;
  description: string;
}

export const SERVICES: ServiceMeta[] = [
  { slug: "accommodation", label: "Accommodation", type: "ACCOMMODATION", emoji: "🏠", description: "Find student housing, share houses, and homestays" },
  { slug: "car-rent-sale", label: "Car Rent/Sale", type: "CAR_RENT_SALE", emoji: "🚗", description: "Rent or buy cars from trusted vendors" },
  { slug: "consultations", label: "Consultations", type: "CONSULTATIONS", emoji: "💬", description: "Book 1:1 sessions with experts" },
  { slug: "accounting", label: "Accounting", type: "ACCOUNTING", emoji: "🧮", description: "Tax, bookkeeping, and financial services" },
  { slug: "driving-licence", label: "Driving Licence", type: "DRIVING_LICENCE", emoji: "🪪", description: "Driving lessons and licence tests" },
  { slug: "loans", label: "Loans", type: "LOANS", emoji: "💰", description: "Student loans and financial assistance" },
  { slug: "airport-pickup", label: "Airport Pickup", type: "AIRPORT_PICKUP", emoji: "✈️", description: "Get picked up from the airport on arrival" },
  { slug: "certifications", label: "Certifications", type: "CERTIFICATIONS", emoji: "🏅", description: "Professional certifications and courses" },
  { slug: "events", label: "Events", type: "EVENTS", emoji: "🎉", description: "Community events and meetups" },
  { slug: "jobs", label: "Jobs", type: "JOBS", emoji: "💼", description: "Part-time, full-time, and casual jobs" },
];

export const SERVICE_MAP: Record<string, ServiceMeta> = SERVICES.reduce(
  (acc, s) => { acc[s.slug] = s; return acc; },
  {} as Record<string, ServiceMeta>
);

export const SERVICE_TYPE_MAP: Record<string, ServiceMeta> = SERVICES.reduce(
  (acc, s) => { acc[s.type] = s; return acc; },
  {} as Record<string, ServiceMeta>
);
