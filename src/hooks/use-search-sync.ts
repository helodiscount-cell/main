"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

/**
 * Hook to synchronize search state to the URL with native debouncing.
 * Prevents rapid router pushes while typing without external libraries.
 */
export function useSearchSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const urlSearchVal = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlSearchVal);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Sync internal state when URL changes (e.g. back button)
  useEffect(() => {
    setValue(urlSearchVal);
  }, [urlSearchVal]);

  const sync = useCallback(
    (newVal: string) => {
      setValue(newVal); // Immediate UI update

      // Clear existing timeout to reset the debounce timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        // Recreate params from the current state to avoid stale closures
        const params = new URLSearchParams(window.location.search);
        if (newVal) {
          params.set("q", newVal);
        } else {
          params.delete("q");
        }

        // Use replace for smoother URL synchronization during typing
        const next = params.toString();
        router.replace(next ? `${pathname}?${next}` : pathname, {
          scroll: false,
        });
      }, 400);
    },
    [router, pathname],
  );

  return {
    sync,
    value,
    params: searchParams,
  };
}
