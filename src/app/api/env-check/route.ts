import { NextResponse } from 'next/server';

function maskDatabaseUrl(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    // mask password
    if (u.password) {
      u.password = '*****';
    }
    return u.toString();
  } catch (e) {
    // not a full URL, attempt simpler mask
    return url.replace(/:(.+)@/, ':*****@');
  }
}

export async function GET() {
  const raw = process.env.DATABASE_URL;
  const masked = maskDatabaseUrl(raw);
  return NextResponse.json({ present: !!raw, masked });
}
