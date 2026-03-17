import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useAuth } from "@/hooks/useAuth";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Shield,
  Bell,
  CreditCard,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Camera,
  Mail,
  Phone,
  Lock,
  Fingerprint,
  LogIn,
  BarChart3,
} from "lucide-react";

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onClick?: () => void;
  danger?: boolean;
}

function SettingsItem({ icon, label, subtitle, onClick, danger }: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors rounded-xl"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          danger ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className={`font-medium text-sm ${danger ? "text-destructive" : "text-foreground"}`}>
          {label}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Form states - use user data if available
  const [name, setName] = useState(user?.email?.split("@")[0] || "Guest User");
  const [email, setEmail] = useState(user?.email || "guest@example.com");
  const [phone, setPhone] = useState("0770 123 456");

  // Security states
  const [biometrics, setBiometrics] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // Notification states
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  const handleSavePersonalInfo = () => {
    setPersonalInfoOpen(false);
    toast({
      title: "Profile Updated",
      description: "Your personal information has been saved.",
    });
  };

  const handleLogout = async () => {
    setLogoutConfirmOpen(false);
    await signOut();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen gradient-bg pb-24">
        <header className="px-4 pt-12 pb-8">
          <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>
        </header>
        <main className="px-4 pt-8 flex flex-col items-center justify-center">
          <div className="glass-card rounded-2xl p-8 text-center max-w-sm w-full">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Welcome to BudgetWise</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Sign in to access your profile, manage settings, and track your savings.
            </p>
            <Button onClick={() => navigate("/auth")} className="w-full gap-2">
              <LogIn className="h-4 w-4" />
              Sign In / Sign Up
            </Button>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={async () => {}} className="min-h-screen">
    <div className="gradient-bg pb-24">
      {/* Header */}
      <header className="px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                {name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <Camera className="h-3.5 w-3.5 text-primary-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-foreground text-lg capitalize">{name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-primary mt-0.5">
                BudgetWise Member
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-6">
        {/* Account Section */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide px-1">
            Account
          </h2>
          <div className="glass-card rounded-2xl overflow-hidden">
            <SettingsItem
              icon={<User className="h-5 w-5" />}
              label="Personal Information"
              subtitle="Name, email, phone number"
              onClick={() => setPersonalInfoOpen(true)}
            />
            <div className="h-px bg-border/50 mx-4" />
            <SettingsItem
              icon={<Shield className="h-5 w-5" />}
              label="Security"
              subtitle="Password, PIN, biometrics"
              onClick={() => setSecurityOpen(true)}
            />
            <div className="h-px bg-border/50 mx-4" />
            <SettingsItem
              icon={<CreditCard className="h-5 w-5" />}
              label="Payment Methods"
              subtitle="Mobile money, bank accounts"
              onClick={() => navigate("/payment-methods")}
            />
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide px-1">
            Preferences
          </h2>
          <div className="glass-card rounded-2xl overflow-hidden">
            <SettingsItem
              icon={<BarChart3 className="h-5 w-5" />}
              label="Reports"
              subtitle="Spending trends & analytics"
              onClick={() => navigate("/reports")}
            />
            <div className="h-px bg-border/50 mx-4" />
            <SettingsItem
              icon={<Bell className="h-5 w-5" />}
              label="Notifications"
              subtitle="Push, email, SMS alerts"
              onClick={() => setNotificationsOpen(true)}
            />
          </div>
        </section>

        {/* Support Section */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide px-1">
            Support
          </h2>
          <div className="glass-card rounded-2xl overflow-hidden">
            <SettingsItem
              icon={<HelpCircle className="h-5 w-5" />}
              label="Help Center"
              subtitle="FAQs, contact support"
              onClick={() => toast({ title: "Help Center", description: "Opening help center..." })}
            />
            <div className="h-px bg-border/50 mx-4" />
            <SettingsItem
              icon={<FileText className="h-5 w-5" />}
              label="Terms & Privacy"
              subtitle="Legal documents"
              onClick={() => toast({ title: "Legal", description: "Opening terms and privacy policy..." })}
            />
          </div>
        </section>

        {/* Logout */}
        <section>
          <div className="glass-card rounded-2xl overflow-hidden">
            <SettingsItem
              icon={<LogOut className="h-5 w-5" />}
              label="Log Out"
              danger
              onClick={() => setLogoutConfirmOpen(true)}
            />
          </div>
        </section>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          BudgetWise v1.0.0
        </p>
      </main>

      {/* Personal Information Dialog */}
      <Dialog open={personalInfoOpen} onOpenChange={setPersonalInfoOpen}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl glass-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Personal Information</DialogTitle>
            <DialogDescription>Update your profile details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-muted/50 border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-muted/50 border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 bg-muted/50 border-border"
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleSavePersonalInfo}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Dialog */}
      <Dialog open={securityOpen} onOpenChange={setSecurityOpen}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl glass-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Security Settings</DialogTitle>
            <DialogDescription>Manage your account security</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Button variant="outline" className="w-full justify-start gap-3" onClick={() => toast({ title: "Change Password", description: "A password reset link has been sent to your email." })}>
              <Lock className="h-4 w-4" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" onClick={() => toast({ title: "Change PIN", description: "PIN change feature coming soon." })}>
              <Lock className="h-4 w-4" />
              Change PIN
            </Button>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3">
                <Fingerprint className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground text-sm">Biometric Login</p>
                  <p className="text-xs text-muted-foreground">Use fingerprint or face ID</p>
                </div>
              </div>
              <Switch checked={biometrics} onCheckedChange={setBiometrics} />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground text-sm">Two-Factor Auth</p>
                  <p className="text-xs text-muted-foreground">Extra security layer</p>
                </div>
              </div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl glass-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Notification Preferences</DialogTitle>
            <DialogDescription>Manage how you receive alerts</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <p className="font-medium text-foreground text-sm">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Receive alerts on your phone</p>
              </div>
              <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <p className="font-medium text-foreground text-sm">Email Alerts</p>
                <p className="text-xs text-muted-foreground">Weekly summaries & updates</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <p className="font-medium text-foreground text-sm">Budget Alerts</p>
                <p className="text-xs text-muted-foreground">Notify when nearing limits</p>
              </div>
              <Switch checked={budgetAlerts} onCheckedChange={setBudgetAlerts} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <DialogContent className="sm:max-w-sm mx-4 rounded-2xl glass-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Log Out</DialogTitle>
            <DialogDescription>Are you sure you want to log out of your account?</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setLogoutConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
    </PullToRefresh>
  );
}