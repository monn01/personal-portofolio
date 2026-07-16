import { NextResponse } from "next/server";
import {
  createContactMessage,
  parseContactMessageInput,
  validateContactMessageInput,
} from "@/lib/mutations";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;

  // Honeypot: field ini cuma keliatan/keisi oleh bot, bukan manusia.
  // Pura-pura sukses biar bot tidak tahu pesannya ditolak.
  if (typeof raw.company === "string" && raw.company.trim() !== "") {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const input = parseContactMessageInput(raw);
  const errors = validateContactMessageInput(input);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  await createContactMessage(input);

  return NextResponse.json({ success: true }, { status: 201 });
}
