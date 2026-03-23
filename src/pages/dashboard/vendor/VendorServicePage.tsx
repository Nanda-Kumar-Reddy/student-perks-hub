/**
 * Enhanced Vendor Service Page — uses shared ServiceListingPage component
 * Provides Listings + Requests + History with Edit/Delete actions
 */
import ServiceListingPage from "@/components/shared/ServiceListingPage";
import { ListingCardItem } from "@/components/shared/ListingCard";
import { ServiceCategory } from "@/components/shared/AddEditListingModal";

interface VendorServicePageProps {
  serviceType: string;
  serviceLabel: string;
  icon: React.ReactNode;
}

function getDemoListings(serviceType: string): ListingCardItem[] {
  const demos: Record<string, ListingCardItem[]> = {
    ACCOMMODATION: [
      { id: "1", title: "Modern Studio CBD", description: "Bright studio near campus", price: "$280/week", status: "APPROVED", emoji: "🏠" },
      { id: "2", title: "Shared 2BR Apartment", description: "Affordable shared living", price: "$180/week", status: "PENDING", emoji: "🏢" },
    ],
    CAR_RENT_SALE: [
      { id: "1", title: "Toyota Corolla 2024", description: "Reliable sedan, low mileage", price: "$250/week", status: "APPROVED", emoji: "🚗" },
      { id: "2", title: "Honda Civic 2023", description: "Great condition", price: "$14,200", status: "PENDING", emoji: "🚗" },
    ],
    CONSULTATIONS: [
      { id: "1", title: "Career Counseling Session", description: "1-hour career guidance", price: "$120/session", status: "APPROVED" },
    ],
    ACCOUNTING: [
      { id: "1", title: "Student Tax Return", description: "Full tax return lodgement", price: "$49", status: "APPROVED" },
    ],
    DRIVING_LICENCE: [
      { id: "1", title: "Standard Package", description: "10 lessons + test booking", price: "$650", status: "APPROVED" },
      { id: "2", title: "Premium Package", description: "20 lessons + 2 test bookings", price: "$1,100", status: "APPROVED" },
    ],
    CERTIFICATIONS: [
      { id: "1", title: "RSA Certificate", description: "Responsible Service of Alcohol", price: "$120", status: "APPROVED", emoji: "🍷" },
    ],
    EVENTS: [
      { id: "1", title: "Welcome Week BBQ", description: "Free food and drinks", status: "APPROVED", emoji: "🎉" },
    ],
    JOBS: [
      { id: "1", title: "Software Engineer", description: "Full-time role in Melbourne", price: "$75k-90k", status: "APPROVED" },
      { id: "2", title: "Barista", description: "Part-time café role", price: "$25-28/hr", status: "PENDING" },
    ],
  };
  return demos[serviceType] || [
    { id: "1", title: `${serviceType} Listing 1`, description: "Sample listing", price: "$100", status: "APPROVED" },
  ];
}

// Map backend service type to ServiceCategory slug
const typeToCategory: Record<string, ServiceCategory> = {
  ACCOMMODATION: "accommodation",
  CAR_RENT_SALE: "car-rent-sale",
  CONSULTATIONS: "consultations",
  ACCOUNTING: "accounting",
  DRIVING_LICENCE: "driving-licence",
  LOANS: "loans",
  AIRPORT_PICKUP: "airport-pickup",
  CERTIFICATIONS: "certifications",
  EVENTS: "events",
  JOBS: "jobs",
};

const noListingsServices = ["AIRPORT_PICKUP", "LOANS"];

export default function VendorServicePage({ serviceType, serviceLabel, icon }: VendorServicePageProps) {
  const listings = getDemoListings(serviceType);
  const showListings = !noListingsServices.includes(serviceType);

  const pendingRequests = [
    { id: "r1", name: "Rahul S.", message: "Interested in this service", date: "Mar 18, 2026", status: "pending" },
    { id: "r2", name: "Priya K.", message: "Can I get more details?", date: "Mar 15, 2026", status: "pending" },
  ];

  const historyRequests = [
    { id: "h1", name: "Amit D.", message: "Completed booking", date: "Mar 10, 2026", status: "Approved" },
    { id: "h2", name: "Sarah L.", message: "Service completed", date: "Mar 5, 2026", status: "Completed" },
  ];

  return (
    <ServiceListingPage
      title={serviceLabel}
      subtitle={`Manage your ${serviceLabel.toLowerCase()} listings and requests`}
      icon={icon}
      role="vendor"
      serviceCategory={typeToCategory[serviceType] || "accommodation"}
      listings={listings}
      showListingsTab={showListings}
      showRequestsTab
      showHistoryTab
      defaultTab={showListings ? "listings" : "requests"}
      pendingRequests={pendingRequests}
      historyRequests={historyRequests}
    />
  );
}
