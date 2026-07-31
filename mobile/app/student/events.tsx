import React from "react";
import { MyRequestsList } from "@/components/shared/MyRequestsList";
import { apiGetMyEventRegistrations } from "@/api/student";

export default function EventsScreen() {
  return (
    <MyRequestsList
      title="Events"
      emoji="🎉"
      queryKey={["my-event-registrations"]}
      fetcher={() => apiGetMyEventRegistrations(1, 50)}
    />
  );
}
