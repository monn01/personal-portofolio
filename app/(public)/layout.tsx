import { ClientEffects } from "@/components/effects/ClientEffects";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ClientEffects />
      <SiteHeader />
      <div className="pb-20 lg:pb-0">
        {children}
        <SiteFooter />
      </div>
      <MobileBottomNav />
      <ScrollToTopButton />
    </>
  );
}
