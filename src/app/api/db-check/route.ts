import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';

export async function GET() {
  try {
    // Simple query to verify DB connectivity from the runtime environment.
    const res = await prisma.$queryRawUnsafe('SELECT 1 as ok');
    return NextResponse.json({ ok: true, result: res });
  } catch (err: any) {
    // Provide a concise error message to help debugging in deployment logs.
    const message = err?.message || String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (_) {}
  }
}
