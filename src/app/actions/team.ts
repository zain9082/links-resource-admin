"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { getLegacyTeamMembers } from "@/lib/legacy-content";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite } from "@/lib/revalidate-site";
import { TEAM_PAGE_PATHS } from "@/lib/website-paths";
import { teamMemberInputSchema } from "@/lib/schemas";

function isLegacyId(id?: string) {
  return Boolean(id?.startsWith("legacy-"));
}

export async function upsertTeamMember(data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = teamMemberInputSchema.parse(data);
    const existingId = parsed.id && !isLegacyId(parsed.id) ? parsed.id : undefined;

    const payload = {
      name: parsed.name,
      role: parsed.role,
      bio: parsed.bio,
      email: parsed.email,
      imageUrl: parsed.imageUrl || null,
      linkedIn: parsed.linkedIn || null,
      twitter: parsed.twitter || null,
      displayOrder: parsed.displayOrder,
      active: parsed.active,
    };

    const saved = existingId
      ? await prisma.teamMember.update({
          where: { id: existingId },
          data: payload,
          select: { id: true },
        })
      : await prisma.teamMember.create({
          data: payload,
          select: { id: true },
        });

    await logActivity({
      adminId: userId,
      action: existingId ? "UPDATED" : "CREATED",
      entity: "TeamMember",
      entityId: saved.id,
      detail: parsed.name,
    });

    revalidatePath("/admin/team");
    revalidatePath("/admin/pages/team-page");
    await revalidateWebsite([...TEAM_PAGE_PATHS]);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    return { error: message };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    const { userId } = await requireAdminSession();
    if (isLegacyId(id)) {
      throw new Error(
        "Import the current team into the CMS first, then you can delete members."
      );
    }

    await prisma.teamMember.delete({ where: { id } });
    await logActivity({
      adminId: userId,
      action: "DELETED",
      entity: "TeamMember",
      entityId: id,
    });
    revalidatePath("/admin/team");
    revalidatePath("/admin/pages/team-page");
    await revalidateWebsite([...TEAM_PAGE_PATHS]);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return { error: message };
  }
}

/** One-time bootstrap when the DB has no TeamMember rows yet. */
export async function importStaticTeamMembers() {
  try {
    const { userId } = await requireAdminSession();
    const existing = await prisma.teamMember.count();
    if (existing > 0) {
      return { error: "Team members already exist in the database." };
    }

    const legacy = await getLegacyTeamMembers();
    await prisma.teamMember.createMany({
      data: legacy.map((member) => ({
        name: member.name,
        role: member.role,
        bio: member.bio,
        email: member.email,
        imageUrl: member.imageUrl,
        linkedIn: member.linkedIn,
        twitter: member.twitter,
        displayOrder: member.displayOrder,
        active: member.active,
      })),
    });

    await logActivity({
      adminId: userId,
      action: "IMPORTED",
      entity: "TeamMember",
      detail: `Imported ${legacy.length} team members`,
    });

    revalidatePath("/admin/team");
    revalidatePath("/admin/pages/team-page");
    await revalidateWebsite([...TEAM_PAGE_PATHS]);
    return { success: true as const, count: legacy.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Import failed";
    return { error: message };
  }
}
