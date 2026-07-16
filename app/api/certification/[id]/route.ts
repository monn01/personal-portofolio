import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  deleteCertification,
  isNotFoundError,
  parseCertificationInput,
  updateCertification,
  validateCertificationInput,
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

  const input = parseCertificationInput(
    (body ?? {}) as Record<string, unknown>,
  );
  const errors = validateCertificationInput(input);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  try {
    const certification = await updateCertification(id, input);

    revalidatePath("/");
    revalidatePath("/certifications");
    revalidatePath("/admin/dashboard/certifications");

    return NextResponse.json({ certification });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Certification tidak ditemukan." },
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
    await deleteCertification(id);

    revalidatePath("/");
    revalidatePath("/certifications");
    revalidatePath("/admin/dashboard/certifications");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Certification tidak ditemukan." },
        { status: 404 },
      );
    }
    throw error;
  }
}
