"use server";

import { Pricing, ResourceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite } from "@/lib/revalidate-site";
import { slugify } from "@/lib/utils";

const DIRECTORY_PATHS = ["/resources", "/categories", "/submit"];

const resourceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().optional(),
  websiteUrl: z.string().url(),
  shortDescription: z.string().min(1),
  longDescription: z.string().optional(),
  categoryId: z.string().min(1),
  tags: z.array(z.string()).default([]),
  pricingTier: z.enum(["FREE", "FREEMIUM", "PAID"]),
  logoUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().default(""),
  icon: z.string().default("Folder"),
  gradient: z.string().default("purple"),
});

const tagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().optional(),
});

export async function upsertResource(data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = resourceSchema.parse(data);
    const slug = parsed.slug?.trim() || slugify(parsed.name);

    const created = parsed.id
      ? await prisma.resource.update({
          where: { id: parsed.id },
          data: {
            slug,
            title: parsed.name,
            tagline: parsed.shortDescription,
            description: parsed.shortDescription,
            longDescription: parsed.longDescription ?? null,
            url: parsed.websiteUrl,
            categoryId: parsed.categoryId,
            pricing: parsed.pricingTier as Pricing,
            logoUrl: parsed.logoUrl || null,
            featured: parsed.featured,
            status: parsed.status as ResourceStatus,
          },
          select: { id: true },
        })
      : await prisma.resource.create({
          data: {
            slug,
            title: parsed.name,
            tagline: parsed.shortDescription,
            description: parsed.shortDescription,
            longDescription: parsed.longDescription ?? null,
            url: parsed.websiteUrl,
            categoryId: parsed.categoryId,
            pricing: parsed.pricingTier as Pricing,
            logoUrl: parsed.logoUrl || null,
            featured: parsed.featured,
            status: parsed.status as ResourceStatus,
          },
          select: { id: true },
        });

    await prisma.resourceTag.deleteMany({ where: { resourceId: created.id } });
    if (parsed.tags.length > 0) {
      await prisma.resourceTag.createMany({
        data: parsed.tags.map((tagId) => ({ resourceId: created.id, tagId })),
      });
    }

    await prisma.activityLog.create({
      data: {
        adminId: userId,
        action: parsed.id ? "UPDATED" : "CREATED",
        entity: "Resource",
        entityId: created.id,
      },
    });
    revalidatePath("/admin/resources");
    await revalidateWebsite([...DIRECTORY_PATHS, `/resources/${slug}`]);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    return { error: message };
  }
}

export async function deleteResource(id: string) {
  try {
    const { userId } = await requireAdminSession();
    await prisma.resource.delete({ where: { id } });
    await prisma.activityLog.create({
      data: {
        adminId: userId,
        action: "DELETED",
        entity: "Resource",
        entityId: id,
      },
    });
    revalidatePath("/admin/resources");
    await revalidateWebsite(DIRECTORY_PATHS);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return { error: message };
  }
}

export async function upsertCategory(data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = categorySchema.parse(data);
    const slug = parsed.slug?.trim() || slugify(parsed.name);
    const category = parsed.id
      ? await prisma.category.update({
        where: { id: parsed.id },
        data: {
          name: parsed.name,
          slug,
          description: parsed.description,
          icon: parsed.icon,
          gradient: parsed.gradient,
        },
        select: { id: true },
      })
      : await prisma.category.create({
        data: {
          name: parsed.name,
          slug,
          description: parsed.description,
          icon: parsed.icon,
          gradient: parsed.gradient,
        },
        select: { id: true },
      });
    await prisma.activityLog.create({
      data: {
        adminId: userId,
        action: parsed.id ? "UPDATED" : "CREATED",
        entity: "Category",
        entityId: category.id,
      },
    });
    revalidatePath("/admin/categories");
    await revalidateWebsite(DIRECTORY_PATHS);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    return { error: message };
  }
}

export async function deleteCategory(id: string) {
  try {
    const { userId } = await requireAdminSession();
    const parsedId = z.string().min(1).parse(id);
    await prisma.$transaction([
      prisma.category.delete({ where: { id: parsedId } }),
      prisma.activityLog.create({
        data: {
          adminId: userId,
          action: "DELETED",
          entity: "Category",
          entityId: parsedId,
        },
      }),
    ]);
    revalidatePath("/admin/categories");
    await revalidateWebsite(DIRECTORY_PATHS);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return { error: message };
  }
}

export async function upsertTag(data: unknown) {
  try {
    const { userId } = await requireAdminSession();
    const parsed = tagSchema.parse(data);
    const slug = parsed.slug?.trim() || slugify(parsed.name);
    const tag = parsed.id
      ? await prisma.tag.update({
        where: { id: parsed.id },
        data: { name: parsed.name, slug },
        select: { id: true },
      })
      : await prisma.tag.create({
        data: { name: parsed.name, slug },
        select: { id: true },
      });
    await prisma.activityLog.create({
      data: {
        adminId: userId,
        action: parsed.id ? "UPDATED" : "CREATED",
        entity: "Tag",
        entityId: tag.id,
      },
    });
    revalidatePath("/admin/tags");
    await revalidateWebsite(DIRECTORY_PATHS);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    return { error: message };
  }
}

export async function deleteTag(id: string) {
  try {
    const { userId } = await requireAdminSession();
    const parsedId = z.string().min(1).parse(id);
    await prisma.$transaction([
      prisma.tag.delete({ where: { id: parsedId } }),
      prisma.activityLog.create({
        data: {
          adminId: userId,
          action: "DELETED",
          entity: "Tag",
          entityId: parsedId,
        },
      }),
    ]);
    revalidatePath("/admin/tags");
    await revalidateWebsite(DIRECTORY_PATHS);
    return { success: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return { error: message };
  }
}
