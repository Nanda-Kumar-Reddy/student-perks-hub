import React from "react";
import { MyRequestsList } from "@/components/shared/MyRequestsList";
import { apiGetMyJobApplications } from "@/api/student";

export default function JobsScreen() {
  return (
    <MyRequestsList
      title="Jobs"
      emoji="💼"
      queryKey={["my-job-applications"]}
      fetcher={() => apiGetMyJobApplications(1, 50)}
    />
  );
}
