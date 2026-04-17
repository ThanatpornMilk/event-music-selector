/**
 * Database Seeding Script
 * 
 * Responsible for initializing the database with sample songs, themes, 
 * and genres to ensure a consistent development environment.
 */
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'node:url';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const rawUrl = process.env.DATABASE_URL || 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: rawUrl });
const prisma = new PrismaClient({ adapter });

// ฟังก์ชันแปลง "MM:SS" เป็น วินาที
const durationToSeconds = (durationStr) => {
    if (!durationStr || typeof durationStr !== 'string') return 0;
    const parts = durationStr.split(':');
    if (parts.length === 2) {
        return Number.parseInt(parts[0], 10) * 60 + Number.parseInt(parts[1], 10);
    }
    return 0;
};

async function main() {
    console.log('--- เริ่มการนำเข้าข้อมูลเพลงใหม่ (พร้อมคำนวณวินาที) ---');

    const csvFilePath = path.join(__dirname, '../public/database/song.csv');

    if (!fs.existsSync(csvFilePath)) {
        console.error(`ไม่พบไฟล์ CSV ที่: ${csvFilePath}`);
        return;
    }

    const csvFile = fs.readFileSync(csvFilePath, 'utf-8');
    const records = parse(csvFile, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true // รองรับไฟล์ที่มี BOM
    });

    // ค้นหานามแฝงของคอลัมน์ (กรณีชื่อใน CSV มีเว้นวรรคแปลกๆ)
    const findColumn = (record, possibleNames) => {
        const keys = Object.keys(record);
        for (const name of possibleNames) {
            const found = keys.find(k => k.trim() === name);
            if (found) return record[found];
        }
        return '';
    };

    console.log(`พบข้อมูลในไฟล์ทั้งหมด ${records.length} รายการ`);

    // เคลียร์ข้อมูลเก่าก่อนเพื่อความสะอาด (ระวัง: ถ้ามีข้อมูลอื่นที่ผูกอยู่ควรข้าม)
    console.log('กำลังทำความสะอาดข้อมูลเก่า...');
    await prisma.playlist.deleteMany({});
    await prisma.song.deleteMany({});
    await prisma.genre.deleteMany({});
    await prisma.theme.deleteMany({});

    let successCount = 0;

    for (const row of records) {
        try {
            const title = findColumn(row, ['ชื่อเพลง', 'Song Name', 'Title']);
            if (!title) continue;

            const artist = findColumn(row, ['ชื่อนักร้อง', 'Artist']);
            const durationStr = findColumn(row, ['นาที 00:00', 'นาที', 'Duration', 'Time']);
            const url = findColumn(row, ['ลิ้ง url', 'Link', 'URL']);
            const language = findColumn(row, ['ภาษา', 'Language']);
            const genresStr = findColumn(row, ['ประเภทเพลง', 'Genres']);
            const themesStr = findColumn(row, ['ธีมงาน', 'Themes']);

            const rawDuration = durationToSeconds(durationStr);

            const genreNames = genresStr ? genresStr.split(',').map(g => g.trim()).filter(g => g !== '') : [];
            const themeNames = themesStr ? themesStr.split(',').map(t => t.trim()).filter(t => t !== '') : [];

            await prisma.song.create({
                data: {
                    title: title,
                    artist: artist || '-',
                    duration: durationStr || '0:00',
                    rawDuration: rawDuration,
                    url: url || '#',
                    language: language || 'Thai',
                    genres: {
                        connectOrCreate: genreNames.map(name => ({
                            where: { name },
                            create: { name }
                        }))
                    },
                    themes: {
                        connectOrCreate: themeNames.map(name => ({
                            where: { name },
                            create: { name }
                        }))
                    }
                },
            });

            successCount++;
        } catch (err) {
            console.error(`พลาดเพลง "${row['ชื่อเพลง']}":`, err.message);
        }
    }
    console.log(`\nนำเข้าข้อมูลสำเร็จทั้งหมด ${successCount} เพลง!`);
}

try {
    await main();
} catch (err) {
    console.error(err);
    process.exit(1);
} finally {
    await prisma.$disconnect();
}
