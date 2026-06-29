import type { Metadata } from "next";
import "./globals.css";
import { ToasterProvider } from "./ToasterProvider";
import Link from "next/link";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "بوابة الاتصالات الشاملة",
  description: "المرجع الموحد لجميع باقات شركات الاتصالات السعودية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <nav className="navbar">
          <div className="container">
            <Link href="/" className="navbar-brand">
              <span style={{ color: "var(--primary)" }}>📱</span> 
              بوابة الاتصالات
            </Link>
            <div className="navbar-links">
              <Link href="/" className="btn">الرئيسية</Link>
              <Link href="/admin/login" className="btn btn-primary">تسجيل الدخول</Link>
            </div>
          </div>
        </nav>
        <ToasterProvider />
        <main>{children}</main>
      </body>
    </html>
  );
}
