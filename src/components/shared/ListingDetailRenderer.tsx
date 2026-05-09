/**
 * ListingDetailRenderer — registry-driven detail page renderer
 *
 * Maps a service slug to the canonical (rich) student detail page component
 * and renders it inside a `ListingViewProvider` so the same UI can be reused
 * by Vendor and Admin portals with role-aware actions and back navigation.
 *
 * Adding a new service = add one entry below. No duplicated JSX per service.
 */
import { lazy, Suspense } from "react";
import { ListingViewProvider, ListingViewRole } from "@/contexts/ListingViewContext";
import { AccountingListingDetailPage, ConsultationListingDetailPage, DrivingPackageDetailPage } from "@/components/shared/ServiceListingDetailViews";

const AccommodationDetailPage = lazy(() => import("@/pages/dashboard/student/AccommodationDetailPage"));
const CarDetailPage = lazy(() => import("@/pages/dashboard/student/CarDetailPage"));
const JobDetailPage = lazy(() => import("@/pages/dashboard/student/JobDetailPage"));
const CertificationDetailPage = lazy(() => import("@/pages/dashboard/student/CertificationDetailPage"));
const EventDetailPage = lazy(() => import("@/pages/dashboard/student/EventDetailPage"));

/** Per-service registry: slug → component. */
const detailRegistry: Record<string, React.ComponentType> = {
  accommodation: AccommodationDetailPage,
  "car-rent-sale": CarDetailPage,
  jobs: JobDetailPage,
  consultations: ConsultationListingDetailPage,
  accounting: AccountingListingDetailPage,
  certifications: CertificationDetailPage,
  events: EventDetailPage,
  "driving-licence": DrivingPackageDetailPage,
};

interface Props {
  serviceSlug: string;
  role: ListingViewRole;
  backUrl: string;
  backLabel: string;
  /** Hide the student-facing primary actions (Apply / Book / Enquire / Register / Chat). */
  hideStudentActions?: boolean;
}

const Fallback = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 w-40 rounded-md bg-muted" />
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="h-48 rounded-xl bg-muted" />
        <div className="h-32 rounded-xl bg-muted" />
        <div className="h-40 rounded-xl bg-muted" />
      </div>
      <div className="h-72 rounded-xl bg-muted" />
    </div>
  </div>
);

export default function ListingDetailRenderer({ serviceSlug, role, backUrl, backLabel, hideStudentActions = true }: Props) {
  const Component = detailRegistry[serviceSlug];

  if (!Component) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="font-display text-base font-bold">No detail view available</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Service "{serviceSlug}" doesn't have a detail page yet.
        </p>
      </div>
    );
  }

  return (
    <ListingViewProvider value={{ role, backUrl, backLabel, hideStudentActions }}>
      <Suspense fallback={<Fallback />}>
        <Component />
      </Suspense>
    </ListingViewProvider>
  );
}
