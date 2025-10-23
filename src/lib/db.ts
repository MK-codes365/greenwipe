import { PrismaClient } from '@prisma/client';

function maskUrl(url?: string) {
	if (!url) return null;
	try {
		const u = new URL(url);
		if (u.password) u.password = '*****';
		return u.toString();
	} catch (e) {
		return url.replace(/:(.+)@/, ':*****@');
	}
}

function buildDatabaseUrlFromEnv(): string | undefined {
	if (process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0) {
		return process.env.DATABASE_URL;
	}

	const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
	if (PGHOST && PGUSER && PGPASSWORD && PGDATABASE) {
		const port = PGPORT || '5432';
		const password = encodeURIComponent(PGPASSWORD);
		return `postgresql://${PGUSER}:${password}@${PGHOST}:${port}/${PGDATABASE}?sslmode=require`;
	}

	return undefined;
}

const runtimeUrl = buildDatabaseUrlFromEnv();

if (process.env.NODE_ENV !== 'production') {
	console.debug('[db] using DATABASE_URL:', maskUrl(runtimeUrl || process.env.DATABASE_URL));
}

const prisma = runtimeUrl
	? new PrismaClient({ datasources: { db: { url: runtimeUrl } } })
	: new PrismaClient();

export default prisma;
