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
import {
  Utensils, Car, Book, ShoppingBag, Gamepad2, Lightbulb, Phone, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SetBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetBudget: (categoryName: string, icon: string, amount: number) => Promise<void>;
}

const categories = [
  { id: "food", name: "Food & Dining", icon: Utensils, iconKey: "utensils", color: "bg-orange-500" },
  { id: "transport", name: "Transport", icon: Car, iconKey: "car", color: "bg-blue-500" },
  { id: "books", name: "Books & Supplies", icon: Book, iconKey: "book", color: "bg-purple-500" },
  { id: "shopping", name: "Shopping", icon: ShoppingBag, iconKey: "shopping-bag", color: "bg-pink-500" },
  { id: "entertainment", name: "Entertainment", icon: Gamepad2, iconKey: "gamepad-2", color: "bg-green-500" },
  { id: "utilities", name: "Utilities", icon: Lightbulb, iconKey: "lightbulb", color: "bg-yellow-500" },
  { id: "airtime", name: "Airtime & Data", icon: Phone, iconKey: "phone", color: "bg-teal-500" },
];

export function SetBudgetModal({ open, onOpenChange, onSetBudget }: SetBudgetModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency", currency: "UGX", minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSetBudget = async () => {
    if (!selectedCategory || !amount) {
      toast({ title: "Missing Information", description: "Please select a category and enter an amount", variant: "destructive" });
      return;
    }

    const category = categories.find((c) => c.id === selectedCategory);
    if (!category) return;

    setIsLoading(true);
    try {
      await onSetBudget(category.name, category.iconKey, Number(amount));
      onOpenChange(false);
      toast({
        title: "Budget Set Successfully",
        description: `${category.name} budget set to ${formatCurrency(Number(amount))} for this month.`,
      });
      setSelectedCategory(null);
      setAmount("");
    } catch (error: any) {
      toast({ title: "Failed to Set Budget", description: error.message || "Something went wrong", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Set Budget</DialogTitle>
          <DialogDescription>Choose a category and set your spending limit</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", category.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium flex-1">{category.name}</span>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget-amount">Monthly Budget (UGX)</Label>
            <Input id="budget-amount" type="number" placeholder="Enter budget amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-lg h-12" />
            <p className="text-xs text-muted-foreground">You won't be able to spend beyond this limit</p>
          </div>

          <div className="bg-warning/10 rounded-xl p-3 border border-warning/20">
            <p className="text-sm text-foreground">
              <strong>💡 Remember:</strong> Any unspent amount will be moved to your savings at month end!
            </p>
          </div>

          <Button variant="action" size="xl" className="w-full" onClick={handleSetBudget} disabled={isLoading || !selectedCategory || !amount}>
            {isLoading ? "Saving..." : "Set Budget"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
