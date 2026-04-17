/**
 * Generated Playlists Page
 * 
 * Displays the list of playlists generated based on user criteria.
 * Allows users to preview songs and favorite their preferred collections.
 */

'use client'
import React, { useEffect, useState } from "react";
import { FaMusic, FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import PlaylistCard from "@/components/playlist-card";
import SongModal from "@/components/song-modal";
import EmptyState from "@/components/empty-state";
import FavoriteModal from "@/components/favorite-modal";
import { getPlaylists, toggleLikePlaylist, updatePlaylistName, clearUnlikedPlaylists } from "@/actions/songs";

export default function PlaylistPage() {
    const router = useRouter();

    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [favoritePlaylist, setFavoritePlaylist] = useState(null);

    const fetchPlaylists = async () => {
        try {
            const data = await getPlaylists('unliked');
            setPlaylists(data);
        } catch (error) {
            console.error("Failed to fetch playlists:", error);
        }
    };

    useEffect(() => {
        // sessionStorage flag is set by Selector.js before redirecting here
        // If the flag is absent, the user arrived directly without generating — clear stale data
        const isReady = sessionStorage.getItem("playlistReady") === "true";
        if (isReady) {
            fetchPlaylists();
        } else {
            // Wipe old playlists immediately if not coming from a fresh generate
            clearUnlikedPlaylists().then(() => setPlaylists([]));
        }
    }, []);

    const handleLikeClick = (playlist) => {
        if (playlist.isLiked) {
            toggleLikePlaylist(playlist.id, false).then(fetchPlaylists);
        } else {
            setFavoritePlaylist(playlist);
        }
    };

    const handleConfirmName = async (newName) => {
        if (!favoritePlaylist) return;
        const finalName = newName.trim() || favoritePlaylist.name; // Fall back to original name if left blank
        await updatePlaylistName(favoritePlaylist.id, finalName);
        await toggleLikePlaylist(favoritePlaylist.id, true); // Like after name has been set
        setFavoritePlaylist(null);
        fetchPlaylists();
        // Close the song detail modal if it's currently open
        setSelectedPlaylist(null);
    };

    const selectedData = selectedPlaylist === null ? null : playlists[selectedPlaylist];

    return (
        <div className="pt-6 px-4 bg-bg-theme min-h-screen text-black text-lg">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 px-2 sm:px-5 mb-8">
                <button
                    onClick={() => router.push("/")}
                    className="hidden sm:flex p-3 sm:p-4 bg-white text-primary-light rounded-xl shadow-md hover:bg-gray-50 transition-all active:scale-90 font-bold items-center justify-center border-2 border-transparent hover:border-primary shrink-0"
                >
                    <FaChevronLeft className="text-xl sm:text-2xl" />
                </button>
                <div className="bg-primary-light px-4 sm:px-10 py-3 sm:py-4 rounded-xl w-full max-w-xl text-center shadow-lg border-2 border-white">
                    <h1 className="text-xl sm:text-3xl font-black text-white whitespace-nowrap overflow-hidden text-ellipsis">🎵 Generated Playlists</h1>
                </div>
            </div>

            {/* Playlist Cards */}
            {playlists.length === 0 ? (
                <EmptyState message="No playlists generated yet. Go back to Home to start!" icon={FaMusic} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
                    {playlists.map((playlist, index) => (
                        <PlaylistCard
                            key={playlist.id || index}
                            playlist={playlist}
                            index={index}
                            isLiked={playlist.isLiked}
                            onLike={() => handleLikeClick(playlist)}
                            onClick={() => setSelectedPlaylist(index)}
                        />
                    ))}
                </div>
            )}

            {/* Modal สำหรับตั้งชื่อ (เรียกใช้ Component ใหม่) */}
            <FavoriteModal
                isOpen={!!favoritePlaylist}
                initialName={favoritePlaylist?.name || ""}
                onClose={() => setFavoritePlaylist(null)}
                onConfirm={handleConfirmName}
            />

            {/* Modal รายละเอียดเพลย์ลิสต์ */}
            {selectedData && (
                <SongModal
                    isOpen={selectedPlaylist !== null}
                    onClose={() => setSelectedPlaylist(null)}
                    title={selectedData.name}
                    image={null}
                    details={[
                        `🕒 ${selectedData.totalHours.toString().padStart(2, '0')}:${selectedData.totalMinutes.toString().padStart(2, '0')}:${selectedData.totalSeconds.toString().padStart(2, '0')}`,
                        `🎵 ${selectedData.songs.length} Songs`,
                        `🎹 ${(JSON.parse(selectedData.metadata || '{}').genres || []).join(", ")}`
                    ]}
                    songs={selectedData.songs}
                    variant="list"
                />
            )}
        </div>
    );
}
