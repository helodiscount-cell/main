"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { contactsService } from "@/api/services/contacts";
import { contactKeys } from "@/keys/react-query";

export function useContacts() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>(
    [],
  );

  const query = useQuery({
    queryKey: [...contactKeys.list(), cursor],
    queryFn: () => contactsService.list(20, cursor),
    staleTime: 5000,
  });

  const handleNext = () => {
    if (query.data?.nextCursor) {
      setCursorHistory((prev) => [...prev, cursor]);
      setCursor(query.data.nextCursor);
    }
  };

  const handlePrev = () => {
    if (cursorHistory.length > 0) {
      setCursorHistory((prev) => {
        const lastCursor = prev[prev.length - 1];
        setCursor(lastCursor);
        return prev.slice(0, -1);
      });
    }
  };

  return {
    contacts: query.data?.contacts ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    // Pagination helpers
    handleNext,
    handlePrev,
    canGoNext: !!query.data?.nextCursor,
    canGoPrev: cursorHistory.length > 0,
    currentPage: cursorHistory.length + 1,
  };
}
