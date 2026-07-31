import { GenericServiceScreen } from "@/components/shared/GenericServiceScreen";
import { SERVICE_MAP } from "@/constants/services";
import { apiGetMyAccountingBookings, apiBookAccounting } from "@/api/student";

export default function AccountingScreen() {
  const meta = SERVICE_MAP["accounting"];
  return (
    <GenericServiceScreen
      meta={meta}
      fetcher={apiGetMyAccountingBookings}
      creator={apiBookAccounting}
      formFields={[
        { key: "serviceType", label: "Service Type", placeholder: "Tax return" },
        { key: "preferredDate", label: "Preferred Date", placeholder: "2024-03-15" },
        { key: "preferredTime", label: "Preferred Time", placeholder: "14:00" },
        { key: "notes", label: "Notes", placeholder: "Details about your request", multiline: true },
      ]}
    />
  );
}
