import { GenericServiceScreen } from "@/components/shared/GenericServiceScreen";
import { SERVICE_MAP } from "@/constants/services";
import { apiGetMyCertificationRequests, apiRequestCertification } from "@/api/student";

export default function CertificationsScreen() {
  const meta = SERVICE_MAP["certifications"];
  return (
    <GenericServiceScreen
      meta={meta}
      fetcher={apiGetMyCertificationRequests}
      creator={apiRequestCertification}
      formFields={[
        { key: "certificationName", label: "Certification", placeholder: "First Aid Certificate" },
        { key: "provider", label: "Preferred Provider", placeholder: "Any" },
        { key: "preferredDate", label: "Preferred Date", placeholder: "2024-03-15" },
        { key: "notes", label: "Notes", placeholder: "Any requirements", multiline: true },
      ]}
    />
  );
}
