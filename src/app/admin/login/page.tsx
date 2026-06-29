import LoginForm from "./LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const adminAuth = (await cookies()).get("admin_auth");
  
  if (adminAuth?.value === "true") {
    redirect("/admin/dashboard");
  }

  return <LoginForm />;
}
