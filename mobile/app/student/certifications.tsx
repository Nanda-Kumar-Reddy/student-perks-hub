import React from "react";
import { MyRequestsList } from "@/components/shared/MyRequestsList";
import { apiGetMyCertificationRequests } from "@/api/student";

export default function CertificationsScreen() {
  return (
    <MyRequestsList
      title="Certifications"
      emoji="🏅"
      queryKey={["my-certification-requests"]}
      fetcher={() => apiGetMyCertificationRequests(1, 50)}
    />
  );
}
