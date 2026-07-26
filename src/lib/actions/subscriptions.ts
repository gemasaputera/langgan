"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  subscriptionSchema,
  type SubscriptionInput,
} from "@/lib/validations/subscription";
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

export async function getSubscriptions() {
  const user = await requireUser();
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: user.id },
    include: { category: true },
    orderBy: { nextPaymentDate: "asc" },
  });
  return subscriptions.map((sub) => ({
    ...sub,
    price: Number(sub.price),
    nextPaymentDate: sub.nextPaymentDate.toISOString(),
    createdAt: sub.createdAt.toISOString(),
    updatedAt: sub.updatedAt.toISOString(),
  }));
}

export async function createSubscription(data: SubscriptionInput) {
  const user = await requireUser();
  const validated = subscriptionSchema.parse(data);
  const subscription = await prisma.subscription.create({
    data: {
      name: validated.name,
      price: validated.price,
      currency: validated.currency || "IDR",
      billingCycle: validated.billingCycle,
      nextPaymentDate: new Date(validated.nextPaymentDate),
      categoryId: validated.categoryId || null,
      logoUrl: validated.logoUrl || null,
      color: validated.color || null,
      notes: validated.notes || null,
      isActive: validated.isActive,
      userId: user.id,
    },
    include: { category: true },
  });
  return {
    ...subscription,
    price: Number(subscription.price),
    nextPaymentDate: subscription.nextPaymentDate.toISOString(),
    createdAt: subscription.createdAt.toISOString(),
    updatedAt: subscription.updatedAt.toISOString(),
  };
}

export async function updateSubscription(id: string, data: SubscriptionInput) {
  const user = await requireUser();
  const validated = subscriptionSchema.parse(data);
  const subscription = await prisma.subscription.update({
    where: { id, userId: user.id },
    data: {
      name: validated.name,
      price: validated.price,
      currency: validated.currency || "IDR",
      billingCycle: validated.billingCycle,
      nextPaymentDate: new Date(validated.nextPaymentDate),
      categoryId: validated.categoryId || null,
      logoUrl: validated.logoUrl || null,
      color: validated.color || null,
      notes: validated.notes || null,
      isActive: validated.isActive,
    },
    include: { category: true },
  });
  return {
    ...subscription,
    price: Number(subscription.price),
    nextPaymentDate: subscription.nextPaymentDate.toISOString(),
    createdAt: subscription.createdAt.toISOString(),
    updatedAt: subscription.updatedAt.toISOString(),
  };
}

export async function deleteSubscription(id: string) {
  const user = await requireUser();
  await prisma.subscription.delete({
    where: { id, userId: user.id },
  });
}

export async function getMonthlyTotal() {
  const user = await requireUser();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: user.id,
      isActive: true,
      nextPaymentDate: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  const monthlyTotal = subscriptions.reduce((sum, sub) => {
    const price = Number(sub.price);
    switch (sub.billingCycle) {
      case "daily":
        return sum + price * 30;
      case "weekly":
        return sum + price * 4;
      case "monthly":
        return sum + price;
      case "yearly":
        return sum + price / 12;
      default:
        return sum + price;
    }
  }, 0);

  return monthlyTotal;
}
