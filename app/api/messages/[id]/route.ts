import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  deleteContactMessage,
  isNotFoundError,
  setMessageReadState,
} from "@/lib/mutations";

export async function PATCH(
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

  const isRead = (body as { isRead?: unknown })?.isRead;
  if (typeof isRead !== "boolean") {
    return NextResponse.json(
      { error: "Field isRead wajib boolean." },
      { status: 400 },
    );
  }

  try {
    const message = await setMessageReadState(id, isRead);

    revalidatePath("/admin/dashboard/messages");

    return NextResponse.json({ message });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Pesan tidak ditemukan." },
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
    await deleteContactMessage(id);

    revalidatePath("/admin/dashboard/messages");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Pesan tidak ditemukan." },
        { status: 404 },
      );
    }
    throw error;
  }
}
