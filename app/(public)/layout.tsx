import { ClientEffects } from "@/components/effects/ClientEffects";
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
      {children}
      <SiteFooter />
      <ScrollToTopButton />
    </>
  );
}
