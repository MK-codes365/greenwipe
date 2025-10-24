import { PrismaClient } from '@prisma/client';

async function main() {
    console.log('Starting database initialization...');
    
    const prisma = new PrismaClient();
    
    try {
        await prisma.$connect();
        console.log('Connected to database successfully');

        // Initialize Stats with default values
        await prisma.stats.upsert({
            where: { id: 'stats' },
            update: {},
            create: {
                id: 'stats',
                totalWipes: 0,
                pdfDownloads: 0,
                eWasteDiverted: 0,
                co2Saved: 0,
                energySaved: 0,
                treesSaved: 0,
                lastCertificateId: '',
                wipeMethodDistribution: {}
            }
        });
        console.log('Stats initialized successfully');

        console.log('Database initialization complete!');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    });