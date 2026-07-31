import React from "react";
import { MyRequestsList } from "@/components/shared/MyRequestsList";
import { apiGetMyCarRequests } from "@/api/student";

export default function CarsScreen() {
  return (
    <MyRequestsList
      title="Car Rent/Sale"
      emoji="🚗"
      queryKey={["my-car-requests"]}
      fetcher={() => apiGetMyCarRequests(1, 50)}
    />
  );
}
