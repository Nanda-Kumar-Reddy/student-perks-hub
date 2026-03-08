import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// ── Create Booking ───────────────────────────────────
export async function createBooking(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { serviceType, serviceId, startDate, endDate, notes } = req.body;

  const booking = await prisma.booking.create({
    data: {
      userId,
      serviceType,
      serviceId,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      notes,
    },
  });

  return res.status(201).json(booking);
}

// ── Get My Bookings ──────────────────────────────────
export async function getMyBookings(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { transaction: true },
    }),
    prisma.booking.count({ where: { userId } }),
  ]);

  return res.json({
    data: bookings,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

// ── Get Single Booking ───────────────────────────────
export async function getBooking(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const role = (req as any).user.role;
  const { id } = req.params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { transaction: true },
  });

  if (!booking) return res.status(404).json({ error: "Booking not found" });

  // Only owner or admin/vendor can view
  if (booking.userId !== userId && role === "student") {
    return res.status(403).json({ error: "Forbidden" });
  }

  return res.json(booking);
}

// ── Update Booking Status (vendor/admin) ─────────────
export async function updateBookingStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
  });

  return res.json(booking);
}

// ── Cancel Booking (student) ─────────────────────────
export async function cancelBooking(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { id } = req.params;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  if (booking.userId !== userId) return res.status(403).json({ error: "Forbidden" });
  if (booking.status !== "pending") {
    return res.status(400).json({ error: "Only pending bookings can be cancelled" });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: "cancelled" },
  });

  return res.json(updated);
}

// ── Admin: List all bookings ─────────────────────────
export async function listAllBookings(req: Request, res: Response) {
  const { page, limit, sortOrder } = req.query as any;

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: sortOrder || "desc" },
      include: { user: { include: { profile: true } }, transaction: true },
    }),
    prisma.booking.count(),
  ]);

  return res.json({
    data: bookings,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
