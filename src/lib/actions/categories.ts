"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { categorySchema, type CategoryInput } from "@/lib/validations/category";
import { headers } from "next/headers";

async function requireUser() {
  const headerStore = await headers();
  const session = await auth.api.getSession({
    headers: headerStore,
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function getCategories() {
  const user = await requireUser();
  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    include: { _count: { select: { subscriptions: true } } },
    orderBy: { name: "asc" },
  });
  return categories;
}

export async function createCategory(data: CategoryInput) {
  const user = await requireUser();
  const validated = categorySchema.parse(data);
  const category = await prisma.category.create({
    data: {
      name: validated.name,
      color: validated.color,
      icon: validated.icon || null,
      userId: user.id,
    },
  });
  return category;
}

export async function updateCategory(id: string, data: CategoryInput) {
  const user = await requireUser();
  const validated = categorySchema.parse(data);
  const category = await prisma.category.update({
    where: { id, userId: user.id },
    data: {
      name: validated.name,
      color: validated.color,
      icon: validated.icon || null,
    },
  });
  return category;
}

export async function deleteCategory(id: string) {
  const user = await requireUser();
  await prisma.category.delete({
    where: { id, userId: user.id },
  });
}
