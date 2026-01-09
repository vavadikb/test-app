import { getProfitSeries, getWalletSummary } from "./actions";
import { WalletCard } from "./components/WalletCard";
import { ProfitCard } from "./components/ProfitCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [summary, profit] = await Promise.all([
    getWalletSummary(),
    getProfitSeries("6H")
  ]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 gap-6 bg-[color:var(--bg)]">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch max-w-[1200px] w-full">
        <WalletCard summary={summary} />
        <ProfitCard initialSeries={profit} initialTimeframe="6H" />
      </div>
    </main>
  );
}
