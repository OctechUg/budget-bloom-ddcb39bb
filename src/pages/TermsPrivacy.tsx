import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNavigation } from "@/components/BottomNavigation";

export default function TermsPrivacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg pb-24">
      <header className="px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Terms & Privacy</h1>
        </div>
      </header>

      <main className="px-4">
        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="terms">Terms of Service</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          </TabsList>

          <TabsContent value="terms">
            <div className="glass-card rounded-2xl p-5 space-y-5">
              <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">1. Acceptance of Terms</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By accessing or using BudgetWise, you agree to be bound by these Terms of Service. If you do not agree, please do not use the application.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">2. Account Responsibilities</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">3. Use of Services</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  BudgetWise provides personal finance management tools including budgeting, savings tracking, and wallet management. These tools are for personal, non-commercial use only.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">4. Financial Disclaimer</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  BudgetWise is not a licensed financial advisor. The information provided through the app is for informational purposes only and should not be considered financial advice.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">5. Termination</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We reserve the right to suspend or terminate your account at any time for violation of these terms or for any other reason at our discretion.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">6. Changes to Terms</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We may update these terms from time to time. Continued use of the app after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <p className="text-xs text-muted-foreground pt-2">Last updated: March 2026</p>
            </div>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="glass-card rounded-2xl p-5 space-y-5">
              <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">1. Information We Collect</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We collect information you provide directly, such as your name, email address, phone number, and financial data you enter into the app (budgets, transactions, savings goals).
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">2. How We Use Your Information</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your data is used to provide and improve our services, personalize your experience, send notifications you've opted into, and ensure the security of your account.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">3. Data Security</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures including encryption, secure connections, and access controls to protect your personal and financial data.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">4. Data Sharing</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We do not sell your personal data. We may share anonymized, aggregated data for analytics purposes. Third-party service providers who assist our operations are bound by confidentiality agreements.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">5. Your Rights</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You have the right to access, correct, or delete your personal data at any time. You may also request a copy of all data we hold about you by contacting support.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">6. Contact Us</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  For questions about this privacy policy, please reach out to our support team through the Help Center in the app.
                </p>
              </section>

              <p className="text-xs text-muted-foreground pt-2">Last updated: March 2026</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
}
