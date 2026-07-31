import { GenericServiceScreen } from "@/components/shared/GenericServiceScreen";
import { SERVICE_MAP } from "@/constants/services";
import { apiGetMyCarRequests, apiCreateCarRequest } from "@/api/student";

export default function CarsScreen() {
  const meta = SERVICE_MAP["car-rent-sale"];
  return (
    <GenericServiceScreen
      meta={meta}
      fetcher={apiGetMyCarRequests}
      creator={apiCreateCarRequest}
      formFields={[
        { key: "type", label: "Rent or Buy", placeholder: "rent" },
        { key: "preferredCar", label: "Preferred Car", placeholder: "Toyota Corolla" },
        { key: "budget", label: "Budget (AUD)", placeholder: "500", keyboardType: "numeric" },
        { key: "startDate", label: "Start Date", placeholder: "2024-03-15" },
        { key: "duration", label: "Duration (if renting)", placeholder: "7 days" },
        { key: "notes", label: "Notes", placeholder: "Any requirements", multiline: true },
      ]}
    />
  );
}
