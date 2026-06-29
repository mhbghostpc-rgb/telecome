import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/MotionDiv";

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";

  const companies = await prisma.company.findMany({
    orderBy: { createdAt: 'asc' }
  });

  let searchResults = null;
  if (q.trim().length > 0) {
    searchResults = await prisma.package.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { data: { contains: q } },
          { minutes: { contains: q } },
          { benefits: { contains: q } },
        ]
      },
      include: {
        category: {
          include: { company: true }
        }
      }
    });
  }

  async function handleSearch(formData: FormData) {
    "use server";
    const query = formData.get("q") as string;
    if (query) {
      redirect(`/?q=${encodeURIComponent(query)}`);
    } else {
      redirect(`/`);
    }
  }

  return (
    <div className="container" style={{ padding: "5rem 0" }}>
      <FadeIn delay={0.1} className="text-center" style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 className="heading-xl">
          بوابة خدمات الاتصالات
        </h1>
        <p className="text-muted" style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto 3rem auto", lineHeight: 1.6 }}>
          استكشف وقارن أحدث الباقات والعروض من جميع شركات الاتصالات السعودية، في مكان واحد وبواجهة عصرية وسريعة.
        </p>
        
        <form action={handleSearch} className="search-container">
          <input 
            type="text" 
            name="q"
            defaultValue={q}
            className="search-input" 
            placeholder="ابحث عن باقة بالاسم، المزايا، أو البيانات..." 
          />
          <button type="submit" style={{ position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
            <Search size={24} className="search-icon" style={{ position: "static", transform: "none" }} />
          </button>
        </form>
      </FadeIn>

      {q ? (
        <FadeIn delay={0.2}>
          <h2 className="heading-lg text-center" style={{ textAlign: "center" }}>نتائج البحث عن: &quot;{q}&quot;</h2>
          {searchResults?.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
              <p className="text-muted" style={{ fontSize: "1.2rem" }}>لا توجد باقات تطابق بحثك. جرب كلمات مفتاحية أخرى.</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-3">
              {searchResults?.map(pkg => (
                <StaggerItem key={pkg.id}>
                  <HoverCard className="card" style={{ height: "100%", display: "flex", flexDirection: "column", borderTop: `4px solid ${pkg.category.company.brandColor}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                      <h3 className="heading-md" style={{ color: pkg.category.company.brandColor }}>{pkg.name}</h3>
                      <span className="badge" style={{ backgroundColor: pkg.category.company.brandColor, color: "white" }}>{pkg.category.company.name}</span>
                    </div>
                    
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", marginBottom: "2rem" }}>
                      {(pkg.priceNew || pkg.priceRecharge) && (
                        <div className="detail-row" style={{ borderBottom: "none", background: "rgba(0,0,0,0.3)", padding: "1.25rem", borderRadius: "16px", marginBottom: "1rem" }}>
                          <span style={{ fontWeight: 600 }}>السعر:</span>
                          <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                            {pkg.priceNew ? `${pkg.priceNew} ر.س` : `${pkg.priceRecharge} ر.س (شحن)`}
                          </span>
                        </div>
                      )}
                      
                      {pkg.data && (
                        <div className="detail-row">
                          <span className="text-muted">الإنترنت</span>
                          <span style={{ fontWeight: 600 }}>{pkg.data}</span>
                        </div>
                      )}
                      
                      {pkg.minutes && (
                        <div className="detail-row">
                          <span className="text-muted">الدقائق</span>
                          <span style={{ fontWeight: 600 }}>{pkg.minutes}</span>
                        </div>
                      )}
                      
                      {pkg.validity && (
                        <div className="detail-row">
                          <span className="text-muted">الصلاحية</span>
                          <span style={{ fontWeight: 600 }}>{pkg.validity}</span>
                        </div>
                      )}

                      {pkg.benefits && (
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className="text-muted" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>مزايا إضافية</span>
                          <p style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>{pkg.benefits}</p>
                        </div>
                      )}
                    </div>

                    {pkg.activationMethod && (
                      <div style={{ marginTop: "auto", background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "16px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <span className="text-muted" style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>طريقة التفعيل</span>
                        <strong style={{ fontSize: "1.05rem" }}>{pkg.activationMethod}</strong>
                      </div>
                    )}
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </FadeIn>
      ) : (
        <FadeIn delay={0.2}>
          <h2 className="heading-lg" style={{ textAlign: "center", marginBottom: "3rem" }}>شركات الاتصالات</h2>
          <StaggerContainer className="grid grid-cols-3">
            {companies.map((company) => (
              <StaggerItem key={company.id}>
                <Link href={`/company/${company.id}`}>
                  <HoverCard 
                    className="card" 
                    style={{ 
                      textAlign: "center", 
                      padding: "3rem 2rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "1.5rem",
                      cursor: "pointer"
                    }}
                  >
                    {company.logoUrl ? (
                      <div style={{ 
                        width: "100px", height: "100px", 
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "0.5rem",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "50%",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.1)",
                        marginBottom: "1rem"
                      }}>
                        <img src={company.logoUrl} alt={company.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      </div>
                    ) : (
                      <div style={{ 
                        width: "100px", height: "100px", 
                        borderRadius: "50%", 
                        background: company.brandColor,
                        boxShadow: `0 10px 30px ${company.brandColor}80`,
                        marginBottom: "1rem"
                      }}></div>
                    )}
                    <div>
                      <h2 className="heading-md" style={{ marginBottom: "0.25rem" }}>
                        {company.name}
                      </h2>
                      <span className="text-muted" style={{ fontSize: "0.95rem" }}>استعرض الباقات والعروض</span>
                    </div>
                  </HoverCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </FadeIn>
      )}
    </div>
  );
}
