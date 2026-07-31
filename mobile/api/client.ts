import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "@/constants/env";

const TOKEN_KEY = "ll_access_token";

let accessToken: string | null = null;
let refreshing: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    SecureStore.setItemAsync(TOKEN_KEY, token).catch(() => {});
  } else {
    SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

export async function loadStoredToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) accessToken = token;
    return token;
  } catch {
    return null;
  }
}

export class HttpError extends Error {
  status: number;
  code?: string;
  body: unknown;
  constructor(message: string, status: number, code?: string, body?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("refresh failed");
      const data = await res.json();
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        return data.accessToken as string;
      }
      return null;
    } catch {
      setAccessToken(null);
      return null;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  raw?: boolean;
  skipAuthRetry?: boolean;
}

export async function request<T>(
  method: string,
  path: string,
  options?: RequestOptions
): Promise<T> {
  const { body, headers, raw, skipAuthRetry } = options || {};

  const buildConfig = (token: string | null): RequestInit => {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
      ...(headers || {}),
    };
    if (token) h["Authorization"] = `Bearer ${token}`;
    const config: RequestInit = {
      method,
      headers: h,
      credentials: "include",
    };
    if (body != null) {
      config.body = raw ? (body as BodyInit) : JSON.stringify(body);
    }
    return config;
  };

  const res = await fetch(`${API_BASE_URL}${path}`, buildConfig(accessToken));

  if (res.status === 401 && !skipAuthRetry && accessToken) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const retryRes = await fetch(`${API_BASE_URL}${path}`, buildConfig(newToken));
      return handleResponse<T>(retryRes);
    }
    setAccessToken(null);
    throw new HttpError("Session expired", 401, "SESSION_EXPIRED");
  }

  return handleResponse<T>(res);
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ error: "Request failed" }));
    throw new HttpError(
      errBody.error || errBody.message || "Request failed",
      res.status,
      errBody.code,
      errBody
    );
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export { API_BASE_URL };
