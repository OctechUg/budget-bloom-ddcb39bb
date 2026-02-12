import { useAuth } from "@/hooks/useAuth";
import Dashboard from "./Dashboard";
import Welcome from "./Welcome";
import logo from "@/assets/welcome-logo.png";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <img src={logo} alt="BudgetWise" className="w-16 h-16 animate-pulse" />
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return user ? <Dashboard /> : <Welcome />;
};

export default Index;
