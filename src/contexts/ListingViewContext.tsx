/**
 * ListingViewContext — lets a single student detail page be reused in
 * Student / Vendor / Admin portals. The detail page reads `role` and `backUrl`
 * from this context and gates its student-only action buttons accordingly.
 *
 * When no provider is mounted, defaults assume the original student experience,
 * so existing student routes keep working unchanged.
 */
import { createContext, useContext } from "react";

export type ListingViewRole = "student" | "vendor" | "admin";

export interface ListingViewContextValue {
  role: ListingViewRole;
  /** Optional override for the "Back to …" button URL */
  backUrl?: string;
  /** Optional override for the back-button label, e.g. "Back to Listings" */
  backLabel?: string;
  /** When true, hide the student-only action buttons (Apply, Book, Enquire, Chat, …) */
  hideStudentActions?: boolean;
}

const Ctx = createContext<ListingViewContextValue>({ role: "student" });

export const ListingViewProvider = Ctx.Provider;
export const useListingView = () => useContext(Ctx);
