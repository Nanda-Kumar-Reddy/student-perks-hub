/**
 * Database Wrapper
 * Abstracts all database access through Prisma.
 * Swap this wrapper to migrate from PostgreSQL to another DB.
 */
import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class DatabaseWrapper {
  // ── Generic CRUD ──────────────────────────────────

  async create<T extends Prisma.ModelName>(
    model: T,
    data: any,
    include?: any
  ): Promise<any> {
    const delegate = this.getDelegate(model);
    return delegate.create({ data, include });
  }

  async findById<T extends Prisma.ModelName>(
    model: T,
    id: string,
    include?: any
  ): Promise<any | null> {
    const delegate = this.getDelegate(model);
    return delegate.findUnique({ where: { id }, include });
  }

  async findOne<T extends Prisma.ModelName>(
    model: T,
    where: any,
    include?: any
  ): Promise<any | null> {
    const delegate = this.getDelegate(model);
    return delegate.findFirst({ where, include });
  }

  async findMany<T extends Prisma.ModelName>(
    model: T,
    where: any,
    pagination?: PaginationParams,
    include?: any
  ): Promise<PaginatedResult<any>> {
    const delegate = this.getDelegate(model);
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const orderBy = pagination?.sortBy
      ? { [pagination.sortBy]: pagination.sortOrder ?? "desc" }
      : { createdAt: "desc" as const };

    const [data, total] = await Promise.all([
      delegate.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include,
      }),
      delegate.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update<T extends Prisma.ModelName>(
    model: T,
    id: string,
    data: any,
    include?: any
  ): Promise<any> {
    const delegate = this.getDelegate(model);
    return delegate.update({ where: { id }, data, include });
  }

  async delete<T extends Prisma.ModelName>(
    model: T,
    id: string
  ): Promise<any> {
    const delegate = this.getDelegate(model);
    return delegate.delete({ where: { id } });
  }

  // ── Direct Prisma access (for complex queries) ───

  get client() {
    return prisma;
  }

  // ── Private helpers ──────────────────────────────

  private getDelegate(model: Prisma.ModelName): any {
    const key = model.charAt(0).toLowerCase() + model.slice(1);
    const delegate = (prisma as any)[key];
    if (!delegate) {
      throw new Error(`Model "${model}" not found in Prisma client`);
    }
    return delegate;
  }
}

export const db = new DatabaseWrapper();
