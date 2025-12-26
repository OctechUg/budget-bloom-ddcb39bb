import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, PiggyBank, TrendingUp, Shield, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Track Your Spending",
    description: "Monitor every transaction and stay on top of your finances with real-time updates.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: PiggyBank,
    title: "Smart Budgeting",
    description: "Set personalized budgets and get alerts when you're close to your limits.",
    color: "bg-secondary/20 text-secondary",
  },
  {
    icon: TrendingUp,
    title: "Financial Insights",
    description: "Visualize your spending patterns with detailed charts and reports.",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data is encrypted and protected with bank-level security.",
    color: "bg-primary/10 text-primary",
  },
];

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">CashFlow</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-32">
        {/* Hero */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Take Control of Your Finances
          </h1>
          <p className="text-muted-foreground text-lg">
            Simple, smart money management for students
          </p>
        </div>

        {/* Feature Banners */}
        <div className="space-y-4 max-w-md mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-5 shadow-card border border-border/50 flex items-start gap-4 animate-in slide-in-from-bottom-4 fade-in"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center shrink-0`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-6 space-y-3">
        <Button 
          onClick={() => navigate("/auth?mode=signup")} 
          className="w-full h-14 text-lg font-semibold rounded-xl"
        >
          Get Started
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/auth?mode=login")} 
          className="w-full h-12 text-muted-foreground hover:text-foreground"
        >
          Already have an account? Sign in
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
