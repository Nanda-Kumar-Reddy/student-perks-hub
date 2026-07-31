import { GenericServiceScreen } from "@/components/shared/GenericServiceScreen";
import { SERVICE_MAP } from "@/constants/services";
import { apiGetMyConsultations, apiBookConsultation } from "@/api/student";

export default function ConsultationsScreen() {
  const meta = SERVICE_MAP["consultations"];
  return (
    <GenericServiceScreen
      meta={meta}
      fetcher={apiGetMyConsultations}
      creator={apiBookConsultation}
      formFields={[
        { key: "topic", label: "Topic", placeholder: "Visa consultation" },
        { key: "preferredDate", label: "Preferred Date", placeholder: "2024-03-15" },
        { key: "preferredTime", label: "Preferred Time", placeholder: "14:00" },
        { key: "duration", label: "Duration", placeholder: "30 minutes" },
        { key: "notes", label: "Notes", placeholder: "What would you like to discuss?", multiline: true },
      ]}
    />
  );
}
