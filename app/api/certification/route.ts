import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createCertification,
  parseCertificationInput,
  validateCertificationInput,
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

  const input = parseCertificationInput(
    (body ?? {}) as Record<string, unknown>,
  );
  const errors = validateCertificationInput(input);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const certification = await createCertification(input);

  revalidatePath("/");
  revalidatePath("/certifications");
  revalidatePath("/admin/dashboard/certifications");

  return NextResponse.json({ certification }, { status: 201 });
}
