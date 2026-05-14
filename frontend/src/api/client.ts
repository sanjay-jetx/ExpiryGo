import { getPublicApiBaseUrl } from "@/config/env";

import { ApiError, parseApiErrorMessage } from "./errors";

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  /** JSON body; sets Content-Type and serializes automatically */
  json?: unknown;
  body?: BodyInit;
};

/**
 * Typed fetch wrapper for the FastAPI backend.
 * Centralizes base URL, headers, JSON parsing, and error mapping.
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { json: jsonBody, body: explicitBody, headers: initHeaders, ...rest } = options;
  const base = getPublicApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}${normalizedPath}`;

  const headers = new Headers(initHeaders);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  let body: BodyInit | undefined = explicitBody;
  if (jsonBody !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(jsonBody);
  }

  // Inject Firebase ID Token if available
  try {
    const { auth } = await import("@/config/firebase");
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      // Fallback for local testing if auth is mocked
      const match = document.cookie.match(new RegExp('(^| )mock_token=([^;]+)'));
      if (match) {
        headers.set("Authorization", `Bearer ${match[2]}`);
      }
    }
  } catch (e) {
    console.warn("Failed to attach Firebase token", e);
  }

  const res = await fetch(url, { ...rest, headers, body });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const parsedBody = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message = parseApiErrorMessage(res.status, parsedBody);
    throw new ApiError(res.status, parsedBody, message);
  }

  return parsedBody as T;
}
