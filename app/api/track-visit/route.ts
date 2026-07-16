import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_PATH_LENGTH = 200;
const BLOCKED_PREFIXES = ["/admin", "/api", "/login"];

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const path = raw.path;

  if (
    typeof path !== "string" ||
    path.length === 0 ||
    path.length > MAX_PATH_LENGTH ||
    !path.startsWith("/") ||
    BLOCKED_PREFIXES.some((prefix) => path.startsWith(prefix))
  ) {
    return NextResponse.json({ error: "Path tidak valid." }, { status: 400 });
  }

  await prisma.pageView.create({ data: { path } });

  return NextResponse.json({ success: true }, { status: 201 });
}
