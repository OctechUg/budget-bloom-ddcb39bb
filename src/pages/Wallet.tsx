import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionItem, Transaction } from "@/components/TransactionItem";
import { DepositModal } from "@/components/DepositModal";
import { WithdrawModal } from "@/components/WithdrawModal";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    category: "Deposit",
    description: "MTN Mobile Money",
    amount: 200000,
    date: "Dec 25, 2025",
  },
  {
    id: "2",
    type: "expense",
    category: "Food & Dining",
    description: "Campus Cafeteria",
    amount: 15000,
    date: "Dec 25, 2025",
  },
  {
    id: "3",
    type: "expense",
    category: "Transport",
    description: "Uber Ride",
    amount: 25000,
    date: "Dec 24, 2025",
  },
  {
    id: "4",
    type: "income",
    category: "Wallet Deposit",
    description: "Airtel Money",
    amount: 150000,
    date: "Dec 23, 2025",
  },
  {
    id: "5",
    type: "expense",
    category: "Shopping",
    description: "Garden City Mall",
    amount: 85000,
    date: "Dec 22, 2025",
  },
  {
    id: "6",
    type: "blocked",
    category: "Entertainment",
    description: "Cinema Tickets",
    amount: 40000,
    date: "Dec 22, 2025",
  },
];

export default function Wallet() {
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense" | "blocked">("all");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const withdrawableBalance = 125000;

  const filteredTransactions = mockTransactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen gradient-bg pb-24">
      {/* Header */}
      <header className="px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground">
            ‹
          </button>
          <h1 className="text-lg font-semibold text-foreground">Transaction</h1>
          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground">
            ⓘ
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Transactions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 bg-muted/50 border-border rounded-xl"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-between px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground">
            <span>All types</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="flex-1 flex items-center justify-between px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground">
            <span>{statusFilter}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Transaction List */}
      <main className="px-4">
        <div className="glass-card rounded-2xl p-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} />
      <WithdrawModal 
        open={withdrawOpen} 
        onOpenChange={setWithdrawOpen} 
        availableBalance={withdrawableBalance}
      />

      <BottomNavigation />
    </div>
  );
}