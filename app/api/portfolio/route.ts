import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createPortfolio,
  parsePortfolioInput,
  validatePortfolioInput,
} from "@/lib/mutations";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const input = parsePortfolioInput((body ?? {}) as Record<string, unknown>);
  const errors = validatePortfolioInput(input);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const portfolio = await createPortfolio(input);

  revalidatePath("/portfolio");
  revalidatePath("/admin/dashboard/portfolio");

  return NextResponse.json({ portfolio }, { status: 201 });
}
