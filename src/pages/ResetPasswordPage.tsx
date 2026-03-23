import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Zap, CheckCircle2, Loader2 } from "lucide-react";
import { updatePassword } from "@/services/auth";
import { toast } from "@/hooks/use-toast";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 150);
    return () => window.clearTimeout(timer);
  }, []);

  const validate = () => {
    const errs: typeof errors = {};
    if (!password.trim()) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    if (!confirmPassword.trim()) errs.confirmPassword = "Please re-enter your password";
    else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await updatePassword(password);
      setSuccessOpen(true);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessOpen(false);
    navigate("/");
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Preparing password reset screen...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="mt-6 font-display text-2xl font-bold">Reset your password</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your new password below</p>
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }}
                className={`mt-1.5 ${errors.password ? "border-destructive" : ""}`}
              />
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Re-enter Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(p => ({ ...p, confirmPassword: undefined })); }}
                className={`mt-1.5 ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>
            <Button className="w-full" size="lg" onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Reset Password
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={successOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm">
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold">Password Reset!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your password has been changed successfully. You can now sign in with your new password.
            </p>
            <Button className="mt-6" onClick={handleClose}>
              Go to Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
