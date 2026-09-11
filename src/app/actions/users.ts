"use server";

import { type Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { userRoleSchema } from "@/lib/schemas";

export async function updateUserRole(userId: string, role: Role) {
  try {
    const { userId: adminId } = await requireAdminSession();
    const parsedRole = userRoleSchema.parse(role);

    if (userId === adminId && parsedRole !== "ADMIN") {
      throw new Error("You cannot remove your own administrator access.");
    }

    await prisma.$transaction(
      async (tx) => {
        const target = await tx.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });
        if (!target) throw new Error("User not found.");

        if (target.role === "ADMIN" && parsedRole !== "ADMIN") {
          const adminCount = await tx.user.count({ where: { role: "ADMIN" } });
          if (adminCount <= 1) {
            throw new Error("The last administrator cannot be demoted.");
          }
        }

        await tx.user.update({
          where: { id: userId },
          data: { role: parsedRole },
        });

        await tx.activityLog.create({
          data: {
            adminId,
            action: "UPDATED",
            entity: "User",
            entityId: userId,
            detail: `Role changed to ${parsedRole}`,
          },
        });
      },
      { isolationLevel: "Serializable" }
    );
    revalidatePath("/admin/users");
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Role update failed";
    return { error: message };
  }
}

export async function resetUserPassword(userId: string) {
  try {
    const { userId: adminId } = await requireAdminSession();
    const parsed = z.string().min(1).parse(userId);
    const tempPassword = randomBytes(18).toString("base64url");
    const hash = await bcrypt.hash(tempPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: parsed },
        data: { passwordHash: hash },
      }),
      prisma.activityLog.create({
        data: {
          adminId,
          action: "PASSWORD_RESET",
          entity: "User",
          entityId: parsed,
          detail: "Temporary password issued",
        },
      }),
    ]);

    revalidatePath("/admin/users");
    return { success: true as const, tempPassword };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reset failed";
    return { error: message };
  }
}

export async function deleteUser(userId: string) {
  try {
    const { userId: adminId } = await requireAdminSession();
    const parsed = z.string().min(1).parse(userId);
    if (parsed === adminId) {
      throw new Error("You cannot delete your own account.");
    }

    await prisma.$transaction(
      async (tx) => {
        const target = await tx.user.findUnique({
          where: { id: parsed },
          select: { role: true },
        });
        if (!target) throw new Error("User not found.");

        if (target.role === "ADMIN") {
          const adminCount = await tx.user.count({ where: { role: "ADMIN" } });
          if (adminCount <= 1) {
            throw new Error("The last administrator cannot be deleted.");
          }
        }

        await tx.activityLog.create({
          data: {
            adminId,
            action: "DELETED",
            entity: "User",
            entityId: parsed,
          },
        });
        await tx.user.delete({ where: { id: parsed } });
      },
      { isolationLevel: "Serializable" }
    );

    revalidatePath("/admin/users");
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return { error: message };
  }
}
