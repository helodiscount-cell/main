import Link from "next/link";
import React from "react";

type Props = {
  id: number;
  form: any;
};

const FormRow = ({ id, form }: Props) => {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center px-4 py-4 gap-4">
      {/* Name + target */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-slate-100 shrink-0 flex items-center justify-center text-xs font-bold text-slate-400">
          {(form.post?.id ?? form.story?.id ?? "").slice(0, 2).toUpperCase()}
        </div>
        <Link
          href={
            form.triggerType === "STORY_REPLY"
              ? `/dash/automations/story/${form.id}`
              : `/dash/automations/post/${form.id}`
          }
          className="flex flex-col gap-0.5"
        >
          <span className="text-sm font-medium text-slate-900">
            {form.name}
          </span>
          <span className="text-xs text-slate-500">
            {form.triggerType === "STORY_REPLY"
              ? "Story reply"
              : "Post comment"}
          </span>
        </Link>
      </div>

      {/* Submissions */}
      <div className="flex items-center gap-2">56</div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-900">LIVE</span>
      </div>

      {/* Last triggered */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-900">Never</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <div>Copy</div>
        {/* <ActionsMenu form={} /> */}
      </div>

      <div className="flex items-center gap-2">
        {/* <ActionsMenu form={} /> */}
      </div>
    </div>
  );
};

export default FormRow;
