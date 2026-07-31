import React from "react";
import { MyRequestsList } from "@/components/shared/MyRequestsList";
import { apiGetMyAccommodationEnquiries } from "@/api/student";

export default function AccommodationsScreen() {
  return (
    <MyRequestsList
      title="Accommodations"
      emoji="🏠"
      queryKey={["my-accommodation-enquiries"]}
      fetcher={() => apiGetMyAccommodationEnquiries(1, 50)}
    />
  );
}
