import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createPost,
  isDuplicateSlugError,
  parsePostInput,
  validatePostInput,
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

  const input = parsePostInput((body ?? {}) as Record<string, unknown>);
  const errors = validatePostInput(input);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  try {
    const post = await createPost(input);

    revalidatePath("/blog");
    revalidatePath("/admin/dashboard/blog");

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      return NextResponse.json(
        { error: "Slug sudah dipakai artikel lain." },
        { status: 400 },
      );
    }
    throw error;
  }
}
