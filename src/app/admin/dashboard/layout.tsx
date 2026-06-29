import Link from "next/link";
import { Building2, List, Package as PackageIcon, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { FadeIn } from "@/components/MotionDiv";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <FadeIn delay={0} className="sidebar" style={{ width: "280px" }}>
        <h3 style={{ marginBottom: "2rem", color: "var(--primary)", fontSize: "1.5rem", fontWeight: 800 }}>لوحة التحكم</h3>
        
        <Link href="/admin/dashboard" className="sidebar-link">
          <Building2 size={22} /> الشركات
        </Link>
        <Link href="/admin/dashboard/categories" className="sidebar-link">
          <List size={22} /> الأقسام
        </Link>
        <Link href="/admin/dashboard/packages" className="sidebar-link">
          <PackageIcon size={22} /> الباقات
        </Link>
        
        <div style={{ flex: 1 }}></div>
        
        <form action={logout}>
          <button type="submit" className="sidebar-link" style={{ width: "100%", color: "var(--danger)" }}>
            <LogOut size={22} /> تسجيل الخروج
          </button>
        </form>
      </FadeIn>
      <FadeIn delay={0.2} className="admin-content" style={{ flex: 1 }}>
        {children}
      </FadeIn>
    </div>
  );
}
