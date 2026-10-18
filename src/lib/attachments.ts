/**
 * Limits for files attached to the quote/contact form (house plans, photos).
 * Shared by the form (client-side checks) and /api/quote (enforced). Files are
 * emailed as attachments — nothing is stored. Base64 inflates size by ~33%, so
 * MAX_TOTAL keeps the email comfortably under Microsoft 365's limits.
 */
export const MAX_FILES = 3;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 15 * 1024 * 1024;

export const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "webp", "heic", "heif"] as const;

/** Value for the file input's `accept` attribute. */
export const ACCEPT = ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(",");

export const extensionOf = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";

export const isAllowedFile = (name: string) =>
  (ALLOWED_EXTENSIONS as readonly string[]).includes(extensionOf(name));

export const formatBytes = (n: number) =>
  n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1).replace(/\.0$/, "")} MB`;
