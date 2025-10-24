import { NextResponse } from 'next/server';
import dns from 'dns/promises';

export async function GET() {
  const raw = process.env.DATABASE_URL || '';
  try {
    const url = new URL(raw);
    const host = url.hostname;
    const addrs = await dns.lookup(host, { all: true });
    return NextResponse.json({ ok: true, host, addrs });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
