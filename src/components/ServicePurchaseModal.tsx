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
import { Check, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
  "School Fees": [100000, 500000, 1000000, 2000000],
  Transport: [5000, 10000, 20000, 50000],
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
  Electricity: [
    { id: "umeme", name: "UMEME Yaka", icon: "⚡" },
  ],
  Water: [
    { id: "nwsc", name: "NWSC", icon: "💧" },
  ],
  TV: [
    { id: "dstv", name: "DSTV", icon: "📺" },
    { id: "gotv", name: "GOtv", icon: "📡" },
    { id: "startimes", name: "StarTimes", icon: "⭐" },
  ],
  "School Fees": [
    { id: "direct", name: "Direct Payment", icon: "🏫" },
  ],
  Transport: [
    { id: "safeboda", name: "SafeBoda", icon: "🏍️" },
    { id: "bolt", name: "Bolt", icon: "🚗" },
  ],
};

export function ServicePurchaseModal({
  open,
  onOpenChange,
  serviceName,
  serviceIcon,
}: ServicePurchaseModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const amounts = quickAmounts[serviceName] || [5000, 10000, 20000, 50000];
  const serviceProviders = providers[serviceName] || [{ id: "default", name: serviceName, icon: "📦" }];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const accountLabel = serviceName === "Airtime" || serviceName === "Data"
    ? "Phone Number"
    : serviceName === "Electricity"
    ? "Meter Number"
    : serviceName === "Water"
    ? "Customer Reference"
    : serviceName === "TV"
    ? "Smart Card / IUC Number"
    : serviceName === "School Fees"
    ? "Student ID / PRN"
    : "Account Number";

  const handlePurchase = async () => {
    if (!amount || !accountNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onOpenChange(false);

    toast({
      title: "Payment Successful",
      description: `${formatCurrency(Number(amount))} ${serviceName} payment processed successfully.`,
    });

    setAmount("");
    setSelectedProvider("");
    setAccountNumber("");
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setAmount("");
      setSelectedProvider("");
      setAccountNumber("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-2xl max-h-[90vh] overflow-y-auto">
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
          {/* Provider Selection */}
          {serviceProviders.length > 1 && (
            <div className="space-y-2">
              <Label>Provider</Label>
              <div className="grid grid-cols-2 gap-2">
                {serviceProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-xl border-2 transition-all",
                      selectedProvider === provider.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-xl">{provider.icon}</span>
                    <span className="text-sm font-medium">{provider.name}</span>
                    {selectedProvider === provider.id && (
                      <Check className="h-4 w-4 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Account / Phone Number */}
          <div className="space-y-2">
            <Label>{accountLabel}</Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={`Enter ${accountLabel.toLowerCase()}`}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Amount (UGX)</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg h-12"
            />
            <div className="flex gap-2 flex-wrap">
              {amounts.map((amt) => (
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

          {/* Submit */}
          <Button
            variant="action"
            size="xl"
            className="w-full"
            onClick={handlePurchase}
            disabled={isLoading || !amount || !accountNumber}
          >
            {isLoading ? "Processing..." : `Pay ${amount ? formatCurrency(Number(amount)) : ""}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
