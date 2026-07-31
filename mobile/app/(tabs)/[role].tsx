import React from "react";
import { useLocalSearchParams } from "expo-router";
import { StudentDashboard } from "@/components/dashboards/StudentDashboard";
import { VendorDashboard } from "@/components/dashboards/VendorDashboard";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import type { AppRole } from "@/types";

export default function RoleDashboard() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const r = (role as AppRole) || "student";

  if (r === "vendor") return <VendorDashboard />;
  if (r === "admin") return <AdminDashboard />;
  return <StudentDashboard />;
}
