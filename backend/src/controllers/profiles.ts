import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getMyProfile(req: Request, res: Response) {
  const userId = (req as any).user.userId;

  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) return res.status(404).json({ error: "Profile not found" });
  return res.json(profile);
}

export async function updateMyProfile(req: Request, res: Response) {
  const userId = (req as any).user.userId;

  const profile = await prisma.profile.update({
    where: { userId },
    data: req.body,
  });

  return res.json(profile);
}

// Admin: list all profiles with pagination
export async function listProfiles(req: Request, res: Response) {
  const { page, limit, sortBy, sortOrder } = req.query as any;

  const [profiles, total] = await Promise.all([
    prisma.profile.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" },
      include: { user: { include: { roles: true } } },
    }),
    prisma.profile.count(),
  ]);

  return res.json({
    data: profiles,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
