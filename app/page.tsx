import HeaderNav from "@/components/HeaderNav";
import PageShell from "@/components/PageShell";
import PortfolioContent from "@/components/PortfolioContent";

export default function Home() {
  return (
    <PageShell>
      <HeaderNav />
      <PortfolioContent />
    </PageShell>
  );
}
