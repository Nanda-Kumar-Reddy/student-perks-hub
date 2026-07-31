import React from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function HomeRedirect() {
  const role = useAuthStore((s) => s.role);
  return <Redirect href={`/(tabs)/${role || "student"}`} />;
}
