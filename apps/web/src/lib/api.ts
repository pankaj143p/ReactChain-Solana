import axios, { AxiosRequestConfig } from "axios";

export async function apiFetch(
  url: string,
  options: RequestInit = {},
  token?: string,
  clearAuth?: () => void
) {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let data = undefined;
  let contentTypeSet = false;
  if (options.body instanceof FormData) {
    data = options.body;
    // Don't set Content-Type for FormData
  } else if (options.body) {
    headers["Content-Type"] = "application/json";
    data =
      typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body);
    contentTypeSet = true;
  }

  const axiosConfig: AxiosRequestConfig = {
    method: (options.method as any) || "GET",
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
    headers,
    data,
    withCredentials: (options as any).credentials === "include",
  };

  try {
    const res = await axios(axiosConfig);
    return res;
  } catch (error: any) {
    if (error.response && error.response.status === 401 && clearAuth) {
      clearAuth();
      localStorage.removeItem("auth");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      throw new Error("Unauthorized");
    }
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Request failed");
    }
    throw new Error(error.message || "Unknown error");
  }
}
