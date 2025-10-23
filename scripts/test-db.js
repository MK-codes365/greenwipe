const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    console.log('Starting DB test...');
    const res = await prisma.$queryRawUnsafe('SELECT 1 as ok');
    console.log('DB OK:', res);
  } catch (e) {
    console.error('DB connection test failed:', e.message || e);
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();
