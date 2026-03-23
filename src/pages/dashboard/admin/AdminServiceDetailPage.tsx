/**
 * Admin Service Detail Page — shows listings for a specific service with Approve/Reject actions
 */
import ServiceListingPage from "@/components/shared/ServiceListingPage";
import { ListingCardItem } from "@/components/shared/ListingCard";
import { ServiceCategory } from "@/components/shared/AddEditListingModal";

// Demo data — same structure across all services
const demoListings: Record<string, ListingCardItem[]> = {
  accommodation: [
    { id: "a1", title: "Modern Studio CBD", description: "Bright studio near campus", price: "$280/week", status: "PENDING", emoji: "🏠" },
    { id: "a2", title: "Shared 2BR Apartment", description: "Affordable shared living", price: "$180/week", status: "PENDING", emoji: "🏢" },
    { id: "a3", title: "Luxury 1BR Unit", description: "Premium living", price: "$350/week", status: "APPROVED", emoji: "🏙️" },
  ],
  "car-rent-sale": [
    { id: "c1", title: "Toyota Corolla 2024", description: "Reliable sedan", price: "$250/week", status: "PENDING", emoji: "🚗" },
    { id: "c2", title: "Honda Civic 2023", description: "Great condition", price: "$14,200", status: "APPROVED", emoji: "🚗" },
  ],
  consultations: [
    { id: "co1", title: "Career Counseling", description: "1-hour session", price: "$120/session", status: "PENDING", emoji: "👥" },
  ],
  accounting: [
    { id: "ac1", title: "Student Tax Return", description: "Full tax lodgement", price: "$49", status: "PENDING", emoji: "🧮" },
  ],
  "driving-licence": [
    { id: "d1", title: "10 Lessons Pack", description: "10 x 1hr lessons + test prep", price: "$650", status: "APPROVED", emoji: "🚗" },
    { id: "d2", title: "Premium Package", description: "20 lessons + 2 test bookings", price: "$1,100", status: "PENDING", emoji: "🚗" },
  ],
  loans: [
    { id: "l1", title: "Personal Loan Application", description: "Student personal loan", price: "$5,000", status: "PENDING" },
  ],
  "airport-pickup": [
    { id: "ap1", title: "QF1 — Melbourne Airport", description: "3 passengers, 4 luggage", status: "PENDING" },
  ],
  certifications: [
    { id: "ce1", title: "RSA Certificate", description: "Responsible Service of Alcohol", price: "$120", status: "APPROVED", emoji: "🍷" },
    { id: "ce2", title: "First Aid & CPR", description: "Full day course", price: "$180", status: "PENDING", emoji: "🏥" },
  ],
  events: [
    { id: "e1", title: "Welcome Week BBQ", description: "Semester kick-off event", status: "APPROVED", emoji: "🎉" },
    { id: "e2", title: "Career Fair 2026", description: "Connect with employers", status: "PENDING", emoji: "💼" },
  ],
  jobs: [
    { id: "j1", title: "Software Engineer — TechCorp", description: "Full-time role", price: "$75k-90k", status: "APPROVED" },
    { id: "j2", title: "Barista — Bean Counter", description: "Part-time role", price: "$25-28/hr", status: "PENDING" },
  ],
};

const serviceLabels: Record<string, { label: string; icon: string }> = {
  accommodation: { label: "Accommodation", icon: "🏠" },
  "car-rent-sale": { label: "Car Rent/Sale", icon: "🚗" },
  consultations: { label: "Consultations", icon: "👥" },
  accounting: { label: "Accounting", icon: "🧮" },
  "driving-licence": { label: "Driving Licence", icon: "🚗" },
  loans: { label: "Loans", icon: "💰" },
  "airport-pickup": { label: "Airport Pickup", icon: "✈️" },
  certifications: { label: "Certifications", icon: "📜" },
  events: { label: "Events", icon: "🎉" },
  jobs: { label: "Jobs", icon: "💼" },
};

interface Props {
  serviceSlug: string;
  icon: React.ReactNode;
}

export default function AdminServiceDetailPage({ serviceSlug, icon }: Props) {
  const config = serviceLabels[serviceSlug] || { label: serviceSlug, icon: "📦" };
  const listings = demoListings[serviceSlug] || [];

  return (
    <ServiceListingPage
      title={config.label}
      subtitle={`Review and approve/reject ${config.label.toLowerCase()} listings`}
      icon={icon}
      role="admin"
      serviceCategory={serviceSlug as ServiceCategory}
      listings={listings}
      showListingsTab
      showRequestsTab={false}
      showHistoryTab={false}
      defaultTab="listings"
    />
  );
}
