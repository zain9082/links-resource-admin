"use server";

import { ContactInquiryStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const idSchema = z.string().cuid();
const statusSchema = z.enum(["READ", "ARCHIVED"]);

export async function viewContactInquiry(id: string) {
  try {
    const { userId } = await requireAdminSession();
    const parsedId = idSchema.parse(id);

    await prisma.$transaction(async (tx) => {
      const inquiry = await tx.contactInquiry.findUnique({
        where: { id: parsedId },
        select: { status: true },
      });
      if (!inquiry) throw new Error("Contact inquiry not found.");

      if (inquiry.status === ContactInquiryStatus.NEW) {
        await tx.contactInquiry.update({
          where: { id: parsedId },
          data: { status: ContactInquiryStatus.READ },
        });
      }

      await tx.activityLog.create({
        data: {
          adminId: userId,
          action: "VIEWED",
          entity: "ContactInquiry",
          entityId: parsedId,
        },
      });
    });

    revalidatePath("/admin/contact-inquiries");
    return { success: true as const };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not open inquiry.",
    };
  }
}

export async function updateContactInquiryStatus(id: string, status: "READ" | "ARCHIVED") {
  try {
    const { userId } = await requireAdminSession();
    const parsed = z.object({ id: idSchema, status: statusSchema }).parse({ id, status });

    await prisma.$transaction([
      prisma.contactInquiry.update({
        where: { id: parsed.id },
        data: { status: parsed.status as ContactInquiryStatus },
      }),
      prisma.activityLog.create({
        data: {
          adminId: userId,
          action: parsed.status === "ARCHIVED" ? "ARCHIVED" : "MARKED_READ",
          entity: "ContactInquiry",
          entityId: parsed.id,
        },
      }),
    ]);

    revalidatePath("/admin/contact-inquiries");
    return { success: true as const };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not update inquiry.",
    };
  }
}

export async function deleteContactInquiry(id: string) {
  try {
    const { userId } = await requireAdminSession();
    const parsedId = idSchema.parse(id);

    await prisma.$transaction([
      prisma.contactInquiry.delete({ where: { id: parsedId } }),
      prisma.activityLog.create({
        data: {
          adminId: userId,
          action: "DELETED",
          entity: "ContactInquiry",
          entityId: parsedId,
        },
      }),
    ]);

    revalidatePath("/admin/contact-inquiries");
    return { success: true as const };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not delete inquiry.",
    };
  }
}
