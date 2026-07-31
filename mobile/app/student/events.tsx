import { GenericServiceScreen } from "@/components/shared/GenericServiceScreen";
import { SERVICE_MAP } from "@/constants/services";
import { apiGetMyEventRegistrations, apiRegisterForEvent } from "@/api/student";

export default function EventsScreen() {
  const meta = SERVICE_MAP["events"];
  return (
    <GenericServiceScreen
      meta={meta}
      fetcher={apiGetMyEventRegistrations}
      creator={apiRegisterForEvent}
      formFields={[
        { key: "eventName", label: "Event Name", placeholder: "Community Meetup" },
        { key: "date", label: "Date", placeholder: "2024-03-15" },
        { key: "attendees", label: "Number of Attendees", placeholder: "1", keyboardType: "numeric" },
        { key: "notes", label: "Notes", placeholder: "Any special requirements", multiline: true },
      ]}
    />
  );
}
