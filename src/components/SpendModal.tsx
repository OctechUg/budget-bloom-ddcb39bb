import { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SpendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  categoryName: string;
  remaining: number;
  onSpend: (amount: number, description: string, categoryId: string) => Promise<void>;
}

export function SpendModal({ open, onOpenChange, categoryId, categoryName, remaining, onSpend }: SpendModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

  const handleSpend = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      toast({ title: "Invalid Amount", description: "Enter a valid amount", variant: "destructive" });
      return;
    }
    if (amt > remaining) {
      toast({ title: "Budget Exceeded", description: `You only have ${formatCurrency(remaining)} left in ${categoryName}`, variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await onSpend(amt, description || categoryName, categoryId);
      toast({ title: "Expense Recorded", description: `${formatCurrency(amt)} spent from ${categoryName}` });
      onOpenChange(false);
      setAmount("");
      setDescription("");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Spend from {categoryName}</DialogTitle>
          <DialogDescription>
            Available: {formatCurrency(remaining)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Amount (UGX)</Label>
            <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-lg h-12" />
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Input placeholder="What's this for?" value={description} onChange={(e) => setDescription(e.target.value)} className="h-12" />
          </div>
          <Button variant="action" size="xl" className="w-full" onClick={handleSpend} disabled={isLoading || !amount}>
            {isLoading ? "Processing..." : `Spend ${amount ? formatCurrency(Number(amount)) : ""}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
