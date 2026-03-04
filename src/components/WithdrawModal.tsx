import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: number;
  onWithdraw: (amount: number, description: string) => Promise<void>;
}

export function WithdrawModal({ open, onOpenChange, availableBalance, onWithdraw }: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isOverLimit = Number(amount) > availableBalance;

  const handleWithdraw = async () => {
    if (!amount || !phone) {
      toast({ title: "Missing Information", description: "Please enter amount and phone number", variant: "destructive" });
      return;
    }
    if (isOverLimit) {
      toast({ title: "Insufficient Balance", description: "You cannot withdraw more than your available balance", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await onWithdraw(Number(amount), `Withdrawal to Mobile Money (${phone})`);
      onOpenChange(false);
      toast({ title: "Withdrawal Successful", description: `${formatCurrency(Number(amount))} has been sent to your mobile money.` });
      setAmount("");
      setPhone("");
    } catch (error: any) {
      toast({ title: "Withdrawal Failed", description: error.message || "Something went wrong", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Withdraw Savings</DialogTitle>
          <DialogDescription>Transfer your savings to mobile money</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="bg-success/10 rounded-2xl p-4 border border-success/20">
            <p className="text-sm text-muted-foreground mb-1">Available to withdraw</p>
            <p className="text-2xl font-bold text-success">{formatCurrency(availableBalance)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="withdraw-amount">Amount (UGX)</Label>
              <button onClick={() => setAmount(String(availableBalance))} className="text-xs font-medium text-primary hover:underline">
                Withdraw All
              </button>
            </div>
            <Input
              id="withdraw-amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`text-lg h-12 ${isOverLimit ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {isOverLimit && (
              <div className="flex items-center gap-1 text-destructive text-xs">
                <AlertCircle className="h-3 w-3" />
                <span>Amount exceeds available balance</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdraw-phone">Receive on</Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="withdraw-phone"
                type="tel"
                placeholder="0770 123 456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <Button
            variant="success"
            size="xl"
            className="w-full"
            onClick={handleWithdraw}
            disabled={isLoading || isOverLimit || !amount}
          >
            {isLoading ? "Processing..." : `Withdraw ${amount ? formatCurrency(Number(amount)) : ""}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
