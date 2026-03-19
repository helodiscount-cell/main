import { Instagram, MessageSquare } from "lucide-react";

const tabs = [
  {
    id: "dm-from-comments",
    title: "DM from Comments",
    description:
      "Send links instantly when people comment on your post or reel",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: "dm-from-stories",
    title: "DM from Stories",
    description: "Automate responses when people interact with your stories",
    icon: <Instagram className="w-5 h-5" />,
  },
];

export default function TabSelector({
  setActiveTab,
}: {
  setActiveTab: (value: string | null) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className="group relative rounded-xl border border-gray-100 bg-gray-50/50 p-6 hover:bg-white hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer flex flex-col"
          onClick={() => setActiveTab(tab.id)}
        >
          <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-white p-2 text-purple-600 shadow-sm ring-1 ring-gray-200 group-hover:ring-purple-200 transition-all">
            {tab.icon}
          </div>
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
            {tab.title}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {tab.description}
          </p>
        </div>
      ))}
    </div>
  );
}
