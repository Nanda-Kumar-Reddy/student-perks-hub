import { GenericServiceScreen } from "@/components/shared/GenericServiceScreen";
import { SERVICE_MAP } from "@/constants/services";
import { apiGetMyLoanApplications, apiApplyForLoan } from "@/api/student";

export default function LoansScreen() {
  const meta = SERVICE_MAP["loans"];
  return (
    <GenericServiceScreen
      meta={meta}
      fetcher={apiGetMyLoanApplications}
      creator={apiApplyForLoan}
      formFields={[
        { key: "loanAmount", label: "Loan Amount (AUD)", placeholder: "5000", keyboardType: "numeric" },
        { key: "purpose", label: "Purpose", placeholder: "Tuition fees" },
        { key: "duration", label: "Repayment Period", placeholder: "12 months" },
        { key: "notes", label: "Notes", placeholder: "Additional information", multiline: true },
      ]}
    />
  );
}
