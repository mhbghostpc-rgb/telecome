import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminCategories() {
  const companies = await prisma.company.findMany();
  const categories = await prisma.category.findMany({
    include: { company: true },
    orderBy: { companyId: "asc" }
  });

  async function createCategory(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const companyId = parseInt(formData.get("companyId") as string);
    
    if (name && companyId) {
      await prisma.category.create({
        data: { name, companyId }
      });
      revalidatePath("/admin/dashboard/categories");
    }
  }

  async function deleteCategory(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    if (id) {
      await prisma.category.delete({ where: { id } });
      revalidatePath("/admin/dashboard/categories");
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: "2rem" }}>إدارة الأقسام</h2>
      
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>إضافة قسم جديد</h3>
        <form action={createCategory} style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>اسم القسم (مثل: باقات إنترنت، باقات مكالمات)</label>
            <input type="text" name="name" className="input-field" required />
          </div>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>الشركة التابع لها</label>
            <select name="companyId" className="input-field" required>
              <option value="">-- اختر الشركة --</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: "46px" }}>إضافة</button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "1rem" }}>الأقسام الحالية</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "right" }}>
              <th style={{ padding: "1rem" }}>اسم القسم</th>
              <th style={{ padding: "1rem" }}>الشركة</th>
              <th style={{ padding: "1rem" }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "1rem", fontWeight: "600" }}>{cat.name}</td>
                <td style={{ padding: "1rem" }}>
                  <span className="badge" style={{ backgroundColor: cat.company.brandColor, color: "white" }}>
                    {cat.company.name}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={cat.id} />
                    <button type="submit" className="badge" style={{ backgroundColor: "var(--danger)", color: "white" }}>حذف</button>
                  </form>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>لا يوجد أقسام مضافة</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
