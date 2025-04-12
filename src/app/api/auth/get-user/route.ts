import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const user = cookieStore.get("user")?.value || null;
  const token = cookieStore.get("token")?.value || null;

  return NextResponse.json({ success: true, user, token });
}
