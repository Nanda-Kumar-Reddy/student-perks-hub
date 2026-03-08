import { Request, Response, NextFunction } from "express";

/**
 * Role-Based Access Control Middleware
 * Usage: rbac("admin") or rbac("admin", "vendor")
 */
export function rbac(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Required role: ${allowedRoles.join(" or ")}`,
      });
    }

    next();
  };
}
