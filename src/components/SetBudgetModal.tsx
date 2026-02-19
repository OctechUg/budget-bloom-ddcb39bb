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
  Utensils,
  Car,
  Book,
  ShoppingBag,
  Gamepad2,
  Lightbulb,
  Phone,
  Plus,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SetBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { id: "food", name: "Food & Dining", icon: Utensils, color: "bg-orange-500" },
  { id: "transport", name: "Transport", icon: Car, color: "bg-blue-500" },
  { id: "books", name: "Books & Supplies", icon: Book, color: "bg-purple-500" },
  { id: "shopping", name: "Shopping", icon: ShoppingBag, color: "bg-pink-500" },
  { id: "entertainment", name: "Entertainment", icon: Gamepad2, color: "bg-green-500" },
  { id: "utilities", name: "Utilities", icon: Lightbulb, color: "bg-yellow-500" },
  { id: "airtime", name: "Airtime & Data", icon: Phone, color: "bg-teal-500" },
];

export function SetBudgetModal({ open, onOpenChange }: SetBudgetModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
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

  const handleSetBudget = async () => {
    if (!selectedCategory || !amount) {
      toast({
        title: "Missing Information",
        description: "Please select a category and enter an amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const category = categories.find((c) => c.id === selectedCategory);
    
    setIsLoading(false);
    onOpenChange(false);
    
    toast({
      title: "Budget Set Successfully",
      description: `${category?.name} budget set to ${formatCurrency(Number(amount))} for this month.`,
    });

    // Reset form
    setSelectedCategory(null);
    setAmount("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Set Budget</DialogTitle>
          <DialogDescription>
            Choose a category and set your spending limit
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Category Selection */}
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
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", category.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium flex-1">{category.name}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="budget-amount">Monthly Budget (UGX)</Label>
            <Input
              id="budget-amount"
              type="number"
              placeholder="Enter budget amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg h-12"
            />
            <p className="text-xs text-muted-foreground">
              You won't be able to spend beyond this limit
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-warning/10 rounded-xl p-3 border border-warning/20">
            <p className="text-sm text-foreground">
              <strong>💡 Remember:</strong> Any unspent amount will be moved to your savings at month end!
            </p>
          </div>

          {/* Submit Button */}
          <Button
            variant="action"
            size="xl"
            className="w-full"
            onClick={handleSetBudget}
            disabled={isLoading || !selectedCategory || !amount}
          >
            {isLoading ? "Saving..." : "Set Budget"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
