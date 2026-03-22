"use client";

import { useQuery } from "@tanstack/react-query";
import { contactsService } from "@/api/services/contacts";
import { contactKeys } from "@/keys/react-query";

export function useContacts() {
  const query = useQuery({
    queryKey: contactKeys.list(),
    queryFn: () => contactsService.list(),
  });

  return {
    contacts: query.data?.contacts ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
