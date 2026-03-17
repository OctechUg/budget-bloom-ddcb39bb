import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  Smartphone,
  Building2,
  Trash2,
  CheckCircle2,
  Star,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  type: "mobile_money" | "bank";
  provider: string;
  accountNumber: string;
  isDefault: boolean;
}

const MOBILE_PROVIDERS = [
  { id: "mtn", name: "MTN Mobile Money", color: "bg-yellow-500" },
  { id: "airtel", name: "Airtel Money", color: "bg-red-500" },
];

const BANKS = [
  { id: "stanbic", name: "Stanbic Bank" },
  { id: "dfcu", name: "DFCU Bank" },
  { id: "centenary", name: "Centenary Bank" },
  { id: "equity", name: "Equity Bank" },
  { id: "absa", name: "Absa Bank" },
];

export default function PaymentMethods() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "mobile_money", provider: "MTN Mobile Money", accountNumber: "0770 *** 456", isDefault: true },
  ]);

  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState<"mobile_money" | "bank" | null>(null);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAdd = () => {
    if (!selectedProvider || !accountNumber) {
      toast({ title: "Missing Info", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: addType!,
      provider: selectedProvider,
      accountNumber: accountNumber,
      isDefault: methods.length === 0,
    };

    setMethods([...methods, newMethod]);
    setAddOpen(false);
    setAddType(null);
    setSelectedProvider("");
    setAccountNumber("");
    setAccountName("");
    toast({ title: "Added", description: `${selectedProvider} has been added.` });
  };

  const handleDelete = (id: string) => {
    const wasDefault = methods.find((m) => m.id === id)?.isDefault;
    const remaining = methods.filter((m) => m.id !== id);
    if (wasDefault && remaining.length > 0) {
      remaining[0].isDefault = true;
    }
    setMethods(remaining);
    setDeleteConfirm(null);
    toast({ title: "Removed", description: "Payment method has been removed." });
  };

  const handleSetDefault = (id: string) => {
    setMethods(methods.map((m) => ({ ...m, isDefault: m.id === id })));
    toast({ title: "Default Updated", description: "Default payment method changed." });
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <PullToRefresh onRefresh={async () => {}} className="min-h-screen">
      <div className="gradient-bg pb-24">
        {/* Header */}
        <header className="px-4 pt-12 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Payment Methods</h1>
          </div>
        </header>

        <main className="px-4 space-y-6">
          {/* Existing Methods */}
          {methods.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium mb-1">No payment methods</p>
              <p className="text-sm text-muted-foreground">Add a mobile money account or bank to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {methods.map((method) => (
                <div key={method.id} className="glass-card rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      method.type === "mobile_money" ? "bg-primary/10 text-primary" : "bg-accent/50 text-foreground"
                    }`}>
                      {method.type === "mobile_money" ? <Smartphone className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground text-sm">{method.provider}</p>
                        {method.isDefault && (
                          <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{method.accountNumber}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!method.isDefault && (
                        <button onClick={() => handleSetDefault(method.id)} className="w-9 h-9 rounded-xl hover:bg-muted/50 flex items-center justify-center transition-colors">
                          <Star className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                      <button onClick={() => setDeleteConfirm(method.id)} className="w-9 h-9 rounded-xl hover:bg-destructive/10 flex items-center justify-center transition-colors">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Button */}
          <Button onClick={() => setAddOpen(true)} className="w-full gap-2 h-12 rounded-xl" variant="outline">
            <Plus className="h-5 w-5" />
            Add Payment Method
          </Button>
        </main>

        {/* Add Method Dialog */}
        <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) setAddType(null); }}>
          <DialogContent className="sm:max-w-md mx-4 rounded-2xl glass-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {!addType ? "Add Payment Method" : addType === "mobile_money" ? "Add Mobile Money" : "Add Bank Account"}
              </DialogTitle>
              <DialogDescription>
                {!addType ? "Choose a payment method type" : "Enter your account details"}
              </DialogDescription>
            </DialogHeader>

            {!addType ? (
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => setAddType("mobile_money")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm">Mobile Money</p>
                    <p className="text-xs text-muted-foreground">MTN MoMo, Airtel Money</p>
                  </div>
                </button>
                <button
                  onClick={() => setAddType("bank")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm">Bank Account</p>
                    <p className="text-xs text-muted-foreground">Link your bank account</p>
                  </div>
                </button>
              </div>
            ) : addType === "mobile_money" ? (
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Provider</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {MOBILE_PROVIDERS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProvider(p.name)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                          selectedProvider === p.name
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-foreground hover:bg-muted/30"
                        }`}
                      >
                        {p.name.replace(" Money", "").replace(" Mobile", "")}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="momo-number" className="text-foreground">Phone Number</Label>
                  <Input
                    id="momo-number"
                    type="tel"
                    placeholder="0770 123 456"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="h-12 bg-muted/50 border-border"
                  />
                </div>
                <Button className="w-full h-12" onClick={handleAdd} disabled={!selectedProvider || !accountNumber}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Add Mobile Money
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Bank</Label>
                  <div className="space-y-2">
                    {BANKS.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedProvider(b.name)}
                        className={`w-full p-3 rounded-xl border text-sm font-medium text-left transition-colors ${
                          selectedProvider === b.name
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-foreground hover:bg-muted/30"
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-num" className="text-foreground">Account Number</Label>
                  <Input
                    id="account-num"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="h-12 bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-name" className="text-foreground">Account Name</Label>
                  <Input
                    id="account-name"
                    placeholder="Enter account holder name"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="h-12 bg-muted/50 border-border"
                  />
                </div>
                <Button className="w-full h-12" onClick={handleAdd} disabled={!selectedProvider || !accountNumber}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Add Bank Account
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-sm mx-4 rounded-2xl glass-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Remove Payment Method</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Remove</Button>
            </div>
          </DialogContent>
        </Dialog>

        <BottomNavigation />
      </div>
    </PullToRefresh>
  );
}
