import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionItem, Transaction } from "@/components/TransactionItem";
import { DepositModal } from "@/components/DepositModal";
import { WithdrawModal } from "@/components/WithdrawModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownToLine, ArrowUpFromLine, Search, Filter, X } from "lucide-react";

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
    category: "Deposit",
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense" | "blocked">("all");

  const withdrawableBalance = 125000;

  const filteredTransactions = mockTransactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card px-4 pt-12 pb-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground mb-6">Wallet</h1>

        {/* Balance Cards */}
        <div className="space-y-3 mb-6">
          <BalanceCard
            title="Total Balance"
            amount={610000}
            variant="primary"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="action" 
            className="flex-1" 
            size="lg"
            onClick={() => setDepositOpen(true)}
          >
            <ArrowDownToLine className="h-5 w-5" />
            Deposit
          </Button>
          <Button 
            variant="success" 
            className="flex-1" 
            size="lg"
            onClick={() => setWithdrawOpen(true)}
          >
            <ArrowUpFromLine className="h-5 w-5" />
            Withdraw
          </Button>
        </div>
      </header>

      {/* Transaction History */}
      <main className="px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Transaction History
          </h2>
          <div className="flex gap-2">
            <Button 
              variant={searchOpen ? "default" : "outline"} 
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="mb-4 animate-fade-in">
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11"
            />
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {(["all", "income", "expense", "blocked"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filterType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
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
