import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  updateProfile,
  validateProfileInput,
  type UpdateProfileInput,
} from "@/lib/mutations";

export async function PUT(request: Request) {
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

  const raw = (body ?? {}) as Record<string, unknown>;

  const input: UpdateProfileInput = {
    name: typeof raw.name === "string" ? raw.name : "",
    bio: typeof raw.bio === "string" ? raw.bio : "",
    photoUrl: typeof raw.photoUrl === "string" ? raw.photoUrl : null,
    email: typeof raw.email === "string" ? raw.email : "",
    contactLinks: Array.isArray(raw.contactLinks)
      ? (raw.contactLinks as UpdateProfileInput["contactLinks"])
      : [],
    skills: Array.isArray(raw.skills)
      ? (raw.skills as UpdateProfileInput["skills"])
      : [],
  };

  const errors = validateProfileInput(input);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const profile = await updateProfile(input);

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/skills");
  revalidatePath("/admin/dashboard/profile");

  return NextResponse.json({ profile });
}
