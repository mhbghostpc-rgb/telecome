"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "يرجى إدخال اسم المستخدم وكلمة المرور" };
  }

  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    return { error: "بيانات الدخول غير صحيحة" };
  }

  const isValid = await bcrypt.compare(password, admin.password);

  if (!isValid) {
    return { error: "بيانات الدخول غير صحيحة" };
  }

  // Set cookie
  (await cookies()).set("admin_auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  redirect("/admin/dashboard");
}

export async function logout() {
  (await cookies()).delete("admin_auth");
  redirect("/admin/login");
}
