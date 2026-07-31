import { GenericServiceScreen } from "@/components/shared/GenericServiceScreen";
import { SERVICE_MAP } from "@/constants/services";
import { apiGetMyJobApplications, apiApplyForLoan } from "@/api/student";

export default function JobsScreen() {
  const meta = SERVICE_MAP["jobs"];
  return (
    <GenericServiceScreen
      meta={meta}
      fetcher={apiGetMyJobApplications}
      creator={apiApplyForLoan as any}
      formFields={[
        { key: "jobTitle", label: "Job Title", placeholder: "Part-time Retail" },
        { key: "experience", label: "Experience", placeholder: "2 years" },
        { key: "availability", label: "Availability", placeholder: "Weekends" },
        { key: "notes", label: "Notes", placeholder: "Any additional info", multiline: true },
      ]}
    />
  );
}
