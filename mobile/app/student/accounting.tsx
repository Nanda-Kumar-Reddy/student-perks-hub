import React from "react";
import { MyRequestsList } from "@/components/shared/MyRequestsList";
import { apiGetMyAccountingBookings } from "@/api/student";

export default function AccountingScreen() {
  return (
    <MyRequestsList
      title="Accounting"
      emoji="🧮"
      queryKey={["my-accounting-bookings"]}
      fetcher={() => apiGetMyAccountingBookings(1, 50)}
    />
  );
}
