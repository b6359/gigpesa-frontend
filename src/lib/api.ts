const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://www.gigpesa.co.ke";

// Simple in-memory cache (for GET endpoints)
const cache = new Map<string, { data: any; timestamp: number }>();

// Track refresh state to prevent multiple refresh requests
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

// Helper to get access token from local or session storage
const getToken = () =>
  localStorage.getItem("gigpesa_token") || sessionStorage.getItem("gigpesa_token");

// Auto-refresh the JWT token
async function refreshToken(): Promise<void> {
  if (isRefreshing) return refreshPromise!;
  isRefreshing = true;

  refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include", // needed if your refresh token is stored in cookies
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Failed to refresh token");
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("gigpesa_token", data.access_token);
      }
    })
    .finally(() => {
      isRefreshing = false;
    });

  return refreshPromise;
}

// Main API function
export async function api<T = any>(
  endpoint: string,
  method: string = "GET",
  data?: any,
  retry = true
): Promise<T> {
  const token = getToken();

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: method !== "GET" && data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const responseData = isJson ? await res.json() : await res.text();

    if (res.status === 401 && retry) {
      try {
        await refreshToken();
        return api<T>(endpoint, method, data, false); // retry once
      } catch {
        throw new Error("Unauthorized. Please sign in again.");
      }
    }

    if (!res.ok) {
      throw new Error(
        typeof responseData === "string"
          ? responseData
          : responseData?.message || "API Error"
      );
    }

    return responseData as T;
  } catch (error: any) {
    console.error("API Error:", error);
    throw new Error(error.message || "Network error");
  }
}

// Optional cached GET API for read-only endpoints
export async function cachedApi<T = any>(
  endpoint: string,
  ttl = 60 * 1000 // cache duration in ms
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(endpoint);

  if (cached && now - cached.timestamp < ttl) {
    return cached.data as T;
  }

  const data = await api<T>(endpoint);
  cache.set(endpoint, { data, timestamp: now });
  return data;
}

export default api;
