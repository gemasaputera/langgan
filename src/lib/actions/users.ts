"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

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

export async function getProfile() {
  const user = await requireUser();
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}