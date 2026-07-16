import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createExperience,
  parseExperienceInput,
  validateExperienceInput,
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

  const input = parseExperienceInput((body ?? {}) as Record<string, unknown>);
  const errors = validateExperienceInput(input);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const experience = await createExperience(input);

  revalidatePath("/");
  revalidatePath("/experience");
  revalidatePath("/admin/dashboard/experience");

  return NextResponse.json({ experience }, { status: 201 });
}
