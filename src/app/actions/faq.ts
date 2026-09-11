"use server";

import { updateHomepageSection } from "@/app/actions/homepage";

export async function updateFaqItems(items: unknown) {
  return updateHomepageSection("faq", items);
}
