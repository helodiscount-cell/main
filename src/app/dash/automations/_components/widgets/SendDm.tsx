import {
  ImageIcon,
  X,
  SmilePlus,
  ChevronUp,
  ChevronDown,
  Loader2,
  Type,
  Link as LinkIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DmLink } from "@dm-broo/common-types";

const MAX_CHARS = 1000;
const MAX_LINKS = 3;

type Props = {
  message: string;
  onMessageChange: (msg: string) => void;
  imageUrl?: string;
  onImageChange?: (url: string) => void;
  links?: DmLink[];
  onLinksChange?: (links: DmLink[]) => void;
};

const SendDm = ({
  message,
  onMessageChange,
  imageUrl,
  onImageChange,
  links = [],
  onLinksChange,
}: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res?.[0]) {
        onImageChange?.(res[0].url);
        toast.success("Image uploaded successfully");
      }
    },
    onUploadError: (error: Error) => {
      setIsUploading(false);
      toast.error(`Upload failed: ${error.message}`);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });

  // Handle file selection from the hidden input
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Restrict to image files only
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    await startUpload([file]);
  };

  const removeMedia = () => {
    onImageChange?.("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle files dropped into the upload area
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Restrict to image files only
    if (!file.type.startsWith("image/")) {
      toast.error("Please drop an image file.");
      return;
    }

    await startUpload([file]);
  };

  const openAddLink = () => {
    setEditingIndex(null);
    setTitle("");
    setUrl("");
    setIsDialogOpen(true);
  };

  const openEditLink = (index: number) => {
    setEditingIndex(index);
    setTitle(links[index].title);
    setUrl(links[index].url);
    setIsDialogOpen(true);
  };

  const saveLink = () => {
    // Ensure mutation handler exists before performing changes
    if (!onLinksChange) {
      toast.error("Error: Unable to update links. Please try again.");
      return;
    }

    if (!title || !url) {
      toast.error("Please fill in both title and URL.");
      return;
    }

    // Verify limit again before adding new link (fail closed)
    if (editingIndex === null && links.length >= MAX_LINKS) {
      toast.error(`Maximum ${MAX_LINKS} links reached.`);
      return;
    }

    // Regular expression for a more strict web URL validation
    const urlRegex = /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/.*)?$/i;

    if (!urlRegex.test(url)) {
      toast.error("Please enter a valid web URL (e.g., example.com).");
      return;
    }

    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    const newLink: DmLink = { title, url: formattedUrl };

    if (editingIndex !== null) {
      const newLinks = [...links];
      newLinks[editingIndex] = newLink;
      onLinksChange(newLinks);
      toast.success("Link updated successfully!");
    } else {
      onLinksChange([...links, newLink]);
      toast.success("Link added successfully!");
    }

    setTitle("");
    setUrl("");
    setEditingIndex(null);
    setIsDialogOpen(false);
  };

  const removeLink = (index: number) => {
    if (!onLinksChange) {
      toast.error("Error: Unable to remove link. Please try again.");
      return;
    }
    onLinksChange(links.filter((_, i) => i !== index));
    toast.success("Link removed");
  };

  return (
    <div className="bg-white rounded-xl border border-purple-300 w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <span className="text-sm font-semibold text-slate-800">Send a DM</span>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-3">
          {/* Media upload area */}
          <div>
            {!imageUrl && !isUploading ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex items-center justify-center gap-2 border border-dashed border-purple-300 rounded-lg py-3 cursor-pointer hover:bg-purple-50 transition-colors"
              >
                <ImageIcon size={16} className="text-slate-400" />
                <span className="text-sm text-slate-400">
                  Select/Drop an image
                </span>
              </div>
            ) : isUploading ? (
              <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-purple-300 rounded-lg py-6 bg-purple-50/50">
                <Loader2 size={24} className="text-purple-500 animate-spin" />
                <span className="text-sm text-purple-600 font-medium">
                  Uploading image...
                </span>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-purple-200">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full max-h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-1.5 right-1.5 bg-white rounded-full p-0.5 shadow text-slate-500 hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Message textarea */}
          <div className="bg-[#F5F5F5] rounded-lg px-3 pt-3 pb-2">
            <div className="flex items-start gap-2">
              <textarea
                value={message}
                onChange={(e) =>
                  onMessageChange(e.target.value.slice(0, MAX_CHARS))
                }
                placeholder="Enter your message here..."
                rows={3}
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none"
              />
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5 shrink-0"
              >
                <SmilePlus size={18} />
              </button>
            </div>
            <div className="text-xs text-slate-400 text-left mt-1">
              {message.length}/{MAX_CHARS}
            </div>
          </div>

          {/* Links DisplaySection */}
          {links.length > 0 && (
            <div className="space-y-2 pt-1">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-[#F8F9FA] px-4 py-3 rounded-2xl border border-slate-100 group hover:border-purple-200 hover:bg-white transition-all shadow-sm active:scale-[0.99]"
                >
                  <div className="bg-purple-100 p-2 rounded-xl text-purple-600">
                    <LinkIcon size={16} />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-slate-700 truncate">
                    {link.title}
                  </span>
                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => openEditLink(index)}
                      className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dialog Component (Shared for add/edit) */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {links.length < MAX_LINKS && (
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant={"ghost"}
                  onClick={openAddLink}
                  className="w-full flex items-center gap-2 bg-[#F7F0FF] text-[#6A06E4] hover:bg-[#F2E6FF] transition-colors py-5"
                >
                  <span className="text-xs font-normal">Add Link</span>
                </Button>
              </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px] rounded-3xl pb-6">
              <DialogHeader className="pb-2">
                <DialogTitle className="text-xl font-bold text-slate-800">
                  {editingIndex !== null ? "Edit Link" : "Add Link"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-sm bg-slate-50/50">
                  {/* Title Row */}
                  <div className="flex items-center gap-4 px-4 py-3.5 bg-white group transition-colors hover:bg-slate-50">
                    <div className="text-slate-400 group-hover:text-purple-500 transition-colors">
                      <Type size={18} />
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-400 min-w-20">
                        Enter Title
                      </span>
                      <input
                        autoFocus
                        placeholder="Open Link"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-slate-800 font-medium placeholder:text-slate-300 outline-none"
                      />
                    </div>
                  </div>

                  {/* URL Row */}
                  <div className="flex items-center gap-4 px-4 py-3.5 bg-white group transition-colors hover:bg-slate-50">
                    <div className="text-slate-400 group-hover:text-purple-500 transition-colors">
                      <LinkIcon size={18} />
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-400 min-w-20">
                        Enter Link
                      </span>
                      <input
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-slate-800 font-medium placeholder:text-slate-300 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={saveLink}
                  disabled={editingIndex === null && links.length >= MAX_LINKS}
                  className="w-full bg-[#6A06E4] hover:bg-[#5805BD] text-white rounded-xl py-6 font-bold text-base shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingIndex !== null ? "Update Link" : "Add Link"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {links.length >= MAX_LINKS && (
            <p className="text-[10px] text-center text-slate-400 pt-1">
              Maximum {MAX_LINKS} links reached.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SendDm;
