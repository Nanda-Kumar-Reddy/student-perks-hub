import { GenericServiceScreen } from "@/components/shared/GenericServiceScreen";
import { SERVICE_MAP } from "@/constants/services";
import { apiGetMyDrivingLicenseBookings, apiBookDrivingLicense } from "@/api/student";

export default function DrivingLicenceScreen() {
  const meta = SERVICE_MAP["driving-licence"];
  return (
    <GenericServiceScreen
      meta={meta}
      fetcher={apiGetMyDrivingLicenseBookings}
      creator={apiBookDrivingLicense}
      formFields={[
        { key: "licenseType", label: "License Type", placeholder: "Learner" },
        { key: "preferredDate", label: "Preferred Date", placeholder: "2024-03-15" },
        { key: "preferredTime", label: "Preferred Time", placeholder: "10:00" },
        { key: "lessonsNeeded", label: "Lessons Needed", placeholder: "5", keyboardType: "numeric" },
        { key: "notes", label: "Notes", placeholder: "Any special requirements", multiline: true },
      ]}
    />
  );
}
