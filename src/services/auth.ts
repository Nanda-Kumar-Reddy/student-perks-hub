/**
 * Authentication Service — Abstraction layer over Supabase Auth.
 * Swap this file to migrate to another provider (AWS Cognito, Firebase, etc.)
 */
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AppUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
};

function mapUser(user: User): AppUser {
  return {
    id: user.id,
    email: user.email ?? "",
    fullName: user.user_metadata?.full_name ?? "",
    avatarUrl: user.user_metadata?.avatar_url ?? "",
  };
}

export async function signUp(email: string, password: string, fullName: string, role: "student" | "vendor" = "student") {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) throw error;
  return data.user ? mapUser(data.user) : null;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return mapUser(data.user);
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPasswordForEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function getSession(): Promise<{ user: AppUser; session: Session } | null> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session) return null;
  return { user: mapUser(session.user), session };
}

export function onAuthStateChange(callback: (user: AppUser | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? mapUser(session.user) : null);
  });
  return subscription;
}
