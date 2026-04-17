import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: 'file:./dev.db' })
});

async function main() {
    const songs = await prisma.song.findMany({
        where: {
            OR: [
                { title: { contains: 'Thousand Years' } },
                { title: { contains: 'Your Song' } }
            ]
        }
    });
    console.log(JSON.stringify(songs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
