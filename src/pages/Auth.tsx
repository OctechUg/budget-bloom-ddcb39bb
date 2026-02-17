import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Phone, Wallet, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";

const SIMULATED_OTP = "123456";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isSignup = searchParams.get("mode") === "signup";
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 9 && cleaned.length <= 15;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");

    if (!validatePhone(phoneNumber)) {
      setPhoneError("Please enter a valid phone number (e.g. 0771234567)");
      return;
    }

    setLoading(true);
    // Simulate sending OTP
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep("otp");
    toast({
      title: "OTP Sent!",
      description: `A verification code has been sent to ${phoneNumber}. (Use 123456 for demo)`,
    });
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);

    if (otp === SIMULATED_OTP) {
      toast({
        title: isSignup ? "Account Created!" : "Welcome back!",
        description: isSignup
          ? "Your phone number has been verified. Welcome to BudgetWise!"
          : "You have successfully logged in.",
      });
      navigate("/");
    } else {
      toast({
        title: "Invalid OTP",
        description: "The code you entered is incorrect. Please try again.",
        variant: "destructive",
      });
      setOtp("");
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Header */}
      <div className="p-6">
        <button
          onClick={() => (step === "otp" ? setStep("phone") : navigate("/"))}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{step === "otp" ? "Change number" : "Back"}</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-glow">
            {step === "phone" ? (
              <Wallet className="w-8 h-8 text-primary-foreground" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-primary-foreground" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {step === "phone" ? "BudgetWise" : "Verify Your Number"}
          </h1>
          <p className="text-muted-foreground mt-1 text-center">
            {step === "phone"
              ? isSignup
                ? "Create your account with your phone number"
                : "Log in with your phone number"
              : `Enter the 6-digit code sent to ${phoneNumber}`}
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={handleSendOTP} className="w-full max-w-sm space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0771234567"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (phoneError) setPhoneError("");
                  }}
                  className={`pl-10 bg-muted/50 border-border ${phoneError ? "border-destructive" : ""}`}
                />
              </div>
              {phoneError && <p className="text-sm text-destructive">{phoneError}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-12 gradient-primary shadow-glow hover:opacity-90"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </form>
        ) : (
          <div className="w-full max-w-sm space-y-6 flex flex-col items-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button
              onClick={handleVerifyOTP}
              className="w-full h-12 gradient-primary shadow-glow hover:opacity-90"
              size="lg"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </Button>

            <button
              onClick={handleSendOTP}
              className="text-sm text-primary hover:underline"
              disabled={loading}
            >
              Didn't receive a code? Resend
            </button>
          </div>
        )}

        {/* Toggle */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                navigate(isSignup ? "/auth" : "/auth?mode=signup");
                setStep("phone");
                setOtp("");
                setPhoneError("");
              }}
              className="text-primary font-medium hover:underline"
            >
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
