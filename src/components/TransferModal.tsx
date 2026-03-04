import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightLeft, Loader2, Hash } from "lucide-react";

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: number;
  onTransfer: (amount: number, recipientId: string, note: string) => Promise<void>;
}

export function TransferModal({ open, onOpenChange, availableBalance, onTransfer }: TransferModalProps) {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", minimumFractionDigits: 0 }).format(value);

  const numericAmount = parseInt(amount) || 0;
  const isOverLimit = numericAmount > availableBalance;

  const handleTransfer = async () => {
    if (!accountId.trim()) {
      toast({ title: "Missing Account ID", description: "Please enter the recipient's account ID.", variant: "destructive" });
      return;
    }
    if (numericAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount.", variant: "destructive" });
      return;
    }
    if (isOverLimit) {
      toast({ title: "Insufficient Balance", description: "You don't have enough funds.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await onTransfer(numericAmount, accountId, note);
      toast({ title: "Transfer Successful! ✅", description: `${formatCurrency(numericAmount)} sent to account ${accountId}.` });
      setAccountId("");
      setAmount("");
      setNote("");
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Transfer Failed", description: error.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Transfer Money
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">Available Balance</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(availableBalance)}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Recipient Account ID</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="e.g. 0xA3...9C78" value={accountId} onChange={(e) => setAccountId(e.target.value)} className="pl-9 bg-muted/50 border-border" maxLength={50} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Amount (UGX)</Label>
            <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={`bg-muted/50 border-border ${isOverLimit ? "border-destructive" : ""}`} />
            {isOverLimit && <p className="text-xs text-destructive">Insufficient balance</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Note (optional)</Label>
            <Input placeholder="What's this for?" value={note} onChange={(e) => setNote(e.target.value)} className="bg-muted/50 border-border" maxLength={100} />
          </div>

          <Button onClick={handleTransfer} className="w-full h-12 gradient-primary shadow-glow hover:opacity-90" disabled={loading || isOverLimit || !amount || !accountId}>
            {loading ? (<><Loader2 className="h-4 w-4 animate-spin" />Processing...</>) : (<><ArrowRightLeft className="h-4 w-4" />Send {numericAmount > 0 ? formatCurrency(numericAmount) : "Money"}</>)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
