/**
 * Configuration for dashboard tables (Automations, Forms, etc.)
 */
export const TABLE_CONFIGS = {
  automations: {
    title: "Automations",
    gridClass: "grid-cols-[3fr_1fr_1fr_1fr_1fr_auto]",
    columns: [
      { id: "title", label: "Automations", type: "main" },
      { id: "status", label: "Status", type: "status" },
      { id: "count", label: "Runs", type: "stats", sortable: true },
      {
        id: "followers",
        label: "New Followers",
        type: "stats",
        sortable: true,
      },
      { id: "date", label: "Last Triggered", type: "date", sortable: true },
      { id: "actions", label: "", type: "actions" },
    ],
  },
  forms: {
    title: "Forms",
    gridClass: "grid-cols-[3fr_1fr_1fr_1fr_auto]",
    columns: [
      { id: "title", label: "Forms", type: "main" },
      { id: "status", label: "Status", type: "status" },
      { id: "count", label: "Submissions", type: "stats", sortable: true },
      { id: "date", label: "Last Updated", type: "date", sortable: true },
      { id: "actions", label: "", type: "actions" },
    ],
  },
} as const;

export type TableVariant = keyof typeof TABLE_CONFIGS;
