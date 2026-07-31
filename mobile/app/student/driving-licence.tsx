import React from "react";
import { MyRequestsList } from "@/components/shared/MyRequestsList";
import { apiGetMyDrivingLicenseBookings } from "@/api/student";

export default function DrivingLicenceScreen() {
  return (
    <MyRequestsList
      title="Driving Licence"
      emoji="🪪"
      queryKey={["my-driving-license-bookings"]}
      fetcher={() => apiGetMyDrivingLicenseBookings(1, 50)}
    />
  );
}
