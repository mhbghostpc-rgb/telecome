import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminCompanies() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "asc" }
  });

  async function createCompany(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const brandColor = formData.get("brandColor") as string;
    
    if (name && brandColor) {
      await prisma.company.create({
        data: { name, brandColor }
      });
      revalidatePath("/admin/dashboard");
    }
  }

  async function deleteCompany(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    if (id) {
      await prisma.company.delete({ where: { id } });
      revalidatePath("/admin/dashboard");
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: "2rem" }}>إدارة الشركات</h2>
      
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>إضافة شركة جديدة</h3>
        <form action={createCompany} style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>اسم الشركة</label>
            <input type="text" name="name" className="input-field" required />
          </div>
          <div className="input-group" style={{ width: "150px", marginBottom: 0 }}>
            <label>لون الهوية</label>
            <input type="color" name="brandColor" className="input-field" defaultValue="#2563eb" style={{ height: "46px", padding: "0.2rem" }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: "46px" }}>إضافة</button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "1rem" }}>الشركات الحالية</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "right" }}>
              <th style={{ padding: "1rem" }}>الاسم</th>
              <th style={{ padding: "1rem" }}>اللون</th>
              <th style={{ padding: "1rem" }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(company => (
              <tr key={company.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "1rem" }}>{company.name}</td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "4px", backgroundColor: company.brandColor }}></div>
                    {company.brandColor}
                  </div>
                </td>
                <td style={{ padding: "1rem" }}>
                  <form action={deleteCompany}>
                    <input type="hidden" name="id" value={company.id} />
                    <button type="submit" className="badge" style={{ backgroundColor: "var(--danger)", color: "white" }}>حذف</button>
                  </form>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>لا يوجد شركات مضافة</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
