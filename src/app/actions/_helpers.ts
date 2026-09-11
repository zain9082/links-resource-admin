"use server";

import { revalidatePath } from "next/cache";
import { ZodType } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { revalidateWebsite } from "@/lib/revalidate-site";

type ActionResult = { success: true } | { error: string };

export async function runAdminMutation<T>({
  schema,
  input,
  entity,
  action,
  entityId,
  detail,
  pathsToRevalidate = [],
  websitePathsToRevalidate = [],
  mutation,
}: {
  schema: ZodType<T>;
  input: unknown;
  entity: string;
  action: string;
  entityId?: string;
  detail?: string;
  pathsToRevalidate?: string[];
  websitePathsToRevalidate?: string[];
  mutation: (parsed: T, userId: string) => Promise<void>;
}): Promise<ActionResult> {
  try {
    const { userId } = await requireAdminSession();
    const parsed = schema.parse(input);
    await mutation(parsed, userId);

    await logActivity({
      adminId: userId,
      action,
      entity,
      entityId,
      detail,
    });

    for (const path of pathsToRevalidate) {
      revalidatePath(path);
    }

    if (websitePathsToRevalidate?.length) {
      await revalidateWebsite(websitePathsToRevalidate);
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return { error: message };
  }
}

export async function requireAdminAndGetUserId() {
  const { userId } = await requireAdminSession();
  return userId;
}
