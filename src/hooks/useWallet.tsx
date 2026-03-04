import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface WalletData {
  balance: number;
  totalDeposited: number;
  totalWithdrawn: number;
}

export interface TransactionData {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: string;
  icon?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  allocatedAmount: number;
  spentAmount: number;
  periodMonth: string;
  status: string;
}

export function useWallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData>({ balance: 0, totalDeposited: 0, totalWithdrawn: 0 });
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWallet = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (data) {
      setWallet({
        balance: data.balance,
        totalDeposited: data.total_deposited,
        totalWithdrawn: data.total_withdrawn,
      });
    }
  }, [user]);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("transactions")
      .select("*, budget_categories(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) {
      setTransactions(
        data.map((t) => ({
          id: t.id,
          type: t.type === "deposit" ? "income" : t.type === "withdrawal" ? "income" : "expense",
          category: (t.budget_categories as any)?.name || t.type.charAt(0).toUpperCase() + t.type.slice(1),
          description: t.description || t.type,
          amount: t.type === "deposit" ? t.amount : -t.amount,
          date: new Date(t.created_at).toLocaleDateString("en-UG", { month: "short", day: "numeric", year: "numeric" }),
          status: t.status,
        }))
      );
    }
  }, [user]);

  const fetchBudgets = useCallback(async () => {
    if (!user) return;
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { data } = await supabase
      .from("budget_categories")
      .select("*")
      .eq("user_id", user.id)
      .eq("period_month", currentMonth);
    if (data) {
      setBudgets(
        data.map((b) => ({
          id: b.id,
          name: b.name,
          icon: b.icon,
          allocatedAmount: b.allocated_amount,
          spentAmount: b.spent_amount,
          periodMonth: b.period_month,
          status: b.status,
        }))
      );
    }
  }, [user]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchWallet(), fetchTransactions(), fetchBudgets()]);
    setLoading(false);
  }, [fetchWallet, fetchTransactions, fetchBudgets]);

  useEffect(() => {
    if (user) {
      refetch();
    } else {
      setWallet({ balance: 0, totalDeposited: 0, totalWithdrawn: 0 });
      setTransactions([]);
      setBudgets([]);
      setLoading(false);
    }
  }, [user, refetch]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("wallet-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "wallets", filter: `user_id=eq.${user.id}` }, () => fetchWallet())
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions", filter: `user_id=eq.${user.id}` }, () => { fetchTransactions(); fetchWallet(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "budget_categories", filter: `user_id=eq.${user.id}` }, () => fetchBudgets())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchWallet, fetchTransactions, fetchBudgets]);

  const deposit = async (amount: number, description: string) => {
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      type: "deposit",
      amount,
      description,
      status: "confirmed",
    });
    if (error) throw error;
  };

  const withdraw = async (amount: number, description: string) => {
    if (!user) throw new Error("Not authenticated");
    if (amount > wallet.balance) throw new Error("Insufficient balance");
    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      type: "withdrawal",
      amount,
      description,
      status: "confirmed",
    });
    if (error) throw error;
  };

  const transfer = async (amount: number, recipientId: string, note: string) => {
    if (!user) throw new Error("Not authenticated");
    if (amount > wallet.balance) throw new Error("Insufficient balance");
    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      type: "withdrawal",
      amount,
      description: `Transfer to ${recipientId}${note ? `: ${note}` : ""}`,
      status: "confirmed",
    });
    if (error) throw error;
  };

  const setBudget = async (categoryName: string, icon: string, amount: number) => {
    if (!user) throw new Error("Not authenticated");
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Check if category already exists for this month
    const { data: existing } = await supabase
      .from("budget_categories")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", categoryName)
      .eq("period_month", currentMonth)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("budget_categories")
        .update({ allocated_amount: amount, icon })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("budget_categories").insert({
        user_id: user.id,
        name: categoryName,
        icon,
        allocated_amount: amount,
        period_month: currentMonth,
      });
      if (error) throw error;
    }
  };

  const deleteBudget = async (categoryId: string) => {
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase
      .from("budget_categories")
      .delete()
      .eq("id", categoryId);
    if (error) throw error;
  };

  return {
    wallet,
    transactions,
    budgets,
    loading,
    deposit,
    withdraw,
    transfer,
    setBudget,
    deleteBudget,
    refetch,
  };
}
