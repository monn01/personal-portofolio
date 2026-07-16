import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createAchievement,
  parseAchievementInput,
  validateAchievementInput,
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

  const input = parseAchievementInput((body ?? {}) as Record<string, unknown>);
  const errors = validateAchievementInput(input);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const achievement = await createAchievement(input);

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/certifications");
  revalidatePath("/admin/dashboard/achievements");

  return NextResponse.json({ achievement }, { status: 201 });
}
