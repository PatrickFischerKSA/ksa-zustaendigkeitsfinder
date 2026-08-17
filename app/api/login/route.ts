import { NextResponse } from "next/server";
import { accessCookieName, accessToken, safeEqual } from "../../password-auth";

export async function POST(request: Request) {
  const configuredPassword = process.env.SITE_PASSWORD;
  if (!configuredPassword) {
    return NextResponse.json({ error: "Password protection is not configured." }, { status: 503 });
  }

  let submittedPassword = "";
  try {
    const body = await request.json() as { password?: unknown };
    submittedPassword = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!safeEqual(submittedPassword, configuredPassword)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const token = await accessToken(configuredPassword);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(accessCookieName, token!, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
