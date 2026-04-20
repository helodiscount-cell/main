"use client";

import { useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

/**
 * Hook to synchronize search state to the URL with native debouncing.
 * Prevents rapid router pushes while typing without external libraries.
 */
export function useSearchSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sync = useCallback(
    (val: string) => {
      // Clear existing timeout to reset the debounce timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (val) {
          params.set("q", val);
        } else {
          params.delete("q");
        }
        // Use replace for smoother URL synchronization during typing
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }, 400);
    },
    [router, searchParams, pathname],
  );

  return {
    sync,
    params: searchParams,
  };
}
