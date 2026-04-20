"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { contactsService } from "@/api/services/contacts";
import { contactKeys } from "@/keys/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { TableRow, MobilePageLayout, TablePageLayout } from "../_components";
import { SortField } from "../_components/TableHeader";
import { useTableState } from "@/hooks/use-table-state";
import { useSearchSync } from "@/hooks/use-search-sync";
import { APP_CONFIG } from "@/configs/app.config";

const ContactsPage = () => {
  const isMobile = useIsMobile();
  const { sync: syncSearch } = useSearchSync();

  // Fetch contacts - Using a reasonable limit for client-side sorting/filtering of results
  const { data, isLoading } = useQuery({
    queryKey: [...contactKeys.list(), "list"],
    queryFn: () => contactsService.list(100),
  });

  const contacts = data?.contacts ?? [];

  const {
    search,
    sortField,
    sortOrder,
    page,
    setPage,
    toggleSort,
    paginatedItems: paginatedContacts,
    totalItems,
    filteredAndSorted,
  } = useTableState({
    data: contacts,
    defaultSortField: "date" as SortField,
    defaultSortOrder: "desc",
    filterFn: (c, s) => {
      return c.username.toLowerCase().includes(s.toLowerCase());
    },
    sortFn: (a, b, field, order) => {
      const fieldA =
        field === "date"
          ? new Date(a.lastInteractedAt).getTime()
          : a.username.toString().toLowerCase();
      const fieldB =
        field === "date"
          ? new Date(b.lastInteractedAt).getTime()
          : b.username.toString().toLowerCase();

      if (fieldA !== fieldB) {
        if (typeof fieldA === "number" && typeof fieldB === "number") {
          return order === "asc" ? fieldA - fieldB : fieldB - fieldA;
        }
        return order === "asc"
          ? String(fieldA).localeCompare(String(fieldB))
          : String(fieldB).localeCompare(String(fieldA));
      }
      return a.id.localeCompare(b.id);
    },
  });

  const handleSearchChange = (val: string) => {
    syncSearch(val);
    setPage(1);
  };

  if (isMobile) {
    return (
      <MobilePageLayout
        title="Contacts"
        items={filteredAndSorted}
        isLoading={isLoading}
        emptyMessage={
          search
            ? "No matches found."
            : "No contacts yet. They'll appear here once they interact!"
        }
        searchValue={search}
        onSearchChange={handleSearchChange}
        sortOrder={sortOrder}
        onSortChange={(sortKey) => {
          if (sortKey === "date") toggleSort("date");
        }}
      />
    );
  }

  return (
    <TablePageLayout
      variant="contacts"
      isLoading={isLoading}
      totalItems={totalItems}
      currentPage={page}
      pageSize={APP_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE}
      onPageChange={setPage}
      items={paginatedContacts}
      renderRow={(contact) => (
        <TableRow key={contact.id} data={contact} variant="contacts" />
      )}
      emptyState={{
        message: search
          ? "No matches found."
          : "No contacts yet. They'll appear here once they interact!",
        icon: <span className="text-4xl text-slate-300">👥</span>,
      }}
      statusFilter="ALL"
      handleStatusChange={() => {}}
      sortField={sortField}
      sortOrder={sortOrder}
      handleSort={toggleSort}
    />
  );
};

export default ContactsPage;
