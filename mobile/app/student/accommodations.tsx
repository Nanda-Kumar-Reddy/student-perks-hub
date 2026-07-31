import { GenericServiceScreen } from "@/components/shared/GenericServiceScreen";
import { SERVICE_MAP } from "@/constants/services";
import { apiGetMyAccommodationEnquiries, apiCreateAccommodationEnquiry } from "@/api/student";

export default function AccommodationsScreen() {
  const meta = SERVICE_MAP["accommodation"];
  return (
    <GenericServiceScreen
      meta={meta}
      fetcher={apiGetMyAccommodationEnquiries}
      creator={apiCreateAccommodationEnquiry}
      formFields={[
        { key: "location", label: "Preferred Location", placeholder: "Sydney CBD" },
        { key: "budget", label: "Budget (AUD/week)", placeholder: "300", keyboardType: "numeric" },
        { key: "moveInDate", label: "Move-in Date", placeholder: "2024-03-15" },
        { key: "duration", label: "Duration", placeholder: "6 months" },
        { key: "notes", label: "Notes", placeholder: "Any special requirements", multiline: true },
      ]}
    />
  );
}
