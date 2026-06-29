export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Wifi, Phone, CalendarDays, CheckCircle2 } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/MotionDiv";

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const companyId = parseInt(resolvedParams.id);
  
  if (isNaN(companyId)) return notFound();

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      categories: {
        include: { packages: true }
      }
    }
  });

  if (!company) return notFound();

  return (
    <div className="container" style={{ padding: "5rem 0" }}>
      <FadeIn delay={0.1}>
        <div style={{ marginBottom: "4rem" }}>
          <Link href="/" className="btn btn-glass" style={{ marginBottom: "3rem" }}>
            <ArrowRight size={18} /> العودة للرئيسية
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {company.logoUrl ? (
              <div style={{ 
                width: "100px", height: "100px", 
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "50%",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.1)"
              }}>
                <img src={company.logoUrl} alt={company.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
            ) : (
              <div style={{ 
                width: "100px", height: "100px", 
                backgroundColor: company.brandColor, 
                borderRadius: "50%",
                boxShadow: `0 10px 30px ${company.brandColor}80`
              }}></div>
            )}
            <h1 className="heading-xl" style={{ marginBottom: 0 }}>
              باقات وعروض {company.name}
            </h1>
          </div>
        </div>
      </FadeIn>

      {company.categories.length === 0 ? (
        <FadeIn delay={0.2} className="card" style={{ textAlign: "center", padding: "5rem" }}>
          <p className="text-muted" style={{ fontSize: "1.25rem", fontWeight: 500 }}>لا يوجد باقات مضافة لهذه الشركة بعد.</p>
        </FadeIn>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "5rem" }}>
          {company.categories.map((category, index) => (
            <FadeIn delay={0.2 + (index * 0.1)} key={category.id}>
              <h2 className="heading-lg" style={{ 
                borderBottom: `2px solid var(--border)`, 
                paddingBottom: "1rem", 
                display: "flex",
                alignItems: "center",
                gap: "1rem"
              }}>
                <span style={{ width: "8px", height: "32px", borderRadius: "4px", backgroundColor: company.brandColor, display: "inline-block" }}></span>
                {category.name}
              </h2>
              
              <StaggerContainer className="grid grid-cols-3">
                {category.packages.length === 0 ? (
                  <p className="text-muted" style={{ gridColumn: "1 / -1", fontSize: "1.1rem" }}>لا يوجد باقات في هذا القسم.</p>
                ) : (
                  category.packages.map(pkg => (
                    <StaggerItem key={pkg.id}>
                      <HoverCard className="card" style={{ height: "100%", display: "flex", flexDirection: "column", borderTop: `4px solid ${company.brandColor}` }}>
                        <div style={{ marginBottom: "2rem" }}>
                          <h3 className="heading-md" style={{ color: company.brandColor }}>{pkg.name}</h3>
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
                              <span className="text-muted" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Wifi size={18} /> الإنترنت
                              </span>
                              <span style={{ fontWeight: 600 }}>{pkg.data}</span>
                            </div>
                          )}
                          
                          {pkg.minutes && (
                            <div className="detail-row">
                              <span className="text-muted" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Phone size={18} /> الدقائق
                              </span>
                              <span style={{ fontWeight: 600 }}>{pkg.minutes}</span>
                            </div>
                          )}
                          
                          {pkg.validity && (
                            <div className="detail-row">
                              <span className="text-muted" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <CalendarDays size={18} /> الصلاحية
                              </span>
                              <span style={{ fontWeight: 600 }}>{pkg.validity}</span>
                            </div>
                          )}

                          {pkg.benefits && (
                            <div style={{ marginTop: "1.5rem", padding: "1.25rem", background: "rgba(0,0,0,0.3)", borderRadius: "16px", display: "flex", gap: "0.75rem", alignItems: "flex-start", border: "1px solid rgba(255,255,255,0.05)" }}>
                              <CheckCircle2 size={20} style={{ color: company.brandColor, flexShrink: 0, marginTop: "2px" }} />
                              <div>
                                <span style={{ color: company.brandColor, display: "block", marginBottom: "0.25rem", fontWeight: 700, fontSize: "0.9rem" }}>المزايا</span>
                                <p style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>{pkg.benefits}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {pkg.activationMethod && (
                          <div style={{ marginTop: "auto", background: "rgba(0,0,0,0.3)", padding: "1.25rem", borderRadius: "16px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            <span className="text-muted" style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>طريقة التفعيل</span>
                            <strong style={{ fontSize: "1.05rem" }}>{pkg.activationMethod}</strong>
                          </div>
                        )}
                      </HoverCard>
                    </StaggerItem>
                  ))
                )}
              </StaggerContainer>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
