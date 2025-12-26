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
import { Smartphone, CreditCard, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentMethods = [
  { id: "mtn", name: "MTN Mobile Money", icon: "🟡" },
  { id: "airtel", name: "Airtel Money", icon: "🔴" },
];

const quickAmounts = [50000, 100000, 200000, 500000];

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("mtn");
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

  const handleDeposit = async () => {
    if (!amount || !phone) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    onOpenChange(false);
    
    toast({
      title: "Deposit Initiated",
      description: `${formatCurrency(Number(amount))} deposit request sent. Check your phone for confirmation.`,
    });

    // Reset form
    setAmount("");
    setPhone("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Deposit Funds</DialogTitle>
          <DialogDescription>
            Add money to your wallet via mobile money
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (UGX)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg h-12"
            />
            {/* Quick Amounts */}
            <div className="flex gap-2 flex-wrap">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(String(amt))}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    amount === String(amt)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {formatCurrency(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                    selectedMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-sm font-medium">{method.name}</span>
                  {selectedMethod === method.id && (
                    <Check className="h-4 w-4 text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="0770 123 456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            variant="action"
            size="xl"
            className="w-full"
            onClick={handleDeposit}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : `Deposit ${amount ? formatCurrency(Number(amount)) : ""}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
