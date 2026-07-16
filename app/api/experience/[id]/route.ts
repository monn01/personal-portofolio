import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  deleteExperience,
  isNotFoundError,
  parseExperienceInput,
  updateExperience,
  validateExperienceInput,
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

  const input = parseExperienceInput((body ?? {}) as Record<string, unknown>);
  const errors = validateExperienceInput(input);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  try {
    const experience = await updateExperience(id, input);

    revalidatePath("/");
    revalidatePath("/experience");
    revalidatePath("/admin/dashboard/experience");

    return NextResponse.json({ experience });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Experience tidak ditemukan." },
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
    await deleteExperience(id);

    revalidatePath("/");
    revalidatePath("/experience");
    revalidatePath("/admin/dashboard/experience");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Experience tidak ditemukan." },
        { status: 404 },
      );
    }
    throw error;
  }
}
