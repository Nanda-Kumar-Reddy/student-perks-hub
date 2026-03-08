import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Zap, CheckCircle2, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    if (!password.trim()) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateAccount = () => {
    if (validate()) {
      setOtpOpen(true);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 6) {
      setVerified(true);
      toast({ title: "Account created successfully!" });
    }
  };

  const handleCloseOtp = () => {
    setOtpOpen(false);
    setTimeout(() => { setOtp(""); setVerified(false); }, 300);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            LifelineAustralia
          </Link>
          <h1 className="mt-6 font-display text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start earning rewards today</p>
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: undefined })); }} className={`mt-1.5 ${errors.name ? "border-destructive" : ""}`} />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@university.edu" value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: undefined })); }} className={`mt-1.5 ${errors.email ? "border-destructive" : ""}`} />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }} className={`mt-1.5 ${errors.password ? "border-destructive" : ""}`} />
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>
            <Button className="w-full" size="lg" onClick={handleCreateAccount}>Create Account</Button>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </div>
        </div>
      </div>

      <Dialog open={otpOpen} onOpenChange={handleCloseOtp}>
        <DialogContent className="max-w-sm">
          {verified ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">Account Verified!</h2>
              <p className="mt-2 text-sm text-muted-foreground">Your account has been created successfully.</p>
              <Button className="mt-6" onClick={handleCloseOtp}>Continue</Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">Verify your email</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  We've sent a 6-digit code to<br />
                  <span className="font-medium text-foreground">{email}</span>
                </p>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button className="w-full" onClick={handleVerifyOtp} disabled={otp.length < 6}>
                  Verify & Create Account
                </Button>
                <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Didn't receive the code? Resend
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
