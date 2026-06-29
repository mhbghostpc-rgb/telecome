import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminPackages() {
  const categories = await prisma.category.findMany({
    include: { company: true },
    orderBy: { companyId: "asc" }
  });

  const packages = await prisma.package.findMany({
    include: {
      category: {
        include: { company: true }
      }
    },
    orderBy: { categoryId: "asc" }
  });

  async function createPackage(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const categoryId = parseInt(formData.get("categoryId") as string);
    const priceNew = parseFloat(formData.get("priceNew") as string) || null;
    const priceRecharge = parseFloat(formData.get("priceRecharge") as string) || null;
    const data = formData.get("data") as string;
    const minutes = formData.get("minutes") as string;
    const validity = formData.get("validity") as string;
    const benefits = formData.get("benefits") as string;
    const activationMethod = formData.get("activationMethod") as string;
    
    if (name && categoryId) {
      await prisma.package.create({
        data: {
          name, categoryId, priceNew, priceRecharge, data, minutes, validity, benefits, activationMethod
        }
      });
      revalidatePath("/admin/dashboard/packages");
    }
  }

  async function deletePackage(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    if (id) {
      await prisma.package.delete({ where: { id } });
      revalidatePath("/admin/dashboard/packages");
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: "2rem" }}>إدارة الباقات</h2>
      
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>إضافة باقة جديدة</h3>
        <form action={createPackage} className="grid grid-cols-2">
          <div className="input-group">
            <label>القسم (الشركة - القسم)</label>
            <select name="categoryId" className="input-field" required>
              <option value="">-- اختر القسم --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.company.name} - {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>اسم الباقة</label>
            <input type="text" name="name" className="input-field" required />
          </div>
          <div className="input-group">
            <label>السعر كشريحة جديدة (ريال)</label>
            <input type="number" step="0.01" name="priceNew" className="input-field" />
          </div>
          <div className="input-group">
            <label>السعر كشحن (ريال)</label>
            <input type="number" step="0.01" name="priceRecharge" className="input-field" />
          </div>
          <div className="input-group">
            <label>البيانات (الإنترنت)</label>
            <input type="text" name="data" placeholder="مثال: 50 جيجا" className="input-field" />
          </div>
          <div className="input-group">
            <label>الدقائق</label>
            <input type="text" name="minutes" placeholder="مثال: لا محدود" className="input-field" />
          </div>
          <div className="input-group">
            <label>الصلاحية</label>
            <input type="text" name="validity" placeholder="مثال: 4 أسابيع" className="input-field" />
          </div>
          <div className="input-group">
            <label>طريقة التفعيل</label>
            <input type="text" name="activationMethod" placeholder="مثال: أرسل 123 إلى 900" className="input-field" />
          </div>
          <div className="input-group" style={{ gridColumn: "1 / -1" }}>
            <label>مزايا إضافية</label>
            <textarea name="benefits" className="input-field" rows={3}></textarea>
          </div>
          <div className="input-group" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem" }}>إضافة الباقة</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "1rem" }}>الباقات الحالية</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "right" }}>
                <th style={{ padding: "1rem" }}>الباقة</th>
                <th style={{ padding: "1rem" }}>الشركة والقسم</th>
                <th style={{ padding: "1rem" }}>السعر (جديد/شحن)</th>
                <th style={{ padding: "1rem" }}>البيانات</th>
                <th style={{ padding: "1rem" }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1rem", fontWeight: "600" }}>{pkg.name}</td>
                  <td style={{ padding: "1rem" }}>
                    <span className="badge" style={{ backgroundColor: pkg.category.company.brandColor, color: "white", marginBottom: "4px", display: "inline-block" }}>
                      {pkg.category.company.name}
                    </span>
                    <br />
                    <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>{pkg.category.name}</span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div>جديد: {pkg.priceNew ? `${pkg.priceNew} ر.س` : '-'}</div>
                    <div>شحن: {pkg.priceRecharge ? `${pkg.priceRecharge} ر.س` : '-'}</div>
                  </td>
                  <td style={{ padding: "1rem" }}>{pkg.data || '-'}</td>
                  <td style={{ padding: "1rem" }}>
                    <form action={deletePackage}>
                      <input type="hidden" name="id" value={pkg.id} />
                      <button type="submit" className="badge" style={{ backgroundColor: "var(--danger)", color: "white" }}>حذف</button>
                    </form>
                  </td>
                </tr>
              ))}
              {packages.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>لا يوجد باقات مضافة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
