import axios, { AxiosError, AxiosResponse } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging in development
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      );
    }
    return config;
  },
  (error) => {
    console.log("axios outgoing req error " + error);
    return Promise.reject(error);
  },
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (res: AxiosResponse) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Response] ${res.config.method?.toUpperCase()} ${res.config.url}`,
        res.data,
      );
    }
    return res;
  },
  async (error: AxiosError<any>) => {
    console.log("axios incoming res error " + error);
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (process.env.NODE_ENV === "development") {
      console.error(`[API Error] ${status || "Network Error"}:`, message);
    }

    return Promise.reject(error);
  },
);

/**
 * Helper function to extract data from axios response
 * Usage: const data = await request(api.get('/endpoint'))
 */
export async function request<T>(
  promise: Promise<AxiosResponse<T>>,
): Promise<T> {
  const res = await promise;
  return res.data;
}
