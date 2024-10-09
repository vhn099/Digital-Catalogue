import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.AUTH_COOKIE_SIGNATURE_KEY_CURRENT;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 hours from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  if (input === 'deleted') {
    return null;
  }
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}

export function formatDate(date: any) {
  if (!date) {
    return "";
  }
  const d = new Date(date.toDate()),
  year = d.getFullYear();
  
  let month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    hours: any = d.getHours(),
    minutes: any = d.getMinutes(),
    seconds: any = d.getSeconds();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  return [year, month, day].join("-") + ' ' + [hours, minutes, seconds].join(':');
}