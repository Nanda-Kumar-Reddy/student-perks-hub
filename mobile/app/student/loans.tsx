import React from "react";
import { MyRequestsList } from "@/components/shared/MyRequestsList";
import { apiGetMyLoanApplications } from "@/api/student";

export default function LoansScreen() {
  return (
    <MyRequestsList
      title="Loans"
      emoji="💰"
      queryKey={["my-loan-applications"]}
      fetcher={() => apiGetMyLoanApplications(1, 50)}
    />
  );
}
