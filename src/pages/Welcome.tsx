import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, PiggyBank, TrendingUp, Shield, ChevronRight, ChevronLeft } from "lucide-react";

const slides = [
  {
    icon: Wallet,
    title: "Welcome to BudgetWise",
    description: "Track spending, set budgets, and manage your finances — all from one app.",
  },
  {
    icon: PiggyBank,
    title: "Smart Budgeting",
    description: "Set personalized budgets for each category. Get alerts when you're close to limits.",
  },
  {
    icon: TrendingUp,
    title: "Financial Insights",
    description: "Visualize your spending patterns with detailed analytics and smart recommendations.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data is encrypted with bank-level security. You're in control.",
  },
];

const Welcome = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center shadow-glow animate-in zoom-in duration-500">
            <Icon className="w-12 h-12 text-primary-foreground" />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 w-24 h-24 rounded-2xl bg-primary/20 blur-xl -z-10" />
        </div>

        {/* Title & Description */}
        <div className="text-center max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-2xl font-bold text-foreground mb-3">
            {slide.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {slide.description}
          </p>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "w-6 bg-primary" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="px-6 pb-8 space-y-3">
        <Button 
          onClick={() => navigate("/auth?mode=signup")} 
          className="w-full h-14 text-lg font-semibold rounded-xl gradient-primary shadow-glow hover:opacity-90 transition-all"
        >
          Get Started
        </Button>
        <div className="text-center">
          <span className="text-muted-foreground text-sm">
            Already have an account?{" "}
          </span>
          <button 
            onClick={() => navigate("/auth?mode=login")} 
            className="text-primary font-medium text-sm hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;