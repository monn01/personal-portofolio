import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  deletePost,
  isDuplicateSlugError,
  isNotFoundError,
  parsePostInput,
  updatePost,
  validatePostInput,
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

  const input = parsePostInput((body ?? {}) as Record<string, unknown>);
  const errors = validatePostInput(input);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  try {
    const post = await updatePost(id, input);

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/dashboard/blog");

    return NextResponse.json({ post });
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      return NextResponse.json(
        { error: "Slug sudah dipakai artikel lain." },
        { status: 400 },
      );
    }
    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan." },
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
    await deletePost(id);

    revalidatePath("/blog");
    revalidatePath("/admin/dashboard/blog");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan." },
        { status: 404 },
      );
    }
    throw error;
  }
}
