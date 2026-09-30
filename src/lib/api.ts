import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { getSession, type Role } from "@/lib/session";

type Fields = Record<string, string[]>;

export class ApiError extends Error {
  constructor(public status: number, message: string, public fields?: Fields) {
    super(message);
  }
}

type Handler<C> = (req: Request, ctx: C) => Promise<Response>;

// Wraps a route handler so every failure comes back as { error, fields? } with a sensible status.
export function route<C>(fn: Handler<C>): Handler<C> {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof ApiError) return NextResponse.json({ error: e.message, fields: e.fields }, { status: e.status });
      if (e instanceof z.ZodError)
        return NextResponse.json(
          { error: e.issues[0]?.message ?? "Invalid input", fields: z.flattenError(e).fieldErrors },
          { status: 400 },
        );
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") return NextResponse.json({ error: "That record already exists." }, { status: 409 });
        if (e.code === "P2025") return NextResponse.json({ error: "Not found." }, { status: 404 });
        if (e.code === "P2021")
          return NextResponse.json({ error: "The database has no tables yet. Run `npm run setup`." }, { status: 503 });
      }
      // P1001/P1002: can't reach or timed out (with the pg adapter these arrive as known request errors).
      const unreachable = e instanceof Prisma.PrismaClientKnownRequestError && (e.code === "P1001" || e.code === "P1002");
      if (unreachable || e instanceof Prisma.PrismaClientInitializationError)
        return NextResponse.json({ error: "The database is not reachable right now. Please try again." }, { status: 503 });
      console.error(e);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
  };
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new ApiError(400, "The request body must be valid JSON.");
  }
}

export async function readForm(req: Request) {
  try {
    return await req.formData();
  } catch {
    throw new ApiError(400, "Send the file as multipart form data.");
  }
}

export async function requireRole(role: Role) {
  const s = await getSession();
  if (s.role !== role) throw new ApiError(403, role === "staff" ? "Only Registry staff can do this." : "Switch to a student view to do this.");
  return s;
}

// A student-view request must name the student being viewed.
export async function requireStudent() {
  const s = await requireRole("student");
  if (!s.studentId) throw new ApiError(403, "Choose a student to view as first.");
  return s.studentId;
}

export const ok = (data: unknown, status = 200) => NextResponse.json(data, { status });

// Retries a transaction that lost a race on a unique key (for example two enrolments creating
// the first ID counter row of a year at the same moment).
export async function retryOnConflict<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (e) {
      const conflict = e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
      if (!conflict || i >= attempts) throw e;
    }
  }
}
