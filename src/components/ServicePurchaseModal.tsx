import { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";

interface ServicePurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceName: string;
  serviceIcon: React.ReactNode;
}

const quickAmounts: Record<string, number[]> = {
  Airtime: [1000, 2000, 5000, 10000],
  Data: [5000, 10000, 20000, 50000],
  Electricity: [20000, 50000, 100000, 200000],
  Water: [20000, 50000, 100000, 200000],
  TV: [30000, 50000, 80000, 150000],
};

const providers: Record<string, { id: string; name: string; icon: string }[]> = {
  Airtime: [
    { id: "mtn", name: "MTN", icon: "🟡" },
    { id: "airtel", name: "Airtel", icon: "🔴" },
    { id: "lycamobile", name: "Lycamobile", icon: "🟢" },
  ],
  Data: [
    { id: "mtn", name: "MTN", icon: "🟡" },
    { id: "airtel", name: "Airtel", icon: "🔴" },
  ],
  Electricity: [{ id: "umeme", name: "UMEME Yaka", icon: "⚡" }],
  Water: [{ id: "nwsc", name: "NWSC", icon: "💧" }],
  TV: [
    { id: "dstv", name: "DSTV", icon: "📺" },
    { id: "gotv", name: "GOtv", icon: "📡" },
    { id: "startimes", name: "StarTimes", icon: "⭐" },
  ],
};

// Map service names to likely budget category names
const serviceToCategoryMap: Record<string, string> = {
  Airtime: "Airtime & Data",
  Data: "Airtime & Data",
  Electricity: "Utilities",
  Water: "Utilities",
  TV: "Entertainment",
};

export function ServicePurchaseModal({ open, onOpenChange, serviceName, serviceIcon }: ServicePurchaseModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { budgets, spendFromBudget, wallet } = useWallet();

  const amounts = quickAmounts[serviceName] || [5000, 10000, 20000, 50000];
  const serviceProviders = providers[serviceName] || [{ id: "default", name: serviceName, icon: "📦" }];

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

  const accountLabel = serviceName === "Airtime" || serviceName === "Data" ? "Phone Number"
    : serviceName === "Electricity" ? "Meter Number"
    : serviceName === "Water" ? "Customer Reference"
    : serviceName === "TV" ? "Smart Card / IUC Number"
    : serviceName === "School Fees" ? "Student ID / PRN"
    : "Account Number";

  // Find matching budget categories
  const suggestedCategoryName = serviceToCategoryMap[serviceName];
  const matchingBudgets = budgets.filter(b => {
    if (suggestedCategoryName && b.name === suggestedCategoryName) return true;
    return false;
  });
  const availableBudgets = budgets.filter(b => (b.allocatedAmount - b.spentAmount) > 0);

  const handlePurchase = async () => {
    if (!amount || !accountNumber) {
      toast({ title: "Missing Information", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const amt = Number(amount);
    setIsLoading(true);
    try {
      if (selectedCategoryId) {
        // Spend from budget category
        await spendFromBudget(amt, `${serviceName} - ${accountNumber}`, selectedCategoryId);
      } else {
        // No category selected - check if they have enough balance anyway
        if (amt > wallet.balance) {
          toast({ title: "Insufficient Balance", description: "Not enough funds in your wallet", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        // Just record as a general expense (no category)
        const { supabase } = await import("@/integrations/supabase/client");
        const { useAuth } = await import("@/hooks/useAuth");
        // We already have spendFromBudget but need a general spend. Use withdraw instead.
        toast({ title: "Select a Budget", description: "Please select a budget category to spend from", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      onOpenChange(false);
      toast({ title: "Payment Successful", description: `${formatCurrency(amt)} ${serviceName} payment processed.` });
      setAmount(""); setSelectedProvider(""); setAccountNumber(""); setSelectedCategoryId(null);
    } catch (e: any) {
      toast({ title: "Payment Failed", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) { setAmount(""); setSelectedProvider(""); setAccountNumber(""); setSelectedCategoryId(null); }
    onOpenChange(open);
  };

  // Auto-select matching budget
  const autoCategory = matchingBudgets.length === 1 && !selectedCategoryId ? matchingBudgets[0].id : selectedCategoryId;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {serviceIcon}
            <div>
              <DialogTitle className="text-xl">Buy {serviceName}</DialogTitle>
              <DialogDescription>Quick & instant payment</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {serviceProviders.length > 1 && (
            <div className="space-y-2">
              <Label>Provider</Label>
              <div className="grid grid-cols-2 gap-2">
                {serviceProviders.map((provider) => (
                  <button key={provider.id} onClick={() => setSelectedProvider(provider.id)}
                    className={cn("flex items-center gap-2 p-3 rounded-xl border-2 transition-all",
                      selectedProvider === provider.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}>
                    <span className="text-xl">{provider.icon}</span>
                    <span className="text-sm font-medium">{provider.name}</span>
                    {selectedProvider === provider.id && <Check className="h-4 w-4 text-primary ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>{accountLabel}</Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder={`Enter ${accountLabel.toLowerCase()}`} value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)} className="pl-10 h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Amount (UGX)</Label>
            <Input type="number" placeholder="Enter amount" value={amount}
              onChange={(e) => setAmount(e.target.value)} className="text-lg h-12" />
            <div className="flex gap-2 flex-wrap">
              {amounts.map((amt) => (
                <button key={amt} onClick={() => setAmount(String(amt))}
                  className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    amount === String(amt) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}>
                  {formatCurrency(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Category Selection */}
          {availableBudgets.length > 0 && (
            <div className="space-y-2">
              <Label>Pay from Budget</Label>
              <div className="space-y-2">
                {availableBudgets.map((b) => {
                  const rem = b.allocatedAmount - b.spentAmount;
                  const isSelected = (autoCategory || selectedCategoryId) === b.id;
                  return (
                    <button key={b.id} onClick={() => setSelectedCategoryId(b.id)}
                      className={cn("w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left",
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      )}>
                      <div>
                        <span className="text-sm font-medium">{b.name}</span>
                        <p className="text-[11px] text-muted-foreground">{formatCurrency(rem)} remaining</p>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Button variant="action" size="xl" className="w-full" onClick={handlePurchase}
            disabled={isLoading || !amount || !accountNumber || (!selectedCategoryId && !autoCategory)}>
            {isLoading ? "Processing..." : `Pay ${amount ? formatCurrency(Number(amount)) : ""}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
