import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
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
      className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors rounded-xl"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          danger ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className={`font-medium ${danger ? "text-destructive" : "text-foreground"}`}>
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
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary px-4 pt-12 pb-8">
        <h1 className="text-2xl font-bold text-primary-foreground mb-6">Profile</h1>

        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-4 shadow-card -mb-12">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                JO
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-soft">
                <Camera className="h-3.5 w-3.5 text-primary-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-foreground text-lg">James Ochieng</h2>
              <p className="text-sm text-muted-foreground">james.ochieng@mak.ac.ug</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Makerere University • Year 3
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-16 space-y-6">
        {/* Account Section */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide px-1">
            Account
          </h2>
          <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
            <SettingsItem
              icon={<User className="h-5 w-5" />}
              label="Personal Information"
              subtitle="Name, email, phone number"
            />
            <div className="h-px bg-border mx-4" />
            <SettingsItem
              icon={<Shield className="h-5 w-5" />}
              label="Security"
              subtitle="Password, PIN, biometrics"
            />
            <div className="h-px bg-border mx-4" />
            <SettingsItem
              icon={<CreditCard className="h-5 w-5" />}
              label="Payment Methods"
              subtitle="Mobile money, bank accounts"
            />
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide px-1">
            Preferences
          </h2>
          <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
            <SettingsItem
              icon={<Bell className="h-5 w-5" />}
              label="Notifications"
              subtitle="Push, email, SMS alerts"
            />
          </div>
        </section>

        {/* Support Section */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide px-1">
            Support
          </h2>
          <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
            <SettingsItem
              icon={<HelpCircle className="h-5 w-5" />}
              label="Help Center"
              subtitle="FAQs, contact support"
            />
            <div className="h-px bg-border mx-4" />
            <SettingsItem
              icon={<FileText className="h-5 w-5" />}
              label="Terms & Privacy"
              subtitle="Legal documents"
            />
          </div>
        </section>

        {/* Logout */}
        <section>
          <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
            <SettingsItem
              icon={<LogOut className="h-5 w-5" />}
              label="Log Out"
              danger
            />
          </div>
        </section>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          BudgetWise v1.0.0
        </p>
      </main>

      <BottomNavigation />
    </div>
  );
}
