import React from "react";
import { MyRequestsList } from "@/components/shared/MyRequestsList";
import { apiGetMyConsultations } from "@/api/student";

export default function ConsultationsScreen() {
  return (
    <MyRequestsList
      title="Consultations"
      emoji="💬"
      queryKey={["my-consultations"]}
      fetcher={() => apiGetMyConsultations(1, 50)}
    />
  );
}
