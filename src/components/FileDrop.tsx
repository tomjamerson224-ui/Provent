import { useRef, useState, type DragEvent } from "react";
import { FileText, ImageIcon, Paperclip, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ACCEPT, MAX_FILE_BYTES, MAX_FILES, MAX_TOTAL_BYTES, extensionOf, formatBytes, isAllowedFile } from "@/lib/attachments";

type Props = {
  id: string;
  files: File[];
  onChange: (files: File[]) => void;
  /** Called with a human-readable reason when a file is rejected. */
  onReject: (message: string) => void;
};

export default function FileDrop({ id, files, onChange, onReject }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function add(incoming: File[]) {
    const next = [...files];
    for (const f of incoming) {
      if (next.length >= MAX_FILES) {
        onReject(`You can attach up to ${MAX_FILES} files.`);
        break;
      }
      if (!isAllowedFile(f.name)) {
        onReject(`"${f.name}" isn't a PDF or image file.`);
        continue;
      }
      if (f.size > MAX_FILE_BYTES) {
        onReject(`"${f.name}" is over ${formatBytes(MAX_FILE_BYTES)}.`);
        continue;
      }
      if (next.reduce((s, x) => s + x.size, 0) + f.size > MAX_TOTAL_BYTES) {
        onReject(`Attachments can be up to ${formatBytes(MAX_TOTAL_BYTES)} in total.`);
        continue;
      }
      if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
    }
    onChange(next);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    add(Array.from(e.dataTransfer.files));
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => files.length < MAX_FILES && input.current?.click()}
        className={cn(
          "cursor-pointer",
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors",
          dragging ? "border-brand bg-accent" : "border-input bg-muted/40 hover:bg-muted",
          files.length >= MAX_FILES && "opacity-60",
        )}
      >
        <Paperclip className="size-6 text-muted-foreground" />
        <p className="text-sm">
          <span className="hidden sm:inline">Drag house plans or photos here, or </span>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-sm font-semibold text-brand-dark"
            disabled={files.length >= MAX_FILES}
            onClick={(e) => {
              e.stopPropagation();
              input.current?.click();
            }}
          >
            <span className="sm:hidden">Attach house plans or photos</span>
            <span className="hidden sm:inline">browse files</span>
          </Button>
        </p>
        <p className="text-xs text-muted-foreground">
          PDF, JPG, PNG or HEIC · up to {MAX_FILES} files, {formatBytes(MAX_FILE_BYTES)} each
        </p>
        <input
          ref={input}
          id={id}
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            add(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {files.map((f, i) => {
            const Icon = extensionOf(f.name) === "pdf" ? FileText : ImageIcon;
            return (
              <li key={`${f.name}-${f.size}`} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 text-sm">
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{f.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{formatBytes(f.size)}</span>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  aria-label={`Remove ${f.name}`}
                  onClick={() => onChange(files.filter((_, j) => j !== i))}
                >
                  <X />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
