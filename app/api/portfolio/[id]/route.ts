import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  deletePortfolio,
  isNotFoundError,
  parsePortfolioInput,
  updatePortfolio,
  validatePortfolioInput,
} from "@/lib/mutations";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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

  try {
    const portfolio = await updatePortfolio(id, input);

    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${id}`);
    revalidatePath("/admin/dashboard/portfolio");

    return NextResponse.json({ portfolio });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Portfolio tidak ditemukan." },
        { status: 404 },
      );
    }
    throw error;
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deletePortfolio(id);

    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${id}`);
    revalidatePath("/admin/dashboard/portfolio");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Portfolio tidak ditemukan." },
        { status: 404 },
      );
    }
    throw error;
  }
}
