import React from "react";
import { ContactsHeader, ContactsTable } from "@/components/dash/contacts";

export default function ContactsPage() {
  return (
    <div className="flex flex-col h-full bg-transparent">
      <ContactsHeader />
      <div className="mx-4 mb-4 flex-1 flex flex-col">
        <ContactsTable />
      </div>
    </div>
  );
}
