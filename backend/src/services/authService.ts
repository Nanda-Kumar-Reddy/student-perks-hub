/**
 * Auth Service
 * Business logic for signup, login, Google login, refresh, logout, OTP
 */
import { db } from "../wrappers/databaseWrapper";
import { auth } from "../wrappers/authWrapper";
import { notifications } from "../wrappers/notificationWrapper";
import { AppRole } from "@prisma/client";

export interface SignupInput {
  email: string;
  password: string;
  fullName: string;
  role?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface GoogleLoginInput {
  googleId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

class AuthService {
  async signup(input: SignupInput) {
    const existing = await db.client.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });
    if (existing) {
      throw Object.assign(new Error("Email already registered"), { status: 409 });
    }

    const passwordHash = await auth.hashPassword(input.password);
    const role = (input.role as AppRole) || "student";

    const user = await db.client.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        profile: { create: { fullName: input.fullName } },
        roles: { create: { role } },
      },
      include: { roles: true, profile: true },
    });

    const userRole = user.roles[0]?.role ?? "student";
    const tokens = this.generateTokenPair(user.id, userRole);
    await auth.storeRefreshToken(user.id, tokens.refreshToken);

    console.log(`[AUTH] Signup: ${user.email} (${userRole})`);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.profile?.fullName,
        role: userRole,
      },
      ...tokens,
    };
  }

  async login(input: LoginInput) {
    const user = await db.client.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: { roles: true, profile: true },
    });

    if (!user || !user.passwordHash) {
      console.log(`[AUTH] Failed login attempt: ${input.email}`);
      throw Object.assign(new Error("Invalid email or password"), { status: 401 });
    }

    const valid = await auth.verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      console.log(`[AUTH] Failed login attempt: ${input.email}`);
      throw Object.assign(new Error("Invalid email or password"), { status: 401 });
    }

    const userRole = user.roles[0]?.role ?? "student";
    const tokens = this.generateTokenPair(user.id, userRole);
    await auth.storeRefreshToken(user.id, tokens.refreshToken);

    console.log(`[AUTH] Login: ${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.profile?.fullName,
        role: userRole,
      },
      ...tokens,
    };
  }

  async googleLogin(input: GoogleLoginInput) {
    let user = await db.client.user.findUnique({
      where: { googleId: input.googleId },
      include: { roles: true, profile: true },
    });

    if (!user) {
      // Check if email already exists
      const existing = await db.client.user.findUnique({
        where: { email: input.email.toLowerCase() },
      });

      if (existing) {
        // Link Google ID to existing account
        user = await db.client.user.update({
          where: { id: existing.id },
          data: { googleId: input.googleId },
          include: { roles: true, profile: true },
        });
      } else {
        // Create new user
        user = await db.client.user.create({
          data: {
            email: input.email.toLowerCase(),
            googleId: input.googleId,
            emailVerified: true,
            profile: {
              create: {
                fullName: input.fullName,
                avatarUrl: input.avatarUrl,
              },
            },
            roles: { create: { role: "student" } },
          },
          include: { roles: true, profile: true },
        });
      }
    }

    const userRole = user.roles[0]?.role ?? "student";
    const tokens = this.generateTokenPair(user.id, userRole);
    await auth.storeRefreshToken(user.id, tokens.refreshToken);

    console.log(`[AUTH] Google login: ${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.profile?.fullName,
        role: userRole,
      },
      ...tokens,
    };
  }

  async refresh(token: string) {
    const result = await auth.validateAndRevokeRefreshToken(token);
    if (!result) {
      throw Object.assign(new Error("Invalid or expired refresh token"), { status: 401 });
    }

    const user = await db.client.user.findUnique({
      where: { id: result.userId },
      include: { roles: true },
    });
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 401 });
    }

    const userRole = user.roles[0]?.role ?? "student";
    const tokens = this.generateTokenPair(user.id, userRole);
    await auth.storeRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(refreshToken: string | undefined) {
    if (refreshToken) {
      await auth.revokeRefreshToken(refreshToken);
    }
  }

  async getMe(userId: string) {
    const user = await db.client.user.findUnique({
      where: { id: userId },
      include: { profile: true, roles: true },
    });

    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.profile?.fullName,
      avatarUrl: user.profile?.avatarUrl,
      phone: user.profile?.phone,
      address: user.profile?.address,
      university: user.profile?.university,
      role: user.roles[0]?.role ?? "student",
    };
  }

  // ── OTP ───────────────────────────────────────────

  async sendOtp(userId: string, purpose: string) {
    const code = auth.generateOtp();
    await auth.storeOtp(userId, code, purpose);

    // TODO: Send OTP via email/SMS using notification wrapper
    console.log(`[OTP] Code for user ${userId}: ${code} (purpose: ${purpose})`);

    return { message: "OTP sent successfully" };
  }

  async verifyOtp(userId: string, code: string, purpose: string) {
    const valid = await auth.verifyOtp(userId, code, purpose);
    if (!valid) {
      throw Object.assign(new Error("Invalid or expired OTP"), { status: 400 });
    }

    if (purpose === "signup" || purpose === "verification") {
      await db.client.user.update({
        where: { id: userId },
        data: { emailVerified: true },
      });
    }

    return { message: "OTP verified successfully" };
  }

  // ── Password Reset ─────────────────────────────────

  async forgotPassword(email: string) {
    const user = await db.client.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: "If that email exists, a reset link has been sent" };
    }

    const resetToken = auth.generateResetToken(user.id);
    // TODO: Send email with reset link using notification wrapper
    console.log(`[AUTH] Password reset token for ${email}: ${resetToken}`);

    return { message: "If that email exists, a reset link has been sent" };
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = auth.verifyResetToken(token);
    if (!userId) {
      throw Object.assign(new Error("Invalid or expired reset token"), { status: 400 });
    }

    const passwordHash = await auth.hashPassword(newPassword);
    await db.client.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Revoke all refresh tokens for security
    await db.client.refreshToken.deleteMany({ where: { userId } });

    console.log(`[AUTH] Password reset for user ${userId}`);
    return { message: "Password updated successfully" };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await db.client.user.findUnique({ where: { id: userId } });
    if (!user?.passwordHash) {
      throw Object.assign(new Error("Cannot change password for OAuth accounts"), { status: 400 });
    }

    const valid = await auth.verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      throw Object.assign(new Error("Current password is incorrect"), { status: 401 });
    }

    const passwordHash = await auth.hashPassword(newPassword);
    await db.client.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: "Password changed successfully" };
  }

  // ── Private Helpers ───────────────────────────────

  private generateTokenPair(userId: string, role: string) {
    return {
      accessToken: auth.generateAccessToken({ userId, role }),
      refreshToken: auth.generateRefreshToken({ userId, role }),
    };
  }
}

export const authService = new AuthService();
