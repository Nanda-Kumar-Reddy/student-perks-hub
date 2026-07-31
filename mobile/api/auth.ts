import { request, setAccessToken } from "./client";
import type { AppUser, AppRole } from "@/types";

interface AuthResponse {
  user: Record<string, unknown>;
  accessToken: string;
  role?: AppRole;
}

function mapUser(raw: Record<string, unknown>, role?: AppRole): AppUser {
  const profile = raw.profile as Record<string, unknown> | undefined;
  return {
    id: (raw.id as string) || (raw.userId as string) || "",
    email: (raw.email as string) || "",
    fullName:
      (raw.fullName as string) ||
      (raw.full_name as string) ||
      (profile?.fullName as string) ||
      "",
    avatarUrl:
      (raw.avatarUrl as string) ||
      (raw.avatar_url as string) ||
      (profile?.avatarUrl as string) ||
      "",
    role: role || (raw.role as AppRole) || "student",
    emailVerified: (raw.emailVerified as boolean) || false,
  };
}

export async function apiSignup(data: {
  email: string;
  password: string;
  fullName: string;
  role?: AppRole;
}): Promise<{ user: AppUser }> {
  const result = await request<AuthResponse>("POST", "/api/auth/signup", {
    body: {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      role: data.role || "student",
    },
  });
  setAccessToken(result.accessToken);
  return { user: mapUser(result.user, result.role) };
}

export async function apiLogin(data: {
  email: string;
  password: string;
}): Promise<{ user: AppUser }> {
  const result = await request<AuthResponse>("POST", "/api/auth/login", { body: data });
  setAccessToken(result.accessToken);
  return { user: mapUser(result.user, result.role) };
}

export async function apiGetMe(): Promise<AppUser> {
  const result = await request<{ user: Record<string, unknown>; role: AppRole }>(
    "GET",
    "/api/auth/me"
  );
  return mapUser(result.user, result.role);
}

export async function apiLogout(): Promise<void> {
  try {
    await request("POST", "/api/auth/logout");
  } catch {
    // ignore
  }
  setAccessToken(null);
}

export async function apiForgotPassword(email: string): Promise<void> {
  await request("POST", "/api/auth/forgot-password", { body: { email } });
}

export async function apiResetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  await request("POST", "/api/auth/reset-password", { body: { token, newPassword } });
}
