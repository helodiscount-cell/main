"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/services/api/api-client";
import { AxiosError, AxiosRequestConfig } from "axios";
import { BeErrorResponse } from "@/types";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: BeErrorResponse | null;
}

interface ApiOptions {
  body?: any;
  config?: AxiosRequestConfig;
}

type ApiMethod = "GET" | "POST";

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (
    url: string,
    method: ApiMethod,
    options?: ApiOptions
  ) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (
      url: string,
      method: ApiMethod,
      options?: ApiOptions
    ): Promise<T | null> => {
      setState({ data: null, loading: true, error: null });

      try {
        let response;

        if (method === "GET") {
          response = await apiClient.get<T>(url, options?.config);
        } else if (method === "POST") {
          response = await apiClient.post<T>(
            url,
            options?.body,
            options?.config
          );

          console.log(response.data);
        } else {
          throw new Error(`Unsupported method: ${method}`);
        }

        setState({ data: response.data, loading: false, error: null });
        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        const errorMessage =
          (error.response?.data as BeErrorResponse).error ||
          "An error occurred";
        console.log(errorMessage);

        setState({
          data: null,
          loading: false,
          error: {
            error: errorMessage,
            success: false,
            details: (error.response?.data as BeErrorResponse).details,
          },
        });
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
