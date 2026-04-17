'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getSongs(filters = {}) {
    const { searchTerm, language, theme, genre } = filters;

    return await prisma.song.findMany({
        where: {
            AND: [
                searchTerm ? {
                    OR: [
                        { title: { contains: searchTerm } },
                        { artist: { contains: searchTerm } }
                    ]
                } : {},
                language && language !== 'Select' ? { language: { contains: language } } : {},
                theme && theme !== 'Select' ? { 
                    themes: { 
                        some: { name: { contains: theme } } 
                    } 
                } : {},
                genre && genre !== 'Select' && genre !== 'All' ? { 
                    genres: { 
                        some: { name: { contains: genre } } 
                    } 
                } : {},
            ]
        },
        include: {
            genres: true,
            themes: true
        }
    });
}

// --- Playlist Actions ---

/**
 * บันทึกเพลย์ลิสต์ลง Database
 */
export async function savePlaylist(data) {
    const { name, songs, totalDuration, metadata, isLiked = false } = data;
    
    // ค้นหา ID ของเพลงที่ต้องเชื่อมโยง
    const songIds = songs.map(s => s.id).filter(id => !!id);

    const playlist = await prisma.playlist.create({
        data: {
            name,
            isLiked,
            totalHours: totalDuration.hours || 0,
            totalMinutes: totalDuration.minutes || 0,
            totalSeconds: totalDuration.seconds || 0,
            metadata: JSON.stringify(metadata || {}),
            songs: {
                connect: songIds.map(id => ({ id }))
            }
        },
        include: {
            songs: true
        }
    });

    revalidatePath('/playlist');
    revalidatePath('/favorite');
    return playlist;
}

/**
 * ดึงรายการเพลย์ลิสต์
 * mode: 'all' | 'liked' | 'unliked'
 */
export async function getPlaylists(mode = 'all') {
    let where = {};
    if (mode === 'liked') where = { isLiked: true };
    if (mode === 'unliked') where = { isLiked: false };

    return await prisma.playlist.findMany({
        where,
        orderBy: { id: 'asc' },
        include: {
            songs: {
                include: {
                    genres: true,
                    themes: true
                }
            }
        }
    });
}

/**
 * อัปเดตชื่อเพลย์ลิสต์
 */
export async function updatePlaylistName(id, newName) {
    const updated = await prisma.playlist.update({
        where: { id },
        data: { name: newName }
    });
    revalidatePath('/playlist');
    revalidatePath('/favorite');
    return updated;
}

/**
 * กดหัวใจ/ยกเลิกหัวใจ เพลย์ลิสต์
 */
export async function toggleLikePlaylist(id, isLiked) {
    const updated = await prisma.playlist.update({
        where: { id },
        data: { isLiked }
    });
    revalidatePath('/playlist');
    revalidatePath('/favorite');
    return updated;
}

/**
 * ลบเพลงออกจากเพลย์ลิสต์
 */
export async function removeSongFromPlaylist(playlistId, songId) {
    const updated = await prisma.playlist.update({
        where: { id: playlistId },
        data: {
            songs: {
                disconnect: { id: songId }
            }
        },
        include: {
            songs: true
        }
    });
    revalidatePath('/favorite');
    return updated;
}

/**
 * เพิ่มเพลงเข้าเพลย์ลิสต์
 */
export async function addSongToPlaylist(playlistId, songId) {
    const updated = await prisma.playlist.update({
        where: { id: playlistId },
        data: {
            songs: {
                connect: { id: songId }
            }
        },
        include: {
            songs: true
        }
    });
    revalidatePath('/favorite');
    return updated;
}

/**
 * ลบเพลย์ลิสต์ทิ้ง
 */
export async function deletePlaylist(id) {
    await prisma.playlist.delete({
        where: { id }
    });
    revalidatePath('/playlist');
    revalidatePath('/favorite');
    return { success: true };
}

/**
 * ล้างเพลย์ลิสต์ที่ยังไม่ได้ถูก Like ทั้งหมด
 */
export async function clearUnlikedPlaylists() {
    await prisma.playlist.deleteMany({
        where: { isLiked: false }
    });
    revalidatePath('/playlist');
    return { success: true };
}
