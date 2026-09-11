"use server";

import { put } from "@vercel/blob";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAdminSession } from "@/lib/admin-auth";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extensionFor(type: string, fallbackName: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  const fromName = fallbackName.split(".").pop()?.toLowerCase();
  return fromName && fromName.length <= 5 ? fromName : "jpg";
}

function safeBaseName(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "image";
}

async function uploadToLocalPublic(file: File, folder: string) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = extensionFor(file.type, file.name);
  const filename = `${safeBaseName(file.name)}-${randomBytes(6).toString("hex")}.${ext}`;
  const relativeUrl = `/${folder}/${filename}`;

  // Write into the public website so visitors can load the image.
  const websiteDir = path.resolve(process.cwd(), "../links-resource/public", folder);
  await mkdir(websiteDir, { recursive: true });
  await writeFile(path.join(websiteDir, filename), bytes);

  // Mirror into the portal public folder so the admin preview works locally.
  const portalDir = path.resolve(process.cwd(), "public", folder);
  await mkdir(portalDir, { recursive: true });
  await writeFile(path.join(portalDir, filename), bytes);

  return relativeUrl;
}

export async function uploadAdminImage(formData: FormData) {
  try {
    await requireAdminSession();

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { error: "Choose an image file to upload." };
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return { error: "Only JPG, PNG, WEBP, or GIF images are allowed." };
    }

    if (file.size > MAX_BYTES) {
      return { error: "Image must be 5MB or smaller." };
    }

    const folderRaw = String(formData.get("folder") ?? "team/uploads");
    const folder = folderRaw.replace(/^\/+|\/+$/g, "").replace(/\.\./g, "");
    if (!folder || !/^[a-z0-9/_-]+$/i.test(folder)) {
      return { error: "Invalid upload folder." };
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
    if (token) {
      const ext = extensionFor(file.type, file.name);
      const pathname = `${folder}/${safeBaseName(file.name)}-${randomBytes(6).toString("hex")}.${ext}`;
      const blob = await put(pathname, file, {
        access: "public",
        token,
        addRandomSuffix: false,
        contentType: file.type,
      });
      return { success: true as const, url: blob.url };
    }

    if (process.env.NODE_ENV === "production") {
      return {
        error:
          "Image uploads require BLOB_READ_WRITE_TOKEN in production. Add a Vercel Blob store to the portal project.",
      };
    }

    const url = await uploadToLocalPublic(file, folder);
    return { success: true as const, url };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return { error: message };
  }
}
