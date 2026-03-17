import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { PullToRefresh } from "@/components/PullToRefresh";
import { FundDistribution } from "@/components/FundDistribution";
import { MoneyPoolCard } from "@/components/MoneyPoolCard";
import { TransactionItem, Transaction } from "@/components/TransactionItem";
import { DepositModal } from "@/components/DepositModal";
import { WithdrawModal } from "@/components/WithdrawModal";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Wallet2, PiggyBank, LayoutGrid, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Wallet() {
  const navigate = useNavigate();
  const { wallet, transactions, budgets, deposit, withdraw, refetch } = useWallet();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense" | "blocked">("all");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const { toast } = useToast();

  const budgetedBalance = budgets.reduce((sum, b) => sum + (b.allocatedAmount - b.spentAmount), 0);
  const savingsBalance = wallet.savingsBalance;
  const availableBalance = wallet.balance - Math.max(budgetedBalance, 0);
  const savingsLocked = wallet.savingsLockedUntil ? new Date(wallet.savingsLockedUntil) > new Date() : false;
  const lockDate = wallet.savingsLockedUntil ? new Date(wallet.savingsLockedUntil).toLocaleDateString("en-UG", { month: "short", day: "numeric", year: "numeric" }) : null;

  const displayTransactions: Transaction[] = transactions.map(t => ({
    id: t.id,
    type: t.type as any,
    category: t.category,
    description: t.description,
    amount: t.amount,
    date: t.date,
    status: t.status,
  }));

  const filteredTransactions = displayTransactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || t.type === filterType;
    const matchesStatus = statusFilter === "All Status" ||
                          (statusFilter === "Completed" && t.status === "confirmed") ||
                          (statusFilter === "Pending" && t.status === "pending");
    return matchesSearch && matchesFilter && matchesStatus;
  });

  return (
    <PullToRefresh onRefresh={async () => { await refetch(); toast({ title: "Refreshed" }); }} className="min-h-screen">
    <div className="gradient-bg pb-24">
      <header className="px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">‹</button>
          <h1 className="text-lg font-semibold text-foreground">My Wallet</h1>
          <button onClick={() => toast({ title: "Wallet Info", description: "Your money is split into 3 pools." })} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">ⓘ</button>
        </div>
      </header>

      <main className="px-4 space-y-5">
        <section className="animate-fade-in">
          <FundDistribution available={Math.max(availableBalance, 0)} budgeted={Math.max(budgetedBalance, 0)} savings={savingsBalance} />
        </section>

        <section className="space-y-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Money Pools</h2>
          <MoneyPoolCard title="Available Balance" amount={Math.max(availableBalance, 0)} description="Unallocated funds you can spend or budget" icon={Wallet2} variant="available" actionLabel="Withdraw" onAction={() => setWithdrawOpen(true)} />
          <MoneyPoolCard title="Budgeted Funds" amount={Math.max(budgetedBalance, 0)} description="Allocated across your budget categories" icon={LayoutGrid} variant="budgeted" actionLabel="View Budgets" onAction={() => navigate("/budget")} />
          <MoneyPoolCard title="Savings (Locked)" amount={savingsBalance} description={savingsLocked && lockDate ? `Locked until ${lockDate} • ${wallet.savingsRate}% of deposits` : `${wallet.savingsRate}% of each deposit`} icon={PiggyBank} variant="savings" actionLabel="View Savings" onAction={() => navigate("/savings")} />
        </section>

        <section className="flex gap-3 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <button onClick={() => setDepositOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
            <ArrowDownToLine className="h-4 w-4" /> Deposit
          </button>
          <button onClick={() => setWithdrawOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted/50 transition-colors">
            <ArrowUpFromLine className="h-4 w-4" /> Withdraw
          </button>
        </section>

        <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Transaction History</h2>
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search Transactions" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-11 h-12 bg-muted/50 border-border rounded-xl" />
          </div>
          <div className="flex gap-2 mb-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-1 flex items-center justify-between px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground">
                  <span>{filterType === "all" ? "All types" : filterType.charAt(0).toUpperCase() + filterType.slice(1)}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => setFilterType("all")}>All types</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("income")}>Income</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("expense")}>Expense</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-1 flex items-center justify-between px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground">
                  <span>{statusFilter}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setStatusFilter("All Status")}>All Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>Completed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>Pending</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="glass-card rounded-2xl p-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p className="text-sm">No transactions yet</p>
                <p className="text-xs mt-1">Deposit funds to get started</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} onDeposit={deposit} />
      <WithdrawModal open={withdrawOpen} onOpenChange={setWithdrawOpen} availableBalance={wallet.balance} onWithdraw={withdraw} />

      <BottomNavigation />
    </div>
    </PullToRefresh>
  );
}
