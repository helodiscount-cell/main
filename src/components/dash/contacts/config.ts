export const CONTACTS_CONFIG = {
  PAGE_TITLE: "Contacts",
  SEARCH_PLACEHOLDER: "Search contacts",
  EMPTY_STATE_MESSAGE: "No contacts found.",
  COLUMNS: [
    { key: "username", label: "Username", sortable: false, width: "flex-2" },
    {
      key: "email",
      label: "Email ID",
      sortable: false,
      width: "flex-2 justify-center",
    },
    {
      key: "lastInteracted",
      label: "Last Interacted",
      sortable: true,
      width: "flex-1 justify-end",
    },
  ],
};
